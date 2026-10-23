# 🌾 Official Validated MVP Specification: Yucu Protocol
### *Traceability, Visibility, and Verifiable Provenance in Tlaxiaco, Oaxaca*

* **Version:** 1.2.0 (Release Candidate MVP)
* **Governing Body:** Student-Researchers & Faculty at TecNM Campus Tlaxiaco
* **Ecosystem:** Stellar Network / Soroban Smart Contracts / Drips Network / Tech Rebel

---

## 🎯 1. Strict MVP Scope Definition

In accordance with mentor recommendations (Alberto Chaves and Brandon), the Yucu MVP **strictly scopes its boundaries** to prevent feature creep and ensure rigorous, definitive validation in the field:

> **MVP Mission Statement:**  
> *"Empower smallholder coffee farmers and indigenous textile artisans in the region of Tlaxiaco, Oaxaca with an offline-first tool that guarantees harvest traceability, commercial visibility for their craftsmanship, and mathematical proof of origin anchored on the Stellar blockchain."*

The MVP exclusively addresses **three core pillars**:

```
                       ┌───────────────────────────────────────────────┐
                       │               RAÍZ PROTOCOL MVP               │
                       │             (Tlaxiaco, Oaxaca)                │
                       └───────────────────────┬───────────────────────┘
                                               │
           ┌───────────────────────────────────┼───────────────────────────────────┐
           │                                   │                                   │
           ▼                                   ▼                                   ▼
  1. TRACEABILITY                     2. VISIBILITY                       3. VERIFIABLE PROVENANCE
  - Offline parcel registration       - Public Digital Lot Passport       - Canonical SHA-256 Digest
  - Native Mixteco / Spanish voice    - Verifiable technical sheet        - Soroban (Stellar) anchoring
  - Photo, weight & plot capture      - Printed physical Hang-Tag QR      - Tamper-proof anti-coyote audit
```

---

## 📍 2. Pilot Territory & Target Actors

### A. Initial Validation Territory
* **Hub Municipality:** Heroica Ciudad de Tlaxiaco, Oaxaca, Mexico.
* **Pilot Communities:**
  1. **Santa María Yucuhiti:** High-altitude specialty coffee region (1,600 to 2,000 MASL), cultivating Typica, Bourbon, and Pluma Hidalgo varieties.
  2. **San Cristóbal Amoltepec:** Indigenous textile artisan community renowned for backstrap loom weaving and natural ancestral dyes.
  3. **San Agustín Tlacotepec:** Traditional smallholder coffee growers and raw wild-flower honey producers.

### B. The 3 MVP Actors

| Actor | Identity | Interaction with MVP |
| :--- | :--- | :--- |
| **1. Producer / Artisan** | Rural smallholder (median age 62, speaks *Tu'un Savi* or rural Spanish). | Speaks via voice or taps large 112px touch targets in the PWA to register lots without entering passwords. Receives a physical QR Hang-Tag label. |
| **2. Cooperative / Community Validator** | Tlaxiaco cooperative warehouse managers or TecNM resident student-researchers. | Validates physical delivery of coffee bags at the collection hub and co-signs the reception attestation. |
| **3. Institutional Buyer (SMB)** | Specialty coffee roasters and ethical boutiques across Mexico, the US, and Europe. | Scans the bag QR label, audits the digital passport, and locks payments into the Trustless Work Soroban Escrow. |

---

## 🛠️ 3. End-to-End User Flow (Step-by-Step MVP)

### User and System Interaction Sequence Diagram

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

### Step 1: On-Parcel / Workshop Capture (100% Offline Resilience)
1. The farmer opens the **Yucu PWA** on their smartphone (or meets with a TecNM field promoter).
2. Taps the 112px ergonomic microphone button and dictates harvest details:  
   *Mixteco example:* `"Kuni yu una kiti café"` / *Spanish example:* `"120 kilos de café pergamino lavado en Yucuhiti"`.
3. The application securely writes the record to **IndexedDB**, guaranteeing zero data loss even in mountain valleys without cellular coverage.

### Step 2: Digital Lot Passport & Cryptographic Anchoring
1. The `CryptoEngine` creates a canonical **SHA-256 Community Digest** binding:
   * Unique Lot ID (`MX-OAX-TLAX-2026-CAFE-01`).
   * Producer identity and obfuscated parcel geocoordinates.
   * Botanical variety, altitude, and harvest timestamp.
2. Upon sensing an active internet connection (community WiFi or mobile data upon returning to town), the `SyncEngine` anchors the digest onto the `LotPassport` contract on **Stellar / Soroban**.

### Step 3: Physical Labeling via QR Code (ISO/IEC 18004 Hang-Tag)
1. The application renders an SVG Hang-Tag label containing the vectorized QR code.
2. The QR tag is physically attached to the jute coffee bag or stitched to the textile.
3. The QR code resolves directly to the immutable public Digital Passport.

### Step 4: Public Verification & Milestone Settlement
1. The buyer (roaster or boutique importer) scans the QR code with any standard smartphone without installing third-party apps.
2. The viewer reveals:
   * Origin photo and native audio introduction by the producer.
   * SCAA cupping score, moisture level, and zero-deforestation proof.
   * Verifiable transaction hash and block ledger number on Stellar Horizon.
3. Payment executes via **Trustless Work**'s Soroban escrow contract, releasing funds directly into the producer's account or debit card without exploitative middlemen.

---

## 📊 4. MVP Success & Field Validation Metrics

1. **50 Active Producers in Tlaxiaco:** Formal onboarding and registration of at least 50 real agricultural and artisanal lots during the 2026 harvest cycle.
2. **0% Offline Data Loss:** 100% data persistence rate when capturing lots in zero-connectivity terrain.
3. **Registration Time < 3 Minutes:** A smallholder can complete a full lot registration in under 180 seconds using voice input.
4. **Zero-Seed-Phrase Dependency:** 0% of rural producers forced to write down or memorize 24-word English seed phrases.
5. **Immutable Stellar Attestation:** 100% of validated lots anchored with a cryptographic hash on Soroban.
