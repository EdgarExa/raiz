#![no_std]
//! FairEscrow: depósito en garantía para compras directas a productores.
//!
//! Reglas de seguridad (auditoría técnica, oct 2026):
//! - Solo el comprador (confirma que recibió) o el administrador (árbitro) liberan los fondos.
//! - La liberación exige una atestación de entrega VÁLIDA en el registro de atestaciones.
//! - El precio mínimo lo fija el PRODUCTOR (no el comprador) con `set_min_price`.
//! - Si nadie libera antes de la fecha límite, el comprador recupera su dinero (`refund`).
//!
//! Aviso legal: retener y liberar fondos de terceros en mainnet puede requerir autorización
//! de la CNBV (Ley Fintech). Este contrato es para red de prueba y fines académicos.
use soroban_sdk::{
    contract, contractclient, contracterror, contractimpl, contracttype, symbol_short, token,
    Address, BytesN, Env,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum EscrowError {
    AlreadyInitialized = 1,
    OrderNotFound = 2,
    OrderAlreadyExists = 3,
    OrderNotFunded = 4,
    OrderAlreadySettled = 5,
    InvalidOrderStatus = 6,
    PriceBelowAntiCoyoteGuardrail = 7,
    AttestationRegistryFailed = 8,
    DeliveryAttestationInvalid = 9,
    Unauthorized = 10,
    InvalidPayoutMethod = 11,
    InvalidAmount = 12,
    DeadlineNotReached = 13,
    NotInitialized = 14,
}

#[contracttype]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum OrderStatus {
    Created = 0,
    Funded = 1,
    QualityVerified = 2,
    Settled = 3,
    Refunded = 4,
}

#[contracttype]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum PayoutRail {
    /// Efectivo vía red MicoPay. Los fondos van a la cuenta de MicoPay: es custodia de un tercero.
    MicoPayScaleCash = 1,
    /// SPEI vía un ancla regulada (p. ej. Etherfuse) a la cuenta del productor.
    EtherfuseSpeiBanxico = 2,
    PolarBoliviaQr = 3,
    PixBrazil = 4,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EscrowOrder {
    pub order_id: BytesN<32>,
    pub buyer: Address,
    pub producer: Address,
    pub token: Address,
    pub amount: i128,
    pub min_price_guardrail: i128,
    pub payout_rail: PayoutRail,
    pub communal_treasury: Address,
    pub status: OrderStatus,
    pub delivery_attestation_uid: Option<BytesN<32>>,
    pub created_at: u64,
    pub deadline: u64,
    pub settled_at: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    AttestationRegistry,
    MicoPayTerminalAuthority,
    Order(BytesN<32>),
    CommunalTequioTreasury,
    MinPrice(Address, Address), // (productor, token)
}

/// Interfaz mínima del contrato `attestation_registry` que se consulta antes de liberar.
#[contractclient(name = "AttestationRegistryClient")]
pub trait AttestationRegistryInterface {
    fn verify_attestation(env: Env, attestation_uid: BytesN<32>) -> bool;
}

const TEQUIO_BPS: i128 = 200; // 2% fondo comunitario (Tequio)
const TOTAL_BPS: i128 = 10_000;
const TTL_THRESHOLD: u32 = 100_000;
const TTL_EXTEND_TO: u32 = 500_000;

fn bump_instance(env: &Env) {
    env.storage()
        .instance()
        .extend_ttl(TTL_THRESHOLD, TTL_EXTEND_TO);
}

fn save_order(env: &Env, key: &DataKey, order: &EscrowOrder) {
    env.storage().persistent().set(key, order);
    env.storage()
        .persistent()
        .extend_ttl(key, TTL_THRESHOLD, TTL_EXTEND_TO);
}

fn admin(env: &Env) -> Result<Address, EscrowError> {
    env.storage()
        .instance()
        .get(&DataKey::Admin)
        .ok_or(EscrowError::NotInitialized)
}

#[contract]
pub struct FairEscrowContract;

#[contractimpl]
impl FairEscrowContract {
    /// Inicializa el contrato. `admin` actúa como árbitro en disputas.
    pub fn initialize(
        env: Env,
        admin: Address,
        attestation_registry: Address,
        micopay_authority: Address,
        communal_treasury: Address,
    ) -> Result<(), EscrowError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(EscrowError::AlreadyInitialized);
        }
        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::AttestationRegistry, &attestation_registry);
        env.storage()
            .instance()
            .set(&DataKey::MicoPayTerminalAuthority, &micopay_authority);
        env.storage()
            .instance()
            .set(&DataKey::CommunalTequioTreasury, &communal_treasury);
        bump_instance(&env);
        Ok(())
    }

    /// El PRODUCTOR fija su precio mínimo por token (protección contra el coyote).
    pub fn set_min_price(
        env: Env,
        producer: Address,
        token: Address,
        min_price: i128,
    ) -> Result<(), EscrowError> {
        producer.require_auth();
        if min_price < 0 {
            return Err(EscrowError::InvalidAmount);
        }
        let key = DataKey::MinPrice(producer, token);
        env.storage().persistent().set(&key, &min_price);
        env.storage()
            .persistent()
            .extend_ttl(&key, TTL_THRESHOLD, TTL_EXTEND_TO);
        bump_instance(&env);
        Ok(())
    }

    /// Precio mínimo vigente del productor para un token (0 si no lo ha fijado).
    pub fn get_min_price(env: Env, producer: Address, token: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::MinPrice(producer, token))
            .unwrap_or(0)
    }

    /// El comprador crea la orden y deposita. `deadline` = momento (timestamp del ledger)
    /// a partir del cual puede pedir su reembolso si nadie liberó los fondos.
    pub fn create_and_fund_order(
        env: Env,
        order_id: BytesN<32>,
        buyer: Address,
        producer: Address,
        token: Address,
        amount: i128,
        deadline: u64,
        payout_rail: PayoutRail,
    ) -> Result<(), EscrowError> {
        buyer.require_auth();

        if amount <= 0 || buyer == producer {
            return Err(EscrowError::InvalidAmount);
        }

        let min_price = Self::get_min_price(env.clone(), producer.clone(), token.clone());
        if amount < min_price {
            return Err(EscrowError::PriceBelowAntiCoyoteGuardrail);
        }

        let order_key = DataKey::Order(order_id.clone());
        if env.storage().persistent().has(&order_key) {
            return Err(EscrowError::OrderAlreadyExists);
        }

        let communal_treasury: Address = env
            .storage()
            .instance()
            .get(&DataKey::CommunalTequioTreasury)
            .ok_or(EscrowError::NotInitialized)?;

        let contract_address = env.current_contract_address();
        token::Client::new(&env, &token).transfer(&buyer, &contract_address, &amount);

        let order = EscrowOrder {
            order_id: order_id.clone(),
            buyer,
            producer,
            token,
            amount,
            min_price_guardrail: min_price,
            payout_rail,
            communal_treasury,
            status: OrderStatus::Funded,
            delivery_attestation_uid: None,
            created_at: env.ledger().timestamp(),
            deadline,
            settled_at: 0,
        };
        save_order(&env, &order_key, &order);
        bump_instance(&env);

        env.events().publish(
            (symbol_short!("escrow"), symbol_short!("funded")),
            (order_id, amount),
        );
        Ok(())
    }

    /// Libera los fondos con una atestación de entrega válida.
    /// Solo puede llamarlo el comprador (confirma que recibió) o el administrador (árbitro).
    pub fn release_with_attestation(
        env: Env,
        order_id: BytesN<32>,
        delivery_attestation_uid: BytesN<32>,
        caller: Address,
    ) -> Result<(), EscrowError> {
        caller.require_auth();

        let order_key = DataKey::Order(order_id.clone());
        let mut order: EscrowOrder = env
            .storage()
            .persistent()
            .get(&order_key)
            .ok_or(EscrowError::OrderNotFound)?;

        if caller != order.buyer && caller != admin(&env)? {
            return Err(EscrowError::Unauthorized);
        }
        if order.status != OrderStatus::Funded && order.status != OrderStatus::QualityVerified {
            return Err(EscrowError::InvalidOrderStatus);
        }

        let registry: Address = env
            .storage()
            .instance()
            .get(&DataKey::AttestationRegistry)
            .ok_or(EscrowError::AttestationRegistryFailed)?;
        let valid = AttestationRegistryClient::new(&env, &registry)
            .verify_attestation(&delivery_attestation_uid);
        if !valid {
            return Err(EscrowError::DeliveryAttestationInvalid);
        }

        let tequio_amount = (order.amount * TEQUIO_BPS) / TOTAL_BPS;
        let producer_net = order.amount - tequio_amount;

        let contract_address = env.current_contract_address();
        let token_client = token::Client::new(&env, &order.token);

        match order.payout_rail {
            PayoutRail::MicoPayScaleCash => {
                let micopay_authority: Address = env
                    .storage()
                    .instance()
                    .get(&DataKey::MicoPayTerminalAuthority)
                    .ok_or(EscrowError::InvalidPayoutMethod)?;
                token_client.transfer(&contract_address, &micopay_authority, &producer_net);
            }
            PayoutRail::EtherfuseSpeiBanxico
            | PayoutRail::PolarBoliviaQr
            | PayoutRail::PixBrazil => {
                token_client.transfer(&contract_address, &order.producer, &producer_net);
            }
        }
        if tequio_amount > 0 {
            token_client.transfer(&contract_address, &order.communal_treasury, &tequio_amount);
        }

        order.status = OrderStatus::Settled;
        order.delivery_attestation_uid = Some(delivery_attestation_uid);
        order.settled_at = env.ledger().timestamp();
        save_order(&env, &order_key, &order);
        bump_instance(&env);

        env.events().publish(
            (symbol_short!("escrow"), symbol_short!("settled")),
            (order_id, producer_net),
        );
        Ok(())
    }

    /// Devuelve el depósito completo al comprador.
    /// - El administrador (árbitro) puede reembolsar en cualquier momento mientras la orden esté fondeada.
    /// - El comprador puede reembolsarse solo después de `deadline`.
    pub fn refund(env: Env, order_id: BytesN<32>, caller: Address) -> Result<(), EscrowError> {
        caller.require_auth();

        let order_key = DataKey::Order(order_id.clone());
        let mut order: EscrowOrder = env
            .storage()
            .persistent()
            .get(&order_key)
            .ok_or(EscrowError::OrderNotFound)?;

        if order.status != OrderStatus::Funded && order.status != OrderStatus::QualityVerified {
            return Err(EscrowError::InvalidOrderStatus);
        }

        let is_admin = caller == admin(&env)?;
        if !is_admin {
            if caller != order.buyer {
                return Err(EscrowError::Unauthorized);
            }
            if env.ledger().timestamp() <= order.deadline {
                return Err(EscrowError::DeadlineNotReached);
            }
        }

        token::Client::new(&env, &order.token).transfer(
            &env.current_contract_address(),
            &order.buyer,
            &order.amount,
        );

        order.status = OrderStatus::Refunded;
        order.settled_at = env.ledger().timestamp();
        save_order(&env, &order_key, &order);
        bump_instance(&env);

        env.events().publish(
            (symbol_short!("escrow"), symbol_short!("refund")),
            (order_id, order.amount),
        );
        Ok(())
    }

    /// Consulta una orden.
    pub fn get_order(env: Env, order_id: BytesN<32>) -> Result<EscrowOrder, EscrowError> {
        env.storage()
            .persistent()
            .get(&DataKey::Order(order_id))
            .ok_or(EscrowError::OrderNotFound)
    }
}

#[cfg(test)]
mod test;
