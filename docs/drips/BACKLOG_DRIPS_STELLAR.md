# 💧 Yucu Protocol: Modular Drips & Stellar Grant Issues Backlog
### *Technical Issue Specifications for Student-Researchers & Open-Source Contributors*

* **Repository:** `Open-Hub-Tec/yucu`  
* **Institution:** Instituto Tecnológico de Tlaxiaco (TecNM - Oaxaca, Mexico)  
* **Associated Decisions:** [ADR-001 (Trustless Work)](../adr/ADR-001-TRUSTLESS-WORK-ESCROW.md) • [ADR-002 (Offline-First PWA)](../adr/ADR-002-OFFLINE-FIRST-PWA-AND-RURAL-IDENTITY.md)  
* **Roadmap Overview:** [DRIPS_ISSUES_ROADMAP.md](./DRIPS_ISSUES_ROADMAP.md)

---

## 📌 ISSUE #101: [Core/Crypto]: Canonical Community Digest SHA-256 Hashing Engine
- **GitHub Issue Tracker:** [#3](https://github.com/Open-Hub-Tec/yucu/issues/3)
- **Target Module:** `src/core/crypto/CryptoEngine.ts`
- **Labels:** `good-first-issue`, `crypto`, `unit-tests`, `phase-1`
- **Estimated Bounty:** 150 USDC / Drips Tier 1 (1–2 days)

### 🎯 Problem Statement
To create an immutable provenance passport for an indigenous agricultural or artisanal lot (coffee, honey, textiles, palm), we must compute a deterministic cryptographic digest combining:
1. Producer identification and obfuscated parcel geocoordinates.
2. The authentic oral audio testimonial in a native variant (*Tu'un Savi*, Triqui, or Spanish).
3. The photograph of the harvested batch or textile sample.
4. Unix timestamp, botanical variety, and altitude.

### 🛠️ Technical Tasks
- [x] Refactor `CryptoEngine.computeSha256()` to accept `string`, `Uint8Array`, and `ArrayBuffer`.
- [x] Implement `canonicalizeLotPayload(input: LotDigestInput): string` ensuring dictionary keys are sorted alphabetically before serialization to prevent cross-platform hash discrepancies.
- [x] Support hybrid execution: Native `window.crypto.subtle` in browsers with automatic fallback to Node's `node:crypto` when run server-side or in CI unit tests.
- [x] Maintain test suite in `src/tests/` with deterministic test vectors.

---

## 📌 ISSUE #102: [Core/Policy]: FairTrade Rule Engine & Anti-Coyote Price Guardrails
- **GitHub Issue Tracker:** [#4](https://github.com/Open-Hub-Tec/yucu/issues/4)
- **Target Module:** `src/core/policy/FairTradeEngine.ts`
- **Labels:** `core-logic`, `math`, `governance`, `phase-1`
- **Estimated Bounty:** 200 USDC / Drips Tier 1 (2–3 days)

### 🎯 Problem Statement
Predatory intermediaries ("coyotes") exploit remote communities by purchasing harvests below rural maintenance costs. The platform must programmatically enforce regional cost floors, flag predatory offers, and calculate automated perpetual secondary royalties (8% to farming families, 2% to community tequio infrastructure).

### 🛠️ Technical Tasks
- [x] Implement `FairTradeEngine.validateLotPricing(params: PriceCheckParams): EvaluationResult`.
- [x] Model regional baseline cost matrices:
  - High-altitude Washed Arabica coffee (>1,600m): Minimum $90 MXN/kg parchment.
  - Wild Campanilla honey: Minimum $120 MXN/liter.
  - Backstrap loom textiles: Minimum $250 MXN per base piece.
  - Handwoven palm crafts: Minimum $120 MXN per hat (vs. $20 coyote price).
- [x] Implement `calculateSplitDistributions(totalSaleAmountMxn: number, options: SplitOptions)` returning exact integer stroops/cents to eliminate floating-point rounding errors.

---

## 📌 ISSUE #201: [Offline/Sync]: ACID Outbox Transactional Queue in IndexedDB
- **GitHub Issue Tracker:** [#5](https://github.com/Open-Hub-Tec/yucu/issues/5)
- **Target Module:** `src/utils/offlineStorage.ts` & `src/core/sync/SyncEngine.ts`
- **Labels:** `offline-first`, `indexeddb`, `pwa`, `phase-2`
- **Estimated Bounty:** 350 USDC / Drips Tier 2 (3–5 days)

### 🎯 Problem Statement
In the Mixteca Highlands (Santa María Yucuhiti, San Juan Mixtepec), coffee farms and artisan workshops operate in zero-connectivity terrain. The app must persist all voice audio recordings and harvest declarations locally in IndexedDB without data loss.

### 🛠️ Technical Tasks
- [x] Implement transactional ACID operations in `offlineStorage.ts` using IndexedDB.
- [x] Design FIFO outbox pattern with automatic status flags: `PENDING_SYNC`, `SYNCING`, `ANCHORED_ON_CHAIN`.
- [x] Implement `SyncEngine.ts` with network event listeners (`online` / `offline`) and exponential backoff retry.
- [x] Guarantee 0% data loss across session restarts.

---

## 📌 ISSUE #301: [Blockchain/Escrow]: Trustless Work Soroban Escrow Integration
- **GitHub Issue Tracker:** [#26](https://github.com/Open-Hub-Tec/yucu/issues/26)
- **Target Module:** `src/core/blockchain/TrustlessWorkEscrowAdapter.ts`
- **Labels:** `soroban`, `smart-contracts`, `trustless-work`, `escrow`, `phase-4`
- **Estimated Bounty:** 500 USDC / Drips Tier 4 (5–7 days)

### 🎯 Problem Statement
Following mentor architecture guidelines (Alberto Chaves & Brandon / [ADR-001](../adr/ADR-001-TRUSTLESS-WORK-ESCROW.md)), rather than deploying custom fund custody contracts, Yucu integrates **Trustless Work**'s audited Soroban smart contracts for milestone-based disbursement.

### 🛠️ Technical Tasks
- [x] Implement `TrustlessWorkEscrowAdapter.ts` with full milestone lifecycle methods:
  - `initializeEscrow(buyer, producer, approver, amount, milestones)`
  - `depositFunds(escrowId, amount)`
  - `submitMilestoneProof(escrowId, milestoneId, attestationUid)`
  - `releaseMilestonePayment(escrowId, milestoneId)`
- [x] Implement 2-stage milestone schedule for Tlaxiaco lots:
  - **Milestone 1:** 30% advance on origin attestation (`0x01_ORIGIN`).
  - **Milestone 2:** 70% final payment on physical delivery at Tlaxiaco municipal warehouse (`0x04_DELIVERY`).
- [x] Designate Tlaxiaco Municipal Cooperative as the pre-configured dispute arbitrator.
- [x] 100% automated test coverage in `src/tests/trustless_work_escrow.test.ts`.

---

## 📌 ISSUE #501: [Field Validation]: 50-Producer Validated MVP Pilot in Tlaxiaco
- **GitHub Issue Tracker:** [#29](https://github.com/Open-Hub-Tec/yucu/issues/29)
- **Target Territory:** Tlaxiaco, Yucuhiti, Amoltepec, Mixtepec, Ñumí
- **Labels:** `field-test`, `community-validation`, `production-release`, `phase-5`
- **Estimated Bounty:** 600 USDC / Drips Tier 4 (7–10 days)

### 🎯 Problem Statement
Field validation of the full protocol with **at least 50 active indigenous producers** across coffee, honey, textiles, and palm crafts during the 2026 harvest cycle.

### 🛠️ Technical Tasks
- [ ] Onboard 50 active smallholders and artisans across the 5 validated communities.
- [ ] Record and anchor at least 50 verifiable lots with canonical SHA-256 digests on Soroban.
- [ ] Attach ISO/IEC 18004 Hang-Tag QR labels to physical coffee bags and artisanal wares.
- [ ] Execute test milestone releases via Trustless Work escrow to Banco del Bienestar debit cards.
- [ ] Publish the final Field Validation Report in `docs/research/`.
