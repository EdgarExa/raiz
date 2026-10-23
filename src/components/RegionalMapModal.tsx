import React, { useState } from 'react';

interface RegionalMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCommunity?: (name: string) => void;
}

interface CommunityPoint {
  id: string;
  name: string;
  elevation: string;
  product: string;
  lotsCount: number;
  weather: string;
  solarDryingStatus: 'Excelente' | 'Favorable' | 'Alerta Lluvia';
  lat: string;
  lng: string;
  xPercent: number; // For clean map representation
  yPercent: number;
}

const COMMUNITIES: CommunityPoint[] = [
  {
    id: 'tlaxiaco',
    name: 'Heroica Ciudad de Tlaxiaco',
    elevation: '2,048 msnm',
    product: 'Centro de Acopio Central & Laboratorio Tec',
    lotsCount: 18,
    weather: '19°C · Humedad 48%',
    solarDryingStatus: 'Excelente',
    lat: '17.2714° N',
    lng: '97.6806° W',
    xPercent: 50,
    yPercent: 35,
  },
  {
    id: 'penasco',
    name: 'San Mateo Peñasco',
    elevation: '1,750 msnm',
    product: 'Café Arábica Typica Pluma',
    lotsCount: 9,
    weather: '21°C · Soleado',
    solarDryingStatus: 'Excelente',
    lat: '17.1820° N',
    lng: '97.5410° W',
    xPercent: 70,
    yPercent: 60,
  },
  {
    id: 'yucuhiti',
    name: 'Santa María Yucuhiti',
    elevation: '1,820 msnm',
    product: 'Café Estricta Altura & Miel Nativa',
    lotsCount: 12,
    weather: '18°C · Parcialmente nublado',
    solarDryingStatus: 'Favorable',
    lat: '17.0210° N',
    lng: '97.8120° W',
    xPercent: 25,
    yPercent: 75,
  },
  {
    id: 'nuyoo',
    name: 'Santiago Nuyoo',
    elevation: '1,680 msnm',
    product: 'Café de Sombra & Telar de Cintura',
    lotsCount: 7,
    weather: '22°C · Seco',
    solarDryingStatus: 'Excelente',
    lat: '17.0012° N',
    lng: '97.7710° W',
    xPercent: 40,
    yPercent: 82,
  },
  {
    id: 'chalcatongo',
    name: 'Chalcatongo de Hidalgo',
    elevation: '2,450 msnm',
    product: 'Miel de Flor de Ocote & Granos Nativos',
    lotsCount: 5,
    weather: '16°C · Frío templado',
    solarDryingStatus: 'Favorable',
    lat: '17.0310° N',
    lng: '97.5800° W',
    xPercent: 62,
    yPercent: 78,
  },
];

export const RegionalMapModal: React.FC<RegionalMapModalProps> = ({
  isOpen,
  onClose,
  onSelectCommunity,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<CommunityPoint>(COMMUNITIES[1]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#c1c8c2]/50 max-h-[90vh] flex flex-col relative"
      >
        {/* Header */}
        <div className="bg-[#1b3b2b] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-[#c7ebd4]">map</span>
            <div>
              <h3 id="map-title" className="text-[17px] font-bold tracking-tight">
                Mapa Comunitario de la Mixteca
              </h3>
              <p className="text-[11px] text-[#abcfb8]">
                Rutas de Acopio &amp; Centros de Secado Solar Tec
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 text-white flex items-center justify-center cursor-pointer transition-all"
            aria-label="Cerrar mapa"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Map Canvas / Diagram Container */}
        <div className="p-4 bg-[#f6f3ed] border-b border-[#c1c8c2]/40 relative">
          <div className="relative w-full h-56 bg-[#e9e4db] rounded-2xl overflow-hidden border border-[#c1c8c2]/60 shadow-inner flex items-center justify-center">
            {/* Topographic Contour Simulation Lines */}
            <svg
              className="absolute inset-0 w-full h-full opacity-35"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid-map" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#727973" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-map)" />
              <path
                d="M 20,80 Q 90,30 180,60 T 360,40"
                fill="none"
                stroke="#1b3b2b"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <path
                d="M 10,140 Q 120,110 200,160 T 380,130"
                fill="none"
                stroke="#a73918"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <path
                d="M 40,200 Q 150,180 260,210 T 370,190"
                fill="none"
                stroke="#1b3b2b"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            </svg>

            {/* Mountains Silhouette */}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#dcd6ca] to-transparent pointer-events-none" />

            {/* Hub Central Node: Tlaxiaco */}
            {COMMUNITIES.map((c) => {
              const isSelected = selectedPoint.id === c.id;
              const isHub = c.id === 'tlaxiaco';
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedPoint(c)}
                  style={{ left: `${c.xPercent}%`, top: `${c.yPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all z-10 ${
                    isSelected ? 'scale-110 z-20' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shadow-md transition-all ${
                      isHub
                        ? 'bg-[#032517] text-[#c7ebd4] ring-4 ring-emerald-200'
                        : isSelected
                        ? 'bg-[#a73918] text-white ring-4 ring-orange-200'
                        : 'bg-white text-[#032517] border border-[#c1c8c2]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isHub ? 'hub' : 'spa'}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 shadow-2xs whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-[#032517] text-white'
                        : 'bg-white/90 text-[#1c1c18] border border-[#c1c8c2]/50'
                    }`}
                  >
                    {c.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-2 text-[11px] text-[#727973]">
            <span>Toque cualquier nodo para ver condiciones de acopio</span>
            <span className="text-[#a73918] font-bold">5 micro-regiones activas</span>
          </div>
        </div>

        {/* Selected Community Detail Panel */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-[13px]">
          <div className="bg-[#fcf9f3] p-3.5 rounded-2xl border border-[#c1c8c2]/50 space-y-1.5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#a73918]">
                  Zona de Producción Verificada
                </span>
                <h4 className="text-[16px] font-bold text-[#032517]">{selectedPoint.name}</h4>
              </div>
              <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-[#c1c8c2]/60 text-[#424843]">
                {selectedPoint.elevation}
              </span>
            </div>
            <p className="text-[12px] text-[#424843]">
              <strong>Vocación:</strong> {selectedPoint.product}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <div className="p-2.5 rounded-xl bg-[#f0eee8] border border-[#c1c8c2]/30">
              <span className="text-[#727973] block text-[11px]">Pronóstico de Secado</span>
              <span className="font-bold text-[#032517] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-amber-600">
                  wb_sunny
                </span>
                {selectedPoint.solarDryingStatus}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#f0eee8] border border-[#c1c8c2]/30">
              <span className="text-[#727973] block text-[11px]">Lotes en Trazabilidad</span>
              <span className="font-bold text-[#032517] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-700">
                  inventory_2
                </span>
                {selectedPoint.lotsCount} lotes amparados
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#f0eee8] border border-[#c1c8c2]/30">
              <span className="text-[#727973] block text-[11px]">Clima en Parcela</span>
              <span className="font-bold text-[#032517]">{selectedPoint.weather}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#f0eee8] border border-[#c1c8c2]/30">
              <span className="text-[#727973] block text-[11px]">Coordenadas GPS</span>
              <span className="font-mono text-[11px] text-[#424843]">
                {selectedPoint.lat}, {selectedPoint.lng}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#c1c8c2]/30 flex gap-2">
          {onSelectCommunity && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectCommunity(selectedPoint.name);
              }}
              className="flex-1 h-11 bg-[#032517] hover:bg-[#1b3b2b] text-white rounded-full font-bold text-[13px] flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">near_me</span>
              <span>Filtrar Lotes de {selectedPoint.name.split(' ')[0]}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-11 border border-[#c1c8c2] text-[#424843] rounded-full font-bold text-[13px] hover:bg-[#f0eee8] active:scale-98 transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
