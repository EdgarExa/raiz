#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, token, Address, BytesN,
    Env, String,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum RoyaltyError {
    AlreadyInitialized = 1,
    ItemAlreadyRegistered = 2,
    ItemNotFound = 3,
    Unauthorized = 4,
    InvalidResalePrice = 5,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CulturalHeritageItem {
    pub item_id: BytesN<32>,
    pub original_artisan: Address,
    pub current_owner: Address,
    pub community_seal: Address,
    pub provenance_attestation_uid: BytesN<32>,
    pub title: String,
    pub created_at: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    CommunalTequioTreasury,
    Item(BytesN<32>),
}

const ARTISAN_ROYALTY_BPS: i128 = 1_000; // 10.00% perpetual royalty to indigenous artisan
const TEQUIO_COMMUNAL_BPS: i128 = 200;   // 2.00% communal public works fund
const TOTAL_BPS: i128 = 10_000;

#[contract]
pub struct PerpetualRoyaltiesContract;

#[contractimpl]
impl PerpetualRoyaltiesContract {
    /// Initialize the cultural royalties protocol
    pub fn initialize(
        env: Env,
        admin: Address,
        communal_treasury: Address,
    ) -> Result<(), RoyaltyError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(RoyaltyError::AlreadyInitialized);
        }
        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::CommunalTequioTreasury, &communal_treasury);

        Ok(())
    }

    /// Register a verified ancestral textile piece with original artisan attribution
    pub fn register_heritage_item(
        env: Env,
        item_id: BytesN<32>,
        artisan: Address,
        community_seal: Address,
        provenance_attestation_uid: BytesN<32>,
        title: String,
    ) -> Result<(), RoyaltyError> {
        artisan.require_auth();

        let item_key = DataKey::Item(item_id.clone());
        if env.storage().persistent().has(&item_key) {
            return Err(RoyaltyError::ItemAlreadyRegistered);
        }

        let item = CulturalHeritageItem {
            item_id: item_id.clone(),
            original_artisan: artisan.clone(),
            current_owner: artisan,
            community_seal,
            provenance_attestation_uid,
            title,
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&item_key, &item);

        env.events().publish(
            (symbol_short!("artisan"), symbol_short!("reg")),
            item_id,
        );
        Ok(())
    }

    /// Execute secondary market resale with automated 10% royalty and 2% tequio fund
    pub fn execute_secondary_sale(
        env: Env,
        item_id: BytesN<32>,
        buyer: Address,
        payment_token: Address,
        sale_price: i128,
    ) -> Result<(), RoyaltyError> {
        buyer.require_auth();

        if sale_price <= 0 {
            return Err(RoyaltyError::InvalidResalePrice);
        }

        let item_key = DataKey::Item(item_id.clone());
        let mut item: CulturalHeritageItem = env
            .storage()
            .persistent()
            .get(&item_key)
            .ok_or(RoyaltyError::ItemNotFound)?;

        let communal_treasury: Address = env
            .storage()
            .instance()
            .get(&DataKey::CommunalTequioTreasury)
            .unwrap();

        // 10% Perpetual Royalty to Original Master Artisan
        let artisan_royalty = (sale_price * ARTISAN_ROYALTY_BPS) / TOTAL_BPS;
        // 2% Communal Infrastructure (Tequio)
        let tequio_amount = (sale_price * TEQUIO_COMMUNAL_BPS) / TOTAL_BPS;
        // 88% Net Proceeds to Current Seller
        let seller_proceeds = sale_price - artisan_royalty - tequio_amount;

        let token_client = token::Client::new(&env, &payment_token);

        // 1. Transfer 10% directly to the indigenous female artisan
        token_client.transfer(&buyer, &item.original_artisan, &artisan_royalty);

        // 2. Transfer 2% to the communal village treasury
        if tequio_amount > 0 {
            token_client.transfer(&buyer, &communal_treasury, &tequio_amount);
        }

        // 3. Transfer remaining 88% to the seller
        token_client.transfer(&buyer, &item.current_owner, &seller_proceeds);

        // Update ownership on the ledger
        item.current_owner = buyer.clone();
        env.storage().persistent().set(&item_key, &item);

        env.events().publish(
            (symbol_short!("resale"), symbol_short!("complete")),
            (item_id, artisan_royalty),
        );

        Ok(())
    }

    /// Get cultural item metadata
    pub fn get_item(
        env: Env,
        item_id: BytesN<32>,
    ) -> Result<CulturalHeritageItem, RoyaltyError> {
        let item_key = DataKey::Item(item_id);
        env.storage()
            .persistent()
            .get(&item_key)
            .ok_or(RoyaltyError::ItemNotFound)
    }
}
