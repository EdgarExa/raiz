#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, BytesN, Env,
    String,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum AttestationError {
    SchemaAlreadyExists = 1,
    SchemaNotFound = 2,
    AttestationNotFound = 3,
    AttestationAlreadyExists = 4,
    AttestationExpired = 5,
    AttestationAlreadyRevoked = 6,
    SchemaIrrevocable = 7,
    Unauthorized = 8,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AttestationSchema {
    pub schema_uid: BytesN<32>,
    pub name: String,
    pub description: String,
    pub schema_definition: String,
    pub revocable: bool,
    pub issuer_authority: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AttestationRecord {
    pub attestation_uid: BytesN<32>,
    pub schema_uid: BytesN<32>,
    pub recipient: Address,
    pub issuer: Address,
    pub payload_hash: BytesN<32>,
    pub issued_at: u64,
    pub expiration_time: u64, // 0 = permanent / non-expiring
    pub revoked: bool,
    pub signature: BytesN<64>,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Schema(BytesN<32>),
    Attestation(BytesN<32>),
    AttestationCount,
}

const STORAGE_TTL_THRESHOLD: u32 = 100_000;
const STORAGE_BUMP_AMOUNT: u32 = 500_000;

#[contract]
pub struct AttestationRegistryContract;

#[contractimpl]
impl AttestationRegistryContract {
    /// Initialize registry with administrator address
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::AttestationCount, &0u64);
    }

    /// Register a new verifiable claim schema
    pub fn register_schema(
        env: Env,
        schema_uid: BytesN<32>,
        name: String,
        description: String,
        schema_definition: String,
        revocable: bool,
        issuer_authority: Address,
    ) -> Result<(), AttestationError> {
        issuer_authority.require_auth();

        let key = DataKey::Schema(schema_uid.clone());
        if env.storage().persistent().has(&key) {
            return Err(AttestationError::SchemaAlreadyExists);
        }

        let schema = AttestationSchema {
            schema_uid: schema_uid.clone(),
            name,
            description,
            schema_definition,
            revocable,
            issuer_authority,
        };

        env.storage().persistent().set(&key, &schema);
        env.storage()
            .persistent()
            .extend_ttl(&key, STORAGE_TTL_THRESHOLD, STORAGE_BUMP_AMOUNT);

        env.events().publish(
            (symbol_short!("schema"), symbol_short!("created")),
            schema_uid,
        );
        Ok(())
    }

    /// Issue an on-chain attestation conforming to an active schema
    pub fn create_attestation(
        env: Env,
        attestation_uid: BytesN<32>,
        schema_uid: BytesN<32>,
        recipient: Address,
        payload_hash: BytesN<32>,
        expiration_time: u64,
        signature: BytesN<64>,
        issuer: Address,
    ) -> Result<(), AttestationError> {
        issuer.require_auth();

        let schema_key = DataKey::Schema(schema_uid.clone());
        let schema: AttestationSchema = env
            .storage()
            .persistent()
            .get(&schema_key)
            .ok_or(AttestationError::SchemaNotFound)?;

        if schema.issuer_authority != issuer {
            return Err(AttestationError::Unauthorized);
        }

        let attestation_key = DataKey::Attestation(attestation_uid.clone());
        if env.storage().persistent().has(&attestation_key) {
            return Err(AttestationError::AttestationAlreadyExists);
        }

        let current_time = env.ledger().timestamp();
        let record = AttestationRecord {
            attestation_uid: attestation_uid.clone(),
            schema_uid: schema_uid.clone(),
            recipient,
            issuer,
            payload_hash,
            issued_at: current_time,
            expiration_time,
            revoked: false,
            signature,
        };

        env.storage().persistent().set(&attestation_key, &record);
        env.storage().persistent().extend_ttl(
            &attestation_key,
            STORAGE_TTL_THRESHOLD,
            STORAGE_BUMP_AMOUNT,
        );

        let mut count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::AttestationCount)
            .unwrap_or(0);
        count += 1;
        env.storage().instance().set(&DataKey::AttestationCount, &count);

        env.events().publish(
            (symbol_short!("attest"), symbol_short!("issued")),
            (schema_uid, attestation_uid),
        );
        Ok(())
    }

    /// Verify validity of an attestation record
    pub fn verify_attestation(env: Env, attestation_uid: BytesN<32>) -> bool {
        let key = DataKey::Attestation(attestation_uid);
        let record: Option<AttestationRecord> = env.storage().persistent().get(&key);

        match record {
            Some(att) => {
                if att.revoked {
                    return false;
                }
                if att.expiration_time > 0 && env.ledger().timestamp() > att.expiration_time {
                    return false;
                }
                true
            }
            None => false,
        }
    }

    /// Revoke an active attestation (if permitted by the schema)
    pub fn revoke_attestation(
        env: Env,
        attestation_uid: BytesN<32>,
        caller: Address,
    ) -> Result<(), AttestationError> {
        caller.require_auth();

        let key = DataKey::Attestation(attestation_uid.clone());
        let mut att: AttestationRecord = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(AttestationError::AttestationNotFound)?;

        if att.issuer != caller {
            return Err(AttestationError::Unauthorized);
        }

        let schema_key = DataKey::Schema(att.schema_uid.clone());
        let schema: AttestationSchema = env
            .storage()
            .persistent()
            .get(&schema_key)
            .ok_or(AttestationError::SchemaNotFound)?;

        if !schema.revocable {
            return Err(AttestationError::SchemaIrrevocable);
        }

        if att.revoked {
            return Err(AttestationError::AttestationAlreadyRevoked);
        }

        att.revoked = true;
        env.storage().persistent().set(&key, &att);

        env.events().publish(
            (symbol_short!("attest"), symbol_short!("revoked")),
            attestation_uid,
        );
        Ok(())
    }

    /// Query attestation details
    pub fn get_attestation(
        env: Env,
        attestation_uid: BytesN<32>,
    ) -> Result<AttestationRecord, AttestationError> {
        let key = DataKey::Attestation(attestation_uid);
        env.storage()
            .persistent()
            .get(&key)
            .ok_or(AttestationError::AttestationNotFound)
    }

    /// Query schema details
    pub fn get_schema(
        env: Env,
        schema_uid: BytesN<32>,
    ) -> Result<AttestationSchema, AttestationError> {
        let key = DataKey::Schema(schema_uid);
        env.storage()
            .persistent()
            .get(&key)
            .ok_or(AttestationError::SchemaNotFound)
    }
}
