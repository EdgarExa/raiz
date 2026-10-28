import React, { useState } from 'react';
import { PRESET_USERS, RaizAuthEngine, UserProfile, UserRole } from '../core/auth/RaizAuthEngine';
import { SupportedCountry } from '../core/settlement/HybridSettlementOrchestrator';
import { DemoBadge } from './DemoBadge';

interface RaizAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChanged: (user: UserProfile) => void;
}

export const RaizAuthModal: React.FC<RaizAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role || 'productor');
  const [loginTab, setLoginTab] = useState<'phone' | 'carnet' | 'passkey' | 'presets'>('phone');
  
  // Phone OTP state
  const [phoneCountry, setPhoneCountry] = useState<SupportedCountry>(currentUser.country || 'MX');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phone || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedStellar, setCopiedStellar] = useState(false);

  // Student login state
  const [studentMatricula, setStudentMatricula] = useState('TECNM-TLX-2208194');

  // Buyer login state
  const [buyerEmail, setBuyerEmail] = useState('compras@tierravivacafe.com');

  if (!isOpen) return null;

  const countryPrefixes: Record<SupportedCountry, { code: string; flag: string; name: string; example: string }> = {
    MX: { code: '+52', flag: '🇲🇽', name: 'México', example: '953 124 8841' },
    BO: { code: '+591', flag: '🇧🇴', name: 'Bolivia', example: '7 884 1920' },
    BR: { code: '+55', flag: '🇧🇷', name: 'Brasil', example: '35 99812 4021' },
  };

  const handleSendOtp = () => {
    if (!phoneNumber.trim()) {
      setOtpError('Por favor ingresa un número de teléfono válido');
      return;
    }
    setOtpError(null);
    setOtpSent(true);
    setOtpCode('');
  };

  const handleVerifyOtp = () => {
    if (otpCode !== '7421' && otpCode.length < 4) {
      setOtpError('Código de verificación inválido. Usa el código de prueba: 7421');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const fullPhone = `${countryPrefixes[phoneCountry].code} ${phoneNumber}`;
      const user = RaizAuthEngine.verifyPhoneOtp(fullPhone, otpCode, phoneCountry);
      onUserChanged(user);
      onClose();
    }, 800);
  };

  const handleSelectPreset = (user: UserProfile) => {
    RaizAuthEngine.setActiveUser(user);
    onUserChanged(user);
    onClose();
  };

  const handlePasskeyLogin = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Login with biometrics
      const user = PRESET_USERS.find(u => u.country === phoneCountry) || PRESET_USERS[0];
      const active = { ...user, loginMethod: 'passkey_biometric' as const, authenticatedAt: Date.now() };
      RaizAuthEngine.setActiveUser(active);
      onUserChanged(active);
      onClose();
    }, 900);
  };

  const handleCarnetScan = (carnetFolio: string) => {
    const user = RaizAuthEngine.authenticateWithCarnetQr(carnetFolio);
    onUserChanged(user);
    onClose();
  };

  const handleCopyStellarKey = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUser.stellarPublicKey);
      setCopiedStellar(true);
      setTimeout(() => setCopiedStellar(false), 2000);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#fcf9f3] rounded-3xl overflow-hidden shadow-2xl border border-[#c1c8c2]/50 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-linear-to-r from-[#032517] to-[#1b3b2b] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <span className="material-symbols-outlined text-[26px]">fingerprint</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-[17px] font-black tracking-tight text-white">Identidad Yucu</h3>
                <DemoBadge detail="Inicio de sesión de prueba: el código OTP es fijo y las cuentas Stellar no son reales." />
                <span className="text-[10px] bg-amber-400 text-neutral-950 font-black px-1.5 py-0.5 rounded-md uppercase">
                  Sin Contraseñas
                </span>
              </div>
              <p className="text-[12px] text-emerald-200">Acceso inclusivo rural y orquestación multimoneda</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Current User Card */}
        <div className="p-4 bg-white border-b border-[#c1c8c2]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px]">
                  {countryPrefixes[currentUser.country]?.flag || '🇲🇽'}
                </span>
                <span className="text-[14px] font-extrabold text-[#032517] leading-tight">
                  {currentUser.name}
                </span>
              </div>
              <p className="text-[11px] text-[#424843]">
                {currentUser.community} · {currentUser.craftOrCrop}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.2 rounded-full">
                  {currentUser.role === 'productor'
                    ? 'Campesino / Artesano'
                    : currentUser.role === 'estudiante_tecnm'
                    ? 'Estudiante TecNM'
                    : 'Comprador'}
                </span>
                {currentUser.carnetFolio && (
                  <span className="text-[10px] text-[#727973] font-mono">
                    Carnet: {currentUser.carnetFolio}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-800 font-extrabold block">Billetera Stellar</span>
            <button
              type="button"
              onClick={handleCopyStellarKey}
              className="text-[11px] font-mono bg-[#f0eee8] hover:bg-[#ebe8e2] px-2 py-1 rounded-md text-[#032517] flex items-center gap-1 cursor-pointer transition-colors"
              title="Copiar clave pública Stellar abstraída"
            >
              <span>{currentUser.stellarPublicKey.slice(0, 4)}...{currentUser.stellarPublicKey.slice(-4)}</span>
              <span className="material-symbols-outlined text-[14px]">
                {copiedStellar ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* Role Selector Tabs */}
          <div>
            <label className="text-[11px] font-bold text-[#424843] uppercase tracking-wider block mb-1.5">
              1. Selecciona tu Rol en el Ecosistema
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('productor')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  selectedRole === 'productor'
                    ? 'bg-[#032517] text-white border-[#032517] shadow-sm scale-[1.02]'
                    : 'bg-white text-[#424843] border-[#c1c8c2]/60 hover:bg-[#f0eee8]'
                }`}
              >
                <span className="text-[20px]">👨‍🌾</span>
                <span className="text-[12px] font-bold">Productor / Artesano</span>
                <span className="text-[9.5px] opacity-80 leading-tight">Mixteca · Yungas · Minas</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('estudiante_tecnm')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  selectedRole === 'estudiante_tecnm'
                    ? 'bg-[#0e7490] text-white border-[#0e7490] shadow-sm scale-[1.02]'
                    : 'bg-white text-[#424843] border-[#c1c8c2]/60 hover:bg-[#f0eee8]'
                }`}
              >
                <span className="text-[20px]">🎓</span>
                <span className="text-[12px] font-bold">Estudiante TecNM</span>
                <span className="text-[9.5px] opacity-80 leading-tight">Open Hub Tlaxiaco</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('comprador')}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  selectedRole === 'comprador'
                    ? 'bg-[#a73918] text-white border-[#a73918] shadow-sm scale-[1.02]'
                    : 'bg-white text-[#424843] border-[#c1c8c2]/60 hover:bg-[#f0eee8]'
                }`}
              >
                <span className="text-[20px]">☕</span>
                <span className="text-[12px] font-bold">Comprador</span>
                <span className="text-[9.5px] opacity-80 leading-tight">Tostadores & Galerías</span>
              </button>
            </div>
          </div>

          {/* Login Mode Content Based on Role */}
          {selectedRole === 'productor' && (
            <div className="bg-white p-4 rounded-2xl border border-[#c1c8c2]/50 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-[#c1c8c2]/30 pb-2">
                <span className="text-[12px] font-bold text-[#032517]">
                  Métodos de acceso rural sin contraseñas:
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setLoginTab('phone')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      loginTab === 'phone'
                        ? 'bg-[#032517] text-white'
                        : 'bg-[#f0eee8] text-[#424843] hover:bg-[#ebe8e2]'
                    }`}
                  >
                    💬 SMS Móvil
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginTab('carnet')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      loginTab === 'carnet'
                        ? 'bg-[#032517] text-white'
                        : 'bg-[#f0eee8] text-[#424843] hover:bg-[#ebe8e2]'
                    }`}
                  >
                    🪪 Carnet QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginTab('passkey')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      loginTab === 'passkey'
                        ? 'bg-[#032517] text-white'
                        : 'bg-[#f0eee8] text-[#424843] hover:bg-[#ebe8e2]'
                    }`}
                  >
                    👆 Huella
                  </button>
                </div>
              </div>

              {/* Tab 1: SMS OTP */}
              {loginTab === 'phone' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    {/* Country Selector */}
                    <div className="flex rounded-xl border border-[#c1c8c2] overflow-hidden">
                      {(['MX', 'BO', 'BR'] as SupportedCountry[]).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setPhoneCountry(c);
                            setOtpSent(false);
                          }}
                          className={`px-2.5 py-1.5 text-[12px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            phoneCountry === c
                              ? 'bg-[#032517] text-white'
                              : 'bg-white text-[#424843] hover:bg-[#f0eee8]'
                          }`}
                        >
                          <span>{countryPrefixes[c].flag}</span>
                          <span>{c}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 flex items-center bg-[#fcf9f3] rounded-xl border border-[#c1c8c2] px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#032517]">
                      <span className="text-[13px] font-mono text-[#727973] mr-1.5">
                        {countryPrefixes[phoneCountry].code}
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder={`Ej: ${countryPrefixes[phoneCountry].example}`}
                        className="w-full text-[14px] font-bold text-[#032517] bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="w-full py-2.5 rounded-xl bg-[#032517] hover:bg-[#1b3b2b] text-white font-bold text-[13px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                    >
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>Enviar Código SMS</span>
                    </button>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl flex flex-col gap-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-emerald-900">
                          Código enviado al celular (Demostración: 7421)
                        </span>
                        <button
                          type="button"
                          onClick={() => setOtpCode('7421')}
                          className="text-[11px] font-bold text-emerald-700 underline cursor-pointer"
                        >
                          Autocompletar
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="Escribe 7421"
                          className="flex-1 text-center font-mono text-[18px] font-bold bg-white border border-emerald-400 rounded-lg py-1.5 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isVerifying}
                          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[13px] rounded-lg transition-all cursor-pointer flex items-center gap-1 active:scale-95 disabled:opacity-50"
                        >
                          {isVerifying ? (
                            <span>Verificando...</span>
                          ) : (
                            <>
                              <span>Entrar</span>
                              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {otpError && (
                    <p className="text-[11px] text-red-600 font-medium">{otpError}</p>
                  )}
                </div>
              )}

              {/* Tab 2: Carnet Físico QR */}
              {loginTab === 'carnet' && (
                <div className="flex flex-col gap-3 text-center py-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f0eee8] border-2 border-dashed border-[#032517]/40 flex items-center justify-center text-[#032517]">
                    <span className="material-symbols-outlined text-[36px]">qr_code_scanner</span>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#032517]">
                      Escaneo de Credencial Comunitaria Física
                    </h4>
                    <p className="text-[11px] text-[#424843]">
                      Para abuelos o artesanos sin teléfono inteligente propio. Los estudiantes del TecNM escanean el carnet impreso para activar su cuenta.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => handleCarnetScan('MX-OAX-8812')}
                      className="p-2 rounded-xl bg-[#fcf9f3] border border-[#c1c8c2] hover:bg-[#ebe8e2] text-left transition-colors cursor-pointer"
                    >
                      <span className="text-[11px] font-bold text-[#032517] block">🇲🇽 Don Aurelio</span>
                      <span className="text-[9.5px] text-[#727973] font-mono">Carnet #MX-OAX-8812</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCarnetScan('MX-OAX-4419')}
                      className="p-2 rounded-xl bg-[#fcf9f3] border border-[#c1c8c2] hover:bg-[#ebe8e2] text-left transition-colors cursor-pointer"
                    >
                      <span className="text-[11px] font-bold text-[#032517] block">🇲🇽 Doña Yolanda</span>
                      <span className="text-[9.5px] text-[#727973] font-mono">Carnet #MX-OAX-4419</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Biometría / Passkey */}
              {loginTab === 'passkey' && (
                <div className="flex flex-col items-center gap-3 text-center py-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-800 animate-pulse">
                    <span className="material-symbols-outlined text-[36px]">fingerprint</span>
                  </div>
                  <div>
                    <h4 className="text-[14px] font-extrabold text-[#032517]">
                      Ingreso Seguro con Sensor de Huella
                    </h4>
                    <p className="text-[11.5px] text-[#424843] max-w-xs mx-auto">
                      Tu huella digital firma criptográficamente tus cosechas en Stellar sin necesidad de recordar ninguna clave.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePasskeyLogin}
                    disabled={isVerifying}
                    className="w-full max-w-xs py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px]">touch_app</span>
                    <span>{isVerifying ? 'Verificando huella...' : 'Tocar Sensor de Huella'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Role: Estudiante TecNM */}
          {selectedRole === 'estudiante_tecnm' && (
            <div className="bg-cyan-50/70 p-4 rounded-2xl border border-cyan-300 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[24px]">🏫</span>
                <div>
                  <h4 className="text-[13.5px] font-bold text-cyan-950">
                    Acreditación Institucional TecNM · Campus Tlaxiaco
                  </h4>
                  <p className="text-[11px] text-cyan-800">
                    Nodo Open Hub: Estudiantes de ingeniería con fe pública comunitaria y residencias profesionales.
                  </p>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-cyan-900 block mb-1">
                  Número de Control / Matrícula TecNM:
                </label>
                <input
                  type="text"
                  value={studentMatricula}
                  onChange={(e) => setStudentMatricula(e.target.value)}
                  className="w-full bg-white border border-cyan-400 rounded-xl px-3 py-2 text-[14px] font-mono font-bold text-cyan-950 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const user = RaizAuthEngine.authenticateAsTecNMStudent(studentMatricula);
                  onUserChanged(user);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-800 hover:bg-cyan-900 text-white font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>Ingresar como Estudiante Promotor TecNM</span>
              </button>
            </div>
          )}

          {/* Role: Comprador / Tostador */}
          {selectedRole === 'comprador' && (
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-300 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[24px]">🏪</span>
                <div>
                  <h4 className="text-[13.5px] font-bold text-amber-950">
                    Acceso para Tostadurías, Cafeterías y Galerías
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    Compra directa a precio justo con trazabilidad inmutable y facturación en su moneda local.
                  </p>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-amber-900 block mb-1">
                  Correo electrónico empresarial:
                </label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full bg-white border border-amber-400 rounded-xl px-3 py-2 text-[14px] font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const user = RaizAuthEngine.authenticateAsBuyer(buyerEmail, 'Restaurante & Tostaduría Tierra Viva');
                  onUserChanged(user);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-[#a73918] hover:bg-[#8e2e13] text-white font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Ingresar como Comprador Directo</span>
              </button>
            </div>
          )}

          {/* Quick Presets for Demo / Presentation */}
          <div>
            <label className="text-[11px] font-bold text-[#424843] uppercase tracking-wider block mb-1.5">
              ⚡ Perfiles Rápidos de Prueba (Para Demostración Trilateral)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_USERS.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectPreset(u)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    currentUser.id === u.id
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-600'
                      : 'bg-white border-[#c1c8c2]/50 hover:bg-[#f0eee8]'
                  }`}
                >
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-bold text-[#032517] block truncate">
                      {countryPrefixes[u.country].flag} {u.name.split(' ')[0]} {u.name.split(' ')[1] || ''}
                    </span>
                    <span className="text-[9.5px] text-[#727973] block truncate">
                      {u.craftOrCrop.split('&')[0]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#f0eee8] border-t border-[#c1c8c2]/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#424843]">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Cuenta Stellar Protegida con Encriptación Local</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#032517] text-white rounded-xl text-[12px] font-bold cursor-pointer hover:bg-[#1b3b2b]"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
