# Architecture Decision Record (ADR-002)
## Offline-First W3C Progressive Web App (PWA) & Zero-Seed Rural Identity Standards

* **Status:** Accepted / Implemented
* **Date:** September 2026
* **Deciders:** Yucu Protocol Architecture Team, TecNM Campus Tlaxiaco
* **Context:** Critical architectural review with Alberto Chaves and Brandon regarding open web standards vs. proprietary messaging platform lock-in.

---

### 1. Context & Problem Statement
Early conceptual discussions explored using commercial messaging chatbots as an interface for farmers and artisans in Tlaxiaco.

However, rigorous field audits and architectural analysis identified **critical structural flaws** with closed messaging ecosystems:
1. **Zero Offline Capability:** Proprietary messaging apps cannot function in high-altitude mountain plots across the Mixteca Highlands (Santa María Yucuhiti, San Cristóbal Amoltepec) where cellular signal and mobile data do not exist.
2. **Commercial API Fees & Restrictions:** Closed platforms incur per-conversation fees. Furthermore, corporate business verification processes systematically exclude unincorporated indigenous producer associations.
3. **Operational Suspension Risk (Vendor Lock-in):** Commercial automated algorithms can suspend or ban community numbers without recourse, abruptly halting harvest operations.
4. **Lack of Local Cryptographic Capabilities:** Closed messaging clients cannot locally generate, store, or sign Stellar cryptographic hashes (`ed25519` / SHA-256) at the device edge.

---

### 2. Channel Evaluation Matrix

| Criterion | 1. Commercial Bot | 2. Offline-First PWA | 3. Physical Community QR Card | 4. Open Notification Bot |
| :--- | :---: | :---: | :---: | :---: |
| **Operates 100% Offline** | ❌ Impossible | ✅ **Yes (IndexedDB + Service Worker)** | ✅ **Yes (Physical Card)** | ❌ Requires connection |
| **Per-Message / Usage Cost** | ❌ Commercial per-conversation fee | ✅ **$0.00 (Open W3C Web Standards)** | ✅ One-time print cost (~$0.25 USD) | ✅ **$0.00 (Open API)** |
| **Sovereignty & Open Source** | ❌ Proprietary closed ecosystem | ✅ **100% Open Source** | ✅ Community sovereignty | ⚠️ External platform |
| **Elder Accessibility** | ⚠️ Complex keyboard typing | ✅ **112px ergonomic tactile & voice** | ✅ **Maximum (Zero personal tech)** | ⚠️ App installation required |
| **Local Cryptographic Signing** | ❌ No | ✅ **Yes (Web Crypto API + Ed25519)** | ✅ Yes (Delegated coop key) | ⚠️ Limited |

---

### 3. Architecture Decision for the MVP

1. **Primary MVP Channel:** **Progressive Web App (PWA) Offline-First**.
   * Runs in any modern mobile browser on low-cost Android smartphones.
   * Stores records locally in IndexedDB when the farmer is offline on parcel.
   * Records and compresses voice audio (*Tu'un Savi* Mixteco and Spanish) using the standard `MediaRecorder` API at 24kbps Opus.
   * Automatically synchronizes in the background when reconnecting to community WiFi or mobile data in town.
2. **Zero-Tech Inclusive Mechanism:** **Physical Community QR Card**.
   * Tailored for elderly farmers and weavers who do not own smartphones.
   * Community cooperative promoters scan the physical card to authenticate lots without requiring passwords or 24-word seed phrases.
3. **Secondary Notification Channel (Optional):** **Open Telegram WebApp / Bot**.
   * For institutional buyers and roasters wishing to receive real-time alerts of newly certified lots without licensing fees.

---

### 4. Consequences & Benefits
* **Technological Sovereignty:** Completely independent of Meta and commercial messaging APIs.
* **Zero Recurring Communication Costs:** No per-message fees for indigenous cooperatives.
* **Proven Field Resilience:** Operates at 2,000 meters altitude where coffee is harvested, solving the genuine reality of Tlaxiaco.
