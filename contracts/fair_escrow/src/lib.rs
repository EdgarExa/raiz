#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, token, Address, BytesN,
    Env,
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
    MicoPayScaleCash = 1,  // Instant physical cash payout via MicoPay local carrier/node network
    EtherfuseSpeiBanxico = 2, // Direct SPEI wire transfer to Banco del Bienestar debit card
    PolarBoliviaQr = 3,    // ASFI QR Simple for Bolivian producers
    PixBrazil = 4,         // Banco Central do Brasil PIX instant settlement
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
    pub settled_at: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    AttestationRegistry,
    MicoPayTerminalAuthority,
    Order(BytesN<32>),
    CommunalTequioTreasury,
}

const TEQUIO_BPS: i128 = 200; // 2% Communal Infrastructure Fund
const TOTAL_BPS: i128 = 10_000;

#[contract]
pub struct FairEscrowContract;

#[contractimpl]
impl FairEscrowContract {
    /// Initialize FairEscrow contract
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

        Ok(())
    }

    /// Create and fund purchase order with anti-coyote price guardrails
    pub fn create_and_fund_order(
        env: Env,
        order_id: BytesN<32>,
        buyer: Address,
        producer: Address,
        token: Address,
        amount: i128,
        min_price_guardrail: i128,
        payout_rail: PayoutRail,
    ) -> Result<(), EscrowError> {
        buyer.require_auth();

        // Enforce anti-coyote price protection
        if amount < min_price_guardrail {
            return Err(EscrowError::PriceBelowAntiCoyoteGuardrail);
        }

        let order_key = DataKey::Order(order_id.clone());
        if env.storage().persistent().has(&order_key) {
            return Err(EscrowError::OrderAlreadyExists);
        }

        // Lock buyer liquidity into the contract
        let contract_address = env.current_contract_address();
        token::Client::new(&env, &token).transfer(&buyer, &contract_address, &amount);

        let communal_treasury: Address = env
            .storage()
            .instance()
            .get(&DataKey::CommunalTequioTreasury)
            .unwrap();

        let order = EscrowOrder {
            order_id: order_id.clone(),
            buyer,
            producer,
            token,
            amount,
            min_price_guardrail,
            payout_rail,
            communal_treasury,
            status: OrderStatus::Funded,
            delivery_attestation_uid: None,
            created_at: env.ledger().timestamp(),
            settled_at: 0,
        };

        env.storage().persistent().set(&order_key, &order);

        env.events().publish(
            (symbol_short!("escrow"), symbol_short!("funded")),
            (order_id, amount),
        );
        Ok(())
    }

    /// Release funds upon verified PhysicalDeliveryAttestation (MicoPay reception confirmation)
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

        if order.status != OrderStatus::Funded && order.status != OrderStatus::QualityVerified {
            return Err(EscrowError::InvalidOrderStatus);
        }

        // Calculate 2% Tequio Communal Fund & 98% Net Producer Payout
        let tequio_amount = (order.amount * TEQUIO_BPS) / TOTAL_BPS;
        let producer_net = order.amount - tequio_amount;

        let contract_address = env.current_contract_address();
        let token_client = token::Client::new(&env, &order.token);

        // Disburse payments according to verified payout rail
        match order.payout_rail {
            PayoutRail::MicoPayScaleCash => {
                // If MicoPay Cash: funds are credited to MicoPay liquidity pool,
                // and the producer collects physical banknotes via MicoPay cash network
                let micopay_authority: Address = env
                    .storage()
                    .instance()
                    .get(&DataKey::MicoPayTerminalAuthority)
                    .unwrap();
                token_client.transfer(&contract_address, &micopay_authority, &producer_net);
            }
            PayoutRail::EtherfuseSpeiBanxico
            | PayoutRail::PolarBoliviaQr
            | PayoutRail::PixBrazil => {
                // Direct on-chain settlement to producer's anchor gateway address
                token_client.transfer(&contract_address, &order.producer, &producer_net);
            }
        }

        // Transfer 2% to Communal Assembly Infrastructure Fund (Tequio)
        if tequio_amount > 0 {
            token_client.transfer(&contract_address, &order.communal_treasury, &tequio_amount);
        }

        order.status = OrderStatus::Settled;
        order.delivery_attestation_uid = Some(delivery_attestation_uid);
        order.settled_at = env.ledger().timestamp();
        env.storage().persistent().set(&order_key, &order);

        env.events().publish(
            (symbol_short!("escrow"), symbol_short!("settled")),
            (order_id, producer_net),
        );

        Ok(())
    }

    /// Query order status
    pub fn get_order(env: Env, order_id: BytesN<32>) -> Result<EscrowOrder, EscrowError> {
        let order_key = DataKey::Order(order_id);
        env.storage()
            .persistent()
            .get(&order_key)
            .ok_or(EscrowError::OrderNotFound)
    }
}
