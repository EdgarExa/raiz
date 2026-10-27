---
name: 🛍️ Buyer Research Interview & Usability Evaluation (TecNM)
about: Official template in English for TecNM engineering students to report buyer discovery interviews and usability tests on Yucu Digital Passport
title: "[UX-RESEARCH]: Buyer Interview & Usability Test - [Profile/Location]"
labels: ["user-research", "usability-testing", "buyer-interviews", "ux-evaluation"]
assignees: ''
---

<!-- 
================================================================================
🎓 TECNM STUDENT INSTRUCTIONS (READ CAREFULLY BEFORE SUBMITTING):
1. Purpose: Validate buyer willingness-to-pay, perception of verifiable authenticity 
   vs. commercial plagiarism, understanding of Yucu's direct logistics model (NO middleman fees),
   and usability of the Digital Passport (QR scanning, Stellar zero-PII stamp, and direct contact).
2. Ethical Conduct: Introduce yourself as a Computer Systems Engineering student from 
   Instituto Tecnológico de Tlaxiaco. Request verbal consent before taking notes.
3. Zero-Bias Principle: Never "sell" or explain where to click. Let the buyer explore the screen 
   using the "Think Aloud Protocol". Every hesitation or doubt is a valuable software insight.
4. Language: Submit this report in English for the open-source evaluation committee.
================================================================================
-->

# 🛍️ Buyer Research & UX Usability Evaluation Report
**Project:** Yucu Mixteca Open Hub (`Open-Hub-Tec/yucu`)  
**Institution:** Instituto Tecnológico de Tlaxiaco (TecNM) – Computer Systems Engineering  
**Course / Advisor:** Software Engineering Fundamentals / Professional Residency  
**Milestone / Grant:** Open Source Milestone – Buyer Validation & Usability Testing  

---

## 👥 1. Field Research Team (TecNM Students)
- **Student Researcher(s):** <!-- Full names of student evaluators -->
- **Semester & Group:** <!-- e.g., 5th Semester, Group B - B.S. Computer Systems Engineering -->
- **Date of Test:** <!-- YYYY-MM-DD -->
- **Location / Test Context:** <!-- e.g., Specialty coffee shop in Tlaxiaco / Organic market in Oaxaca / Remote video session -->
- **Participant's Device:** <!-- e.g., Xiaomi Redmi Note 11 (6.4" Android, Chrome browser) / iPhone 13 (Safari) -->

---

## 👤 2. Buyer Profile & Demographics
- **Identifier / Alias:** <!-- e.g., Buyer-01 (barista & cultural collector). No name or exact age. -->
- **Age & Occupation:** 
- **City of Residence:** <!-- e.g., Tlaxiaco, Oaxaca / Mexico City / International tourist -->
- **Buyer Segment:**
  - [ ] Ethical end-consumer / Cultural tourist
  - [ ] Specialty coffee shop owner / Professional barista
  - [ ] Fashion designer / Traditional backstrap-loom textile collector
  - [ ] Fair-trade store owner / Agroecological distributor
  - [ ] Other: <!-- specify -->
- **Purchase Frequency (Crafts & Origin Agro-products):** <!-- e.g., Weekly / Bi-weekly / Monthly / Travel-only -->
- **Current Purchase Channels:** <!-- e.g., Street markets, craft boutiques, Instagram, middlemen resellers -->

---

## 🔒 2.1 Contact details
> **Do not publish them here.** This issue is public. If the buyer agrees to be contacted at launch, store the contact in the team's private folder (`.investigacion_privada/`), never in an issue ([`docs/research/PRIVACIDAD.md`](../../docs/research/PRIVACIDAD.md), rules 2 and 5).

- **Agreed to be contacted?** [ ] Yes (stored in the private folder) · [ ] No

---

## 🎙️ 3. Qualitative Discovery Interview (Value & Trust)

### 3.1 Motivations & Plagiarism Pain Points
* **What motivates you to buy authentic Mixtec handicrafts (backstrap-loom, palm, pottery) or high-altitude specialty coffee instead of industrial alternatives?**
  > *Buyer Response:* 

* **Have you ever doubted whether an artisanal piece or coffee lot is 100% authentic versus an industrial imitation or reseller blend? How do you verify it today?**
  > *Buyer Response:*

* **How does it affect your purchasing decisions knowing that commercial brands have plagiarized Mixtec embroidery designs without community consent?**
  > *Buyer Response:*

### 3.2 Perception of Traceability & Stellar Zero-PII Stamp
* **When you scan a QR code on a physical garment hang-tag or coffee bag, what specific information do you expect to see?**
  > *Buyer Response:*

* **Explanation given to buyer:**  
  *"Yucu records an immutable cryptographic fingerprint on the public Stellar blockchain certifying the piece originated from a verified indigenous community, but it stores ZERO Personally Identifiable Information (no full names, IDs, or home coordinates on-chain) to protect artisan privacy and sovereignty."*  
  *How does this cryptographic verification affect your trust compared to a standard printed label?*
  > *Buyer Response:*

* **Willingness to Pay (Fair Trade Premium):** Would you pay a fair-trade premium (e.g., 20% to 40% more) if you have verifiable proof that 100% of the payment goes directly to the artisan family?
  - [ ] Yes, definitely (Estimated premium: +$____ MXN)
  - [ ] Depends on the product
  - [ ] No, seeking lowest price possible
  > *Buyer Comments:*

### 3.3 Perception of Yucu's Direct Logistics Disclaimer
* **Explanation given to buyer:**  
  *"Yucu is NOT a delivery company or an e-commerce platform like Amazon: it charges ZERO middleman commissions and operates NO logistics trucks. Instead, Yucu provides the verified digital certificate and an assisted direct contact button (WhatsApp/phone) so buyer and artisan agree on local pick-up or shipping directly."*  
  *How do you evaluate dealing directly with the craft maker versus paying markups to a commercial delivery app?*
  > *Buyer Response:*

* **Preferred communication channel to arrange delivery & payment:**
  - [ ] Direct assisted WhatsApp message
  - [ ] Phone call
  - [ ] Agreed physical pick-up point (café, artisan fair, community center)
  - [ ] Other: <!-- specify -->

### 3.4 Sovereign Artisan Consent & Visibility Levels
* **On the public passport, the artisan can choose to display: (1) Full legal name, (2) First name & community only, or (3) Collective cooperative name. They can also pause public visibility at any time while the Stellar cryptographic stamp remains valid.**  
  *How do you view this consent-first policy prioritizing indigenous self-determination over forced personal data exposure?*
  > *Buyer Response:*

---

## 🧪 4. UX Usability Testing Protocol (Observed Tasks)

<!--
INSTRUCTION FOR STUDENT EVALUATOR:
Hand the smartphone with the Yucu Public Passport / Tag to the buyer. Ask them to "Think Aloud".
Do NOT tell them where to click. Record exact time-on-task, hesitations, and errors.
-->

| # | Task Description | Time (sec) | Result | Needed Help? | Observations & Friction Points |
|---|---|:---:|:---:|:---:|---|
| **T1** | **Scan physical QR hang-tag & load Digital Passport** | ___ s | [ ] Pass<br>[ ] Struggle<br>[ ] Fail | [ ] No<br>[ ] Yes | *Did the page load promptly? Was the product clear immediately?* |
| **T2** | **Identify cultural origin, artisan, & ancestral technique** | ___ s | [ ] Pass<br>[ ] Struggle<br>[ ] Fail | [ ] No<br>[ ] Yes | *Did they read community story & work hours? Was typography readable?* |
| **T3** | **Inspect authenticity verification & Stellar Blockchain stamp** | ___ s | [ ] Pass<br>[ ] Struggle<br>[ ] Fail | [ ] No<br>[ ] Yes | *Did they understand the certificate? Any technical jargon confusion?* |
| **T4** | **Locate logistics disclaimer & Direct Contact action** | ___ s | [ ] Pass<br>[ ] Struggle<br>[ ] Fail | [ ] No<br>[ ] Yes | *Did they look for a traditional cart or understand direct negotiation?* |
| **T5** | **Explore community showcase & filter by product type / town** | ___ s | [ ] Pass<br>[ ] Struggle<br>[ ] Fail | [ ] No<br>[ ] Yes | *Were filters (loom, coffee, honey, clay, palm) and towns intuitive?* |

---

## 📊 5. Standardized System Usability Scale (SUS)

*Score each statement from 1 (**Strongly Disagree**) to 5 (**Strongly Agree**):*

1. I think that I would like to use this digital passport frequently when buying crafts/coffee: `[ /5 ]`
2. I found the digital passport unnecessarily complex: `[ /5 ]`
3. I thought the digital passport was easy to use: `[ /5 ]`
4. I think that I would need the support of a technical person to understand the verification: `[ /5 ]`
5. I found the various functions (story, technique, certification, direct contact) well integrated: `[ /5 ]`
6. I thought there was too much inconsistency or confusing information on the screen: `[ /5 ]`
7. I would imagine that most buyers would learn to use this passport very quickly: `[ /5 ]`
8. I found the interface very cumbersome / frustrating to use: `[ /5 ]`
9. I felt very confident that the piece is genuine and authentically community-made: `[ /5 ]`
10. I needed to learn a lot of technical things before I could get going with this passport: `[ /5 ]`

### SUS Score Calculation (Formula for Students):
- **Odd Items (1, 3, 5, 7, 9):** Score = `Response - 1`
- **Even Items (2, 4, 6, 8, 10):** Score = `5 - Response`
- **Total SUS Score:** `(Sum of 10 item scores) * 2.5`
- **Calculated SUS Score:** `_____ / 100` *(SUS > 68 is Acceptable; > 80 is Grade A Excellent)*
- **Authenticity Confidence Level (1 to 10):** `[ /10 ]`

---

## 🚨 6. Critical UX Friction Log

### Friction Item 1: <!-- e.g., Cryptographic hash explanation in Digital Passport -->
- **Screen / Component:** <!-- e.g., DigitalPassportScreen.tsx -->
- **Severity:** [ ] High [ ] Medium [ ] Low
- **Observed User Behavior:** 
- **Buyer Verbatim Quote:** 
- **Suggested Software Fix:** 

### Friction Item 2: <!-- e.g., Notice about direct logistics vs standard shopping cart -->
- **Screen / Component:** <!-- e.g., BuyerShowcaseScreen.tsx / ProductDetailModal.tsx -->
- **Severity:** [ ] High [ ] Medium [ ] Low
- **Observed User Behavior:** 
- **Buyer Verbatim Quote:** 
- **Suggested Software Fix:** 

---

## 💡 7. Voice of the Customer (Key Quotes)
> 💬 *"Buyer quote on cultural authenticity and origin..."*

> 💬 *"Buyer quote on direct contact without middleman commissions..."*

> 💬 *"Buyer quote on usability, QR scanning, or mobile experience..."*

---

## 🛠️ 8. Actionable Backlog & Proposed Pull Requests (TecNM)
Technical engineering tasks identified for upcoming Pull Requests in the repository:

- [ ] **PR-A (Frontend/UX):** <!-- e.g., Add friendly tooltip for Stellar Zero-PII certificate card -->
- [ ] **PR-B (Microcopy/Clarity):** <!-- e.g., Reinforce direct shipping notice next to WhatsApp button -->
- [ ] **PR-C (Accessibility):** <!-- e.g., Increase contrast on community metadata badges -->

---
**TecNM Student Team Sign-off:**  
*Report officially filed for open-source evaluation and Yucu Mixteca engineering review.*
