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
  EscrowStatus,
  LotRecord,
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
  private readonly status = new Map<string, EscrowStatus>();

  private prepare(escrowId: string, next: EscrowStatus, summary: string) {
    return Promise.resolve(demoTx(summary, { escrowId, next }));
  }
  prepareCreate(req: CreateEscrowRequest) {
    const totalPercent = req.milestones.reduce((sum, m) => sum + m.percent, 0);
    if (req.milestones.length === 0 || totalPercent !== 100) {
      return Promise.reject(new Error('Los hitos del pago protegido deben sumar 100%.'));
    }
    return this.prepare(req.orderId, 'created', `Crear un pago protegido de ${req.amount} ${req.asset} con ${req.milestones.length} hitos.`);
  }
  async submitCreate(signedXdr: string): Promise<EscrowCreatedReceipt> {
    const { escrowId } = JSON.parse(decodeURIComponent(escape(atob(signedXdr)))) as { escrowId: string };
    this.status.set(escrowId, 'created');
    return { ...demoReceipt(), escrowId };
  }
  prepareFund(escrowId: string, _buyerAddress: string) {
    return this.prepare(escrowId, 'funded', 'Depositar el pago en el escrow.');
  }
  prepareApproveMilestone(escrowId: string, milestoneIndex: number, _approverAddress: string) {
    return this.prepare(escrowId, 'milestone_approved', `Aprobar el hito ${milestoneIndex + 1}.`);
  }
  prepareRelease(escrowId: string, _releaseSignerAddress: string) {
    return this.prepare(escrowId, 'released', 'Liberar el pago al productor.');
  }
  prepareDispute(escrowId: string, _signerAddress: string) {
    return this.prepare(escrowId, 'disputed', 'Abrir una disputa. El pago queda congelado hasta que se resuelva.');
  }
  prepareResolveDispute(escrowId: string, _resolverAddress: string, producerPercent: number) {
    if (!Number.isFinite(producerPercent) || producerPercent < 0 || producerPercent > 100) {
      return Promise.reject(new Error('El porcentaje para el productor debe estar entre 0 y 100.'));
    }
    const next: EscrowStatus = producerPercent === 0 ? 'refunded' : 'released';
    return this.prepare(escrowId, next, `Resolver la disputa: ${producerPercent}% al productor y ${100 - producerPercent}% de regreso al comprador.`);
  }
  async submit(signedXdr: string) {
    const { escrowId, next } = JSON.parse(decodeURIComponent(escape(atob(signedXdr)))) as { escrowId: string; next: EscrowStatus };
    this.status.set(escrowId, next);
    return demoReceipt();
  }
  async getStatus(escrowId: string) {
    return { status: this.status.get(escrowId) ?? 'created', source: 'simulated' as const };
  }
}
