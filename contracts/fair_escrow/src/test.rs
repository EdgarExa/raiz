#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, token::StellarAssetClient, Env};

#[test]
fn test_create_fund_and_release_micopay_escrow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, FairEscrowContract);
    let client = FairEscrowContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let attestation_registry = Address::generate(&env);
    let micopay_authority = Address::generate(&env);
    let communal_treasury = Address::generate(&env);

    client.initialize(
        &admin,
        &attestation_registry,
        &micopay_authority,
        &communal_treasury,
    );

    let buyer = Address::generate(&env);
    let producer = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let token_contract = env.register_stellar_asset_contract_v2(token_admin);
    let token_client = StellarAssetClient::new(&env, &token_contract.address());

    // Mint 10,000 USDC/MXNe to buyer
    token_client.mock_all_auths().mint(&buyer, &10_000);

    let order_id = BytesN::from_array(&env, &[1u8; 32]);
    let amount = 5_000i128;
    let min_guardrail = 4_500i128; // Fair price floor

    client.create_and_fund_order(
        &order_id,
        &buyer,
        &producer,
        &token_contract.address(),
        &amount,
        &min_guardrail,
        &PayoutRail::MicoPayScaleCash,
    );

    let order = client.get_order(&order_id);
    assert_eq!(order.amount, 5_000);
    assert_eq!(order.status, OrderStatus::Funded);

    // Release upon verified weighing delivery
    let delivery_attestation_uid = BytesN::from_array(&env, &[9u8; 32]);
    client.release_with_attestation(&order_id, &delivery_attestation_uid, &micopay_authority);

    let settled_order = client.get_order(&order_id);
    assert_eq!(settled_order.status, OrderStatus::Settled);
    assert_eq!(settled_order.delivery_attestation_uid, Some(delivery_attestation_uid));
}
