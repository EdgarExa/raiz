#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, token::StellarAssetClient, Env, String};

#[test]
fn test_register_and_resale_with_royalties() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, PerpetualRoyaltiesContract);
    let client = PerpetualRoyaltiesContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let communal_treasury = Address::generate(&env);
    client.initialize(&admin, &communal_treasury);

    let artisan = Address::generate(&env);
    let community_seal = Address::generate(&env);
    let item_id = BytesN::from_array(&env, &[5u8; 32]);
    let provenance_uid = BytesN::from_array(&env, &[6u8; 32]);
    let title = String::from_str(&env, "Rebozo de Telar San Pablo Tijaltepec");

    client.register_heritage_item(
        &item_id,
        &artisan,
        &community_seal,
        &provenance_uid,
        &title,
    );

    let item = client.get_item(&item_id);
    assert_eq!(item.original_artisan, artisan);
    assert_eq!(item.current_owner, artisan);

    // Setup payment token & buyer
    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(token_admin);
    let token_client = StellarAssetClient::new(&env, &token_contract.address());

    let buyer = Address::generate(&env);
    token_client.mock_all_auths().mint(&buyer, &10_000);

    // Resale at 10,000 USDC/MXNe:
    // 1,000 (10%) to artisan, 200 (2%) to tequio communal fund, 8,800 to seller
    client.execute_secondary_sale(
        &item_id,
        &buyer,
        &token_contract.address(),
        &10_000,
    );

    let updated_item = client.get_item(&item_id);
    assert_eq!(updated_item.current_owner, buyer);
    assert_eq!(updated_item.original_artisan, artisan);
}
