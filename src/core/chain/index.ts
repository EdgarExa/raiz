/**
 * Punto de entrada de los puertos de Stellar / Trustless Work (ADR-003).
 * Hoy todo es de demostración. Cuando exista una implementación real, se elige aquí según la
 * configuración, y ningún componente de la UI tiene que cambiar.
 */
import { SimulatedEscrow, SimulatedLotRegistry, SimulatedWallet } from './SimulatedChain';
import type { EscrowPort, LotRegistryPort, WalletPort } from './ports';

export * from './ports';

export const chain: { wallet: WalletPort; lots: LotRegistryPort; escrow: EscrowPort } = {
  wallet: new SimulatedWallet(),
  lots: new SimulatedLotRegistry(),
  escrow: new SimulatedEscrow(),
};
