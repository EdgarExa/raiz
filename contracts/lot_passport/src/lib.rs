#![no_std]
//! Pasaporte digital de lote.
//!
//! Cambios de la auditoría técnica (oct 2026):
//! - No se guardan datos personales en la cadena: el productor se identifica por su dirección
//!   (`producer: Address`), no por su nombre. El nombre vive fuera de la cadena, con consentimiento.
//! - `location` debe ser la comunidad o región, nunca un domicilio.
//! - Un lote nace SIN certificar. Solo el nodo certificador lo certifica con `certify_lot`,
//!   anclando el hash del dictamen de laboratorio o inspección.
//! - El nodo certificador (`certifier`) es una cuenta distinta del `admin` (ADR-003, D6). Su llave
//!   vive en el servidor; si se filtra, el admin la cambia con `set_certifier` sin redesplegar.
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, BytesN, Env,
    String, Symbol,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    Unauthorized = 3,
    LotNotFound = 4,
    LotAlreadyExists = 5,
    AlreadyCertified = 6,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LotPassport {
    pub code: String,
    pub producer: Address,
    pub location: String, // comunidad o región, nunca un domicilio
    pub category: String, // p. ej. "Miel de abeja", "Textil en telar"
    pub variety: String,
    pub volume_units: u64,                 // kilogramos o piezas
    pub photo_hash: BytesN<32>,            // SHA-256 de la foto (la foto vive fuera de la cadena)
    pub lab_cert_hash: Option<BytesN<32>>, // SHA-256 del dictamen; None hasta certificar
    pub certification_score: u32,
    pub registered_at: u64,
    pub certified: bool,
    pub certified_at: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Certifier,
    Lot(String),
}

const LOT_TAG: Symbol = symbol_short!("LOT_REG");
const CERT_TAG: Symbol = symbol_short!("LOT_CERT");
const CERTIFIER_TAG: Symbol = symbol_short!("CERTIFIER");
const TTL_THRESHOLD: u32 = 100_000;
const TTL_EXTEND_TO: u32 = 500_000;

fn admin(env: &Env) -> Result<Address, Error> {
    env.storage()
        .instance()
        .get(&DataKey::Admin)
        .ok_or(Error::NotInitialized)
}

fn certifier(env: &Env) -> Result<Address, Error> {
    env.storage()
        .instance()
        .get(&DataKey::Certifier)
        .ok_or(Error::NotInitialized)
}

fn save(env: &Env, key: &DataKey, lot: &LotPassport) {
    env.storage().persistent().set(key, lot);
    env.storage()
        .persistent()
        .extend_ttl(key, TTL_THRESHOLD, TTL_EXTEND_TO);
    env.storage()
        .instance()
        .extend_ttl(TTL_THRESHOLD, TTL_EXTEND_TO);
}

#[contract]
pub struct LotPassportContract;

#[contractimpl]
impl LotPassportContract {
    /// Inicializa con el admin (administra el contrato) y el nodo certificador (registra y certifica
    /// lotes; p. ej. la institución o la cooperativa).
    pub fn initialize(env: Env, admin: Address, certifier: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::Certifier, &certifier);
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND_TO);
        Ok(())
    }

    /// Cambia el nodo certificador (p. ej. si su llave se filtró). Solo el admin.
    pub fn set_certifier(env: Env, caller: Address, new_certifier: Address) -> Result<(), Error> {
        caller.require_auth();
        if caller != admin(&env)? {
            return Err(Error::Unauthorized);
        }
        env.storage()
            .instance()
            .set(&DataKey::Certifier, &new_certifier);
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND_TO);
        env.events().publish((CERTIFIER_TAG,), new_certifier);
        Ok(())
    }

    /// Dirección del nodo certificador actual.
    pub fn get_certifier(env: Env) -> Result<Address, Error> {
        certifier(&env)
    }

    /// Registra un lote. Firman el nodo certificador y el propio productor.
    pub fn register_lot(
        env: Env,
        caller: Address,
        code: String,
        producer: Address,
        location: String,
        category: String,
        variety: String,
        volume_units: u64,
        photo_hash: BytesN<32>,
    ) -> Result<(), Error> {
        caller.require_auth();
        if caller != certifier(&env)? {
            return Err(Error::Unauthorized);
        }
        producer.require_auth();

        let key = DataKey::Lot(code.clone());
        if env.storage().persistent().has(&key) {
            return Err(Error::LotAlreadyExists);
        }

        let timestamp = env.ledger().timestamp();
        let passport = LotPassport {
            code: code.clone(),
            producer,
            location,
            category,
            variety,
            volume_units,
            photo_hash,
            lab_cert_hash: None,
            certification_score: 0,
            registered_at: timestamp,
            certified: false,
            certified_at: 0,
        };
        save(&env, &key, &passport);

        env.events().publish((LOT_TAG, code), timestamp);
        Ok(())
    }

    /// Certifica un lote con el hash del dictamen. Solo el nodo certificador.
    pub fn certify_lot(
        env: Env,
        caller: Address,
        code: String,
        lab_cert_hash: BytesN<32>,
        certification_score: u32,
    ) -> Result<(), Error> {
        caller.require_auth();
        if caller != certifier(&env)? {
            return Err(Error::Unauthorized);
        }

        let key = DataKey::Lot(code.clone());
        let mut lot: LotPassport = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(Error::LotNotFound)?;
        if lot.certified {
            return Err(Error::AlreadyCertified);
        }

        lot.lab_cert_hash = Some(lab_cert_hash);
        lot.certification_score = certification_score;
        lot.certified = true;
        lot.certified_at = env.ledger().timestamp();
        save(&env, &key, &lot);

        env.events().publish((CERT_TAG, code), certification_score);
        Ok(())
    }

    /// Consulta pública del pasaporte de un lote por su folio.
    pub fn get_lot(env: Env, code: String) -> Result<LotPassport, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Lot(code))
            .ok_or(Error::LotNotFound)
    }
}

#[cfg(test)]
mod test;
