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
  /**
   * Firma una transacción preparada. Pide el PIN; la llave nunca sale del dispositivo.
   * Si la operación es de un contrato Soroban, firma la autorización (auth entry) de esta cuenta;
   * si además la cuenta es la que envía, firma el sobre completo.
   */
  sign(tx: UnsignedTransaction, pin: string): Promise<string>;
  /**
   * Recupera la cuenta en un teléfono nuevo con la tarjeta de recuperación en papel y un PIN nuevo.
   * Falla si la tarjeta no es válida. La tarjeta nunca se envía al servidor.
   */
  restoreAccount(recoveryCard: string, newPin: string): Promise<{ address: string }>;
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

/**
 * `register_lot` exige DOS firmas: la del nodo certificador (rol `certifier` del contrato) y la del productor.
 * Flujo (ADR-003, D6; issues #92 y #94): el servidor prepara la transacción y firma SOLO la
 * autorización del nodo certificador -> la cuenta fuente es la del productor, que firma el sobre en
 * su teléfono -> `submit` lo envía (el servidor puede envolverlo en un fee-bump sin modificarlo).
 * La llave del nodo certificador es de la plataforma (no de una persona) y vive solo en el `.env`
 * del servidor (`STELLAR_CERTIFIER_SECRET`). El servidor nunca firma por el productor.
 */
export interface LotRegistryPort {
  prepareRegisterLot(req: RegisterLotRequest): Promise<UnsignedTransaction>;
  submit(signedXdr: string): Promise<ChainReceipt>;
  getLot(code: string): Promise<(LotRecord & { source: ChainSource }) | null>;
}

// ─────────────────────────────── Escrow (Trustless Work) ───────────────────────────────

export interface EscrowMilestone {
  description: string;
  /** Porcentaje del monto total que libera este hito. Los hitos deben sumar 100. */
  percent: number;
}

export interface CreateEscrowRequest {
  orderId: string;
  buyerAddress: string;
  producerAddress: string;
  /** Cooperativa o persona que aprueba los hitos (no la plataforma). */
  approverAddress: string;
  /** Quien firma la liberación del pago al productor (no la plataforma). */
  releaseSignerAddress: string;
  /** Quien resuelve una disputa, p. ej. la asamblea o la cooperativa (no la plataforma). */
  disputeResolverAddress: string;
  amount: number;
  /** Activo de Stellar, p. ej. 'USDC'. */
  asset: string;
  milestones: EscrowMilestone[];
}

export type EscrowStatus = 'created' | 'funded' | 'milestone_approved' | 'released' | 'disputed' | 'refunded';

/** Comprobante de la creación de un escrow: incluye su ID, que solo se conoce después de enviarla. */
export interface EscrowCreatedReceipt extends ChainReceipt {
  /** ID del contrato de escrow (en Trustless Work, el `contractId`). Se usa en las demás operaciones. */
  escrowId: string;
}

export interface EscrowPort {
  prepareCreate(req: CreateEscrowRequest): Promise<UnsignedTransaction>;
  /** Envía la creación firmada y devuelve el ID del escrow. */
  submitCreate(signedXdr: string): Promise<EscrowCreatedReceipt>;
  prepareFund(escrowId: string, buyerAddress: string): Promise<UnsignedTransaction>;
  prepareApproveMilestone(escrowId: string, milestoneIndex: number, approverAddress: string): Promise<UnsignedTransaction>;
  prepareRelease(escrowId: string, releaseSignerAddress: string): Promise<UnsignedTransaction>;
  /** Abre una disputa (comprador o productor). Congela el pago hasta que se resuelva. */
  prepareDispute(escrowId: string, signerAddress: string): Promise<UnsignedTransaction>;
  /**
   * Resuelve una disputa: `producerPercent` (0 a 100) del saldo va al productor y el resto regresa
   * al comprador. Solo lo firma el `disputeResolverAddress` del escrow.
   */
  prepareResolveDispute(escrowId: string, resolverAddress: string, producerPercent: number): Promise<UnsignedTransaction>;
  /** Envía cualquier operación firmada que no sea la creación. */
  submit(signedXdr: string): Promise<ChainReceipt>;
  getStatus(escrowId: string): Promise<{ status: EscrowStatus; source: ChainSource }>;
}
