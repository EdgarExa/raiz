# ADR-005: Infraestructura de atestaciones para emisores y verificadores externos

* **Estado:** Propuesta (borrador). No se construye nada de aquí hasta que los mantenedores la acepten.
* **Fecha:** 27 de octubre de 2026
* **Decide:** Mantenedores de Yucu Protocol (Open Hub TecNM, Tlaxiaco)
* **Relación:** Se apoya en [ADR-003](./ADR-003-NO-CUSTODIAL-Y-TRUSTLESS-WORK.md) (no custodial, puertos) y [ADR-004](./ADR-004-PAGOS-EN-PESOS-SIN-BILLETERA.md) (D5: lo mínimo en la cadena; D11: servicios para compradores y marcas). Los diagramas están en [`docs/arquitectura/`](../arquitectura/README.md).

---

## 1. Contexto

Hoy Yucu tiene una sola app, la PWA, pensada para la artesana y el comprador. Los servicios que ADR-004 (D11) propone cobrar a compradores y marcas necesitan que **personas y organizaciones de fuera** usen el protocolo:

* **Emisores:** grupos, cooperativas, certificadoras, marcas o instituciones que afirman algo sobre un lote ("este lote es de origen comunitario", "esta colaboración tuvo consentimiento").
* **Verificadores:** cualquier comprador o tienda que escanea el QR y quiere saber si esa afirmación es válida, sin cuenta ni billetera.

Nada de eso existe. Además, `contracts/attestation_registry` acepta **un solo emisor por esquema**, recibe los IDs desde fuera y guarda un campo `signature` que no verifica.

Antes de decidir se revisó la única infraestructura de atestaciones en Soroban con despliegue en mainnet: Attest Protocol ([`daccred/attestprotocol`](https://github.com/daccred/attestprotocol), commit `c0c4529`). Lo que se encontró está en la sección 4.

## 2. Decisiones

**D1. Dos apps nuevas, separadas de la PWA de la artesana.**
* **Verificador público:** una página ligera que abre el enlace del QR y muestra "vigente" o "revocado", quién lo afirma y cuándo. No pide cuenta ni billetera.
* **Consola de emisores:** el emisor emite y revoca atestaciones y ve su historial. Incluye una pantalla mínima de administración de esquemas que solo usa Yucu.

Se separan porque son públicos muy distintos: una artesana mayor y una certificadora no deben compartir pantallas.

*Alternativa:* una sola PWA con roles. Se construye más rápido, pero mezcla los dos públicos.

**D2. Un puerto nuevo, `AttestationPort`, en `src/core/chain/ports.ts`.** Sigue el patrón de ADR-003: preparar → firmar → enviar. Forma propuesta:

```ts
export interface AttestationPort {
  prepareAttest(req: AttestRequest): Promise<UnsignedTransaction>;
  prepareRevoke(attestationId: string, issuerAddress: string): Promise<UnsignedTransaction>;
  /** Envía la emisión firmada y devuelve el ID que calculó el contrato. */
  submitAttest(signedXdr: string): Promise<ChainReceipt & { attestationId: string }>;
  submit(signedXdr: string): Promise<ChainReceipt>;
  /** Lectura directa de la red: el verificador no depende del servidor de Yucu. */
  verify(attestationId: string): Promise<{ valid: boolean; revoked: boolean; expired: boolean; source: ChainSource }>;
  listForLot(lotCode: string): Promise<{ items: AttestationRecord[]; source: ChainSource }>;
}
```

`AttestRequest` lleva el esquema, el emisor, el lote al que se refiere, el hash del contenido y una fecha de vencimiento opcional. Nunca lleva nombres. El emisor firma con su propia billetera (`ExternalWalletPort` o `DeviceWalletPort`).

**D3. Cambios en `attestation_registry`.**

| Cambio | Por qué |
|---|---|
| **Varios emisores por esquema:** el administrador agrega o quita emisores autorizados a una lista por esquema | Hoy cada grupo necesitaría su propio esquema |
| **El contrato calcula los IDs** (prefijo de dominio + dirección del contrato + esquema + sujeto + emisor + número de secuencia) | Hoy quien llama elige el ID y podría ocupar uno ajeno |
| **Referencia al lote** (`lot_code`) | Para ligar la atestación con `lot_passport` y listar las de un lote |
| **Se quita `signature`** | Parece una firma verificada y no lo es; la autenticidad ya la da `require_auth` del emisor |
| **Se rechaza un vencimiento pasado** y se guarda `revoked_at` | Igual que hace Attest Protocol |
| Se **mantienen** `payload_hash`, el registro de esquemas solo por el administrador, el almacenamiento `persistent` y `verify_attestation()` | Protegen la privacidad, evitan basura en el contrato y facilitan verificar |
| Constructor, `upgrade` y una función pública para extender el TTL | Mismos riesgos que #110 resuelve en `lot_passport` |

El tipo de almacenamiento por esquema (temporal o persistente) ya es la issue #100, y se mantiene.

**D4. El verificador lee la red directamente.** Para comprobar una atestación consulta el contrato por RPC, sin pasar por el servidor de Yucu: así el resultado no depende de confiar en Yucu. El servidor agrega una **API de solo lectura** (índice) únicamente para listados e historial. Esa API no firma ni guarda llaves.

**D5. Privacidad en el verificador.** Muestra el producto, el emisor, el municipio o región y las fechas. Nunca el nombre de la artesana ni coordenadas.

**D6. Alta de emisores.** El administrador agrega un emisor a un esquema después de verificar fuera de la cadena quién es. En la cadena el emisor es una dirección `G…`. Cómo se verifica a un emisor queda en la sección 5.

## 3. Consecuencias

* Se crean issues nuevas para los alumnos: `AttestationPort` con su versión simulada, cambios a `attestation_registry`, el verificador público y la consola mínima de emisores. Cada una con pruebas positivas y negativas.
* Los cambios al contrato exigen redesplegar `attestation_registry`. Conviene hacerlo en el mismo redespliegue de #110 para que los IDs cambien una sola vez.
* El widget de #79 se vuelve parte del verificador.
* El plan de trabajo crece en unas 20 a 25 semanas-alumno. Con dos semestres se recomienda el verificador completo y una consola mínima: un emisor emite y revoca.

## 4. Alternativa descartada: usar Attest Protocol

Se revisó el código y la actividad en la red al 27 de octubre de 2026. Los puntos de código salen de la lectura, no de pruebas ejecutadas.

* **Cualquiera puede registrar esquemas, y se guardan en almacenamiento `instance`** (`instructions/schema.rs`). Ese almacenamiento se carga en cada llamada y tiene un tamaño máximo, así que se podría llenar de esquemas basura.
* **Sin un *resolver*, cualquiera puede atestar con cualquier esquema:** el contrato no revisa que el autor sea la autoridad del esquema.
* **En `attest()` el sujeto es siempre el mismo autor.** Atestar sobre otra persona exige delegación con firmas BLS12-381, que WebCrypto no soporta. No sirve con la llave no exportable de la artesana (#91).
* **No llama `extend_ttl`** en ninguna parte.
* **Uso en mainnet:** el contrato v1 tiene 49 eventos, del 5 al 9 de noviembre de 2025, de dos cuentas. El contrato actual (v2) solo tiene su inicialización. Los contratos aparecen como "unverified" en stellar.expert.

Se toma su modelo (esquema, emisor, sujeto, revocación, vencimiento e IDs calculados en el contrato) para poder interoperar o migrar después, sin depender de su contrato.

## 5. Preguntas abiertas

1. ¿Cómo se verifica a un emisor antes de darlo de alta, y quién lo decide?
2. ¿Quién paga las comisiones de red de los emisores? ¿El patrocinio de #94 también los cubre?
3. ¿Se cobra a los emisores por el servicio (ADR-004, D11)? ¿Cuánto, y lo cobra la misma entidad con RFC?
4. ¿Qué esquemas hay al inicio? Propuesta: "origen comunitario" (lo emite el grupo) y "colaboración con consentimiento" (lo emite la marca, con la firma de la artesana).
5. ¿Una atestación puede requerir también la firma de la artesana? La segunda propuesta de la pregunta 4 lo necesita.
