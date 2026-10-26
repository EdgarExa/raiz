import React from 'react';

interface DemoBadgeProps {
  /** Qué parte de la pantalla es simulada; se muestra al pasar el cursor. */
  detail?: string;
}

/**
 * Etiqueta visible para resultados simulados (ver la tabla "Qué es real y qué es simulado" del README).
 * Úsala en toda pantalla cuyo resultado no venga de una fuente real: pagos, escrow, certificaciones,
 * oráculos de IA basados en reglas, autenticación de prueba y métricas fijas.
 */
export const DemoBadge: React.FC<DemoBadgeProps> = ({ detail }) => (
  <span
    className="text-[10px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-wide shrink-0 bg-[#ffdbd1] text-[#6e2410] border border-[#f5b8a6]"
    title={detail ?? 'Resultado simulado: todavía no proviene de una fuente real.'}
  >
    Demostración
  </span>
);
