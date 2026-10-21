# Buyer Validation and Potential Interviews Report — Raíz Protocol

## 1. Methodology and Scope
* **Instrument:** Semi-structured interview applied to representative analysis units (6 buyer profiles in Tlaxiaco, Oaxaca de Juárez, Huajuapan, San Juan Ñumí, and Puebla).
* **Objective:** Recognize shopping habits, preferred categories (textiles, palm weave, pottery, honey, coffee, food, and decoration), frictions in current platforms, and priority features for the development of the Raíz mobile application.

---

## 2. Comparative Synthesis of Buyer Profiles
The needs of 6 representative buyer profiles from the Mixteca region and surrounding areas were contrasted:

| Code | Age | Residence | Main Interest | Declared Priority |
| :--- | :---: | :--- | :--- | :--- |
| **Buyer 1** | 29 | Tlaxiaco | Textiles, honey | Catalog and cart |
| **Buyer 2** | 41 | Oaxaca de Juárez | Coffee, food | Delivery and payments |
| **Buyer 3** | 22 | Huajuapan | Accessories, palm weave | Favorites and filters |
| **Buyer 4** | 55 | San Juan Ñumí | Honey, ceramics | Ease of use |
| **Buyer 5** | 35 | Puebla | Textiles, decoration | Authenticity and shipping |
| **Buyer 6** | 47 | Tlaxiaco | Food, honey | Trust and support |

---

## 3. Tabulation of Detected Needs (Frequencies)
Based on the cross-analysis of the responses, the requirements with the highest demand among the profiles were identified:

| Detected Need | Mentions (out of 6 profiles) | Interpretation / Finding |
| :--- | :---: | :--- |
| **Clear catalog and photographs** | 6 / 6 | Basic requirement for navigation and visual content without exaggerated filters. |
| **Visible prices and delivery costs** | 5 / 6 | Prevents order abandonment due to hidden costs or surprises at checkout. |
| **Trust in producer and authenticity** | 5 / 6 | Demand for verifiable profiles and clear cultural provenance (community of origin). |
| **Delivery options** | 4 / 6 | Need to arrange delivery points or shipping based on the area and fragility. |
| **Search by categories or filters** | 4 / 6 | Makes it easier to find specific products quickly without searching across social media. |
| **Simple purchase or order request** | 4 / 6 | Reduce steps and confusion, and allow carts or direct requests. |
| **Customer support and order tracking** | 3 / 6 | Improve the post-purchase experience with confirmations and contact channels. |

---

## 4. Translation into Functional and Non-Functional App Requirements
Based on direct validation with buyers, technical specifications for development in the repository were established:

* **RF-01:** Display catalog by categories: textiles, palm weave, ceramics, honey, coffee, food, accessories, and decoration *(Priority: High)*.
* **RF-02:** View product details including photographs, price, measurements or ingredients, provenance, and stock *(Priority: High)*.
* **RF-03:** Search and filter by category, price, community, and availability *(Priority: High)*.
* **RF-04:** Allow a shopping cart or order request with a summary prior to confirmation *(Priority: High)*.
* **RF-05:** Display delivery options, costs, and approximate date before confirming *(Priority: High)*.
* **RF-06:** Allow viewing order status and history *(Priority: Medium)*.
* **RF-07:** Provide the producer's profile without exposing sensitive data *(Priority: High)*.
* **RF-08:** Allow favorites and verifiable reviews *(Priority: Medium)*.
* **RNF-01:** Mobile-adaptive interface understandable for users with varying digital experience *(Priority: High)*.
* **RNF-02:** Protect data and offer payment methods through secure services *(Priority: High)*.
