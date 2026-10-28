import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ProductItem, ScreenView } from '../types';
import { ProductDetailModal } from './ProductDetailModal';
import { startAudioRecording, LiveRecorderSession } from '../utils/audioRecorder';

interface BuyerShowcaseScreenProps {
  products: ProductItem[];
  onNavigateScreen: (screen: ScreenView) => void;
  onSelectProductDetails?: (product: ProductItem) => void;
  onAddToCart: (
    item: {
      id: string;
      title: string;
      price: number;
      artisanName: string;
      location: string;
      imageUrl: string;
      quantity: number;
      unit: string;
    },
    openModal?: boolean
  ) => void;
  onDirectContact: (artisanName: string, productTitle: string) => void;
  onOpenBuyerIssueModal?: () => void;
  onViewPassport?: (product: ProductItem) => void;
}

export const BuyerShowcaseScreen: React.FC<BuyerShowcaseScreenProps> = ({
  products,
  onNavigateScreen,
  onSelectProductDetails,
  onAddToCart,
  onDirectContact,
  onOpenBuyerIssueModal,
  onViewPassport
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos los ramos');
  const [selectedLocation, setSelectedLocation] = useState('Toda la Mixteca');
  const [modalProduct, setModalProduct] = useState<ProductItem | null>(null);

  // Estados para Compra Asistida por Voz (Voice Commerce)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioVolume, setAudioVolume] = useState(0);
  const [liveVoiceTranscript, setLiveVoiceTranscript] = useState('');
  const [voiceToast, setVoiceToast] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const audioSessionRef = useRef<LiveRecorderSession | null>(null);
  const timerRef = useRef<any>(null);

  // Limpiar timer y sesión de audio al desmontar
  useEffect(() => {
    return () => {
      if (audioSessionRef.current) {
        audioSessionRef.current.cancel();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleVoiceCommand = (spokenText: string) => {
    const clean = spokenText
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

    if (!clean) return;

    const isBuyIntent =
      clean.includes('comprar') ||
      clean.includes('quiero') ||
      clean.includes('adquirir') ||
      clean.includes('encargar') ||
      clean.includes('ordenar') ||
      clean.includes('llevo') ||
      clean.includes('compro') ||
      clean.includes('pactar') ||
      clean.includes('pedir');

    // Matching products by keywords
    const matchedProduct = products.find((p) => {
      const pTitle = p.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const pCat = p.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if (clean.includes(pTitle)) return true;
      if (clean.includes('cafe') && pCat.includes('cafe')) return true;
      if (
        (clean.includes('sombrero') || clean.includes('palma')) &&
        (pTitle.includes('sombrero') || pCat.includes('palma'))
      )
        return true;
      if (clean.includes('tenate') && pTitle.includes('tenate')) return true;
      if (
        (clean.includes('barro') || clean.includes('mezcalero') || clean.includes('cantaro')) &&
        pCat.includes('barro')
      )
        return true;
      if (
        (clean.includes('huipil') ||
          clean.includes('textil') ||
          clean.includes('rebozo') ||
          clean.includes('telar')) &&
        (pCat.includes('textil') || pTitle.includes('huipil') || pTitle.includes('rebozo'))
      )
        return true;
      if (clean.includes('miel') && pCat.includes('miel')) return true;
      return false;
    });

    if (isBuyIntent && matchedProduct) {
      setVoiceToast(
        `🎉 ¡Comando de compra por voz reconocido! Abriendo orden para "${matchedProduct.title}" ($${matchedProduct.price} MXN)...`
      );
      setTimeout(() => {
        onAddToCart(
          {
            id: matchedProduct.id,
            title: matchedProduct.title,
            price: matchedProduct.price,
            artisanName: matchedProduct.artisanName,
            location: matchedProduct.location,
            imageUrl: matchedProduct.imageUrl,
            quantity: 1,
            unit: 'pieza'
          },
          true
        );
      }, 700);
      return;
    }

    // Filtrados rápidos por categoría
    if (clean.includes('cafe')) {
      setSelectedCategory('Café de Altura');
      setSearchQuery('');
      setVoiceToast('Filtrado por voz: Categoría Café de Altura');
      return;
    }
    if (clean.includes('palma') || clean.includes('sombrero') || clean.includes('tenate')) {
      setSelectedCategory('Tejido de Palma');
      setSearchQuery('');
      setVoiceToast('Filtrado por voz: Categoría Tejido de Palma');
      return;
    }
    if (clean.includes('barro') || clean.includes('mezcalero')) {
      setSelectedCategory('Barro Rojo y Bruñido');
      setSearchQuery('');
      setVoiceToast('Filtrado por voz: Categoría Barro Rojo y Bruñido');
      return;
    }
    if (
      clean.includes('textil') ||
      clean.includes('huipil') ||
      clean.includes('rebozo') ||
      clean.includes('telar')
    ) {
      setSelectedCategory('Textiles & Telar');
      setSearchQuery('');
      setVoiceToast('Filtrado por voz: Categoría Textiles & Telar');
      return;
    }
    if (clean.includes('miel')) {
      setSelectedCategory('Miel y Derivados');
      setSearchQuery('');
      setVoiceToast('Filtrado por voz: Categoría Miel y Derivados');
      return;
    }

    // Búsqueda textual por voz
    setSearchQuery(spokenText);
    setVoiceToast(`Búsqueda por voz ejecutada: "${spokenText}"`);
  };

  const toggleVoiceRecording = async () => {
    if (isRecording) {
      // STOP recording
      setIsRecording(false);
      setAudioVolume(0);
      if (timerRef.current) clearInterval(timerRef.current);

      if (audioSessionRef.current) {
        try {
          const result = await audioSessionRef.current.stop();
          audioSessionRef.current = null;
          const finalTranscript = (result.transcript || liveVoiceTranscript || '').trim();
          if (finalTranscript) {
            handleVoiceCommand(finalTranscript);
          } else {
            setVoiceToast('No se escuchó ningún comando. Intenta de nuevo.');
            setTimeout(() => setVoiceToast(null), 3000);
          }
        } catch (err) {
          console.error('Error deteniendo grabación:', err);
        }
      }
    } else {
      // START recording
      setMicError(null);
      setVoiceToast(null);
      setLiveVoiceTranscript('');
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((sec) => sec + 1);
      }, 1000);

      try {
        const session = await startAudioRecording({
          onVolumeChange: (vol) => setAudioVolume(vol),
          onInterimTranscript: (text) => {
            setLiveVoiceTranscript(text);
          },
          lang: 'es-MX'
        });
        audioSessionRef.current = session;
        setIsRecording(true);
      } catch (err: any) {
        console.warn('Permiso de micrófono denegado:', err);
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setMicError('Permiso de micrófono no otorgado. Por favor permite el acceso en tu navegador.');
      }
    }
  };

  const categories = [
    { id: 'Todos los ramos', label: 'Todos los ramos', icon: 'auto_awesome' },
    { id: 'Tejido de Palma', label: 'Tejido de Palma', icon: 'local_florist' },
    { id: 'Café de Altura', label: 'Café de Altura', icon: 'coffee' },
    { id: 'Barro Rojo y Bruñido', label: 'Barro Rojo y Bruñido', icon: 'soup_kitchen' },
    { id: 'Textiles & Telar', label: 'Textiles & Telar', icon: 'styler' },
    { id: 'Miel y Derivados', label: 'Miel y Derivados', icon: 'hive' }
  ];

  const municipalities = [
    'Toda la Mixteca',
    'Tlaxiaco',
    'Huajuapan',
    'Juxtlahuaca',
    'Nochixtlán',
    'Atatlahuca',
    'Chalcatongo'
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'Todos los ramos' || p.category === selectedCategory;

      const matchesLoc =
        selectedLocation === 'Toda la Mixteca' ||
        p.location.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesCat && matchesLoc;
    });
  }, [products, searchQuery, selectedCategory, selectedLocation]);

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 pt-3 pb-32">
      {/* Hero Banner */}
      <section className="mb-4 bg-[#f6f3ed] rounded-2xl p-4 border border-[#c1c8c2]/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 shrink-0 rounded-full bg-[#1b3b2b] text-white flex items-center justify-center mt-0.5 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">storefront</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ffdbd1] text-[#3b0900]">
                C1 Vitrina Comunitaria
              </span>
              <span className="text-xs text-[#424843]">Región Mixteca Oaxaqueña</span>
            </div>
            <h2 className="text-[22px] font-bold text-[#032517] leading-tight">
              Artesanías y Productos de Origen
            </h2>
            <p className="text-[14px] text-[#424843] mt-1 leading-relaxed">
              Trato directo con los maestros artesanos vía mensajes asistidos. Sin intermediarios.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="shrink-0 flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-[#c1c8c2]/40">
            <span className="material-symbols-outlined text-[#a73918]">verified_user</span>
            <div className="text-left">
              <p className="text-[13px] font-bold text-[#032517] leading-tight">100% Directo</p>
              <p className="text-[11px] text-[#424843]">Sin comisiones</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar with Voice Shopping */}
      <section className="mb-5 space-y-2.5">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#727973]">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </div>
            <input
              className="w-full h-12 pl-12 pr-12 rounded-full bg-white text-[#1c1c18] placeholder:text-[#424843]/60 border border-[#c1c8c2]/60 focus:border-[#032517] focus:ring-1 focus:ring-[#032517] text-[15px] shadow-xs transition-all outline-none"
              placeholder="Buscar pieza o decir 'Quiero comprar café'..."
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-1.5 right-3 w-8 h-8 rounded-full flex items-center justify-center text-[#727973] hover:bg-[#f0eee8]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Botón de Micrófono: Compra por Voz */}
          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`h-12 px-4 rounded-full font-bold text-[13px] flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0 ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse border-2 border-rose-300'
                : 'bg-[#032517] hover:bg-[#073824] text-white border border-emerald-500/40'
            }`}
            title="Comprar o buscar usando tu voz (ej: 'Quiero comprar café')"
          >
            <span className="material-symbols-outlined text-[20px] text-amber-300">
              {isRecording ? 'graphic_eq' : 'mic'}
            </span>
            <span className="hidden sm:inline">
              {isRecording ? 'Escuchando...' : 'Comprar por Voz'}
            </span>
          </button>
        </div>

        {/* Panel de Grabación de Voz en Vivo */}
        {isRecording && (
          <div className="p-3 bg-[#032517] text-white rounded-2xl border-2 border-emerald-400 shadow-md flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[12px] font-black text-emerald-300">
                    Micrófono Activo {recordingSeconds > 0 ? `(${recordingSeconds}s)` : ''}
                  </p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((bar) => (
                      <span
                        key={bar}
                        className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
                        style={{
                          height: `${Math.max(4, Math.min(16, (audioVolume / 255) * 16 * (bar / 2)))}px`
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[12px] text-emerald-100 font-medium truncate mt-0.5">
                  {liveVoiceTranscript ? `"${liveVoiceTranscript}"` : 'Habla ahora: Di "Quiero comprar un sombrero" o "Café de altura"...'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-black shrink-0 cursor-pointer shadow-xs active:scale-95"
            >
              Listo / Procesar
            </button>
          </div>
        )}

        {/* Notificación de Comando por Voz Reconocido */}
        {voiceToast && (
          <div className="p-2.5 bg-emerald-950 text-emerald-100 rounded-2xl border border-emerald-500/60 text-[12px] flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-400">
                record_voice_over
              </span>
              <span className="font-medium">{voiceToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setVoiceToast(null)}
              className="text-emerald-400 hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Error de Micrófono */}
        {micError && (
          <div className="p-2.5 bg-rose-950 text-rose-100 rounded-2xl border border-rose-500/60 text-[12px] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-rose-400">mic_off</span>
              <span>{micError}</span>
            </div>
            <button
              type="button"
              onClick={() => setMicError(null)}
              className="text-rose-400 hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Category Pills */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] text-[#424843] flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px]">category</span> Tipo de producto:
            </span>
            <span
              onClick={() => setSelectedCategory('Todos los ramos')}
              className="text-xs text-[#a73918] font-bold cursor-pointer hover:underline"
            >
              Ver todos ({products.length})
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 h-9 px-3.5 rounded-full text-[13px] flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#032517] text-white font-bold shadow-xs'
                    : 'bg-white hover:bg-[#f0eee8] border border-[#c1c8c2]/50 text-[#1c1c18]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    selectedCategory === cat.id ? 'text-white' : 'text-[#a73918]'
                  }`}
                >
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Municipality Pills */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] text-[#424843] flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px]">pin_drop</span> Municipio / Comunidad:
            </span>
            <span className="text-xs text-[#032517] font-semibold">Mixteca Oaxaqueña</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {municipalities.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setSelectedLocation(loc)}
                className={`shrink-0 h-8 px-3 rounded-full text-[12px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                  selectedLocation === loc
                    ? 'bg-[#fe7952] text-[#6c1900] font-bold shadow-xs'
                    : 'bg-[#f6f3ed] hover:bg-[#f0eee8] text-[#424843] border border-[#c1c8c2]/40'
                }`}
              >
                {selectedLocation === loc && (
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                )}
                <span>{loc}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((prod) => (
          <article
            key={prod.id}
            className="bg-white rounded-2xl border border-[#c1c8c2]/40 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
          >
            {/* Card Image */}
            <div
              onClick={() => setModalProduct(prod)}
              className="relative w-full h-56 overflow-hidden bg-[#f0eee8] cursor-pointer"
            >
              <img
                src={prod.imageUrl}
                alt={prod.imageAlt || prod.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {prod.badge && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#fcf9f3]/90 backdrop-blur-sm text-[#032517] text-[11px] font-bold shadow-xs flex items-center gap-1 border border-[#c1c8c2]/30">
                  <span className="material-symbols-outlined text-[14px] text-[#a73918]">star</span>
                  {prod.badge}
                </span>
              )}
              <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#032517] text-white text-[15px] font-bold shadow-md">
                ${prod.price} MXN
              </span>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div onClick={() => setModalProduct(prod)} className="cursor-pointer">
                <div className="flex items-center gap-1.5 text-xs text-[#a73918] font-bold mb-1">
                  <span className="material-symbols-outlined text-[14px]">local_florist</span>
                  {prod.craftType}
                </div>
                <h3 className="text-[18px] font-bold text-[#032517] group-hover:text-[#a73918] transition-colors leading-snug">
                  {prod.title}
                </h3>
                <p className="text-[13px] text-[#424843] line-clamp-2 mt-1 leading-relaxed">
                  {prod.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#c1c8c2]/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#ffdbd1] text-[#3b0900] flex items-center justify-center font-bold text-xs">
                      {prod.artisanInitials}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1c1c18] leading-none">
                        {prod.artisanName}
                      </p>
                      <p className="text-[11px] text-[#424843] flex items-center gap-0.5 mt-0.5">
                        <span className="material-symbols-outlined text-[13px] text-[#a73918]">
                          pin_drop
                        </span>
                        {prod.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f0eee8] text-[#424843] font-semibold">
                    {prod.stock}
                  </span>
                </div>

                {/* Action Buttons: 1 Clic Directo a Comprar */}
                <div className="space-y-2 pt-1">
                  {/* Botón Principal: Comprar Directo en la App (Abre pago en 1 clic) */}
                  <button
                    type="button"
                    onClick={() =>
                      onAddToCart(
                        {
                          id: prod.id,
                          title: prod.title,
                          price: prod.price,
                          artisanName: prod.artisanName,
                          location: prod.location,
                          imageUrl: prod.imageUrl,
                          quantity: 1,
                          unit: 'pieza'
                        },
                        true
                      )
                    }
                    className="w-full h-11 rounded-full bg-[#a73918] hover:bg-[#8c2d12] active:scale-98 text-white text-[13.5px] font-black flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[19px]">payments</span>
                    <span>Comprar Directo (${prod.price} MXN)</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Botón 2: Pactar por WhatsApp Directo */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `¡Hola ${prod.artisanName}! Vi su producto "${prod.title}" ($${prod.price} MXN) en Yucu y me interesa comprarlo directamente con usted. ¿Cómo acordamos el pago y la entrega?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-10 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white text-[12.5px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px]">chat</span>
                      <span>O por WhatsApp</span>
                    </a>

                    {/* Botón 3: Ver Detalles */}
                    <button
                      type="button"
                      onClick={() => setModalProduct(prod)}
                      className="h-10 px-3.5 rounded-full bg-[#f0eee8] hover:bg-[#ebe8e2] text-[#032517] text-[12px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shrink-0"
                      title="Ver detalles completos del producto"
                    >
                      <span className="material-symbols-outlined text-[17px]">visibility</span>
                      <span>Detalles</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Special Custom Order Callout */}
      <section className="mt-8 p-4 rounded-2xl bg-[#f0eee8] border border-[#c1c8c2]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#a73918] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">question_answer</span>
          </div>
          <div>
            <h4 className="text-[16px] font-bold text-[#032517]">
              ¿Buscas una pieza personalizada o mayoreo?
            </h4>
            <p className="text-[13px] text-[#424843] mt-0.5 leading-relaxed">
              Nuestro bot rural enlazará tu solicitud directamente con el taller comunitario indicado.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDirectContact('Taller Comunitario', 'Pieza especial o mayoreo')}
          className="w-full sm:w-auto shrink-0 h-11 px-5 rounded-full bg-[#a73918] hover:bg-[#6c1900] text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">support_agent</span>
          <span>Solicitar pieza especial</span>
        </button>
      </section>
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onAddToCart={onAddToCart}
        onDirectContact={onDirectContact}
        onViewPassport={onViewPassport}
      />
    </main>
  );
};
