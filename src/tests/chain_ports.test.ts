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
  const { address } = await wallet.createAccount('1234');
  check(address.startsWith('G'), 'La cuenta tiene dirección pública G...');

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
  const create = await escrow.prepareCreate({
    orderId: 'ORD-1', buyerAddress: 'GBUYER', producerAddress: address, approverAddress: 'GCOOP',
    amount: 1000, asset: 'USDC', milestones: [{ description: 'Origen', percent: 30 }, { description: 'Entrega', percent: 70 }],
  });
  await escrow.submit(await wallet.sign(create, '1234'));
  await escrow.submit(await wallet.sign(await escrow.prepareRelease('ORD-1', 'GCOOP'), '1234'));
  const st = await escrow.getStatus('ORD-1');
  check(st.status === 'released' && st.source === 'simulated', 'El escrow simulado recorre el flujo y se marca como simulado');

  if (failures > 0) {
    console.error(`\n${failures} prueba(s) fallaron`);
    process.exit(1);
  }
  console.log('\n  Puertos de cadena: 0 fallos');
}
run();
