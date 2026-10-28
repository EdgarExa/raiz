import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, ShadingType } from 'docx';
import * as fs from 'fs';
import * as path from 'path';

async function generateWordDoc() {
  const doc = new Document({
    title: 'Yucu Protocol - Stellar Soroban Executive Dossier',
    description: 'Executive Presentation Dossier for Denelle Dixon & The Stellar Development Foundation Leadership',
    creator: 'Prof. José Alfredo Román Cruz & Open Hub TecNM',
    sections: [
      {
        properties: {},
        children: [
          // Header / Institution
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'OPEN HUB TecNM · INSTITUTO TECNOLÓGICO DE TLAXIACO (OAXACA, MEXICO)',
                bold: true,
                size: 20,
                color: '10B981',
                font: 'Arial',
              }),
            ],
          }),

          // Main Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'RAÍZ PROTOCOL',
                bold: true,
                size: 44,
                color: '032517',
                font: 'Arial',
              }),
            ],
          }),

          // Subtitle
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'Verifiable RWA Attestation Infrastructure & Programmable Fair Escrows on Stellar Soroban',
                italics: true,
                size: 24,
                color: 'D97706',
                font: 'Arial',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'Executive Presentation & Strategic Roadmap for Denelle Dixon & The Stellar Development Foundation (SDF) Leadership',
                bold: true,
                size: 18,
                color: '4B5563',
                font: 'Arial',
              }),
            ],
          }),

          // Divider
          new Paragraph({
            spacing: { after: 300 },
            border: { bottom: { color: '10B981', space: 1, value: BorderStyle.SINGLE, size: 6 } },
            children: [],
          }),

          // Slide 1 Section
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({ text: 'SLIDE 1: Institutional Introduction & Vision', bold: true, color: '032517', font: 'Arial', size: 28 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Mandate: ', bold: true, color: '032517' }),
              new TextRun({ text: 'An open-source, decentralized RWA Attestation Registry & Fair-Trade Escrow standard empowering unbanked indigenous producers and rural cooperatives with programmable financial sovereignty.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Core Thesis: ', bold: true, color: '032517' }),
              new TextRun({ text: 'Proving Stellar’s founding mission by connecting Mexico’s most vulnerable agricultural and artisanal creators directly to institutional global buyers with zero seed-phrase friction.' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 100, after: 200 },
            shading: { type: ShadingType.CLEAR, fill: 'F3F4F6' },
            children: [
              new TextRun({ text: 'Speaker Script: ', bold: true, italics: true, color: 'D97706' }),
              new TextRun({ text: '"Good morning, Denelle and members of the Stellar leadership team. I am José Alfredo Román Cruz, computer science faculty lead at TecNM Tlaxiaco in Oaxaca, Mexico. Today, on behalf of our university and our student researchers, we present Yucu Protocol. Yucu is an open-source, foundational infrastructure primitive built on Soroban. It delivers what Stellar has uniquely championed from day one: transforming financial access from an abstract promise into mathematical certainty for the most marginalized, resilient producers on Earth."', italics: true }),
            ],
          }),

          // Slide 2 Section
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({ text: 'SLIDE 2: The Macro Problem: Rural Extraction Crisis', bold: true, color: '032517', font: 'Arial', size: 28 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Predatory Middlemen ("Los Coyotes"): ', bold: true }),
              new TextRun({ text: 'Intermediaries capture 400% to 1,000% gross markups. A 9-month handwoven textile bought for $15-$25 USD is resold in luxury galleries for $300-$600 USD with 0% residual upside returning to the creator.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Industrial Piracy & Loss of Provenance: ', bold: true }),
              new TextRun({ text: 'Global fast-fashion and factory imitations cannibalize ancestral designs. Artisans lack verifiable, legally binding certificates of origin to defend their collective heritage against corporate appropriation.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. The Unbanked Last-Mile Chasm: ', bold: true }),
              new TextRun({ text: 'Over 85% of rural producers lack bank accounts, credit history, or internet connectivity, operating strictly in local cash with zero access to global buyers.' }),
            ],
          }),

          // Slide 3 Section: Field Research Findings
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({ text: 'SLIDE 3: Empirical Field Research Audit: What Our Students Discovered in Oaxaca', bold: true, color: '032517', font: 'Arial', size: 28 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Field Audits Conducted by Student Engineering Brigade (PR #1.1 & Issue #18):', bold: true, color: 'D97706' }),
              new TextRun({ text: ' 50 in-person audits across San José Xochixtlán, San Cristóbal Amoltepec, Cuquila, and Magdalena Peñasco.' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: '• 1. The 93% Extraction Shock: ', bold: true, color: 'DC2626' }),
              new TextRun({ text: 'In waist-loom heirloom textiles, an artisan invests 7-9 months of labor to receive ~$60 USD ($1,200 MXN) from local coyotes. The piece is resold in metropolitan luxury boutiques for ~$900 USD ($18,000 MXN)—middlemen capture 93% of gross value.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• 2. Acoustic Usability Breakthrough: ', bold: true, color: '15803D' }),
              new TextRun({ text: '88% of elderly producers failed on standard mobile banking apps due to typing barriers or fear of error. With Yucu’s 112px acoustic voice button, 96% completed their harvest record in <4 seconds without assistance.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• 3. 100% Demand for Cryptographic Hang-Tags: ', bold: true, color: 'D97706' }),
              new TextRun({ text: '100% of surveyed artisans demanded physical ISO/IEC 18004 hang-tags to defend their work against Chinese factory counterfeits and prove their collective community authorship under Mexican law.' }),
            ],
          }),
          new Paragraph({
            spacing: { before: 100, after: 200 },
            shading: { type: ShadingType.CLEAR, fill: 'F3F4F6' },
            children: [
              new TextRun({ text: 'Empirical Extraction Matrix:\n', bold: true, color: '032517' }),
              new TextRun({ text: '• Waist-Loom Huipil: Producer 7% | Coyote Markup 93% | Retained with Yucu: 98%\n' }),
              new TextRun({ text: '• Specialty Coffee: Producer 18% | Coyote Markup 82% | Retained with Yucu: 98%\n' }),
              new TextRun({ text: '• Ancestral Mezcal: Producer 22% | Coyote Markup 78% | Retained with Yucu: 98%\n' }),
              new TextRun({ text: '• Virgin Forest Honey: Producer 25% | Coyote Markup 75% | Retained with Yucu: 98%' }),
            ],
          }),

          // Slide 4 Section
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({ text: 'SLIDE 3: The Missing Primitive in Stellar (The Infrastructure Thesis)', bold: true, color: '032517', font: 'Arial', size: 28 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• The Ethereum EAS Benchmark: ', bold: true }),
              new TextRun({ text: 'Ethereum pioneered verifiable claims with EAS, but L1 gas spikes ($5-$25 USD) disqualify it from rural micro-settlements.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• The Stellar Gap: ', bold: true }),
              new TextRun({ text: 'Stellar has established standards for web auth (SEP-10) and KYC (SEP-12), but lacked an open, composable standard for verifiable Real-World Asset (RWA) claims in Soroban.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• The Solution (SEP-RWA): ', bold: true }),
              new TextRun({ text: 'We authored SEP-RWA (docs/SEP_RWA_ATTESTATION_DRAFT.md) and implemented AttestationRegistry.rs: sub-cent verifiable claims on Soroban at $0.00001 USD per attestation with 5-second finality.' }),
            ],
          }),

          // Slide 4 Section
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({ text: 'SLIDE 4: Core Smart Contract Architecture (Rust on Soroban)', bold: true, color: '032517', font: 'Arial', size: 28 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. AttestationRegistry.rs: ', bold: true, color: '10B981' }),
              new TextRun({ text: 'On-chain notary for immutable schemas, Ed25519 signatures, and state rent TTL extension management (100k-500k ledgers).' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. FairEscrow.rs: ', bold: true, color: '10B981' }),
              new TextRun({ text: 'Non-custodial conditional escrow locking buyer stablecoins (USDC/MXNe). Releases funds ONLY upon verified quality and physical reception attestations, with anti-coyote price guardrails.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. PerpetualRoyalties.rs: ', bold: true, color: '10B981' }),
              new TextRun({ text: 'Automated 10% secondary resale royalties directly to original artisans + 2% to municipal infrastructure funds (Tequio Comunal).' }),
            ],
          }),

          // Slide 5 Section
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({ text: 'SLIDE 5: The Centaur Model: AI Oracles + Indigenous Governance', bold: true, color: '032517', font: 'Arial', size: 28 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Dual-Lock Consensus: ', bold: true }),
              new TextRun({ text: 'Autonomous AI Oracles (Copernicus Sentinel-2 satellite analysis for EUDR zero-deforestation + computer vision SCAA coffee defect scoring) work alongside the human community elder (Master Weaver / Master Palenquero) who signs with an Ed25519 keypair.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Constitutional Respect: ', bold: true }),
              new TextRun({ text: 'Honors Usos y Costumbres under Article 2 of the Mexican Constitution. AI assists with heavy technical auditing, but the community elder retains sovereign authority.' }),
            ],
          }),

          // Slide 6 Section
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({ text: 'SLIDE 6: The Physical Anchor: Digital Passport & ISO/IEC 18004 QR', bold: true, color: '032517', font: 'Arial', size: 28 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Hang-Tag Physical Experience: ', bold: true }),
              new TextRun({ text: 'Vector-rendered QR tags printed on biodegradable kraft paper attached to textiles, coffee bags, or bottles.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Instant Verification: ', bold: true }),
              new TextRun({ text: 'Buyers scan in under 2 seconds on any smartphone, streaming the artisan’s voice in Mixtec (Tu’un Savi), viewing GPS polygon coordinates, and verifying immutable Stellar ledger proof.' }),
            ],
          }),

          // Slide 7 Section
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({ text: 'SLIDE 7: Invisible Web3: Zero-Seed-Phrase Last-Mile Liquidity', bold: true, color: '032517', font: 'Arial', size: 28 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Zero-Typing Voice UI: ', bold: true }),
              new TextRun({ text: 'Elderly producers speak naturally in Mixtec (Tu’un Savi) or Spanish.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Keyless Identity (DID): ', bold: true }),
              new TextRun({ text: 'Laminated physical QR Identity Cards (Carnet de Productor) or SMS OTP. No 24-word seed phrases.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Multi-Anchor Cash-Out: ', bold: true }),
              new TextRun({ text: 'Etherfuse Banxico SPEI directly into Banco del Bienestar debit cards + MicoPay rural mobile cash network with local carriers.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Fee Sponsorship (CAP-0015): ', bold: true }),
              new TextRun({ text: '100% of network fees are sponsored via Stellar Fee-Bumps. Producers never touch crypto or pay gas.' }),
            ],
          }),

          // Slide 8 Section
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({ text: 'SLIDE 8: Business Model & Market Traction (Tech Rebel B2B2C)', bold: true, color: '032517', font: 'Arial', size: 28 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Paying B2B Clients (SMBs): ', bold: true }),
              new TextRun({ text: 'Specialty coffee roasters and ethical fashion galleries who face up to 4% turnover fines under European Union EUDR deforestation mandates if their supply chain lacks verifiable proof.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Revenue Streams: ', bold: true }),
              new TextRun({ text: '1.5% - 2.5% enterprise compliance and audit fee paid by commercial buyers; 0% platform take-rate for primary rural producers.' }),
            ],
          }),

          // Slide 9 Section
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({ text: 'SLIDE 9: Engineering Traction & University Backing', bold: true, color: '032517', font: 'Arial', size: 28 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• 52/52 Automated Tests Passing: ', bold: true }),
              new TextRun({ text: 'Complete CI suite covering acoustic parsing, SCAA vision models, EUDR satellites, DEX routing, and Soroban contracts.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Open-Source GitHub Repository: ', bold: true }),
              new TextRun({ text: 'Active public repo at github.com/Open-Hub-Tec/yucu with daily commits from student residents.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• TecNM Institutional Anchor: ', bold: true }),
              new TextRun({ text: 'Backed by Latin America’s largest public technological university network (600k+ engineering students nationwide).' }),
            ],
          }),

          // Slide 10 Section
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({ text: 'SLIDE 10: Strategic Proposal to Stellar Leadership', bold: true, color: '032517', font: 'Arial', size: 28 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Formal Ratification of SEP-RWA: ', bold: true }),
              new TextRun({ text: 'Adopt the draft specification as the official canonical RWA Attestation standard for Soroban.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Meridian Lisbon Anchor Showcase: ', bold: true }),
              new TextRun({ text: 'Feature Yucu at Meridian Lisbon as an exemplar of Protocol 22 real-world utility with live cross-border trade.' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. University Hub Developer Grant: ', bold: true }),
              new TextRun({ text: 'Support Open Hub TecNM developer residency program to scale pilot integrations from 50 to 500 indigenous cooperatives.' }),
            ],
          }),

          // Slide 11 Section
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({ text: 'SLIDE 11: The True Promise of Stellar', bold: true, color: '032517', font: 'Arial', size: 28 }),
            ],
          }),
          new Paragraph({
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({
                text: '“Real-world assets are not just treasury bills and commodities in institutional vaults; they are the heritage, harvests, and hands of the communities that sustain our world.”',
                italics: true,
                bold: true,
                size: 24,
                color: '032517',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• GitHub: ', bold: true }),
              new TextRun({ text: 'https://github.com/Open-Hub-Tec/yucu\n' }),
              new TextRun({ text: '• Academic Lead: ', bold: true }),
              new TextRun({ text: 'Prof. José Alfredo Román Cruz · tecnologicotlaxiaco@gmail.com\n' }),
              new TextRun({ text: '• Institution: ', bold: true }),
              new TextRun({ text: 'Open Hub TecNM · Instituto Tecnológico de Tlaxiaco, Oaxaca, Mexico' }),
            ],
          }),
        ],
      },
    ],
  });

  const outputPath = path.join(process.cwd(), 'public', 'Raiz_Protocol_Stellar_PitchDeck.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Word Document (.docx) generated successfully at: ${outputPath}`);
}

generateWordDoc().catch((err) => {
  console.error('❌ Failed to generate Word document:', err);
  process.exit(1);
});
