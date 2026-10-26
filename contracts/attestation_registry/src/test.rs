#![cfg(test)]
extern crate std;
use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

#[test]
fn test_register_schema_and_attestation() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(AttestationRegistryContract, ());
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

fn base<'a>() -> (
    Env,
    AttestationRegistryContractClient<'a>,
    Address,
    Address,
    BytesN<32>,
) {
    let env = Env::default();
    env.mock_all_auths();
    let id = env.register(AttestationRegistryContract, ());
    let client = AttestationRegistryContractClient::new(&env, &id);
    let admin = Address::generate(&env);
    let issuer = Address::generate(&env);
    client.initialize(&admin);
    let schema_uid = BytesN::from_array(&env, &[1u8; 32]);
    client.register_schema(
        &schema_uid,
        &String::from_str(&env, "EntregaFisica"),
        &String::from_str(&env, "Constancia de entrega"),
        &String::from_str(&env, "u32 kilos"),
        &true,
        &issuer,
    );
    (env, client, admin, issuer, schema_uid)
}

#[test]
fn alta_de_esquema_exige_firma_del_admin() {
    let (env, _client, admin, issuer, _schema) = base();
    let firmantes: std::vec::Vec<Address> = env.auths().iter().map(|(a, _)| a.clone()).collect();
    assert!(firmantes.contains(&admin));
    assert!(firmantes.contains(&issuer));
}

#[test]
fn solo_la_autoridad_del_esquema_emite() {
    let (env, client, _admin, _issuer, schema) = base();
    let intruso = Address::generate(&env);
    let res = client.try_create_attestation(
        &BytesN::from_array(&env, &[2u8; 32]),
        &schema,
        &Address::generate(&env),
        &BytesN::from_array(&env, &[3u8; 32]),
        &0u64,
        &BytesN::from_array(&env, &[4u8; 64]),
        &intruso,
    );
    assert_eq!(res, Err(Ok(AttestationError::Unauthorized)));
}

#[test]
fn solo_el_emisor_revoca() {
    let (env, client, _admin, issuer, schema) = base();
    let uid = BytesN::from_array(&env, &[2u8; 32]);
    client.create_attestation(
        &uid,
        &schema,
        &Address::generate(&env),
        &BytesN::from_array(&env, &[3u8; 32]),
        &0u64,
        &BytesN::from_array(&env, &[4u8; 64]),
        &issuer,
    );
    let res = client.try_revoke_attestation(&uid, &Address::generate(&env));
    assert_eq!(res, Err(Ok(AttestationError::Unauthorized)));
    assert!(client.verify_attestation(&uid));
}

#[test]
fn atestacion_inexistente_no_es_valida() {
    let (env, client, _admin, _issuer, _schema) = base();
    assert!(!client.verify_attestation(&BytesN::from_array(&env, &[99u8; 32])));
}
