/**
 * Implementación de DEMOSTRACIÓN de los puertos de src/core/chain/ports.ts.
 *
 * Es el ÚNICO lugar del proyecto donde se permite inventar un hash o un número de ledger.
 * Todo lo que devuelve lleva source: 'simulated' para que la UI muestre <DemoBadge />.
 * No toca la red, no guarda llaves y no mueve dinero.
 */
import type {
  ChainReceipt,
  CreateEscrowRequest,
  EscrowCreatedReceipt,
  EscrowPort,
  LotRecord,
  MilestoneState,
  MilestoneStatus,
  LotRegistryPort,
  RegisterLotRequest,
  UnsignedTransaction,
  WalletPort,
} from './ports';

const DEMO_PASSPHRASE = 'Yucu Demo ; sin red';
const DEMO_ADDRESS = 'GDEMOYUCUSIMULADANOEXISTEENLARED0000000000000000000000000';
const DEMO_RECOVERY_CARD = 'TARJETA DE DEMOSTRACIÓN: no protege ninguna cuenta real.';

function randomHex(bytes: number): string {
  return Array.from({ length: bytes }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
}

function demoTx(summary: string, payload: unknown): UnsignedTransaction {
  return { xdr: btoa(unescape(encodeURIComponent(JSON.stringify(payload)))), networkPassphrase: DEMO_PASSPHRASE, summary };
}

function demoReceipt(): ChainReceipt {
  return { source: 'simulated', txHash: randomHex(32), ledger: 52_490_000 + Math.floor(Math.random() * 10_000), explorerUrl: null };
}

export class SimulatedWallet implements WalletPort {
  private created = false;
  async hasAccount() {
    return this.created;
  }
  async createAccount(_pin: string) {
    this.created = true;
    return { address: DEMO_ADDRESS, recoveryCard: DEMO_RECOVERY_CARD };
  }
  async getAddress() {
    return this.created ? DEMO_ADDRESS : null;
  }
  async sign(tx: UnsignedTransaction, _pin: string) {
    return tx.xdr;
  }
  async restoreAccount(recoveryCard: string, _newPin: string) {
    if (recoveryCard.trim() !== DEMO_RECOVERY_CARD) {
      throw new Error('La tarjeta de recuperación no es válida.');
    }
    this.created = true;
    return { address: DEMO_ADDRESS };
  }
}

export class SimulatedLotRegistry implements LotRegistryPort {
  private readonly lots = new Map<string, LotRecord>();

  async prepareRegisterLot(req: RegisterLotRequest) {
    return demoTx(`Registrar el lote ${req.code} (${req.volumeUnits} unidades de ${req.category}).`, { op: 'register_lot', req });
  }
  async submit(signedXdr: string) {
    const { req } = JSON.parse(decodeURIComponent(escape(atob(signedXdr)))) as { req: RegisterLotRequest };
    this.lots.set(req.code, {
      code: req.code,
      producerAddress: req.producerAddress,
      location: req.location,
      category: req.category,
      certified: false,
      registeredAt: Date.now(),
    });
    return demoReceipt();
  }
  async getLot(code: string) {
    const lot = this.lots.get(code);
    return lot ? { ...lot, source: 'simulated' as const } : null;
  }
}

export class SimulatedEscrow implements EscrowPort {
  private readonly escrows = new Map<string, MilestoneState[]>();

  private prepare(escrowId: string, index: number, next: MilestoneStatus, summary: string) {
    const milestones = this.escrows.get(escrowId);
    if (milestones && (index < 0 || index >= milestones.length)) {
      return Promise.reject(new Error(`El pago protegido no tiene un hito ${index + 1}.`));
    }
    return Promise.resolve(demoTx(summary, { escrowId, index, next }));
  }
  prepareCreate(req: CreateEscrowRequest) {
    const totalPercent = req.milestones.reduce((sum, m) => sum + m.percent, 0);
    if (req.milestones.length === 0 || totalPercent !== 100 || req.milestones.some((m) => m.percent <= 0)) {
      return Promise.reject(new Error('Los hitos del pago protegido deben ser mayores que 0 y sumar 100%.'));
    }
    const summary = `Crear un pago protegido de ${req.amount} ${req.asset.code} con ${req.milestones.length} ${req.milestones.length === 1 ? 'hito' : 'hitos'}.`;
    return Promise.resolve(demoTx(summary, { escrowId: req.orderId, count: req.milestones.length }));
  }
  async submitCreate(signedXdr: string): Promise<EscrowCreatedReceipt> {
    const { escrowId, count } = JSON.parse(decodeURIComponent(escape(atob(signedXdr)))) as { escrowId: string; count: number };
    this.escrows.set(escrowId, Array.from({ length: count }, () => ({ status: 'pending' as const })));
    return { ...demoReceipt(), escrowId };
  }
  prepareFund(escrowId: string, _buyerAddress: string) {
    return Promise.resolve(demoTx('Depositar el pago en el escrow.', { escrowId, index: -1, next: 'pending' }));
  }
  prepareMarkMilestoneDone(escrowId: string, milestoneIndex: number, _serviceProviderAddress: string) {
    return this.prepare(escrowId, milestoneIndex, 'done', `Marcar el hito ${milestoneIndex + 1} como enviado.`);
  }
  prepareApproveMilestone(escrowId: string, milestoneIndex: number, _approverAddress: string) {
    return this.prepare(escrowId, milestoneIndex, 'approved', `Aprobar el hito ${milestoneIndex + 1}.`);
  }
  prepareRelease(escrowId: string, milestoneIndex: number, _releaseSignerAddress: string) {
    if (this.escrows.get(escrowId)?.[milestoneIndex]?.status !== 'approved') {
      return Promise.reject(new Error('Solo se puede recibir un hito que el comprador ya aprobó.'));
    }
    return this.prepare(escrowId, milestoneIndex, 'released', `Recibir el pago del hito ${milestoneIndex + 1}.`);
  }
  prepareDispute(escrowId: string, milestoneIndex: number, _signerAddress: string) {
    return this.prepare(escrowId, milestoneIndex, 'disputed', `Abrir una disputa del hito ${milestoneIndex + 1}. Queda congelado hasta que se resuelva.`);
  }
  prepareResolveDispute(escrowId: string, milestoneIndex: number, _resolverAddress: string, receiverPercent: number) {
    if (!Number.isFinite(receiverPercent) || receiverPercent < 0 || receiverPercent > 100) {
      return Promise.reject(new Error('El porcentaje para la artesana debe estar entre 0 y 100.'));
    }
    return this.prepare(escrowId, milestoneIndex, 'resolved', `Resolver la disputa: ${receiverPercent}% a la artesana y ${100 - receiverPercent}% de regreso al comprador.`);
  }
  async submit(signedXdr: string) {
    const { escrowId, index, next } = JSON.parse(decodeURIComponent(escape(atob(signedXdr)))) as { escrowId: string; index: number; next: MilestoneStatus };
    const milestones = this.escrows.get(escrowId);
    if (milestones && index >= 0) milestones[index] = { ...milestones[index], status: next, ...(next === 'done' ? { doneAt: Date.now() } : {}) };
    return demoReceipt();
  }
  async getStatus(escrowId: string) {
    return { milestones: (this.escrows.get(escrowId) ?? []).map((m) => ({ ...m })), source: 'simulated' as const };
  }
}
