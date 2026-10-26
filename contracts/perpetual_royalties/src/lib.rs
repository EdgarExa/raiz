#![no_std]
//! Regalías de reventa para piezas registradas con aval comunitario.
//!
//! Reglas de seguridad (auditoría técnica, oct 2026):
//! - El registro exige la firma de la artesana Y del sello comunitario (derechos colectivos).
//! - La reventa exige la firma del comprador Y del dueño actual (nadie compra sin que el dueño acepte).
//! - Se rechazan precios cuya regalía se redondearía a 0.
//!
//! Límite: la regalía solo aplica a reventas que pasan por este contrato. Una reventa física
//! fuera de la cadena no se puede obligar desde aquí; para eso se necesita un contrato escrito
//! con el comprador.
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
    NotInitialized = 6,
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

/// Porcentajes oficiales del protocolo (ver `src/config/protocolFees.ts`).
pub const ARTISAN_ROYALTY_BPS: i128 = 1_000; // 10.00 % regalía a la artesana original
pub const TEQUIO_COMMUNAL_BPS: i128 = 200; // 2.00 % fondo comunitario (Tequio)
const TOTAL_BPS: i128 = 10_000;
const TTL_THRESHOLD: u32 = 100_000;
const TTL_EXTEND_TO: u32 = 500_000;

fn save_item(env: &Env, key: &DataKey, item: &CulturalHeritageItem) {
    env.storage().persistent().set(key, item);
    env.storage().persistent().extend_ttl(key, TTL_THRESHOLD, TTL_EXTEND_TO);
    env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND_TO);
}

#[contract]
pub struct PerpetualRoyaltiesContract;

#[contractimpl]
impl PerpetualRoyaltiesContract {
    /// Inicializa el protocolo de regalías.
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
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND_TO);
        Ok(())
    }

    /// Registra una pieza. Firman la artesana y el sello de la comunidad.
    pub fn register_heritage_item(
        env: Env,
        item_id: BytesN<32>,
        artisan: Address,
        community_seal: Address,
        provenance_attestation_uid: BytesN<32>,
        title: String,
    ) -> Result<(), RoyaltyError> {
        artisan.require_auth();
        community_seal.require_auth();

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
        save_item(&env, &item_key, &item);

        env.events().publish(
            (symbol_short!("artisan"), symbol_short!("reg")),
            item_id,
        );
        Ok(())
    }

    /// Reventa con 10 % de regalía y 2 % al Tequio. Firman comprador y dueño actual.
    pub fn execute_secondary_sale(
        env: Env,
        item_id: BytesN<32>,
        buyer: Address,
        payment_token: Address,
        sale_price: i128,
    ) -> Result<(), RoyaltyError> {
        buyer.require_auth();

        let item_key = DataKey::Item(item_id.clone());
        let mut item: CulturalHeritageItem = env
            .storage()
            .persistent()
            .get(&item_key)
            .ok_or(RoyaltyError::ItemNotFound)?;

        // El dueño actual debe aceptar la venta y el precio.
        item.current_owner.require_auth();

        if buyer == item.current_owner {
            return Err(RoyaltyError::Unauthorized);
        }

        let artisan_royalty = (sale_price * ARTISAN_ROYALTY_BPS) / TOTAL_BPS;
        let tequio_amount = (sale_price * TEQUIO_COMMUNAL_BPS) / TOTAL_BPS;
        if sale_price <= 0 || artisan_royalty <= 0 || tequio_amount <= 0 {
            return Err(RoyaltyError::InvalidResalePrice);
        }
        let seller_proceeds = sale_price - artisan_royalty - tequio_amount;

        let communal_treasury: Address = env
            .storage()
            .instance()
            .get(&DataKey::CommunalTequioTreasury)
            .ok_or(RoyaltyError::NotInitialized)?;

        let token_client = token::Client::new(&env, &payment_token);
        token_client.transfer(&buyer, &item.original_artisan, &artisan_royalty);
        token_client.transfer(&buyer, &communal_treasury, &tequio_amount);
        token_client.transfer(&buyer, &item.current_owner, &seller_proceeds);

        item.current_owner = buyer;
        save_item(&env, &item_key, &item);

        env.events().publish(
            (symbol_short!("resale"), symbol_short!("complete")),
            (item_id, artisan_royalty),
        );
        Ok(())
    }

    /// Consulta los datos de una pieza.
    pub fn get_item(
        env: Env,
        item_id: BytesN<32>,
    ) -> Result<CulturalHeritageItem, RoyaltyError> {
        env.storage()
            .persistent()
            .get(&DataKey::Item(item_id))
            .ok_or(RoyaltyError::ItemNotFound)
    }
}

#[cfg(test)]
mod test;
