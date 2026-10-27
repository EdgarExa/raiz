---
name: stellar-soroban-rwa
description: Comprehensive engineering skill guide and architecture patterns for designing, developing, and auditing Real-World Asset (RWA) protocols on Stellar and Soroban. Covers @stellar/stellar-sdk, Soroban Rust WASM contracts, storage TTL rent management, SEP-8/SEP-40/SEP-24 standards, CAP-0015 Fee-Bump gas sponsorship, and Trustless Work milestone escrows.
---

# 🌟 Stellar & Soroban RWA Architecture Skill Guide

This skill guide provides reference patterns, smart contract examples, and SDK integrations for building Real-World Asset (RWA) and supply chain provenance protocols on **Stellar** and **Soroban (Rust/WASM)**.

> **Project rules win over this guide.** Read [`AGENTS.md`](../../AGENTS.md), [ADR-003](../../docs/adr/ADR-003-NO-CUSTODIAL-Y-TRUSTLESS-WORK.md) and [ADR-004](https://github.com/Open-Hub-Tec/yucu-protocol/pull/104) first. Non-custodial: the server never generates, stores or receives user keys; every transaction follows prepare → sign on the phone → submit. The UI only talks to the ports in `src/core/chain/`.

---

## 1. Dual-Layer RWA Architecture on Stellar

Stellar provides a native dual-layer architecture uniquely suited for real-world assets:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CLASSIC STELLAR ASSET LAYER                           │
│  - Native Issuance & Regulated Trustlines (Flags: auth_required, clawback)  │
│  - Built-in Decentralized Exchange (DEX) & Path Payments                    │
│  - SEP-8 Compliance Gateway: Pre-flight transfer approval checks            │
│  - 3–5 Second Deterministic Settlement with zero block reorgs               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                         Soroban Asset Contract (SAC)
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOROBAN SMART CONTRACT LAYER (RUST/WASM)                 │
│  - Complex RWA Logic: Attestation registries, milestone escrows, oracles    │
│  - Two-Tier TTL Storage: Temporary (Telemetry) vs. Persistent (Origin)      │
│  - Zero-Gas Rural Sponsorship via CAP-0015 Fee-Bump Envelopes               │
│  - Off-ramps (SPEI, cash) run outside Soroban, behind `PayoutPort`          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Soroban Smart Contract Development Guidelines (Rust)

### 2.1 State & Storage Boundaries (TTL Rent Management)
Unlike EVM blockchains where storage is eternal, Soroban enforces active State Expiration (TTL). Smart contracts must choose the appropriate storage category:

1. **Temporary Storage (`env.storage().temporary()`):**
   * Use for ephemeral data: batch transit telemetry, humidity readings, waybills.
   * Cheaper than persistent storage. Automatically pruned when TTL expires.
2. **Persistent Storage (`env.storage().persistent()`):**
   * Use for permanent origin claims: canonical SHA-256 lot digests, authority signatures, token balances.
   * Must invoke `extend_ttl()` periodically to prevent archival.
3. **Instance Storage (`env.storage().instance()`):**
   * Use for contract-wide configuration: admin addresses, oracle public keys, fee treasury accounts.

### 2.2 Canonical Soroban Contract Skeleton (Attestation Registry)

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RwaAttestation {
    pub schema_id: Symbol,       // e.g. "SCAA_85", "EUDR_2026"
    pub lot_uid: BytesN<32>,     // SHA-256 hash of physical batch
    pub issuer: Address,         // Cooperative or accredited laboratory
    pub recipient: Address,      // Producer address or escrow vault
    pub data_hash: BytesN<32>,   // Complete proof dossier hash
    pub expiration: u64,         // Unix epoch expiration
    pub revoked: bool,           // Revocation status
}

#[contract]
pub struct RwaAttestationRegistry;

#[contractimpl]
impl RwaAttestationRegistry {
    pub fn register_attestation(
        env: Env,
        issuer: Address,
        recipient: Address,
        schema_id: Symbol,
        lot_uid: BytesN<32>,
        data_hash: BytesN<32>,
        validity_seconds: u64,
    ) -> BytesN<32> {
        issuer.require_auth();

        // Never overwrite an existing attestation
        if env.storage().persistent().has(&lot_uid) {
            panic!("attestation already exists"); // use a contracterror in real code
        }

        let expiration = env.ledger().timestamp() + validity_seconds;
        let attestation = RwaAttestation {
            schema_id,
            lot_uid: lot_uid.clone(),
            issuer,
            recipient,
            data_hash,
            expiration,
            revoked: false,
        };

        // Write to persistent storage and bump TTL rent.
        // TTL is measured in ledgers (~5 s each), not seconds, and capped by the network's `max_entry_ttl`.
        let ttl_ledgers = (validity_seconds / 5) as u32;
        env.storage().persistent().set(&lot_uid, &attestation);
        env.storage().persistent().extend_ttl(&lot_uid, ttl_ledgers, ttl_ledgers);

        lot_uid
    }

    pub fn verify_attestation(env: Env, lot_uid: BytesN<32>) -> bool {
        if let Some(att) = env.storage().persistent().get::<BytesN<32>, RwaAttestation>(&lot_uid) {
            if att.revoked || env.ledger().timestamp() > att.expiration {
                return false;
            }
            return true;
        }
        false
    }
}
```

---

## 3. Client & Backend Integration via `@stellar/stellar-sdk`

### 3.1 Initializing Horizon and Soroban RPC Clients

```typescript
import { Horizon, rpc, Networks, Keypair, Transaction, TransactionBuilder } from '@stellar/stellar-sdk';

const horizonServer = new Horizon.Server('https://horizon-testnet.stellar.org');
const sorobanServer = new rpc.Server('https://soroban-testnet.stellar.org');
const networkPassphrase = Networks.TESTNET;
```

### 3.2 CAP-0015 Fee-Bump Gas Sponsorship (Zero-Gas for Smallholders)

Smallholder producers in rural areas sign inner transactions without owning XLM. A sponsor account wraps the transaction with a Fee-Bump envelope. This runs **only on the server**, with the sponsor's own key from `.env`; it pays fees and never signs for the user. Before wrapping, check that the inner transaction only calls allowed contracts and functions, or anyone could spend the sponsor's XLM (see #94 [W4]).

```typescript
// 1. Farmer signs the inner transaction (paying 0 fee)
const innerTx = TransactionBuilder.fromXDR(farmerSignedTxXdr, networkPassphrase);

// 2. Protocol treasury wraps with Fee-Bump
if (!(innerTx instanceof Transaction)) throw new Error('Expected an inner transaction');
const treasuryKeypair = Keypair.fromSecret(process.env.STELLAR_SPONSOR_SECRET!); // server only, never in the repo
const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
  treasuryKeypair,
  '200000', // Max fee in stroops (~0.02 XLM)
  innerTx,
  networkPassphrase
);

feeBumpTx.sign(treasuryKeypair);
const result = await sorobanServer.sendTransaction(feeBumpTx);
```

### 3.3 Converting Native Types to Soroban `ScVal`

```typescript
import { nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';

// Convert JavaScript string/number to Soroban typed ScVal
const schemaScVal = nativeToScVal('SCAA_85', { type: 'symbol' });
const amountScVal = nativeToScVal(10000, { type: 'i128' });
const addressScVal = nativeToScVal('GPRODUCER_ADDRESS...', { type: 'address' });
```

---

## 4. Key Stellar Ecosystem Proposals (SEPs) for RWAs

* **SEP-8 (Regulated Asset Standard):** Enforces compliance checks before an asset transfer clears. Roasters and importers can only receive RWA asset tokens if their wallet passed sanction and country checks.
* **SEP-40 (Oracle Standard):** Standardizes how sensory cupping scores (SCAA) and satellite deforestation indices feed directly into Soroban lending and insurance vaults.
* **SEP-24 & SEP-38 (Anchor Off-Ramp):** Bridges on-chain stablecoins (USDC, MXNe) to local banking rails (Banxico SPEI in Mexico, PIX in Brazil, QR Simple in Bolivia).
* **CAP-0015 (Fee-Bump Transactions):** Native account abstraction pattern enabling gasless rural UX.

---

## 5. Trustless Work Milestone Escrow Pattern (ADR-001)

Rather than maintaining custom custody contracts, use **Trustless Work**'s Soroban escrow contracts through `EscrowPort` (ADR-003). `contracts/fair_escrow` is teaching material only. Roles and milestones follow [ADR-004](https://github.com/Open-Hub-Tec/yucu-protocol/pull/104), D8 (testnet, *multi-release*):

1. **Buyer funds the escrow in USDC from their own wallet.** Before funding, the buyer's app reads the escrow on chain and checks receivers, amounts, fee and roles.
2. **Milestones come from a template, 1 to N.** The default is **a single milestone (100 %)** paid when the buyer confirms receipt. An "advance" template (for example 30 % on shipping and 70 % on receipt) exists but is off unless field research shows artisans need it. Templates live in `src/config/protocolFees.ts`; never hard-code percentages.
3. **Roles:** the artisan receives each milestone in her own account and releases it with her PIN; the group marks "shipped" and never touches money; the buyer approves; the platform account receives only its fee, on top of the price; a third party trusted by both sides resolves disputes.
4. **No Tequio in the escrow (D10).** The 2 % Tequio exists only on resales through `perpetual_royalties`, paid to a community account Yucu never controls.

---

## 6. Official Stellar Raven MCP Context Layer Integration

To enable AI coding assistants (Claude Code, Cursor, VS Code) to write Soroban contracts without hallucinations, the repository integrates **Stellar Raven** (`https://raven.stellar.buzz/mcp`):

* **Configuration File:** `.cursor/mcp.json` and `mcp.json`
* **Transport:** HTTP / Model Context Protocol (MCP)
* **Tools Provided:**
  * `search`: Real-time semantic search over Algolia Stellar Docs, Protocol 22 specs, and SEPs.
  * `execute`: Sandboxed query execution against live Soroban Testnet and Mainnet state.
* **Command to Add to Claude Code:**
  ```bash
  claude mcp add --transport http stellar-raven "https://raven.stellar.buzz/mcp"
  ```

