import assert from 'node:assert';
import { TrustlessWorkEscrowAdapter } from '../core/blockchain/TrustlessWorkEscrowAdapter';

console.log('================================================================');
console.log('   SUITE: TRUSTLESS WORK ESCROW INTEGRATION (SOROBAN / STELLAR)');
console.log('   Evaluación y validación arquitectónica para Tlaxiaco, Oaxaca');
console.log('================================================================');

async function runTests() {
  const adapter = new TrustlessWorkEscrowAdapter({
    defaultApproverTlaxiaco: 'GA7_COOP_TLAXIACO_VALIDATOR_ED25519',
  });

  // 1. Inicialización de Escrow
  console.log('\n📍 1. INICIALIZACIÓN DE CONTRATO TRUSTLESS WORK');
  const escrow = await adapter.initializeEscrow({
    lotCode: 'MX-OAX-TLAX-2026-CAFE-01',
    buyerAddress: 'GB_SPECIALTY_COFFEE_ROASTER_ZURICH',
    producerAddress: 'GA_DON_JUAN_YUCUHITI_OAXACA',
    totalAmount: 1500, // 1,500 USDC
    assetCode: 'USDC',
  });

  assert(escrow.escrowId.startsWith('tw_escrow_'), 'ID de escrow válido generado');
  assert(escrow.totalAmount === 1500, 'Monto total en custodia correcto');
  assert(escrow.milestones.length === 2, '2 hitos configurados');
  assert(escrow.milestones[0].percentage === 30, 'Hito 1 representa 30% ($450 USDC)');
  assert(escrow.milestones[0].amount === 450, 'Monto exacto de hito 1 calculado');
  assert(escrow.milestones[1].percentage === 70, 'Hito 2 representa 70% ($1050 USDC)');
  assert(escrow.milestones[1].amount === 1050, 'Monto exacto de hito 2 calculado');
  console.log('  ✅ PASS: Contrato de Escrow inicializado y fondeado con 2 hitos para Tlaxiaco');

  // 2. Liberación de Hito 1 (Atestación de Origen en Tlaxiaco)
  console.log('\n📍 2. LIBERACIÓN DE HITO 1: ATESTACIÓN DE ORIGEN & CALIDAD');
  const release1 = await adapter.submitMilestoneProofAndRelease({
    escrowId: escrow.escrowId,
    milestoneId: 'milestone-1-origin',
    attestationUid: '0x01_ORIGIN_TLAXIACO_YUCUHITI_88_PTS',
    attestationDigest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    callerAddress: 'GB_SPECIALTY_COFFEE_ROASTER_ZURICH',
  });

  assert(release1.success === true, 'Hito 1 liquidado exitosamente');
  assert(release1.releasedAmount === 450, 'Se liberaron $450 USDC al productor');
  assert(release1.recipient === 'GA_DON_JUAN_YUCUHITI_OAXACA', 'Fondos enviados a la cuenta del productor');
  assert(release1.remainingBalance === 1050, 'Saldo remanente en custodia es $1050 USDC');
  console.log('  ✅ PASS: Anticipo del 30% liberado contra atestación de origen inmutable');

  // 3. Intento de doble retiro (Protección Reentrancy / Idempotencia)
  console.log('\n📍 3. SEGURIDAD: PREVENCIÓN DE DOBLE GASTO / RE-LIBERACIÓN');
  let doubleSpendCaught = false;
  try {
    await adapter.submitMilestoneProofAndRelease({
      escrowId: escrow.escrowId,
      milestoneId: 'milestone-1-origin',
      attestationUid: '0x01_ORIGIN_TLAXIACO_YUCUHITI_88_PTS',
      attestationDigest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      callerAddress: 'GB_SPECIALTY_COFFEE_ROASTER_ZURICH',
    });
  } catch (err: any) {
    doubleSpendCaught = true;
  }
  assert(doubleSpendCaught === true, 'El contrato rechazó re-liquidar el mismo hito');
  console.log('  ✅ PASS: Prevención matemática de doble gasto validada');

  // 4. Liberación de Hito 2 (Entrega Física en Cooperativa de Tlaxiaco)
  console.log('\n📍 4. LIBERACIÓN DE HITO 2: ENTREGA FÍSICA EN COOPERATIVA');
  const release2 = await adapter.submitMilestoneProofAndRelease({
    escrowId: escrow.escrowId,
    milestoneId: 'milestone-2-delivery',
    attestationUid: '0x04_DELIVERY_TLAXIACO_COMMUNITY_COOP',
    attestationDigest: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    callerAddress: 'GA7_COOP_TLAXIACO_VALIDATOR_ED25519',
  });

  assert(release2.success === true, 'Hito 2 liquidado exitosamente');
  assert(release2.releasedAmount === 1050, 'Se liquidaron los $1050 USDC restantes');
  assert(release2.remainingBalance === 0, 'Saldo remanente en custodia es 0');

  const finalEscrow = adapter.getEscrow(escrow.escrowId);
  assert(finalEscrow?.status === 'completed', 'El contrato de escrow finalizó en estado completado');
  console.log('  ✅ PASS: Escrow liquidado 100% al productor y marcado completado');

  console.log('\n================================================================');
  console.log('   AUDITORÍA TRUSTLESS WORK: 100% PRUEBAS EXITOSAS, 0 FALLOS');
  console.log('================================================================\n');
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
