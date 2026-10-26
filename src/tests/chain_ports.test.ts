/**
 * Pruebas de los puertos de src/core/chain (ADR-003).
 * Cualquier implementación real debe cumplir el mismo flujo: preparar -> firmar -> enviar.
 */
import { SimulatedEscrow, SimulatedLotRegistry, SimulatedWallet } from '../core/chain/SimulatedChain';

let failures = 0;
function check(cond: boolean, msg: string) {
  console.log(`${cond ? '  ✅ PASS' : '  ❌ FAIL'}: ${msg}`);
  if (!cond) failures++;
}

async function run() {
  console.log('\n🔗 PUERTOS DE CADENA (SimulatedChain)');
  const wallet = new SimulatedWallet();
  check(!(await wallet.hasAccount()), 'Sin cuenta al inicio');
  const { address, recoveryCard } = await wallet.createAccount('1234');
  check(address.startsWith('G'), 'La cuenta tiene dirección pública G...');

  const newPhone = new SimulatedWallet();
  const restored = await newPhone.restoreAccount(recoveryCard, '5678');
  check(restored.address === address && (await newPhone.hasAccount()), 'La tarjeta de recuperación restaura la cuenta en otro teléfono');
  const otherPhone = new SimulatedWallet();
  const badCard = await otherPhone.restoreAccount('TARJETA EQUIVOCADA', '5678').then(() => false, () => true);
  check(badCard && !(await otherPhone.hasAccount()), 'Una tarjeta equivocada no restaura ninguna cuenta');

  const lots = new SimulatedLotRegistry();
  const tx = await lots.prepareRegisterLot({
    code: 'MIEL-001', producerAddress: address, location: 'San Juan Ñumí', category: 'Miel de abeja',
    variety: 'Multifloral', volumeUnits: 120, photoHashHex: 'a'.repeat(64),
  });
  check(tx.summary.includes('MIEL-001'), 'La transacción preparada explica qué se firma');
  const receipt = await lots.submit(await wallet.sign(tx, '1234'));
  check(receipt.source === 'simulated' && receipt.explorerUrl === null, 'El comprobante se marca como simulado');
  const lot = await lots.getLot('MIEL-001');
  check(lot?.source === 'simulated' && lot.producerAddress === address && !lot.certified, 'El lote se registra sin certificar');

  const escrow = new SimulatedEscrow();
  const order = (orderId: string, percents: number[]) => ({
    orderId, buyerAddress: 'GBUYER', producerAddress: address, approverAddress: 'GCOOP',
    releaseSignerAddress: 'GCOOP', disputeResolverAddress: 'GASAMBLEA', amount: 1000, asset: 'USDC',
    milestones: percents.map((percent, i) => ({ description: `Hito ${i + 1}`, percent })),
  });
  const created = await escrow.submitCreate(await wallet.sign(await escrow.prepareCreate(order('ORD-1', [30, 70])), '1234'));
  check(created.escrowId === 'ORD-1' && created.source === 'simulated', 'Crear el escrow devuelve su ID');
  await escrow.submit(await wallet.sign(await escrow.prepareRelease(created.escrowId, 'GCOOP'), '1234'));
  const st = await escrow.getStatus(created.escrowId);
  check(st.status === 'released' && st.source === 'simulated', 'El escrow simulado recorre el flujo y se marca como simulado');

  const badMilestones = await escrow.prepareCreate(order('ORD-2', [30, 60])).then(() => false, () => true);
  check(badMilestones, 'Se rechaza un escrow cuyos hitos no suman 100%');

  const disputed = await escrow.submitCreate(await wallet.sign(await escrow.prepareCreate(order('ORD-3', [100])), '1234'));
  await escrow.submit(await wallet.sign(await escrow.prepareDispute(disputed.escrowId, 'GBUYER'), '1234'));
  check((await escrow.getStatus(disputed.escrowId)).status === 'disputed', 'Una disputa congela el escrow');
  await escrow.submit(await wallet.sign(await escrow.prepareResolveDispute(disputed.escrowId, 'GASAMBLEA', 0), '1234'));
  check((await escrow.getStatus(disputed.escrowId)).status === 'refunded', 'Resolver con 0% al productor reembolsa al comprador');
  const badPercent = await escrow.prepareResolveDispute(disputed.escrowId, 'GASAMBLEA', 120).then(() => false, () => true);
  check(badPercent, 'Se rechaza resolver una disputa con un porcentaje fuera de 0 a 100');

  if (failures > 0) {
    console.error(`\n${failures} prueba(s) fallaron`);
    process.exit(1);
  }
  console.log('\n  Puertos de cadena: 0 fallos');
}
run();
