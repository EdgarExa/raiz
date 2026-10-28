import React, { useState, useEffect } from 'react';
import { BuyerLeadRecord } from '../types';

interface BuyerResearchIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'template' | 'campo' | 'leads' | 'guide' | 'example';
}

export const BuyerResearchIssueModal: React.FC<BuyerResearchIssueModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'template'
}) => {
  const [activeTab, setActiveTab] = useState<'template' | 'campo' | 'leads' | 'guide' | 'example'>(defaultTab);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [copied, setCopied] = useState<boolean>(false);

  // Estados del Formulario de Campo para Estudiantes (Captura de Entrevista y Teléfono)
  const [studentName, setStudentName] = useState('Castro Jared & Dulce Maetzy');
  const [studentGroup, setStudentGroup] = useState('5º Semestre Grupo B - Ing. en Sistemas Computacionales');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerCity, setBuyerCity] = useState('Tlaxiaco, Oaxaca');
  const [buyerSegment, setBuyerSegment] = useState('Barista / Cafetería de especialidad');
  const [interestedProducts, setInterestedProducts] = useState('Café de especialidad (2kg), Huipil Triqui de telar');
  const [willingnessToPayExtra, setWillingnessToPayExtra] = useState('120');
  const [consentForFutureContact, setConsentForFutureContact] = useState(true);
  const [susScore, setSusScore] = useState(85);
  const [painsObserved, setPainsObserved] = useState<string[]>([
    'Duda de autenticidad frente a copias industriales',
    'Rechazo a comisiones abusivas de intermediarios'
  ]);
  const [buyerQuote, setBuyerQuote] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Directorio de contactos guardados en localStorage
  const [leads, setLeads] = useState<BuyerLeadRecord[]>(() => {
    try {
      const stored = localStorage.getItem('raiz_buyer_leads');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'lead-1',
        timestamp: '2026-10-08 16:30',
        studentName: 'Castro Jared & Dulce Maetzy',
        studentGroup: '5º Semestre Grupo B',
        buyerName: 'Rodrigo Vásquez',
        buyerPhone: '+52 953 145 8921',
        buyerCity: 'Tlaxiaco, Oaxaca',
        buyerSegment: 'Barista / Cafetería Nuu Savi',
        interestedProducts: 'Café de especialidad en grano (5kg)',
        willingnessToPayExtraMxn: 150,
        susScore: 95,
        consentForFutureContact: true,
        notes: 'Desea entrega directa en su cafetería cuando inicie la cosecha oficial certificada.',
        createdVia: 'field_interview'
      },
      {
        id: 'lead-2',
        timestamp: '2026-10-09 11:15',
        studentName: 'Cruz Bautista Alexis',
        studentGroup: '7º Semestre Residencia',
        buyerName: 'Lucía Mendoza',
        buyerPhone: '+52 951 289 4410',
        buyerCity: 'Oaxaca de Juárez, Oax.',
        buyerSegment: 'Diseñadora textil / Coleccionista',
        interestedProducts: 'Rebozo de telar de cintura con tinte natural',
        willingnessToPayExtraMxn: 300,
        susScore: 90,
        consentForFutureContact: true,
        notes: 'Pide aviso urgente por WhatsApp cuando el taller de San Pablo Tijaltepec tenga lote nuevo.',
        createdVia: 'field_interview'
      }
    ];
  });

  // Sincronizar en localStorage cuando leads cambian
  useEffect(() => {
    try {
      localStorage.setItem('raiz_buyer_leads', JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }, [leads]);

  if (!isOpen) return null;

  // ENGLISH OFFICIAL TEMPLATE (For Open Source Milestone)
  const rawEnglishTemplate = `---
name: 🛍️ Buyer Research Interview & Usability Evaluation (TecNM)
about: Official template in English for TecNM engineering students to report buyer discovery interviews and usability tests on Yucu Digital Passport
title: "[UX-RESEARCH]: Buyer Interview & Usability Test - [Profile/Location]"
labels: ["user-research", "usability-testing", "buyer-interviews", "ux-evaluation"]
assignees: ''
---

<!-- 
================================================================================
🎓 TECNM STUDENT INSTRUCTIONS (WHAT THE STUDENT MUST DO):
1. Objective: Validate buyer willingness-to-pay, verifiable authenticity vs. commercial 
   plagiarism, understanding of Yucu's direct logistics model (zero middleman fees),
   and usability of the Digital Passport (QR scanning, Stellar zero-PII stamp, direct contact).
2. Ethical Conduct: Introduce yourself as a Computer Systems Engineering student from 
   Instituto Tecnológico de Tlaxiaco (TecNM). Request verbal consent before taking notes.
3. Zero-Bias Principle: Never "sell" or explain where to click. Let the buyer explore the screen 
   using the "Think Aloud Protocol". Every hesitation or doubt is a valuable software insight.
4. Future Contact Consent: Ask if the buyer authorizes saving their WhatsApp/Phone number to be 
   contacted when the project is fully launched and production orders open.
5. Language Requirement: Complete and submit this report in English for the international
   open-source software evaluation committee.
================================================================================
-->

# 🛍️ Buyer Research & UX Usability Evaluation Report
**Project:** Yucu Mixteca Open Hub (\`Open-Hub-Tec/yucu\`)  
**Institution:** Instituto Tecnológico de Tlaxiaco (TecNM) – Computer Systems Engineering  
**Course / Advisor:** Software Engineering Fundamentals / Professional Residency  
**Milestone / Grant:** Open Source Milestone – Buyer Validation & Usability Testing  

---

## 👥 1. Field Research Team (TecNM Students)
- **Student Researcher(s):** <!-- Full names of student evaluators -->
- **Semester & Group:** <!-- e.g., 5th Semester, Group B – B.S. Computer Systems Engineering -->
- **Date of Test:** <!-- YYYY-MM-DD -->
- **Location / Test Context:** <!-- e.g., Specialty coffee shop in Tlaxiaco / Organic market in Oaxaca / Remote video session -->
- **Participant's Device:** <!-- e.g., Xiaomi Redmi Note 11 (6.4" Android, Chrome browser) / iPhone 13 (Safari) -->

---

## 👤 2. Buyer Profile & Demographics
- **Identifier / Alias:** <!-- e.g., Buyer-01 (Rodrigo V., 32, Barista & cultural collector) -->
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

1. I think that I would like to use this digital passport frequently when buying crafts/coffee: \`[ /5 ]\`
2. I found the digital passport unnecessarily complex: \`[ /5 ]\`
3. I thought the digital passport was easy to use: \`[ /5 ]\`
4. I think that I would need the support of a technical person to understand the verification: \`[ /5 ]\`
5. I found the various functions (story, technique, certification, direct contact) well integrated: \`[ /5 ]\`
6. I thought there was too much inconsistency or confusing information on the screen: \`[ /5 ]\`
7. I would imagine that most buyers would learn to use this passport very quickly: \`[ /5 ]\`
8. I found the interface very cumbersome / frustrating to use: \`[ /5 ]\`
9. I felt very confident that the piece is genuine and authentically community-made: \`[ /5 ]\`
10. I needed to learn a lot of technical things before I could get going with this passport: \`[ /5 ]\`

### SUS Score Calculation (Formula for Students):
- **Odd Items (1, 3, 5, 7, 9):** Score = \`Response - 1\`
- **Even Items (2, 4, 6, 8, 10):** Score = \`5 - Response\`
- **Total SUS Score:** \`(Sum of 10 item scores) * 2.5\`
- **Calculated SUS Score:** \`_____ / 100\` *(SUS > 68 is Acceptable; > 80 is Grade A Excellent)*
- **Authenticity Confidence Level (1 to 10):** \`[ /10 ]\`

---

## 🚨 6. Critical UX Friction Log

### Friction Item 1: <!-- e.g., Cryptographic hash explanation in Digital Passport -->
- **Screen / Component:** <!-- e.g., DigitalPassportScreen.tsx -->
- **Severity:** [ ] High [ ] Medium [ ] Low
- **Observed User Behavior:** 
- **Buyer Verbatim Quote:** 
- **Suggested Software Fix:** 

---

## 💡 7. Voice of the Customer (Key Quotes)
> 💬 *"Buyer quote on cultural authenticity and origin..."*

> 💬 *"Buyer quote on direct contact without middleman commissions..."*

---

## 🛠️ 8. Actionable Backlog & Proposed Pull Requests (TecNM)
Technical engineering tasks identified for upcoming Pull Requests in the repository:
- [ ] **PR-A (Frontend/UX):** <!-- e.g., Add friendly tooltip for Stellar Zero-PII certificate card -->
- [ ] **PR-B (Microcopy/Clarity):** <!-- e.g., Reinforce direct shipping notice next to WhatsApp button -->

---
**TecNM Student Team Sign-off:**  
*Report officially filed for open-source evaluation and Yucu Mixteca engineering review.*
`;

  // SPANISH OFFICIAL TEMPLATE
  const rawSpanishTemplate = `---
name: 🛍️ Entrevista a Compradores y Evaluación de Usabilidad UX
about: Plantilla oficial para que los estudiantes del TecNM registren entrevistas de validación con compradores y pruebas de usabilidad del Pasaporte Digital Yucu
title: "[UX-RESEARCH]: Entrevista a Comprador y Prueba de Usabilidad - [Perfil/Ubicación]"
labels: ["user-research", "usability-testing", "buyer-interviews", "ux-evaluation"]
assignees: ''
---

# 🛍️ Reporte de Entrevista a Comprador y Prueba de Usabilidad UX
**Proyecto:** Yucu Mixteca Open Hub (\`Open-Hub-Tec/yucu\`)  
**Institución:** Instituto Tecnológico de Tlaxiaco (TecNM) – Depto. de Sistemas y Computación  
**Materia / Asesor:** Fundamentos de Ingeniería de Software / Residencia Profesional  
**Hito:** Milestone UX Compradores & Trazabilidad Soberana  

---

## 👥 1. Datos del Equipo Evaluador (Estudiantes TecNM)
- **Investigador(es):** <!-- Nombres completos de los estudiantes -->
- **Semestre y Grupo:** <!-- Ej. 5º Semestre Grupo B - Ing. en Sistemas Computacionales -->
- **Fecha de Aplicación:** <!-- AAAA-MM-DD -->
- **Lugar / Contexto de la Prueba:** <!-- Ej. Cafetería Nuu Savi Tlaxiaco / Mercado Pochote Oaxaca -->
- **Dispositivo Usado por el Comprador:** <!-- Ej. Xiaomi Redmi Note 11 (Chrome) / iPhone 13 (Safari) -->

---

## 👤 2. Perfil del Comprador Entrevistado
- **Identificador / Alias:** <!-- Ej. Comprador-01 (Rodrigo V., 32 años, Barista) -->
- **Edad y Ocupación:** 
- **Lugar de Residencia:** <!-- Ej. Tlaxiaco, Oaxaca / CDMX / Extranjero -->
- **Segmento de Comprador:**
  - [ ] Consumidor final ético / Turista nacional o internacional
  - [ ] Propietario / Barista de cafetería de especialidad
  - [ ] Diseñador(a) de moda / Coleccionista de textiles de telar
  - [ ] Tienda de comercio justo / Distribuidor agroecológico
  - [ ] Otro: <!-- Especificar -->
- **Frecuencia de compra de productos artesanales / agroecológicos:** 
- **Canales donde suele comprar actualmente:** 

---

## 📱 2.1 Datos de Contacto y Autorización de Notificación a Futuro (Lead de Preventa)
> 💡 **Instrucción para Estudiantes del TecNM:** La mayor señal de validación de dolor y necesidad es si el comprador acepta dar su teléfono para ser contactado cuando la plataforma y las entregas con las artesanas estén formalmente activas.

- **Nombre o Contacto del Comprador:** <!-- Ej. Rodrigo Vásquez -->
- **Número Celular / WhatsApp:** <!-- Ej. +52 953 123 4567 -->
- **Ciudad y Destino de Envío Futuro:** <!-- Ej. Tlaxiaco, Oax. / Roma Norte, CDMX -->
- **Productos / Artesanías de Interés:** <!-- Ej. Café de especialidad Nuu Savi (2kg), Huipil Triqui de telar -->
- **Presupuesto Estimado / Disposición a Pagar:** <!-- Ej. $1,200 MXN -->
- **Consentimiento de Contacto al Lanzamiento:**
  - [ ] **SÍ AUTORIZADO:** El comprador aceptó expresamente guardar su número de WhatsApp/teléfono para ser avisado en cuanto el proyecto esté listo y se abran pedidos formales.
  - [ ] **NO AUTORIZADO:** El comprador prefirió retroalimentación anónima.

---

## 🎙️ 3. Guion de Entrevista Cualitativa (Descubrimiento y Valor)
### 3.1 Motivación y Problema de Autenticidad
* **¿Qué te motiva a buscar artesanías o café de especialidad de origen mixteco?**
  > *Respuesta:* 
* **¿Alguna vez has dudado si una pieza es 100% auténtica o reventa/copia industrial?**
  > *Respuesta:* 
* **¿Cómo te impacta saber que marcas comerciales plagian bordados sin permiso comunitario?**
  > *Respuesta:* 

### 3.2 Trazabilidad y Sello Stellar Zero-PII
* **¿Qué esperas ver al escanear el QR físico en una etiqueta?**
  > *Respuesta:* 
* **Sobreprecio Ético:** ¿Pagarías un sobreprecio justo (+20% a +40%) si sabes que el 100% llega a la artesana?
  - [ ] Sí, con certeza (Estimado: +$____ MXN)
  - [ ] Depende del producto
  - [ ] No, busco el menor precio posible

### 3.3 Deslinde Logístico Directo de Yucu
* **Yucu conecta directamente con la artesana por WhatsApp sin intermediarios ni comisiones:**
  *¿Cómo valoras el trato directo frente a pagar comisiones a apps comerciales?*
  > *Respuesta:* 

---

## 🧪 4. Pruebas de Usabilidad UX (Tareas T1 - T5)
| # | Tarea | Tiempo (seg) | Resultado | Observaciones |
|---|---|:---:|:---:|---|
| **T1** | Escanear QR y ver pasaporte | ___ s | [ ] Éxito [ ] Dificultad | |
| **T2** | Identificar origen cultural y técnica | ___ s | [ ] Éxito [ ] Dificultad | |
| **T3** | Verificar sello inmutable Stellar | ___ s | [ ] Éxito [ ] Dificultad | |
| **T4** | Localizar botón de contacto directo | ___ s | [ ] Éxito [ ] Dificultad | |
| **T5** | Filtrar vitrina comunitaria | ___ s | [ ] Éxito [ ] Dificultad | |

---

## 📊 5. Escala SUS (System Usability Scale)
- **Puntaje SUS Calculado:** \`_____ / 100\` *(Meta > 80 pts)*
- **Nivel de Confianza en Autenticidad (1 a 10):** \`[ /10 ]\`

---
**Firma de Brigada TecNM:**  
*Reporte listo para evaluación técnica y comunitaria de Yucu Mixteca.*
`;

  const activeTemplateText = language === 'en' ? rawEnglishTemplate : rawSpanishTemplate;

  const handleCopy = (textToCopy = activeTemplateText) => {
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const filename = language === 'en' ? 'BUYER_RESEARCH_AND_UX_ISSUE_TEMPLATE.md' : 'ISSUE_ENTREVISTA_COMPRADORES_UX.md';
    const blob = new Blob([activeTemplateText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Guardar lead de campo en el directorio local
  const handleSaveFieldLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      alert('Por favor introduce el nombre o alias del comprador.');
      return;
    }
    if (!buyerPhone.trim()) {
      alert('Por favor introduce el teléfono o WhatsApp para poder contactarlo en el futuro.');
      return;
    }

    const newLead: BuyerLeadRecord = {
      id: 'lead-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      studentName: studentName.trim() || 'Estudiante TecNM',
      studentGroup: studentGroup.trim() || 'Ing. Sistemas',
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      buyerCity: buyerCity.trim(),
      buyerSegment,
      interestedProducts: interestedProducts.trim(),
      willingnessToPayExtraMxn: Number(willingnessToPayExtra) || 0,
      susScore: Number(susScore) || 85,
      consentForFutureContact,
      notes: buyerQuote.trim(),
      createdVia: 'field_interview'
    };

    setLeads([newLead, ...leads]);
    setSaveSuccessMsg(`¡Contacto de ${buyerName} guardado con éxito en el directorio!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);

    // Limpiar formulario para la siguiente entrevista
    setBuyerName('');
    setBuyerPhone('');
    setBuyerQuote('');
  };

  // Generar Markdown individual para un lead
  const generateLeadMarkdown = (lead: BuyerLeadRecord) => {
    return `---
name: 🛍️ Buyer Research Interview & Usability Evaluation (TecNM)
title: "[UX-RESEARCH]: Buyer Interview - ${lead.buyerName} (${lead.buyerCity})"
labels: ["user-research", "usability-testing", "buyer-interviews", "ux-evaluation"]
---

# 🛍️ Reporte de Entrevista a Comprador y Prueba de Usabilidad UX
**Proyecto:** Yucu Mixteca Open Hub (\`Open-Hub-Tec/yucu\`)  
**Institución:** Instituto Tecnológico de Tlaxiaco (TecNM) – Depto. de Sistemas y Computación  
**Estudiante(s):** ${lead.studentName} (${lead.studentGroup})  
**Fecha:** ${lead.timestamp}  

---

## 👤 Perfil y Teléfono del Comprador (Validación de Dolor y Demanda)
- **Nombre:** ${lead.buyerName}
- **WhatsApp / Teléfono de Contacto:** **${lead.buyerPhone}**
- **Ciudad:** ${lead.buyerCity}
- **Segmento:** ${lead.buyerSegment}
- **Productos de Interés:** ${lead.interestedProducts}
- **Disposición a Pagar Sobreprecio Ético:** +$${lead.willingnessToPayExtraMxn} MXN
- **Autorización para ser contactado al lanzamiento del proyecto:** ${lead.consentForFutureContact ? '✅ SÍ AUTORIZADO (Guardado para notificación)' : '❌ No autorizado'}
- **Puntuación SUS Reportada:** ${lead.susScore} / 100
- **Cita Textual del Comprador:** "${lead.notes || 'Excelente iniciativa de comercio directo sin intermediarios.'}"
`;
  };

  // Abrir issue en GitHub para un lead específico
  const handleOpenGitHubForLead = (lead: BuyerLeadRecord) => {
    const md = generateLeadMarkdown(lead);
    const title = `[UX-RESEARCH]: Entrevista Comprador - ${lead.buyerName} (${lead.buyerCity})`;
    const url = `https://github.com/Open-Hub-Tec/yucu/issues/new?title=${encodeURIComponent(title)}&labels=user-research,usability-testing,buyer-interviews,ux-evaluation&body=${encodeURIComponent(md)}`;
    window.open(url, '_blank');
  };

  // Exportar todos los leads a CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Fecha', 'Estudiante', 'Grupo', 'Comprador', 'Telefono_WhatsApp', 'Ciudad', 'Segmento', 'Productos_Interes', 'Sobreprecio_MXN', 'SUS_Score', 'Consentimiento_Contacto', 'Notas'];
    const rows = leads.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.studentName || ''}"`,
      `"${l.studentGroup || ''}"`,
      `"${l.buyerName}"`,
      `"${l.buyerPhone}"`,
      `"${l.buyerCity}"`,
      `"${l.buyerSegment}"`,
      `"${l.interestedProducts}"`,
      l.willingnessToPayExtraMxn || 0,
      l.susScore || 0,
      l.consentForFutureContact ? 'SI_AUTORIZADO' : 'NO',
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DIRECTORIO_COMPRADORES_TECNM_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Eliminar lead
  const handleDeleteLead = (id: string) => {
    if (confirm('¿Eliminar este registro de comprador del dispositivo?')) {
      setLeads(leads.filter(l => l.id !== id));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#fcfaf6] text-[#1c241f] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-300 w-full max-w-5xl max-h-[94vh]">
        {/* HEADER */}
        <div className="bg-[#032517] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-emerald-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 text-amber-300 flex items-center justify-center font-bold text-lg shadow-xs">
              🛍️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-700/50">
                  TecNM Tlaxiaco · Open Hub Milestone
                </span>
                <span className="text-[11px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/40 font-bold">
                  {leads.length} Teléfonos Guardados
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
                Validación de Compradores, Usabilidad UX y Directorio
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle for Template tab */}
            {activeTab === 'template' && (
              <div className="bg-emerald-950 p-0.5 rounded-lg border border-emerald-700/60 flex items-center text-xs">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-amber-400 text-stone-950 font-black shadow-2xs'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  EN (Official)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('es')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    language === 'es'
                      ? 'bg-amber-400 text-stone-950 font-black shadow-2xs'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  ES
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-rose-900 text-stone-200 hover:text-white transition-colors cursor-pointer"
              title="Cerrar modal"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="bg-stone-100 px-3 sm:px-6 pt-3 pb-0 border-b border-stone-200 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('campo')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-t border-x flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'campo'
                  ? 'bg-[#fcfaf6] text-[#032517] border-stone-300 shadow-2xs font-black'
                  : 'text-stone-600 hover:text-stone-900 border-transparent hover:bg-stone-200/60'
              }`}
            >
              <span>📱</span>
              <span>Modo Campo (Registrar Teléfono)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-t border-x flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'leads'
                  ? 'bg-[#fcfaf6] text-[#032517] border-stone-300 shadow-2xs font-black'
                  : 'text-stone-600 hover:text-stone-900 border-transparent hover:bg-stone-200/60'
              }`}
            >
              <span>📞</span>
              <span>Directorio de Compradores</span>
              <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {leads.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('template')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-t border-x flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'template'
                  ? 'bg-[#fcfaf6] text-[#032517] border-stone-300 shadow-2xs font-black'
                  : 'text-stone-600 hover:text-stone-900 border-transparent hover:bg-stone-200/60'
              }`}
            >
              <span>📋</span>
              <span>Plantilla Issue GitHub</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-t border-x flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'bg-[#fcfaf6] text-[#032517] border-stone-300 shadow-2xs font-black'
                  : 'text-stone-600 hover:text-stone-900 border-transparent hover:bg-stone-200/60'
              }`}
            >
              <span>🧭</span>
              <span>Protocolo de Campo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('example')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer border-t border-x flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'example'
                  ? 'bg-[#fcfaf6] text-[#032517] border-stone-300 shadow-2xs font-black'
                  : 'text-stone-600 hover:text-stone-900 border-transparent hover:bg-stone-200/60'
              }`}
            >
              <span>⭐</span>
              <span>Ejemplo (Benchmark)</span>
            </button>
          </div>

          {activeTab === 'template' && (
            <div className="flex items-center gap-2 pb-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(activeTemplateText)}
                className="px-3 py-1.5 bg-[#032517] hover:bg-emerald-950 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Copiar texto markdown al portapapeles"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? '¡Copiado!' : 'Copiar Plantilla'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="p-1.5 bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-lg text-xs font-bold flex items-center transition-all cursor-pointer"
                title="Descargar archivo .md"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
              </button>
            </div>
          )}
        </div>

        {/* CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-sm">
          {/* TAB 1: MODO CAMPO (REGISTRAR TELÉFONO Y ENTREVISTA EN VIVO) */}
          {activeTab === 'campo' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-950">
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-0.5">💡</div>
                  <div>
                    <h4 className="font-black text-sm text-amber-900">
                      Captura en Campo para Estudiantes del TecNM
                    </h4>
                    <p className="text-xs text-amber-900/90 mt-0.5 leading-relaxed">
                      Al entrevistar a un comprador en Tlaxiaco o en la Mixteca, registra su <strong>teléfono celular / WhatsApp</strong> y su autorización para contactarlo cuando el proyecto esté listo. Esto valida la intención real de compra y genera la lista de espera oficial.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('leads')}
                  className="shrink-0 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">contacts</span>
                  <span>Ver Directorio ({leads.length})</span>
                </button>
              </div>

              {saveSuccessMsg && (
                <div className="bg-emerald-600 text-white p-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 animate-fadeIn shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveFieldLead} className="bg-white p-5 rounded-2xl border border-stone-300 shadow-xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Datos del estudiante */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Estudiante(s) Evaluador(es) TecNM:
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Ej. Castro Jared & Dulce Maetzy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Semestre y Materia:
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
                      value={studentGroup}
                      onChange={(e) => setStudentGroup(e.target.value)}
                      placeholder="Ej. 5º Semestre Grupo B - Residencia"
                    />
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Datos del Comprador */}
                  <div>
                    <label className="block text-xs font-black text-stone-900 mb-1">
                      Nombre o Contacto del Comprador: *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none font-bold"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Ej. Rodrigo Vásquez (Barista)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-emerald-950 mb-1">
                      📱 Teléfono Celular / WhatsApp: *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border-2 border-emerald-600 focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 outline-none font-bold text-emerald-950"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="+52 953 123 4567"
                    />
                    <span className="text-[10px] text-stone-500 mt-0.5 block">
                      Para avisarle cuando los lotes y entregas estén listos
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Ciudad / Ubicación de la Prueba:
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
                      value={buyerCity}
                      onChange={(e) => setBuyerCity(e.target.value)}
                      placeholder="Ej. Tlaxiaco / Oaxaca / CDMX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Perfil o Segmento de Comprador:
                    </label>
                    <select
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-emerald-700 outline-none bg-white font-medium"
                      value={buyerSegment}
                      onChange={(e) => setBuyerSegment(e.target.value)}
                    >
                      <option value="Barista / Cafetería de especialidad">Barista / Cafetería de especialidad</option>
                      <option value="Turista cultural / Consumidor ético">Turista cultural / Consumidor ético</option>
                      <option value="Diseñador(a) / Coleccionista textil">Diseñador(a) / Coleccionista textil</option>
                      <option value="Tienda de comercio justo / Distribuidor">Tienda de comercio justo / Distribuidor</option>
                      <option value="Vecino local de Tlaxiaco / Mixteca">Vecino local de Tlaxiaco / Mixteca</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Productos / Ramos de Interés:
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-emerald-700 outline-none"
                      value={interestedProducts}
                      onChange={(e) => setInterestedProducts(e.target.value)}
                      placeholder="Ej. Café Nuu Savi, Rebozo telar, Tenate"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Sobreprecio Ético Dispuesto (MXN):
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs text-stone-500 font-bold">$</span>
                      <input
                        type="number"
                        className="w-full pl-6 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-emerald-700 outline-none font-bold"
                        value={willingnessToPayExtra}
                        onChange={(e) => setWillingnessToPayExtra(e.target.value)}
                        placeholder="120"
                      />
                    </div>
                  </div>
                </div>

                {/* Dolores Observados y SUS */}
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-3">
                  <div>
                    <span className="block text-xs font-bold text-stone-800 mb-1.5">
                      Dolores y Factores Críticos Validados en la Entrevista:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                      {[
                        'Duda de autenticidad frente a copias industriales',
                        'Rechazo a comisiones abusivas de intermediarios',
                        'Valora que el 100% del pago vaya a la artesana',
                        'Entendió y apreció el sello Stellar Zero-PII sin invasión de datos'
                      ].map((pain) => (
                        <label key={pain} className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={painsObserved.includes(pain)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPainsObserved([...painsObserved, pain]);
                              } else {
                                setPainsObserved(painsObserved.filter(p => p !== pain));
                              }
                            }}
                            className="rounded text-emerald-800 focus:ring-emerald-700"
                          />
                          <span>{pain}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-200">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-stone-800">
                        Evaluación SUS Rápida:
                      </span>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        step="5"
                        value={susScore}
                        onChange={(e) => setSusScore(Number(e.target.value))}
                        className="w-32 accent-emerald-800 cursor-pointer"
                      />
                      <span className="text-xs font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-mono">
                        {susScore} / 100 ({susScore >= 80 ? 'Excelente A' : 'Aceptable'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Consentimiento de Teléfono */}
                <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consentForFutureContact}
                      onChange={(e) => setConsentForFutureContact(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 cursor-pointer"
                    />
                    <div className="text-xs text-emerald-950">
                      <strong className="block font-black text-emerald-900">
                        ✅ Consentimiento Ético de Contacto al Lanzamiento Oficial:
                      </strong>
                      <span>
                        El comprador autoriza guardar su número telefónico / WhatsApp para ser contactado en el futuro una vez que el proyecto esté listo y las artesanas reciban pedidos y entregas de producción.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Cita Textual */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Cita Textual del Comprador (Voice of the Customer):
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-emerald-700 outline-none"
                    placeholder="Ej. 'Me encanta poder hablar directo por WhatsApp con la artesana sin que una aplicación intermediaria le quite el 30% de su trabajo...'"
                    value={buyerQuote}
                    onChange={(e) => setBuyerQuote(e.target.value)}
                  />
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-stone-500">
                    Se guarda localmente en el dispositivo de la brigada y se puede exportar a CSV o subir a GitHub.
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="submit"
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#032517] hover:bg-emerald-950 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">save</span>
                      <span>Guardar en Directorio</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: DIRECTORIO DE CONTACTOS GUARDADOS */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              <div className="bg-[#f0eee8] border border-stone-300 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📞</span>
                    <h4 className="text-base font-black text-[#032517]">
                      Directorio de Compradores Validados ({leads.length} Contactos)
                    </h4>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                    Registro de prospectos y primeros adoptantes que validaron la plataforma y autorizaron ser contactados vía WhatsApp/teléfono cuando el proyecto esté terminado.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    title="Descargar tabla compatible con Excel o Google Sheets"
                  >
                    <span className="material-symbols-outlined text-[16px]">file_download</span>
                    <span>Exportar CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('campo')}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                    <span>Nuevo Registro</span>
                  </button>
                </div>
              </div>

              {leads.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
                  <p className="text-stone-500 font-medium">Aún no hay contactos registrados en este dispositivo.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('campo')}
                    className="mt-3 px-4 py-2 bg-[#032517] text-white rounded-xl text-xs font-bold"
                  >
                    Capturar primer comprador
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-emerald-800/40 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-black text-sm text-[#032517]">{lead.buyerName}</h5>
                            <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-mono">
                              {lead.buyerCity}
                            </span>
                          </div>
                          <span className="text-xs text-stone-500 block mt-0.5 font-medium">
                            {lead.buyerSegment}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                          SUS: {lead.susScore || 85}/100
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between text-stone-700">
                          <span className="text-stone-500">Teléfono / WhatsApp:</span>
                          <strong className="text-emerald-900 font-mono text-sm">{lead.buyerPhone}</strong>
                        </div>

                        <div className="flex items-center justify-between text-stone-700">
                          <span className="text-stone-500">Interés:</span>
                          <span className="font-medium text-stone-900 text-right">{lead.interestedProducts}</span>
                        </div>

                        {lead.willingnessToPayExtraMxn ? (
                          <div className="flex items-center justify-between text-stone-700">
                            <span className="text-stone-500">Sobreprecio Ético:</span>
                            <span className="font-bold text-amber-700">+${lead.willingnessToPayExtraMxn} MXN</span>
                          </div>
                        ) : null}

                        {lead.notes ? (
                          <p className="text-[11px] text-stone-600 italic bg-stone-50 p-2 rounded-lg border border-stone-150 mt-1">
                            &ldquo;{lead.notes}&rdquo;
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 gap-2 flex-wrap">
                        <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-bold">
                          <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                          <span>Autorizado al lanzamiento</span>
                        </div>

                        <div className="flex items-center gap-1.5 ml-auto">
                          {/* Botón WhatsApp directo */}
                          <a
                            href={`https://api.whatsapp.com/send?phone=${lead.buyerPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                              `Hola ${lead.buyerName}, te saludamos de la brigada de validación de Yucu (TecNM Tlaxiaco). Respecto a tu interés en: ${lead.interestedProducts}, te guardamos en nuestro directorio de preventa oficial.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#20ba59] transition-all cursor-pointer"
                            title="Enviar WhatsApp de confirmación"
                          >
                            <span className="material-symbols-outlined text-[16px]">chat</span>
                          </a>

                          {/* Botón Subir Issue a GitHub */}
                          <button
                            type="button"
                            onClick={() => handleOpenGitHubForLead(lead)}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                            title="Crear Issue en GitHub con los datos de esta entrevista"
                          >
                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                            <span>Issue GitHub</span>
                          </button>

                          {/* Botón Borrar */}
                          <button
                            type="button"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Eliminar registro"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PLANTILLA MARKDOWN DE ISSUE GITHUB */}
          {activeTab === 'template' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl text-xs sm:text-sm text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">💡</span>
                  <div>
                    <strong>Instrucción para el Alumno:</strong> Copia esta plantilla oficial o abre directamente la nueva issue con la plantilla en GitHub:
                    <div className="mt-0.5">
                      <code className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-mono font-bold text-xs">
                        github.com/Open-Hub-Tec/yucu/issues/new?template=buyer_interview_and_usability.md
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <a
                    href="https://github.com/Open-Hub-Tec/yucu/issues/new?title=%5BUX-RESEARCH%5D%3A+Buyer+Interview+%26+Usability+Test+-+TecNM&labels=user-research%2Cusability-testing%2Cbuyer-interviews%2Cux-evaluation&template=buyer_interview_and_usability.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Abrir Issue en GitHub</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                </div>
              </div>

              <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-stone-700 shadow-inner max-h-[55vh]">
                <pre className="whitespace-pre-wrap">{activeTemplateText}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: GUÍA Y PROTOCOLO DE CAMPO */}
          {activeTab === 'guide' && (
            <div className="space-y-5 text-stone-800">
              <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-amber-950 text-xs sm:text-sm space-y-1">
                <h4 className="font-bold flex items-center gap-2 text-amber-900 text-sm">
                  <span className="material-symbols-outlined text-base">school</span>
                  Protocolo del Estudiante del Tec de Tlaxiaco en Campo
                </h4>
                <p>
                  Tu función es validar la experiencia del comprador sin vender el producto ni indicarle dónde hacer clic. Aplica el <strong>Think-Aloud Protocol</strong> (pensar en voz alta), registra dolores observados y pide permiso para guardar su WhatsApp.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2">
                  <h5 className="font-black text-stone-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">1</span>
                    Presentación Ética y Consentimiento
                  </h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Preséntate como estudiante de Ingeniería en Sistemas Computacionales del Instituto Tecnológico de Tlaxiaco. Explica que Yucu es un protocolo comunitario para combatir el plagio de artesanías y erradicar comisiones de intermediarios.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2">
                  <h5 className="font-black text-stone-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">2</span>
                    Captura del Teléfono para el Lanzamiento
                  </h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Pregunta: <em>&ldquo;¿Nos autorizas guardar tu número celular para avisarte por WhatsApp en cuanto el proyecto esté listo y se puedan hacer compras oficiales?&rdquo;</em> Si acepta, regístralo en la pestaña &ldquo;Modo Campo&rdquo;.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
                <h5 className="font-black text-stone-900 text-sm">
                  3. Las 5 Tareas Observadas de Usabilidad en el Teléfono:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs text-center">
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <span className="font-bold block text-emerald-800">Tarea 1</span>
                    <span>Escanear QR físico y cargar pasaporte</span>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <span className="font-bold block text-emerald-800">Tarea 2</span>
                    <span>Reconocer artesana y técnica ancestral</span>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <span className="font-bold block text-emerald-800">Tarea 3</span>
                    <span>Inspeccionar sello inmutable Stellar</span>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <span className="font-bold block text-emerald-800">Tarea 4</span>
                    <span>Localizar deslinde y contacto directo</span>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <span className="font-bold block text-emerald-800">Tarea 5</span>
                    <span>Filtrar vitrina comunitaria por municipios</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950 text-white p-4 rounded-xl border border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <h6 className="font-bold text-amber-300 text-sm mb-1">
                    4. Fórmula Estandarizada SUS (System Usability Scale):
                  </h6>
                  <p className="text-emerald-200/90 font-mono">
                    • Reactivos Impares (1, 3, 5, 7, 9): Puntos = Calificación - 1<br />
                    • Reactivos Pares (2, 4, 6, 8, 10): Puntos = 5 - Calificación<br />
                    • Puntaje Final = (Suma de los 10 reactivos) × 2.5 (Escala 0 a 100)
                  </p>
                </div>
                <div className="text-center bg-emerald-900/80 p-3 rounded-lg border border-emerald-700/60 shrink-0">
                  <span className="text-xs text-emerald-300 block">Meta del Hito</span>
                  <span className="text-lg font-black text-amber-300 font-mono">&gt; 80 / 100</span>
                  <span className="text-[10px] text-emerald-300 block">Grado A (Excelente)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EJEMPLO DE REFERENCIA */}
          {activeTab === 'example' && (
            <div className="space-y-4">
              <div className="bg-stone-50 border border-stone-300 p-4 rounded-xl text-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <div>
                    <span className="font-black text-[#032517] text-sm sm:text-base block">
                      Ejemplo de Referencia: Rodrigo V. (Barista en Nuu Savi, Tlaxiaco, 32 años)
                    </span>
                    <span className="text-xs text-stone-500">
                      Evaluado por: Castro Jared &amp; Dulce Maetzy (TecNM Tlaxiaco - ISC)
                    </span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-300 font-mono">
                    SUS: 95.0 / 100 (Grado A+)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-stone-200">
                    <strong className="block text-stone-900 mb-0.5">Perfil:</strong>
                    Barista y copropietario de cafetería Nuu Savi, Tlaxiaco.
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-stone-200">
                    <strong className="block text-stone-900 mb-0.5">📱 Teléfono:</strong>
                    +52 953 145 8921 (Autorizado para aviso de lanzamiento).
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-stone-200">
                    <strong className="block text-stone-900 mb-0.5">Velocidad QR (T1):</strong>
                    6 segundos (Cámara nativa Xiaomi Redmi).
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-stone-200">
                    <strong className="block text-stone-900 mb-0.5">Sobreprecio Ético:</strong>
                    +$150 MXN/kg de café trazable.
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-stone-200 text-xs space-y-2">
                  <p className="italic text-stone-700">
                    &ldquo;Me parece brillante que la blockchain no guarde mi INE ni datos invasivos de la artesana. Si ella quiere pausar su ficha, mantiene soberanía. El hecho de que Stellar solo registre la huella digital prueba la autenticidad física sin vulnerar la privacidad. Y tener un botón directo de WhatsApp para pactar la entrega sin intermediarios es el modelo más honesto posible.&rdquo;
                  </p>
                  <p className="font-bold text-emerald-800 text-right">
                    — Rodrigo V., Nuu Savi Specialty Café, Tlaxiaco, Oaxaca
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-stone-100 px-4 sm:px-6 py-3 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-600 font-medium hidden sm:inline">
              Yucu Open Hub · Instituto Tecnológico de Tlaxiaco (TecNM)
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {activeTab === 'campo' && (
              <button
                type="button"
                onClick={() => setActiveTab('leads')}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-stone-200 text-stone-700 border border-stone-300 transition-all cursor-pointer"
              >
                Ver Contactos ({leads.length})
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#032517] hover:bg-emerald-950 text-white transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
