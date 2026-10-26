/**
 * Puertos de la arquitectura no custodial (docs/adr/ADR-003-NO-CUSTODIAL-Y-TRUSTLESS-WORK.md).
 *
 * La interfaz de usuario SOLO usa estos puertos. Nunca importa @stellar/stellar-sdk ni llama a
 * Trustless Work directamente. Patrón de toda operación: preparar -> firmar en el teléfono -> enviar.
 *
 * Implementaciones:
 *  - SimulatedChain (demostración, ya existe): marca todo con source 'simulated'.
 *  - Implementaciones reales: las construyen los estudiantes en las issues de la Wave.
 */

/** De dónde viene un resultado. Si es 'simulated', la UI debe mostrar <DemoBadge />. */
export type ChainSource = 'testnet' | 'simulated';

/** Comprobante de una transacción enviada a la red (o simulada). */
export interface ChainReceipt {
  source: ChainSource;
  txHash: string;
  ledger: number;
  /** Enlace al explorador (stellar.expert) o null si es simulado. */
  explorerUrl: string | null;
}

/** Transacción preparada SIN firmar (XDR en base64) que el usuario firmará en su dispositivo. */
export interface UnsignedTransaction {
  xdr: string;
  networkPassphrase: string;
  /** Texto en lenguaje sencillo de lo que la persona está a punto de firmar. */
  summary: string;
}

// ─────────────────────────────── Billetera (en el teléfono) ───────────────────────────────

/**
 * La llave privada vive SOLO en el dispositivo, cifrada con el PIN de la persona.
 * Ningún método devuelve ni envía la llave secreta.
 */
export interface WalletPort {
  /** ¿Ya hay una cuenta creada en este dispositivo? */
  hasAccount(): Promise<boolean>;
  /** Crea la cuenta en el dispositivo y devuelve su dirección pública (G...). */
  createAccount(pin: string): Promise<{ address: string; recoveryCard: string }>;
  /** Dirección pública de la cuenta del dispositivo, o null si no hay. */
  getAddress(): Promise<string | null>;
  /** Firma una transacción preparada. Pide el PIN; la llave nunca sale del dispositivo. */
  sign(tx: UnsignedTransaction, pin: string): Promise<string>;
}

// ─────────────────────────────── Registro de lotes (lot_passport) ───────────────────────────────

export interface RegisterLotRequest {
  code: string;
  /** Dirección pública del productor (de su WalletPort), nunca su nombre. */
  producerAddress: string;
  /** Comunidad o región, nunca un domicilio. */
  location: string;
  category: string;
  variety: string;
  volumeUnits: number;
  /** SHA-256 en hexadecimal de la evidencia (CryptoEngine). */
  photoHashHex: string;
}

export interface LotRecord {
  code: string;
  producerAddress: string;
  location: string;
  category: string;
  certified: boolean;
  registeredAt: number;
}

export interface LotRegistryPort {
  prepareRegisterLot(req: RegisterLotRequest): Promise<UnsignedTransaction>;
  submit(signedXdr: string): Promise<ChainReceipt>;
  getLot(code: string): Promise<(LotRecord & { source: ChainSource }) | null>;
}

// ─────────────────────────────── Escrow (Trustless Work) ───────────────────────────────

export interface EscrowMilestone {
  description: string;
  /** Porcentaje del monto total que libera este hito. */
  percent: number;
}

export interface CreateEscrowRequest {
  orderId: string;
  buyerAddress: string;
  producerAddress: string;
  /** Cooperativa o persona que aprueba los hitos (no la plataforma). */
  approverAddress: string;
  amount: number;
  /** Activo de Stellar, p. ej. 'USDC'. */
  asset: string;
  milestones: EscrowMilestone[];
}

export type EscrowStatus = 'created' | 'funded' | 'milestone_approved' | 'released' | 'disputed' | 'refunded';

export interface EscrowPort {
  prepareCreate(req: CreateEscrowRequest): Promise<UnsignedTransaction>;
  prepareFund(escrowId: string, buyerAddress: string): Promise<UnsignedTransaction>;
  prepareApproveMilestone(escrowId: string, milestoneIndex: number, approverAddress: string): Promise<UnsignedTransaction>;
  prepareRelease(escrowId: string, releaseSignerAddress: string): Promise<UnsignedTransaction>;
  submit(signedXdr: string): Promise<ChainReceipt>;
  getStatus(escrowId: string): Promise<{ status: EscrowStatus; source: ChainSource }>;
}
