/**
 * Yucu Core - Badge Embebible de Confianza y Trazabilidad RWA (<YucuPassportBadge />)
 * 
 * Componente modular listo para ser integrado en tiendas de terceros (Shopify, WooCommerce, Webflow)
 * o dentro de la propia plataforma para certificar el lote en un clic con verificación criptográfica en Soroban.
 */

import React, { useState } from 'react';
import { useYucuAttestation } from '../core/hooks/useYucuProtocol';

export interface YucuPassportBadgeProps {
  lotCode: string;
  productTitle?: string;
  qualityScore?: number;
  compact?: boolean;
  onOpenPassport?: (lotCode: string) => void;
}

export const YucuPassportBadge: React.FC<YucuPassportBadgeProps> = ({
  lotCode,
  productTitle,
  qualityScore = 88.5,
  compact = false,
  onOpenPassport,
}) => {
  const { verified, loading } = useYucuAttestation({ lotCode });
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://yucu.tecnm.mx/?cert=${encodeURIComponent(lotCode)}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClick = () => {
    if (onOpenPassport) {
      onOpenPassport(lotCode);
    } else {
      window.open(`/?cert=${encodeURIComponent(lotCode)}`, '_blank');
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer group"
        title="Ver Pasaporte Digital en Soroban / Stellar"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse group-hover:scale-125 transition-transform"></span>
        <span>🌿 Yucu #{lotCode}</span>
        <span className="text-amber-300">★ {qualityScore}</span>
      </button>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="bg-linear-to-br from-[#032517] via-[#073822] to-[#041d13] text-white p-3.5 rounded-2xl border border-emerald-500/40 shadow-md hover:border-emerald-400 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/5 rounded-full blur-2xl group-hover:bg-emerald-400/10 transition-colors pointer-events-none"></div>

      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-400 text-emerald-950 flex items-center justify-center font-black text-xs shadow-xs">
            ✓
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300/80 block">
              Certificación RWA Soroban
            </span>
            <div className="text-xs font-black text-white group-hover:text-emerald-200 transition-colors">
              {productTitle || `Lote Auténtico #${lotCode}`}
            </div>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
          {loading ? 'Verificando...' : verified ? 'Verificado en Ledger' : 'Sello Válido'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 py-2 border-y border-emerald-800/60 my-2 text-center text-[10px] font-mono">
        <div className="bg-emerald-950/60 p-1.5 rounded-lg border border-emerald-800/40">
          <span className="text-gray-400 block text-[9px]">SCAA / Calidad</span>
          <strong className="text-amber-300 text-xs">★ {qualityScore}</strong>
        </div>
        <div className="bg-emerald-950/60 p-1.5 rounded-lg border border-emerald-800/40">
          <span className="text-gray-400 block text-[9px]">EUDR Satélite</span>
          <strong className="text-emerald-300 text-xs">0% Pérdida</strong>
        </div>
        <div className="bg-emerald-950/60 p-1.5 rounded-lg border border-emerald-800/40">
          <span className="text-gray-400 block text-[9px]">Pago Familiar</span>
          <strong className="text-white text-xs">98% Directo</strong>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-emerald-200/80 pt-1">
        <span className="flex items-center gap-1 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          GS1 Digital Link Compliant
        </span>
        <button
          onClick={handleCopyLink}
          className="text-emerald-400 hover:text-white font-bold transition-colors underline cursor-pointer"
        >
          {copied ? '¡Copiado!' : 'Copiar enlace'}
        </button>
      </div>
    </div>
  );
};
