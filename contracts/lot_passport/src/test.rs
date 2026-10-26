#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

fn setup<'a>() -> (Env, LotPassportContractClient<'a>, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();
    let id = env.register(LotPassportContract, ());
    let client = LotPassportContractClient::new(&env, &id);
    let admin = Address::generate(&env);
    let producer = Address::generate(&env);
    client.initialize(&admin);
    (env, client, admin, producer)
}

fn registrar(env: &Env, c: &LotPassportContractClient, admin: &Address, producer: &Address, code: &str) {
    c.register_lot(
        admin,
        &String::from_str(env, code),
        producer,
        &String::from_str(env, "San Juan Ñumí"),
        &String::from_str(env, "Miel de abeja"),
        &String::from_str(env, "Multifloral"),
        &120,
        &BytesN::from_array(env, &[7u8; 32]),
    );
}

#[test]
fn el_lote_nace_sin_certificar_y_luego_se_certifica() {
    let (env, c, admin, producer) = setup();
    registrar(&env, &c, &admin, &producer, "MIEL-001");

    let lot = c.get_lot(&String::from_str(&env, "MIEL-001"));
    assert!(!lot.certified);
    assert_eq!(lot.lab_cert_hash, None);
    assert_eq!(lot.producer, producer);

    c.certify_lot(&admin, &String::from_str(&env, "MIEL-001"), &BytesN::from_array(&env, &[8u8; 32]), &87);
    let lot = c.get_lot(&String::from_str(&env, "MIEL-001"));
    assert!(lot.certified);
    assert_eq!(lot.certification_score, 87);
}

#[test]
fn solo_el_certificador_registra_y_certifica() {
    let (env, c, admin, producer) = setup();
    let intruso = Address::generate(&env);
    let res = c.try_register_lot(
        &intruso,
        &String::from_str(&env, "X-1"),
        &producer,
        &String::from_str(&env, "Tlaxiaco"),
        &String::from_str(&env, "Textil"),
        &String::from_str(&env, "Telar"),
        &1,
        &BytesN::from_array(&env, &[1u8; 32]),
    );
    assert_eq!(res, Err(Ok(Error::Unauthorized)));

    registrar(&env, &c, &admin, &producer, "MIEL-002");
    let res = c.try_certify_lot(&intruso, &String::from_str(&env, "MIEL-002"), &BytesN::from_array(&env, &[8u8; 32]), &99);
    assert_eq!(res, Err(Ok(Error::Unauthorized)));
}

#[test]
fn no_se_duplica_ni_se_recertifica() {
    let (env, c, admin, producer) = setup();
    registrar(&env, &c, &admin, &producer, "MIEL-003");
    let res = c.try_register_lot(
        &admin,
        &String::from_str(&env, "MIEL-003"),
        &producer,
        &String::from_str(&env, "San Juan Ñumí"),
        &String::from_str(&env, "Miel de abeja"),
        &String::from_str(&env, "Multifloral"),
        &1,
        &BytesN::from_array(&env, &[1u8; 32]),
    );
    assert_eq!(res, Err(Ok(Error::LotAlreadyExists)));

    c.certify_lot(&admin, &String::from_str(&env, "MIEL-003"), &BytesN::from_array(&env, &[8u8; 32]), &80);
    let res = c.try_certify_lot(&admin, &String::from_str(&env, "MIEL-003"), &BytesN::from_array(&env, &[9u8; 32]), &95);
    assert_eq!(res, Err(Ok(Error::AlreadyCertified)));
}
