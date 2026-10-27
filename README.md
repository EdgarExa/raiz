<div align="center">

# 🌿 Yucu Protocol
### *Decentralized Attestation & AI Oracle Infrastructure for Agricultural Provenance, Fair Escrow & Real-World Assets (RWA) on Stellar & Soroban*

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](./LICENSE)
[![Stellar: Built on Soroban](https://img.shields.io/badge/Stellar-Soroban%20%7C%20Horizon-black.svg?logo=stellar)](https://stellar.org)
[![Escrow: Trustless Work Standard](https://img.shields.io/badge/Escrow-Trustless%20Work%20ADR--001-blueviolet.svg)](https://trustlesswork.com)
[![Institution: TecNM Campus Tlaxiaco](https://img.shields.io/badge/Development-TecNM%20Tlaxiaco-b45309.svg)](http://tlaxiaco.tecnm.mx/)
[![Tests: 80+ Passing](https://img.shields.io/badge/Tests-80%2B%20Passing%20(0%20Failures)-success.svg)]()

<p align="center">
  <b>Open-source decentralized public goods infrastructure on Stellar: Connecting unbanked smallholder coffee growers, beekeepers, and indigenous artisans from the Mixteca region of Oaxaca with global ethical buyers through verifiable on-chain attestations.</b>
  <br>
  <i>Researched, designed, and engineered by indigenous Computer Systems Engineering student-researchers at <b>Instituto Tecnológico de Tlaxiaco (Oaxaca, Mexico)</b></i>
</p>

[Overview](#-overview) • [Empirical Field Research](#-the-empirical-field-research-moat) • [Architecture & Engineering Status](#-engineering-status-what-is-live-vs-sandbox-simulation) • [Unified Settlement Stack](#-unified-3-tier-settlement-architecture) • [Quickstart](#-quickstart) • [Documentation Center](#-documentation-center)

---

</div>

## 📌 Overview

**Yucu Protocol** (named after *Yuku*, the Mixtec word for sacred mountain and forest, honoring Santa María Yucuhiti) is an open-source decentralized protocol for **Traceability, Visibility, and Verifiable Provenance (RWA)** built on the **Stellar Network** and **Soroban Smart Contracts**.

Conceived in the mountainous Mixteca Highlands of Oaxaca (**Heroica Ciudad de Tlaxiaco, San José Xochixtlán, San Pablo Tijaltepec, San Juan Mixtepec, San Juan Ñumí, and Santa María Yucuhiti**), Yucu Protocol eliminates digital and financial exclusion for smallholders and ancestral artisans through an **Offline-First PWA** operated by voice in their native language (*Tu'un Savi* / Mixteco).

---

## 🧪 Implementation Status · Qué es real y qué es simulado (audit, Oct 2026)

> This repository is a **working prototype**. The table below says which parts run for real today and which are demonstrations. Keep it updated in every PR that changes a module's status.

| Module | Status | What it really does today |
|---|---|---|
| PWA (React + Vite, service worker) | ✅ Real | Installable app; assets cached for offline use. |
| Offline storage (`src/utils/offlineStorage.ts`) | ✅ Real | Saves lots in IndexedDB (localStorage fallback). |
| Chat, image analysis, audio transcription (`server.ts`) | ✅ Real, needs `GEMINI_API_KEY` | Calls Gemini. Without a key it returns responses marked `isSimulated: true`. |
| Soroban contracts (`contracts/`) | ✅ Real, **deployed on testnet** | 4 contracts with 23 passing tests. ⚠️ The deployed `lot_passport` predates the separate `certifier` role (ADR-003 D6); it must be redeployed with `contracts/scripts/deploy-testnet.sh`. IDs in [`contracts/deployments/testnet.json`](./contracts/deployments/testnet.json): lot_passport [`CAPXWY…`](https://stellar.expert/explorer/testnet/contract/CAPXWYKU5GESGPZ57LNRCLOVHSBGDOZQVAWC6CWIQ655RSZ2ZGZI2BO7), attestation_registry [`CAIYZN…`](https://stellar.expert/explorer/testnet/contract/CAIYZNZIFHFU357CVFC5UF2YNHBI7KPVORPOGHOBN2HBI4EDQQGIUNHT), perpetual_royalties [`CCNPTD…`](https://stellar.expert/explorer/testnet/contract/CCNPTDDVW3RW53YQACZ2UFFHVLUJXNCMZ3TSK7TB552SUU6DDL26FRKU). `fair_escrow` [`CCVDEQ…`](https://stellar.expert/explorer/testnet/contract/CCVDEQ64Q4PJX73HLLPL3OYXLW4ARA652I34ZYIDQDXYQDQVJNLFSAQB) is **teaching material only**; real escrow is Trustless Work ([ADR-003](./docs/adr/ADR-003-NO-CUSTODIAL-Y-TRUSTLESS-WORK.md)). Not on mainnet. |
| Chain ports (`src/core/chain/`) | 🟡 Architecture ready | Non-custodial ports (`WalletPort`, `LotRegistryPort`, `EscrowPort`): prepare → user signs on device → submit. Only the demo implementation exists; the real ones are student issues. |
| `src/core/blockchain/SorobanAdapter.ts` | 🔴 Simulated | Builds fake tx hashes and ledger numbers; does not call the network. |
| `src/core/blockchain/StellarLiveClient.ts` | 🟡 Partial | Real Stellar SDK objects, but contract invocations return `simulated: true`; not used by the UI. |
| `src/core/blockchain/TrustlessWorkEscrowAdapter.ts` | 🔴 Simulated | Escrows live in an in-memory `Map`; no deposit happens. To be replaced by a real `EscrowPort` on the Trustless Work API. |
| `src/core/settlement/HybridSettlementOrchestrator.ts` | 🔴 Simulated | Fixed exchange rates; SPEI folios generated locally. No real MXN on/off-ramp. |
| `src/core/ai/RaizAIOracles.ts` | 🔴 Simulated | Rule-based: fixed quality scores (e.g. 88.75) and EUDR always "no deforestation"; no satellite data. |
| `src/core/agents/YucuAgentSwarm.ts` | 🔴 Simulated | Returns fixed `CERTIFIED` results. |
| `src/core/sync/SyncEngine.ts` | 🔴 Simulated | "Sending" is a `setTimeout`; not wired to any screen yet. |
| `src/core/auth/RaizAuthEngine.ts` | 🔴 Simulated | Fixed OTP (`7421`) and placeholder `GBRAIZ…` addresses (not valid Stellar accounts). |
| `RaizProtocolSDK.getMetrics()` | 🔴 Simulated | Hard-coded figures; not real settlements or communities. |

**Not a certification:** quality, EUDR and "AI certified" labels in the app are demonstrations until a human validator and a real data source are connected.

---

## ⚡ Executive Summary in 60 Seconds

* **The Problem:** Smallholder indigenous coffee farmers, beekeepers, and textile artisans in Oaxaca lose a large share of their product value to middlemen (*coyotes*), face systematic counterfeiting from industrial knockoffs, and face deep barriers to digital banking (no internet in parcels, no credit cards, language barriers in *Tu'un Savi*).
* **The Solution:** An **Offline-First Voice PWA** that allows an elder artisan to register a harvest by voice without typing. The system computes a cryptographic SHA-256 digest, prints a physical ISO/IEC 18004 hang-tag QR, anchors verifiable attestations on Stellar/Soroban, and, for protected purchases, locks funds in a Trustless Work milestone escrow.
* **The Impact (target design, [ADR-004](./docs/adr/ADR-004-PAGOS-EN-PESOS-SIN-BILLETERA.md)):** Buyers in Mexico pay the artisan directly in pesos (SPEI or cash); only the lot passport goes on Stellar. Foreign buyers pay in USDC into an escrow that releases to the artisan's own account, and she cashes out in pesos (MicoPay cash or Etherfuse SPEI). The artisan never pays a fee; the escrow takes **no Tequio**. On resales that go through the contract: **10% royalty to the original artisan + 2% Tequio** to a community account (single source of truth: [`src/config/protocolFees.ts`](./src/config/protocolFees.ts)). Today the payout rails are simulated; see the status table above.

---

## 🗺️ End-to-End User Journey Map

How a coffee grower or textile artisan interacts with Yucu Protocol—step by step, with direct links to the implementation code:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. PARCEL REGISTRATION ──▶ 2. CRYPTOGRAPHIC TWIN ──▶ 3. ESCROW FUNDING ──▶ 4. SETTLEMENT & PAYOUT      │
│ (Offline / Voice)          (Hang-Tag QR & Ledger)     (Soroban Milestone)     (Banxico SPEI / Cash)    │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

| Step | User & System Action | Technical Component & Direct Code Link |
| :---: | :--- | :--- |
| **1** | **Oral Harvest Log (Offline):** Don Juan presses the 112px voice button in Yucuhiti, speaking in *Tu'un Savi*: *"Kuni yu kiti 120 kilos café pergamino"*. Audio is encoded at 24kbps Opus without cell signal. | [`src/components/RegisterCoffeeLotScreen.tsx`](./src/components/RegisterCoffeeLotScreen.tsx)<br>[`src/utils/offlineStorage.ts`](./src/utils/offlineStorage.ts) |
| **2** | **Cryptographic Digital Twin:** The system extracts metadata, computes the canonical SHA-256 Community Digest, and generates a printable vector SVG hang-tag QR for the physical coffee sack. | [`src/core/crypto/CryptoEngine.ts`](./src/core/crypto/CryptoEngine.ts)<br>[`src/components/ArtisanQrTagModal.tsx`](./src/components/ArtisanQrTagModal.tsx) |
| **3** | **Protected Purchase (Trustless Work escrow, testnet):** A buyer abroad inspects the digital lot passport and funds a Trustless Work escrow in USDC from their own wallet. The artisan is the receiver. | [`src/core/chain/ports.ts`](./src/core/chain/ports.ts) (`EscrowPort`)<br>[`src/core/blockchain/TrustlessWorkEscrowAdapter.ts`](./src/core/blockchain/TrustlessWorkEscrowAdapter.ts) *(simulated)* |
| **4** | **Shipping:** The group marks the milestone as "shipped". By default there is a single milestone (100 %); an "advance" template (e.g. 30 % / 70 %) is only enabled if field research shows artisans need it. | [`docs/standards/SEP_RWA_ATTESTATION_DRAFT.md`](./docs/standards/SEP_RWA_ATTESTATION_DRAFT.md)<br>[`src/core/ai/RaizAIOracles.ts`](./src/core/ai/RaizAIOracles.ts) |
| **5** | **Delivery & Payout:** The buyer confirms receipt; the artisan releases the payment to her own account with her PIN and cashes out in pesos (MicoPay cash or Etherfuse SPEI, behind `PayoutPort`). | [`src/core/settlement/HybridSettlementOrchestrator.ts`](./src/core/settlement/HybridSettlementOrchestrator.ts) *(simulated)*<br>[`docs/adr/ADR-001-TRUSTLESS-WORK-ESCROW.md`](./docs/adr/ADR-001-TRUSTLESS-WORK-ESCROW.md) |

---

## 🏛️ Interactive Architecture Map (With Codebase Links)

| Architecture Layer | Responsibilities | Key Files & Modules in Repo |
| :--- | :--- | :--- |
| **Layer 1: Rural Client (PWA)** | Voice-first accessible UI ("Modo Abuelo"), 112px touch targets, zero-seed authentication, offline caching. | [`src/App.tsx`](./src/App.tsx)<br>[`src/components/MainMenuScreen.tsx`](./src/components/MainMenuScreen.tsx)<br>[`src/components/VoiceAssistantModal.tsx`](./src/components/VoiceAssistantModal.tsx) |
| **Layer 2: Core Domain Engine** | ACID outbox persistence, reactive sync listeners, canonical SHA-256 hashing, ISO/IEC 18004 vector QR generation. | [`src/core/crypto/CryptoEngine.ts`](./src/core/crypto/CryptoEngine.ts)<br>[`src/core/sync/IndexedDbOutbox.ts`](./src/core/sync/IndexedDbOutbox.ts)<br>[`src/core/policy/FairTradeEngine.ts`](./src/core/policy/FairTradeEngine.ts) |
| **Layer 3: Autonomous AI Oracles & Agent Swarm** | 6 specialized agents: Tu'un Savi Voice, SCAA Cupping, Sentinel-2 EUDR, DPP Circularity, Indigenous IP Shield, and Settlement Solver. | [`src/core/agents/YucuAgentSwarm.ts`](./src/core/agents/YucuAgentSwarm.ts)<br>[`src/core/ai/RaizAIOracles.ts`](./src/core/ai/RaizAIOracles.ts)<br>[`src/components/ProtocolInfrastructureModal.tsx`](./src/components/ProtocolInfrastructureModal.tsx) |
| **Layer 4: Soroban Smart Contracts & Official SDK** | Compact WASM contracts, TTL two-tier rent management, official `@stellar/stellar-sdk` client, and Trustless Work escrow. | [`src/core/blockchain/StellarLiveClient.ts`](./src/core/blockchain/StellarLiveClient.ts)<br>[`contracts/attestation_registry/`](./contracts/attestation_registry/)<br>[`contracts/fair_escrow/`](./contracts/fair_escrow/) |
| **Layer 5: Third-Party Developer Tools & Embeds** | React Hooks library (`@yucu-protocol/react`), drop-in `<YucuPassportBadge />`, live REST APIs `/api/v1/protocol/*`, and Stellar Raven MCP. | [`src/core/hooks/useYucuProtocol.ts`](./src/core/hooks/useYucuProtocol.ts)<br>[`src/components/YucuPassportBadge.tsx`](./src/components/YucuPassportBadge.tsx)<br>[`.cursor/mcp.json`](./.cursor/mcp.json) |
| **Layer 6: Multi-Anchor Fiat Settlement Rails** | Atomic swap from on-chain USDC/MXNe to Banxico SPEI interbank transfers and rural cash-in-hand parcel network. | [`src/core/settlement/HybridSettlementOrchestrator.ts`](./src/core/settlement/HybridSettlementOrchestrator.ts) *(simulated)*<br>[`docs/adr/ADR-001-TRUSTLESS-WORK-ESCROW.md`](./docs/adr/ADR-001-TRUSTLESS-WORK-ESCROW.md) |

---

## 📜 Canonical 8-Schema RWA Attestation Catalog

Yucu Protocol standardizes 8 specialized attestation types anchored on Soroban for global trade, regulatory compliance, and community defense:

| Schema UID | Schema Name | Issuing Authority / Oracle | Regulatory / Industry Standard |
| :---: | :--- | :--- | :--- |
| `0x01_VOICE` | **Indigenous Voice & Origin** | Communal Agrarian Assembly + Tu'un Savi Acoustic Notary | W3C Oral Consent / UNESCO Linguistic Heritage |
| `0x02_SCAA` | **Specialty Quality & Sensory Grade** | Certified Q-Grader Vision AI + TecNM Laboratory | SCAA Cupping Protocols / NMX-F-083-SCFI |
| `0x03_EUDR` | **Copernicus Anti-Deforestation Proof** | Sentinel-2 Multispectral Satellite Oracle | EU Deforestation Regulation (EUDR 2026) |
| `0x04_SETT` | **Trustless Work Escrow Clearance** | Audited Soroban Contract + Banxico SPEI | Soroban WASM Milestone Standard (ADR-001) |
| `0x05_DPP` | **EU Digital Product Passport & Carbon Insetting** | DPPCircularityAgent + Agroforestry Biomass Lab | EU Ecodesign (ESPR 2026) / GS1 Digital Link |
| `0x06_INDIP` | **Indigenous Collective IP & Perpetual Royalties** | IndigenousIPGuardianAgent + Communal Assembly | Ley Federal Protección Patrimonio Cultural 2022 |
| `0x07_IOT` | **Cold-Chain & Dynamic Transit Telemetry** | Carrier IoT Mesh (Soroban Temporary Storage TTL 60d) | ISO 22005 Food Traceability / Zero State Bloat |
| `0x08_USMCA` | **Customs Rules of Origin & Phytosanitary** | SENASICA / USDA Organic Conformity Gateway | USMCA (T-MEC) Origin Rules / Stellar SEP-8 |

---

## 🌐 Third-Party Platform Integration (How Other Apps Consume Yucu)

Any external e-commerce store (Shopify, WooCommerce), roaster dApp, fintech, or customs ERP can consume Yucu with three developer-ready options:

### 1. React Hooks (`@yucu-protocol/react`)
```tsx
import { useYucuAttestation, useYucuDigitalPassport } from '@yucu-protocol/react';

function SpecialtyLotCard({ lotCode }) {
  const { verified, dataHash } = useYucuAttestation({ lotCode, expectedSchema: '0x01_SCAA' });
  const { passport, gs1Url } = useYucuDigitalPassport(lotCode);

  return (
    <div>
      <h3>{passport?.credentialSubject?.productName}</h3>
      <p>Verified on Soroban: {verified ? 'YES' : 'PENDING'}</p>
      <a href={gs1Url}>GS1 Digital Link Verification</a>
    </div>
  );
}
```

### 2. Drop-in Trust Badge (`<YucuPassportBadge />`)
Embed a live cryptographic certification badge into any web page or checkout card:
```tsx
import { YucuPassportBadge } from './components/YucuPassportBadge';

<YucuPassportBadge lotCode="MX-2024-884" productTitle="Café Pluma Typica de Altura" qualityScore={89.2} />
```

### 3. Public REST API Gateway
* `GET /api/v1/protocol/spec`: Protocol parameters, schemas, and live Soroban contracts.
* `POST /api/v1/attestations/verify`: Independent cryptographic verification endpoint.
* `POST /api/v1/attestations/issue`: Mints a signed attestation with 100% sponsored gas.
* `GET /api/v1/lots/:code/passport`: Full digital twin conforming to W3C VC and GS1 Digital Link.

---

## 🦅 Stellar Raven MCP Server Integration

This repository is pre-configured with **Stellar Raven**, the official Model Context Protocol (MCP) server from the Stellar Development Foundation (`https://raven.stellar.buzz/mcp`), in `.cursor/mcp.json` and `mcp.json`.

To connect it to Claude Code:
```bash
claude mcp add --transport http stellar-raven "https://raven.stellar.buzz/mcp"
```

---

## 💳 Unified 3-Tier Settlement Architecture

To resolve ambiguity between on-chain escrow, off-ramps, and cash distribution:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 1: ON-CHAIN ESCROW (Trustless Work, testnet)                           │
│ Buyer locks funds in USDC from their own wallet:                            │
│  • Default: 1 milestone (100%), released when the buyer confirms receipt.   │
│  • Optional template with advance (e.g. 30% / 70%), off by default.         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 2: LAST-MILE PARCEL CASH NETWORK (MicoPay Community Nodes)            │
│ For unbanked indigenous elders with zero bank accounts:                      │
│ Local cooperatives and certified transport drivers disburse physical cash   │
│ in parcel/depot upon verifying the hang-tag QR attestation.                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 3: REGULATED FIAT BANKING RAILS (Etherfuse SPEI / MoneyGram Access)    │
│ For banked producers, cooperatives, and commercial entities:               │
│ Atomic conversion from USDC to local currency (MXNe via Etherfuse SPEI,     │
│ cash pickup via MoneyGram Stellar Access, or Banco del Bienestar debit).    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart

Clone, install, and run Yucu Protocol locally:

```bash
# 1. Clone the repository
git clone https://github.com/Open-Hub-Tec/yucu-protocol.git
cd yucu-protocol

# 2. Use Node 22 (see .nvmrc) and install the exact dependencies
nvm use
npm ci

# 3. Launch local development server
npm run dev
```

Open your browser at `http://localhost:3000`.

### Verification & Quality Assurance:
```bash
# Run the complete test suite (79 automated tests, 0 failures)
npm run test

# Compile production bundle
npm run build
```

---

## 📚 Documentation Center

Technical architecture, field evidence, and academic standards are organized modularly in [`docs/`](./docs/README.md):

* **[Architecture Document](./docs/ARCHITECTURE.md):** capas, puertos, quién firma qué y camino del dinero (ADR-003 y ADR-004).
* **[ADR-001: Trustless Work Escrow](./docs/adr/ADR-001-TRUSTLESS-WORK-ESCROW.md):** Milestone custody specification and rationale.
* **[ADR-002: Offline-First PWA & Rural Identity](./docs/adr/ADR-002-OFFLINE-FIRST-PWA-AND-RURAL-IDENTITY.md):** W3C PWA standards vs. proprietary messaging platforms.
* **[SEP-XXXX Attestation Draft](./docs/standards/SEP_RWA_ATTESTATION_DRAFT.md):** Verifiable RWA Attestation Standard proposed for Soroban.
* **[Field Research Dossier](./docs/research/):** Complete field interviews, transcripts, audio recordings, and pain-point validations (Hito 1.1).
* **[UX Usability Testing](./docs/ux-testing/):** Timed field tests with indigenous elders and friction audit reports (Hito 1.2).

---

## 👥 Academic Governance & Team

* **Institution:** Instituto Tecnológico de Tlaxiaco (TecNM - Oaxaca, Mexico).
* **Department:** Ingeniería en Sistemas Computacionales.
* **Faculty Advisor:** Mtro. José Alfredo Román Cruz.
* **Student Research Fellows:** Open Hub TecNM Campus Tlaxiaco.
* **License:** [MIT Open Source](./LICENSE).
