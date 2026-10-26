/**
 * Porcentajes oficiales del protocolo. Fuente única para UI, motores y documentación.
 * Deben coincidir con las constantes de los contratos Soroban:
 *   - contracts/perpetual_royalties/src/lib.rs  (ARTISAN_ROYALTY_BPS = 1000, TEQUIO_COMMUNAL_BPS = 200)
 *   - contracts/fair_escrow/src/lib.rs          (TEQUIO_BPS = 200)
 * Si cambias un valor aquí, cámbialo también en los contratos y en el README.
 */
export const PROTOCOL_FEES = {
  /** Regalía a la artesana original en cada reventa que pasa por el contrato. */
  artisanResaleRoyaltyPct: 10,
  /** Fondo comunitario Tequio en cada reventa. */
  resaleTequioPct: 2,
  /** Fondo comunitario Tequio al liberar un escrow de compra directa (se descuenta del pago). */
  escrowTequioPct: 2,
} as const;
