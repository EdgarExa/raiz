# 🛍️ [BENCHMARK EXAMPLE]: Buyer Interview & Usability Evaluation Report

> **Note for TecNM Engineering Students:** This document serves as an official reference benchmark demonstrating a fully completed GitHub Issue submission for the Buyer Research & Usability Testing milestone.

---

### Issue Title: `[UX-RESEARCH]: Buyer Interview & Usability Test - Specialty Coffee & Cultural Collector in Tlaxiaco`

# 🛍️ Buyer Research & UX Usability Evaluation Report
**Project:** Yucu Mixteca Open Hub (`Open-Hub-Tec/yucu`)  
**Institution:** Instituto Tecnológico de Tlaxiaco (TecNM) – Computer Systems Engineering  
**Course / Advisor:** Software Engineering Fundamentals (SCC-1007) / Eng. José Alfredo Román Cruz  
**Milestone / Grant:** Drips Network Open Source Milestone – Buyer Validation & Usability Testing (PR #34)

---

## 👥 1. Field Research Team (TecNM Students)
- **Student Researcher(s):** Castro Rodríguez Charlie Jared, Reyez Hernández Dulce Maetzy
- **Semester & Group:** 5th Semester, Group B – B.S. Computer Systems Engineering
- **Date of Test:** 2026-10-09
- **Location / Test Context:** "Nuu Savi" Specialty Coffee Shop, Historic Center, Heroica Ciudad de Tlaxiaco, Oaxaca.
- **Participant's Device:** Xiaomi Redmi Note 11 (6.43" AMOLED, Android 12, Google Chrome Browser).

---

## 👤 2. Buyer Profile & Demographics
- **Identifier / Alias:** Buyer-01 (Rodrigo V., 32 years old, Professional Barista & Cultural Textile Collector)
- **Age & Occupation:** 32, Head Barista and Co-owner of cultural specialty café
- **City of Residence:** Tlaxiaco, Oaxaca (frequently serves tourists and wholesale buyers from Mexico City)
- **Buyer Segment:**
  - [x] Specialty coffee shop owner / Professional barista
  - [x] Ethical end-consumer / Cultural tourist
  - [ ] Fashion designer / Traditional backstrap-loom textile collector
  - [ ] Fair-trade store owner / Agroecological distributor
- **Purchase Frequency (Crafts & Origin Agro-products):** Bi-weekly (sources specialty micro-lots of coffee and handcrafted counter merchandise directly from Mixtec producers).
- **Current Purchase Channels:** Direct purchases at Tlaxiaco Saturday open markets (*tianguis*), but struggles with authenticity verification when buying from traveling distributors.

---

## 🎙️ 3. Qualitative Discovery Interview (Value & Trust)

### 3.1 Motivations & Plagiarism Pain Points
* **What motivates you to buy authentic Mixtec handicrafts (backstrap-loom, palm, pottery) or high-altitude specialty coffee instead of industrial alternatives?**
  > *"The depth of cup profile and historical legacy. High-altitude shade-grown Arabica from the Mixteca Alta and Triqui backstrap-loom huipiles carry ancestral heritage that commercial industrial brands can never duplicate."*

* **Have you ever doubted whether an artisanal piece or coffee lot is 100% authentic versus an industrial imitation or reseller blend? How do you verify it today?**
  > *"Frequently. In the coffee trade, resellers often blend old robusta or sugar-coated beans and label them 'high-altitude specialty.' In textiles, shops in downtown Oaxaca sell items labeled 'handmade' that actually come from industrial sewing mills in Puebla or overseas imports. Currently, I only trust sellers if I travel to the farm or know the artisan personally."*

* **How does it affect your purchasing decisions knowing that commercial brands have plagiarized Mixtec embroidery designs without community consent?**
  > *"It is outrageous. In 2022, foreign luxury fashion brands plagiarized embroidery patterns from San Pablo Tijaltepec and San Antonino without giving credit or compensation. Middlemen pay $150 MXN for weeks of intricate handwork and resell it for thousands of euros. We urgently need an open protocol that defends indigenous authors."*

### 3.2 Perception of Traceability & Stellar Zero-PII Stamp
* **When you scan a QR code on a physical garment hang-tag or coffee bag, what specific information do you expect to see?**
  > *"I expect to see the portrait and community of who produced it, the parcel altitude and processing method, the hours invested, and clear proof that 100% of my payment directly supports that family."*

* **Explanation given to buyer on Stellar Zero-PII architecture:**
  > *"It is brilliant that the blockchain does not store the artisan's voter ID, full legal name, or sensitive private data. If an artisan wants to withdraw or pause her public visibility, she holds full sovereignty to do so. The fact that Stellar only records the immutable cryptographic fingerprint proves physical authenticity without violating indigenous privacy."*

* **Willingness to Pay (Fair Trade Premium):**
  - [x] Yes, definitely (Estimated premium: +$80 to $150 MXN per kg of traceable coffee; +$500 to $1,200 MXN on backstrap-loom garments).
  > *"In specialty coffee, a verified lot scoring 84+ SCAA points with provenance easily commands double the price of generic commercial coffee. Verifiable origin justifies the ethical premium."*

### 3.3 Perception of Yucu's Direct Logistics Disclaimer
* **Explanation given on zero-commission direct logistics:**
  > *"This is the most honest model possible. E-commerce platforms that force centralized shipping warehouses charge up to 30% commissions to indigenous producers and hold funds for weeks. Yucu providing an assisted direct WhatsApp link to agree on local pickup at the Saturday market or courier delivery directly with the maker is much more humane and respectful."*

* **Preferred communication channel:**
  - [x] Direct assisted WhatsApp message
  - [x] Physical pick-up point agreed locally in Tlaxiaco or Oaxaca City

### 3.4 Sovereign Artisan Consent & Visibility Levels
* **Buyer perception on the 3 visibility levels:**
  > *"It builds significantly greater trust. When an app forces farmers to expose their full legal names and locations, it feels like surveillance. Seeing an artisan choose 'Doña Rosalía • San Juan Mixtepec' or her cooperative name proves this software was built by local TecNM engineers who actually understand indigenous community sovereignty."*

---

## 🧪 4. UX Usability Testing Protocol (Observed Tasks)

| # | Task Description | Time (sec) | Result | Needed Help? | Observations & Friction Points |
|---|---|:---:|:---:|:---:|---|
| **T1** | **Scan physical QR hang-tag & load Digital Passport** | **6 s** | Pass | No | Scanned instantly with native Xiaomi camera. The passport screen rendered in less than 900ms. |
| **T2** | **Identify cultural origin, artisan, & ancestral technique** | **14 s** | Pass | No | Read the community background and work hours. Praised the artisan photo badge and fair-trade indicator. |
| **T3** | **Inspect authenticity verification & Stellar Blockchain stamp** | **28 s** | Pass | No | Opened the certification card. Asked what the hexadecimal string `0x8f3c...` meant; was satisfied when explained as an immutable mathematical seal. |
| **T4** | **Locate logistics disclaimer & Direct Contact action** | **11 s** | Pass | No | Located the "Direct Deal with Producer" button. Confirmed it opened a pre-filled WhatsApp message. |
| **T5** | **Explore community showcase & filter by product type / town** | **18 s** | Pass | No | Filtered by "High-Altitude Coffee" and "Textiles & Loom". Smooth and responsive interaction. |

---

## 📊 5. Standardized System Usability Scale (SUS)

*Responses given by Rodrigo V. (Scale 1 to 5):*
1. Frequent use intention: `5`
2. Unnecessary complexity: `1`
3. Ease of use: `5`
4. Need for technical support: `2`
5. Well-integrated functions: `5`
6. Inconsistencies on screen: `1`
7. Fast learning curve: `5`
8. Cumbersome / frustrating: `1`
9. Confidence in authenticity: `5`
10. Need to learn complex concepts: `2`

### SUS Score Calculation:
- **Odd Items (1, 3, 5, 7, 9):** `(5-1) + (5-1) + (5-1) + (5-1) + (5-1) = 4 + 4 + 4 + 4 + 4 = 20`
- **Even Items (2, 4, 6, 8, 10):** `(5-1) + (5-2) + (5-1) + (5-1) + (5-2) = 4 + 3 + 4 + 4 + 3 = 18`
- **Sum of Item Scores:** `20 + 18 = 38`
- **Final SUS Score:** `38 * 2.5 = 95.0 / 100` **(Grade A+ Exceptional Usability)**
- **Authenticity Confidence Level (1 to 10):** `10 / 10`

---

## 🚨 6. Critical UX Friction Log

### Friction Item 1: Cryptographic Hash Clarity for Non-Technical Buyers
- **Screen / Component:** `DigitalPassportScreen.tsx` (Stellar Verification Card)
- **Severity:** Medium
- **Observed User Behavior:** The participant spent 12 seconds reading the raw hex code (`0x8f3c...b791e204a9e52`).
- **Buyer Verbatim Quote:** *"For a regular customer who is not a software engineer, raw alphanumeric strings can seem intimidating. A friendly label saying 'Tamper-Proof Digital Fingerprint (Stellar Zero-PII)' makes it immediately understandable."*
- **Suggested Software Fix:** Include a friendly shield badge with tooltip microcopy explaining the cryptographic seal before the raw hash.

### Friction Item 2: Direct Logistics Banner Placement
- **Screen / Component:** `ProductDetailModal.tsx` & `BuyerShowcaseScreen.tsx`
- **Severity:** Low
- **Observed User Behavior:** Looked around briefly to verify if shipping fees were included before tapping WhatsApp.
- **Buyer Verbatim Quote:** *"I love that it's direct via WhatsApp, but having a clear note right above the button saying 'Delivery arranged directly between buyer and artisan' ensures total peace of mind."*
- **Suggested Software Fix:** Place the direct logistics notice immediately adjacent to the direct contact call-to-action.

---

## 💡 7. Voice of the Customer (Key Quotes)
> 💬 *"If I walk into a café or market in Oaxaca and see this QR hang-tag on a bag of beans or a backstrap huipil, I know my money is rewarding genuine stewardship rather than corporate middlemen."*

> 💬 *"Certifying origin on blockchain while giving the artisan full power to hide or show her identity is the most mature, respectful approach to indigenous cultural heritage I have seen in tech."*

---

## 🛠️ 8. Actionable Backlog & Proposed Pull Requests (TecNM)
- [x] **PR #35:** Add descriptive *"Verified Digital Seal (Zero-PII)"* tooltip in `DigitalPassportScreen.tsx`.
- [x] **PR #36:** Reinforce direct logistics microcopy in `BuyerShowcaseScreen.tsx` and `ProductDetailModal.tsx`.
