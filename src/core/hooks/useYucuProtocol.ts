/**
 * Yucu Core - React Hooks Library (@yucu-protocol/react)
 * 
 * Permite a cualquier aplicación externa de e-commerce, cooperativa o fintech
 * consumir Yucu Protocol con hooks nativos de React:
 * - useYucuAttestation: Consulta y verificación on-chain en Soroban
 * - useYucuEscrow: Ciclo de vida de custodia con Trustless Work
 * - useYucuOracles: Acceso a los oráculos multimodales (Voz, SCAA, EUDR, DPP)
 * - useYucuDigitalPassport: Carga de pasaporte W3C y GS1 Digital Link
 */

import { useState, useEffect, useCallback } from 'react';
import { YucuProtocolSDK, raizProtocol } from '../sdk/RaizProtocolSDK';
import { RaizAIOracles, VoiceParsingResult, QualityAttestation, EUDRComplianceReport } from '../ai/RaizAIOracles';

export interface UseYucuAttestationOptions {
  lotCode: string;
  expectedSchema?: string;
  autoVerify?: boolean;
}

export interface UseYucuAttestationResult {
  verified: boolean;
  lotCode: string;
  dataHash: string | null;
  schemaId: string;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useYucuAttestation({
  lotCode,
  expectedSchema = '0x01_SCAA_SPECIALTY',
  autoVerify = true,
}: UseYucuAttestationOptions): UseYucuAttestationResult {
  const [verified, setVerified] = useState<boolean>(false);
  const [dataHash, setDataHash] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(autoVerify);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async () => {
    if (!lotCode) return;
    setLoading(true);
    setError(null);
    try {
      // Intenta consultar la API REST del protocolo
      const res = await fetch('/api/v1/attestations/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotCode, expectedSchema }),
      });

      if (res.ok) {
        const data = await res.json();
        setVerified(data.verified);
        setDataHash(data.dataHash);
      } else {
        // Fallback local determinista con SDK
        const localCheck = raizProtocol.attestations.verifyAttestation(lotCode);
        setVerified(localCheck.valid);
        setDataHash(localCheck.attestationUid);
      }
    } catch (err: any) {
      // Fallback local en caso de desconexión
      const localCheck = raizProtocol.attestations.verifyAttestation(lotCode);
      setVerified(localCheck.valid);
      setDataHash(localCheck.attestationUid);
    } finally {
      setLoading(false);
    }
  }, [lotCode, expectedSchema]);

  useEffect(() => {
    if (autoVerify) {
      verify();
    }
  }, [verify, autoVerify]);

  return {
    verified,
    lotCode,
    dataHash,
    schemaId: expectedSchema,
    loading,
    error,
    refetch: verify,
  };
}

export interface UseYucuDigitalPassportResult {
  passport: any | null;
  loading: boolean;
  gs1Url: string | null;
  refetch: () => Promise<void>;
}

export function useYucuDigitalPassport(lotCode: string): UseYucuDigitalPassportResult {
  const [passport, setPassport] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [gs1Url, setGs1Url] = useState<string | null>(null);

  const fetchPassport = useCallback(async () => {
    if (!lotCode) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/lots/${encodeURIComponent(lotCode)}/passport`);
      if (res.ok) {
        const data = await res.json();
        setPassport(data);
        setGs1Url(`https://yucu.tecnm.mx/01/0750100000001/10/${encodeURIComponent(lotCode)}`);
      }
    } catch {
      // Fallback básico
      setPassport({ id: `urn:yucu:lot:${lotCode}`, lotCode });
      setGs1Url(`https://yucu.tecnm.mx/01/0750100000001/10/${encodeURIComponent(lotCode)}`);
    } finally {
      setLoading(false);
    }
  }, [lotCode]);

  useEffect(() => {
    fetchPassport();
  }, [fetchPassport]);

  return {
    passport,
    loading,
    gs1Url,
    refetch: fetchPassport,
  };
}

export function useYucuOracles() {
  const parseVoice = useCallback((audioTranscript: string, dialect: 'tuun_savi' | 'spanish') => {
    return RaizAIOracles.parseAcousticVoiceInput(audioTranscript, dialect);
  }, []);

  const assessQuality = useCallback((params: { productType: 'coffee' | 'textile'; visualDescription?: string }) => {
    return RaizAIOracles.evaluateLotQuality({ productType: params.productType });
  }, []);

  const verifyEUDR = useCallback((community: string) => {
    return RaizAIOracles.verifyEUDRCompliance({ community });
  }, []);

  return {
    parseVoice,
    assessQuality,
    verifyEUDR,
  };
}
