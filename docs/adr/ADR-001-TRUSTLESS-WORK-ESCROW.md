# Architecture Decision Record (ADR-001)
## Adoption of Trustless Work as Standard Escrow Infrastructure on Soroban

* **Status:** Accepted / Implemented
* **Date:** September 2026
* **Deciders:** Yucu Protocol Architecture Team, TecNM Campus Tlaxiaco
* **Context:** Architectural review with Alberto Chaves (Tech Rebel / Trustless Work) and Brandon (Stellar Ecosystem)

---

### 1. Context & Problem Statement
In Yucu's commercial model for smallholder coffee farmers and artisans in Tlaxiaco (Oaxaca), institutional buyers (specialty coffee roasters, ethical fashion boutiques, import cooperatives) require guaranteed escrow before crop harvesting or batch dispatch. Funds must only disburse when verified real-world milestones are fulfilled:
1. Proof of origin and quality grading (cryptographic attestation).
2. Physical delivery of the batch verified by the community warehouse/cooperative.

Developing, auditing, and maintaining a proprietary custom escrow contract from scratch introduces substantial security risks, duplicates existing ecosystem infrastructure on Stellar, and diverts core engineering focus away from the primary value of the MVP: **harvest traceability, commercial visibility, and verifiable provenance**.

---

### 2. Decision
**Adopt Trustless Work's audited smart contract infrastructure on Soroban (`@trustlesswork/sdk`) as the official conditioned escrow engine for Yucu Protocol.**

Trustless Work provides:
* Battle-tested, audited escrow smart contracts deployed on the Stellar / Soroban network.
* A robust tripartite role architecture:
  * **Client (Buyer):** Deposits funds (USDC, EURC, or Stellar assets).
  * **Service Provider / Producer (Farmer/Artisan):** Fulfills production and physical delivery.
  * **Approver / Arbitrator (Tlaxiaco Cooperative):** Validates milestones and acts as local arbiter in the event of quality or delivery disputes.
* Milestone-based milestone structure: Funds unlock incrementally against tamper-proof digital attestations (`LotPassport` + `AttestationRegistry`).

---

### 3. Integration Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   RAÍZ PROTOCOL                                        │
│  - On-parcel harvest registration (Tlaxiaco, Oaxaca)                                   │
│  - Provenance & Quality Attestation (Canonical SHA-256 Community Digest)               │
│  - Public Digital Lot Passport (Hang-Tag QR Code)                                      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                             Event: Valid Milestone Attestation
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        TRUSTLESS WORK ESCROW (SOROBAN)                                 │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 1. initialize_escrow(buyer, producer, approver, amount, milestones)             │  │
│  │ 2. deposit_funds(asset: USDC/MXNe)                                               │  │
│  │ 3. submit_milestone_proof(milestone_id, yucu_attestation_uid)                    │  │
│  │ 4. release_milestone_payment(milestone_id) -> Transfer to Producer               │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        LAST-MILE FIAT SETTLEMENT RAILS                                 │
│  - Etherfuse SPEI (Banco del Bienestar / Oaxaca Credit Unions)                         │
│  - Local cooperative cash distribution network                                         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 4. Milestone Schedule for Tlaxiaco Lots

| Milestone | Condition | Release % | Verification Source |
| :--- | :--- | :--- | :--- |
| **Milestone 1: Origin Attestation** | Lot registered with valid harvest parameters, coordinates, and canonical SHA-256 digest on Stellar. | **30% Advance** | `AttestationRegistry.rs` (`0x01_ORIGIN`) |
| **Milestone 2: Physical Reception** | Physical coffee sacks delivered to the Tlaxiaco Municipal Warehouse with verified weight and moisture. | **70% Final** | Local cooperative signature (`0x04_DELIVERY`) |

---

### 5. Consequences & Trade-offs
* **Positive:** Drastically reduced audit overhead, instant interoperability with Stellar ecosystem tools, and battle-tested escrow logic.
* **Positive:** Built-in dispute mediation through the local cooperative without custom court contracts.
* **Neutral:** Protocol relies on Trustless Work contract interfaces; changes in their Soroban contract APIs are isolated inside `TrustlessWorkEscrowAdapter.ts`.
