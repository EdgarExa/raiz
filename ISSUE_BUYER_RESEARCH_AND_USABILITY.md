# 🛍️ GitHub Issue: Buyer Research Validation & UX Usability Testing (TecNM)

**Issue Title:**
```
[UX-RESEARCH]: Buyer Validation Interviews & Usability Testing - Milestone 1.3
```

**Labels:**
```
user-research, usability-testing, buyer-interviews, ux-evaluation, tecnm-tlaxiaco
```

**Assignees:**
```
Open-Hub-Tec/yucu-team
```

---

## 📌 1. Objective & Task Assignment for TecNM Students
Following the successful completion of Hito 1.1 and Hito 1.2 (where our student engineering brigades validated indigenous artisan ergonomics and cognitive friction across 7 communities in the Mixteca Alta), **this issue directs and documents the buyer-side validation**:

1. **Market & Ethical Willingness-to-Pay:** Validate why specialty coffee consumers, baristas, and traditional textile collectors seek authentic Mixtec origin products, and measure their willingness to pay an ethical premium if authenticity is mathematically proven.
2. **Yucu Zero-Commission Direct Logistics Model:** Validate that buyers understand and welcome that **Yucu Protocol is NOT an e-commerce middleman or freight delivery company**. Yucu charges 0% commission and operates no shipping trucks; instead, it provides the verified digital certificate and connects the buyer directly with the artisan via assisted WhatsApp to arrange local pickup or direct shipping.
3. **Indigenous Data Sovereignty (Zero-PII on Stellar):** Validate buyer perception of the 3 artisan visibility levels (Full Name, First Name + Community, or Cooperative Name) and verify that storing only cryptographic SHA-256 hashes on the Stellar blockchain builds superior trust compared to extractive commercial databases.
4. **UX Usability Testing:** Measure time-on-task, completion rates, and System Usability Scale (SUS) scores across 5 core mobile tasks using the *Think-Aloud Protocol*.

---

## 📋 2. Student Fieldwork Protocol (Instructions for Evaluators)

### Evaluator Team & Equipment:
* **Engineering Brigade:** B.S. Computer Systems Engineering Students (5th Semester, Group B), Instituto Tecnológico de Tlaxiaco (TecNM).
* **Target Audience:** Specialty café owners, professional baristas, cultural textile collectors, and ethical consumers in Tlaxiaco, Oaxaca de Juárez, and Huajuapan.
* **Testing Setup:** Standard mobile smartphone running the Yucu Progressive Web App (`DigitalPassportScreen.tsx` & `BuyerShowcaseScreen.tsx`), paired with a physical QR hang-tag sample.
* **Ethics:** Introduce yourself as a TecNM student researcher; obtain explicit verbal consent before taking notes or recording audio. Never lead the participant or click for them.

---

## 📱 2.1 Early Adopter Contact & Future Launch Notification (Pre-Order Lead)
> 💡 **Instructions for TecNM Students:** The strongest validation signal is whether a buyer is willing to leave their phone number to be notified when the platform and artisan logistics officially launch. Always ask for explicit verbal consent.

- **Buyer Full Name / Contact Person:** <!-- e.g., Rodrigo Vásquez -->
- **WhatsApp / Phone Number:** <!-- e.g., +52 953 123 4567 -->
- **City / Destination for Future Delivery:** <!-- e.g., Tlaxiaco, Oaxaca / CDMX / Querétaro -->
- **Interested Products / Pieces:** <!-- e.g., High-altitude specialty coffee (2kg), Backstrap-loom rebozo -->
- **Target Budget / Willingness to Pay:** <!-- e.g., $1,200 MXN -->
- **Re-Contact Authorization Consent:**
  - [ ] **YES:** Buyer explicitly agreed to save their phone/WhatsApp to be notified as soon as the project is officially launched and artisan production orders open.
  - [ ] **NO:** Buyer preferred anonymous feedback only.

---

## 🎙️ 3. Field Interview Script & Usability Protocol

### Qualitative Discovery Questions:
1. **Motivation & Authenticity:** What motivates you to seek authentic Mixtec textiles (backstrap-loom, palm, clay) or shade-grown Arabica coffee over industrial alternatives? Have you experienced counterfeit or commercial reseller fraud?
2. **Plagiarism Awareness:** How do you react to the 2022 commercial plagiarism scandals where foreign fashion corporations copied Mixtec embroidery without community authorization?
3. **Stellar Zero-PII Trust:** Yucu records an immutable cryptographic fingerprint on the Stellar blockchain proving the piece was certified in its community, but keeps the artisan's personal identity and home coordinates off-chain to respect indigenous self-determination. Does this mathematical guarantee build your trust?
4. **Direct Logistics Model:** Yucu charges zero delivery fees and takes no cuts from artisans; instead, it connects you directly via WhatsApp to coordinate local pick-up or direct postal delivery. How do you evaluate dealing directly with the maker versus paying markups to a commercial platform?
5. **Artisan Consent:** How do you perceive artisans choosing to display only their first name or cooperative name on the public passport?

### The 5 Observed Usability Tasks (Time-on-Task & Success Rate):
* **Task 1 (T1):** Scan physical QR hang-tag and load the Digital Passport on mobile browser.
* **Task 2 (T2):** Identify cultural origin, artisan name/community, and hours invested.
* **Task 3 (T3):** Inspect the Stellar Blockchain authenticity seal card and explain what it proves.
* **Task 4 (T4):** Locate the direct logistics disclaimer and trigger the Direct Contact action.
* **Task 5 (T5):** Browse the community showcase and filter by craft category and municipality.

### Standardized System Usability Scale (SUS) Formula:
Evaluate 10 statements from 1 (*Strongly Disagree*) to 5 (*Strongly Agree*):
* Odd Items (1, 3, 5, 7, 9): `Score = Rating - 1`
* Even Items (2, 4, 6, 8, 10): `Score = 5 - Rating`
* Total SUS Score = `(Sum of 10 Item Scores) * 2.5` *(Scale 0 to 100; Target: >80 Grade A)*

---

## ⭐ 4. Solved Reference Benchmark (Field Test #01)

### Research Team:
* **Student Researchers:** Castro Rodríguez Charlie Jared & Reyez Hernández Dulce Maetzy (TecNM ISC).
* **Date & Location:** 2026-10-09, "Nuu Savi" Specialty Coffee Shop, Historic Center, Tlaxiaco, Oaxaca.
* **Device Used:** Xiaomi Redmi Note 11 (6.43" AMOLED, Android 12, Chrome Mobile).

### Participant Profile:
* **Participant:** Rodrigo V. (32 years old, Head Barista & Co-owner of specialty café).
* **Segment:** Specialty coffee shop operator & cultural collector (sources origin micro-lots bi-weekly).

### Qualitative Findings & Quotes:
* **On Authenticity & Plagiarism:**  
  > *"Commercial resellers constantly blend old robusta or sugar-coated beans and sell them as 'high-altitude specialty.' And in textiles, foreign brands stole Tijaltepec patterns and sold them for thousands of euros while paying local women $150 pesos. We urgently need an open protocol that defends indigenous authors."*
* **On Stellar Blockchain Zero-PII:**  
  > *"It is brilliant that the blockchain does not store the artisan's voter ID or private address. If she wants to pause public visibility, she holds full sovereignty. Storing only the cryptographic fingerprint proves physical authenticity without violating indigenous privacy."*
* **On Direct Logistics (0% Commission):**  
  > *"E-commerce platforms that force shipping warehouses take 30% cuts from indigenous families and hold payments for weeks. Having a direct WhatsApp button to agree on local pickup at the Saturday market or courier delivery directly with the maker is much more humane and respectful."*
* **Willingness to Pay (WTP):**  
  +$80 to $150 MXN per kg of verifiable specialty coffee; +$500 to $1,200 MXN on certified backstrap-loom huipiles.

### Usability Task Results:

| # | Task | Time Recorded | Success? | Observations |
|---|---|:---:|:---:|---|
| **T1** | Scan physical QR hang-tag & load passport | **6 seconds** | Pass | Native Xiaomi camera scanned instantly; passport rendered in <900ms. |
| **T2** | Identify cultural origin & hours invested | **14 seconds** | Pass | Read parcel altitude and 84 hours of labor. Praised artisan portrait badge. |
| **T3** | Inspect Stellar authenticity card | **28 seconds** | Pass | Asked about the hex code (`0x8f3c...`); appreciated explanation of tamper-proof seal. |
| **T4** | Locate logistics disclaimer & contact button | **11 seconds** | Pass | Located "Direct Deal with Producer" button; confirmed pre-filled WhatsApp message. |
| **T5** | Filter community showcase | **18 seconds** | Pass | Filtered by "High-Altitude Coffee" and "Textiles & Loom" without friction. |

### System Usability Scale (SUS) Score:
* Item Ratings: Q1=5, Q2=1, Q3=5, Q4=2, Q5=5, Q6=1, Q7=5, Q8=1, Q9=5, Q10=2
* Odd Items Sum: `4 + 4 + 4 + 4 + 4 = 20`
* Even Items Sum: `4 + 3 + 4 + 4 + 3 = 18`
* **Final SUS Score:** `(20 + 18) * 2.5 = 95.0 / 100` **(Grade A+ Exceptional Usability)**
* **Authenticity Confidence Level:** `10 / 10`

---

## 🚨 5. Critical UX Friction Log & Derived Pull Requests

### Friction Item 1: Cryptographic Hash Clarity for Laymen
* **Component:** `DigitalPassportScreen.tsx` (Stellar Verification Card)
* **Observed Behavior:** Participant hesitated reading the raw hex code `0x8f3c...b791e204a9e52`.
* **Buyer Verbatim Quote:** *"For regular consumers, raw alphanumeric strings can seem intimidating. A friendly label saying 'Tamper-Proof Digital Fingerprint (Stellar Zero-PII)' makes it immediately understandable."*
* **Resolution (PR #35):** Added green shield badge and friendly explanatory tooltip before the raw hash.

### Friction Item 2: Direct Logistics Banner Placement
* **Component:** `BuyerShowcaseScreen.tsx` & `ProductDetailModal.tsx`
* **Observed Behavior:** Participant briefly scanned for shipping fee calculations before tapping WhatsApp.
* **Buyer Verbatim Quote:** *"I love that it's direct via WhatsApp, but having a clear note right above the button saying 'Delivery arranged directly between buyer and artisan' ensures total peace of mind."*
* **Resolution (PR #36):** Placed the direct logistics disclaimer card immediately adjacent to the direct contact call-to-action button.

---

## ✅ 6. Definition of Done & Deliverables
- [x] Fieldwork interview conducted with representative buyer segment.
- [x] Qualitative discovery questions recorded with verbatim quotes.
- [x] 5 mobile usability tasks timed and evaluated with Think-Aloud protocol.
- [x] Standardized SUS score calculated and categorized.
- [x] Critical friction items logged and translated into actionable repository Pull Requests.
- [x] Full documentation committed under `docs/ux-testing/` and `.github/ISSUE_TEMPLATE/`.
