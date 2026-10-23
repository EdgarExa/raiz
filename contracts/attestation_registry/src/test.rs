#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

#[test]
fn test_register_schema_and_attestation() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, AttestationRegistryContract);
    let client = AttestationRegistryContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let issuer = Address::generate(&env);
    let recipient = Address::generate(&env);

    client.initialize(&admin);

    let schema_uid = BytesN::from_array(&env, &[1u8; 32]);
    let name = String::from_str(&env, "SCAAQualityAttestation");
    let description = String::from_str(&env, "Specialty coffee quality attestation");
    let definition = String::from_str(&env, "u8 cup_score, u16 humidity_bps");

    client.register_schema(
        &schema_uid,
        &name,
        &description,
        &definition,
        &true,
        &issuer,
    );

    let attestation_uid = BytesN::from_array(&env, &[2u8; 32]);
    let payload_hash = BytesN::from_array(&env, &[3u8; 32]);
    let signature = BytesN::from_array(&env, &[4u8; 64]);

    client.create_attestation(
        &attestation_uid,
        &schema_uid,
        &recipient,
        &payload_hash,
        &0u64,
        &signature,
        &issuer,
    );

    let is_valid = client.verify_attestation(&attestation_uid);
    assert!(is_valid);

    let retrieved = client.get_attestation(&attestation_uid);
    assert_eq!(retrieved.schema_uid, schema_uid);
    assert_eq!(retrieved.recipient, recipient);
    assert!(!retrieved.revoked);

    client.revoke_attestation(&attestation_uid, &issuer);
    let is_still_valid = client.verify_attestation(&attestation_uid);
    assert!(!is_still_valid);
}
