# 🏛️ Yucu Protocol Architecture Specification
### *Software Architecture & Decentralized Protocol on Stellar & Soroban*

* **Ecosystem:** Stellar Network / Soroban / Drips Network / TecNM Campus Tlaxiaco
* **Architectural Pattern:** Offline-First, Event-Driven, Decoupled Adapter Pattern
* **Associated ADRs:** [ADR-001 (Trustless Work Escrow)](./adr/ADR-001-TRUSTLESS-WORK-ESCROW.md), [ADR-002 (Offline-First PWA & Rural Identity)](./adr/ADR-002-OFFLINE-FIRST-PWA-AND-RURAL-IDENTITY.md)

---

## 📐 1. System Layers Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        LAYER 1: MOBILE CLIENT & ACCESSIBILITY                          │
│  - Progressive Web App (PWA) Offline-First (React 19 + Tailwind CSS)                   │
│  - "Elder-Friendly / Modo Abuelo" UI: 112px ergonomic touch targets, zero complex text│
│  - Web Audio API: 24kbps Opus recording and acoustic normalization                     │
│  - Zero-Seed IAM: Physical Community QR Cards and SMS OTP authentication               │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   LAYER 2: DOMAIN CORE & OFFLINE RESILIENCE ENGINE                     │
│  - Offline Storage Outbox: IndexedDB (ACID transactional offline-first storage)        │
│  - SyncEngine: Reactive cryptographic synchronization upon connectivity detection      │
│  - CryptoEngine: Canonical SHA-256 Community Digest calculation and Ed25519 signing    │
│  - QR Engine: Vectorized SVG ISO/IEC 18004 generation for physical Hang-Tag labels     │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                     LAYER 3: AUTONOMOUS AI ORACLES & AGENT SWARM                       │
│  - IndigenousVoiceAgent: Acoustic parsing (*Tu'un Savi* / Spanish) & SHA-256 digest    │
│  - SCAACuppingVisionAgent: SCAA sensory scoring (>85 export) & craft defect audit      │
│  - SentinelEUDRSatelliteAgent: Sentinel-2 satellite geofence anti-deforestation proof  │
│  - DPPCircularityAgent: EU Digital Product Passport (ESPR) & agroforestry carbon inset│
│  - IndigenousIPGuardianAgent: Ancestral collective IP shield (8% + 2% Tequio royalty)  │
│  - SettlementSolverAgent: Stellar AMM / Banxico SPEI path payment router               │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                    LAYER 4: SOROBAN SMART CONTRACTS & DEVELOPER GATEWAY                │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ ┌──────────────────────────┐ │
│  │   lot_passport (Rust)   │ │ attestation_registry(RS)│ │  TRUSTLESS WORK ESCROW   │ │
│  │ Immutable lot identity  │ │ 8 Canonical RWA Schemas │ │ Milestone-based Soroban  │ │
│  │ & Tlaxiaco origin proof │ │ Two-Tier TTL Storage    │ │ custody & disbursement   │ │
│  └─────────────────────────┘ └─────────────────────────┘ └──────────────────────────┘ │
│  - External Consumption Gateway: React Hooks (`@yucu-protocol/react`)                  │
│  - Embeddable Trust Badge (`<YucuPassportBadge />`) for Shopify/WooCommerce e-commerce │
│  - Official Stellar SDK Client (`@stellar/stellar-sdk`) & Stellar Raven MCP Server     │
│  - Public REST & Webhook Gateway (`/api/v1/protocol/*`, `/api/v1/attestations/*`)      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                     LAYER 5: SETTLEMENT RAILS & LAST-MILE PAYOUT                       │
│  - Etherfuse Anchor: Atomic swap USDC -> MXNe -> Banxico SPEI interbank transfers     │
│  - Financial Inclusion Accounts: Banco del Bienestar, Finabien & Oaxaca Credit Unions  │
│  - Rural cooperative cash distribution network for unbanked smallholders (MicoPay)     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 2. End-to-End User and System Interaction Sequence Diagram

The following sequence diagram details the complete flow of events and interactions among the three human actors (**Producer**, **Institutional Buyer**, and **Tlaxiaco Cooperative Validator**) with the client software, offline storage, Stellar ledger anchoring, and the **Trustless Work** smart contract escrow:

```mermaid
sequenceDiagram
    autonumber
    actor Producer as 🌾 Producer / Artisan<br/>(Don Juan - Yucuhiti)
    participant PWA as 📱 Yucu PWA Client<br/>(Offline-First)
    participant Storage as 💾 IndexedDB Outbox<br/>(Local Storage)
    participant Sync as 🔄 Sync & Crypto Engine<br/>(SHA-256 / Ed25519)
    participant Soroban as ⛓️ Stellar / Soroban<br/>(LotPassport & Attestation)
    actor Buyer as ☕ B2B Buyer / Roaster<br/>(Specialty Coffee SMB)
    participant TW as 🤝 Trustless Work Escrow<br/>(Milestone-based Soroban)
    actor Coop as 🏛️ Tlaxiaco Cooperative<br/>(Arbitrator / Validator)
    participant Payout as 💳 Settlement Rails<br/>(Etherfuse SPEI / Cash)

    %% PHASE 1: OFFLINE PARCEL REGISTRATION
    Note over Producer,Storage: PHASE 1: Parcel Registration (100% Offline in Tlaxiaco)
    Producer->>PWA: 1. Presses giant 112px mic button and speaks in Mixteco or Spanish
    PWA->>PWA: 2. Web Audio API records 24kbps Opus & extracts harvest metadata (kg, variety)
    PWA->>Storage: 3. Saves lot & voice audio in local IndexedDB (zero data loss in offline mountain)
    PWA-->>Producer: 4. Shows friendly visual confirmation & provisional ID (MX-2026-CAFE-01)

    %% PHASE 2: SYNCHRONIZATION ON NETWORK DETECTION
    Note over Storage,Soroban: PHASE 2: Network Sync & Cryptographic Anchoring on Stellar
    PWA->>Sync: 5. Detects internet connection (community WiFi or mobile data upon town arrival)
    Sync->>Storage: 6. Reads pending lot outbox from local storage
    Sync->>Sync: 7. Computes canonical SHA-256 Community Digest and signs with Ed25519 key
    Sync->>Soroban: 8. Invokes lot_passport::register_lot(digest, producer_id, coordinates)
    Soroban-->>Sync: 9. Emits immutable receipt (Tx Hash and Stellar Ledger Number)
    Sync->>Storage: 10. Updates lot status locally to 'ANCHORED_ON_CHAIN'
    PWA-->>Producer: 11. Generates printable Hang-Tag label with ISO/IEC 18004 QR code

    %% PHASE 3: ESCROW FUNDING VIA TRUSTLESS WORK
    Note over Buyer,TW: PHASE 3: B2B Purchase & Escrow Funding (Trustless Work)
    Buyer->>PWA: 12. Scans physical QR code & inspects digital lot passport
    Buyer->>TW: 13. initialize_escrow(buyer, producer, coop_tlaxiaco, 1500 USDC)
    Buyer->>TW: 14. deposit_funds(1500 USDC locked in audited Soroban smart contract)
    TW-->>TW: 15. Contract locks funds (30% Milestone 1: Origin / 70% Milestone 2: Delivery)

    %% PHASE 4: MILESTONE RELEASE & LAST-MILE SETTLEMENT
    Note over TW,Payout: PHASE 4: Milestone Verification & Fund Disbursement
    Sync->>TW: 16. submit_milestone_proof(Milestone 1: Yucu Origin Attestation Verified)
    TW->>Payout: 17. Releases 30% advance ($450 USDC) directly to Producer
    Producer->>Coop: 18. Delivers physical coffee bags to Tlaxiaco Municipal Warehouse
    Coop->>PWA: 19. Scans bag QR tag, validates physical weight & moisture grade
    Coop->>TW: 20. submit_milestone_proof(Milestone 2: Physical Delivery Approved)
    TW->>Payout: 21. Releases remaining 70% final settlement ($1,050 USDC)
    Payout-->>Producer: 22. SPEI deposit to Banco del Bienestar card or local cash network
    TW-->>Buyer: 23. Transfers certified on-chain ownership of verified lot
```

### Breakdown of Sequence Phases:

1. **Phase 1 (Parcel Offline Edge):** Don Juan is in the remote mountains of Santa María Yucuhiti without cellular coverage. He opens the Yucu PWA, taps the 112px ergonomic microphone button, and speaks in *Tu'un Savi* (Mixteco). The application captures the audio and harvest metadata locally in IndexedDB with zero dependence on active internet.
2. **Phase 2 (Stellar Ledger Anchoring):** Upon arriving at a connected zone or community WiFi hotspot in Tlaxiaco, the `SyncEngine` processes the outbox, computes the canonical SHA-256 Community Digest, and interacts with Soroban smart contracts, generating the physical QR Hang-Tag label for the coffee sacks.
3. **Phase 3 (B2B Escrow with Trustless Work):** An ethical buyer or roaster in Europe, the US, or Mexico City scans the QR code, reviews verifiable proof of origin and quality, and locks 1,500 USDC in **Trustless Work**'s audited Soroban escrow contract.
4. **Phase 4 (Milestone Disbursement & Delivery):** The farmer immediately receives an automated 30% advance payment ($450 USDC) backed by the certified origin attestation. When physical coffee bags arrive at the Tlaxiaco cooperative, the local validator confirms physical reception, triggering the release of the remaining 70% ($1,050 USDC) via SPEI directly to the farmer's Banco del Bienestar debit card.

---

## 📂 3. Repository Directory Structure (Technical Mapping)

To facilitate onboarding for student-researchers, maintainers, and open-source contributors:

```text
yucu/
├── contracts/                     # Rust smart contracts for Soroban (Stellar)
│   ├── attestation_registry/      # Schema registry & on-chain provenance claims
│   ├── lot_passport/              # Immutable digital passport for agricultural lots
│   ├── perpetual_royalties/       # Secondary market royalty engine for female artisans
│   └── fair_escrow/               # Baseline community escrow implementation
├── docs/                          # Architectural, technical, and field research docs
│   ├── adr/                       # Architecture Decision Records (ADR-001, ADR-002)
│   ├── MVP_SPECIFICATION.md       # Strict MVP specification for Tlaxiaco pilot
│   ├── ARCHITECTURE.md            # This system architecture document
│   ├── PROTOCOL_SPECIFICATION.md  # Cryptographic & smart contract protocol spec
│   └── research/                  # Field research reports & usability interviews in Oaxaca
├── src/
│   ├── components/                # React UI components (PWA / Elder-Friendly Mode)
│   │   ├── ChatScreen.tsx         # Voice registration & conversational interface
│   │   ├── DigitalPassportScreen.tsx # Public verified lot passport viewer
│   │   ├── ArtisanQrTagModal.tsx  # Physical QR Hang-Tag label generator
│   │   └── TopAppBar.tsx          # Main header & role switcher
│   ├── core/                      # Pure domain core (isolated from UI framework)
│   │   ├── ai/                    # AI Oracles (Voice STT, SCAA Quality, EUDR Satellite)
│   │   ├── auth/                  # Zero-Seed identity & Community QR card engine
│   │   ├── blockchain/            # Soroban RPC adapter & Trustless Work Escrow adapter
│   │   ├── crypto/                # Canonical SHA-256 digest & Ed25519 signing
│   │   ├── settlement/            # Hybrid multi-anchor settlement orchestrator (Etherfuse)
│   │   └── sync/                  # Offline outbox & synchronization engine (IndexedDB)
│   └── tests/                     # Automated unit and system test suites
└── drips.config.json              # Drips Network funding configuration & splits
```

---

## 🔒 4. Trustless Work Escrow Integration

In alignment with [ADR-001](./adr/ADR-001-TRUSTLESS-WORK-ESCROW.md), Yucu Protocol utilizes **Trustless Work**'s audited smart contract infrastructure via the `TrustlessWorkEscrowAdapter`:

1. **Funding:** The institutional buyer deposits USDC or MXNe into the Trustless Work contract.
2. **Milestone 1 (Harvest Advance - 30%):** Automatically released when the smart contract verifies the origin attestation issued by Yucu in Tlaxiaco (`0x01_ORIGIN`).
3. **Milestone 2 (Final Settlement - 70%):** Released when the Tlaxiaco cooperative issues the physical delivery attestation (`0x04_DELIVERY`).
4. **Arbitration:** If discrepancies arise in weight, humidity, or defect score, the municipal cooperative acts as the designated arbitrator within Trustless Work to achieve resolution.

---

## 📡 5. Channel Policy & Offline Resilience

In alignment with [ADR-002](./adr/ADR-002-OFFLINE-FIRST-PWA-AND-RURAL-IDENTITY.md):
* The primary interaction channel is an open **Progressive Web App (PWA)** adhering to W3C standards, ensuring total sovereignty by eliminating dependencies on closed commercial messaging platforms, avoiding per-message API fees, and eliminating the risk of arbitrary account bans.
* All data is persisted locally in **IndexedDB** at the edge, synchronizing with the Stellar ledger in atomic batches when connectivity is available.
