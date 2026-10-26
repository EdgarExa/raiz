# ADR-004: La artesana cobra en pesos, sin billetera

* **Estado:** Fase 1 aceptada · Fase 2 en investigación
* **Fecha:** 26 de octubre de 2026
* **Decide:** Mantenedores de Yucu Protocol (Open Hub TecNM, Tlaxiaco), después de una validación de arquitectura con revisión de código, contratos, integraciones, amenazas, privacidad y experiencia de uso
* **Relación:** Ajusta [ADR-003](./ADR-003-NO-CUSTODIAL-Y-TRUSTLESS-WORK.md) (D5: llave en el teléfono de cada campesino) y retoma la tarjeta QR comunitaria de [ADR-002](./ADR-002-OFFLINE-FIRST-PWA-AND-RURAL-IDENTITY.md).

---

## 1. Contexto

ADR-003 propone que cada productora tenga una cuenta Stellar en su teléfono con PIN y tarjeta de recuperación (issue #91). Lo que sabemos de las comunidades no encaja con eso:

| Lo que sabemos | Qué implica |
|---|---|
| Las artesanas piensan y cobran en **pesos**; hoy, en efectivo. Piden defender su precio (QR de origen), vender directo y **cobrar rápido**. | La interfaz no debe hablar de cripto. |
| Los grupos están **organizados (asamblea, presidente) pero no constituidos legalmente**: sin RFC ni cuenta bancaria. | El grupo no puede verificarse ante una casa de cambio. Sí puede tener una cuenta Stellar. |
| **Algunas artesanas tienen cuenta bancaria y otras no.** | Hacen falta dos formas de cobrar: SPEI y efectivo. |
| La mayoría tiene **Android y WhatsApp, pero comparte el celular con sus hijos**. | Una llave en el celular queda al alcance de otras personas. |
| Para cobrar en efectivo irían a **tiendas de la cabecera municipal**. | Una red de tiendas es viable si se recluta localmente. |
| Se quiere vender **primero en México y después en el extranjero**. | La primera fase puede no mover dinero en Stellar. |

## 2. Qué encontró la validación

| Supuesto | Resultado | Evidencia |
|---|---|---|
| Una cuenta multifirma clásica (2 de 3) puede autorizar contratos de Soroban | ✅ | Soroban verifica el umbral medio de la cuenta. Las firmas vencen en minutos (`signatureExpirationLedger`): hace falta un flujo para juntarlas. |
| `lot_passport` y `perpetual_royalties` pueden dejar de exigir la firma de la artesana | ✅ | Cambio directo de `require_auth` y de los campos guardados. |
| Trustless Work acepta un receptor distinto del productor | ✅ | Documentación de roles. El receptor necesita trustline de USDC. Comisión del protocolo: 0.3 %. |
| Trustless Work puede pagar a un receptor distinto por hito | ✅ | Escrow *multi-release*. |
| El grupo puede crear un retiro en efectivo de **MicoPay** desde su cuenta multifirma | ❌ | El contrato lo acepta, pero el servidor de MicoPay inicia sesión con **una sola llave** (`micopay/backend/src/services/challenge.service.ts`). |
| El QR de MicoPay se puede mandar por WhatsApp y cobrar horas después | ❌ | El QR dura **15 minutos** y el retiro **2 horas** (`trade.service.ts`). La tienda se elige **antes** de bloquear. |
| **Etherfuse** paga por SPEI a cualquier artesana | ❌ | Exige **CURP y RFC**, selfie de prueba de vida y una cuenta bancaria **a nombre de la persona verificada**. Acepta USDC en Stellar (v2). Pagar desde la cuenta del grupo solo se podría como socio integrador con KYB, por confirmar. |
| El resolutor de disputas puede ser la plataforma | ❌ | Quien resuelve decide a dónde va el dinero: contradice ADR-003 D1. |

Conclusión: **la fase 1 está validada; la fase 2, tal como estaba escrita, no funciona hoy.**

## 3. Decisiones

### Fase 1 — aceptada

**D1. La artesana solo ve pesos.** Su interfaz no muestra "billetera", USDC, XLM, hashes ni llaves. Ve su lote, su QR y cuánto le pagarán en pesos.

**D2. Compradores en México: el dinero va directo y en pesos.** SPEI a la artesana con banco, o efectivo al entregar. **El dinero no pasa por Stellar.** En Stellar solo va el **pasaporte del lote** (`lot_passport`, `attestation_registry`).

**D3. El grupo firma el registro por sus socias.** Cada grupo tiene una cuenta Stellar **multifirma** (por ejemplo, 2 de 3 responsables elegidas por la asamblea, de familias distintas; llave maestra con peso 0; la plataforma sin ninguna firma). Una responsable escanea la tarjeta QR de la artesana (ADR-002) y el registro lo firman el grupo y el certificador (ADR-003 D6). La artesana no firma.

**D4. Referencia anónima por lote.** En la cadena no va la dirección ni el nombre de la artesana, sino una referencia **distinta en cada lote**: `ref = HMAC(secreto_artesana, código_del_lote)`. Así sus lotes no se pueden vincular entre sí, y ella (o el grupo) puede demostrar la autoría cuando quiera. El secreto es aleatorio (32 bytes), vive en su tarjeta QR y en una copia del grupo, **nunca en el servidor de Yucu**, y nunca se calcula a partir de CURP, nombre o teléfono. Además: ubicación como municipio o región, categoría y variedad de una lista cerrada, volumen por rangos.

**D5. Protecciones mínimas.**
* El teléfono arma el resumen de lo que se va a firmar **a partir de la transacción**, no del texto que manda el servidor.
* La tarjeta QR solo identifica; para registrar se pide además un PIN corto de la responsable.
* Un libro por socia (fuera de la cadena) que revisa la asamblea: qué lote se registró a su nombre y cuánto se le pagó.
* En la cadena no se publican pagos por socia.

### Fase 2 — en investigación

Compradores del extranjero y compras protegidas en México. **No se construye hasta resolver lo siguiente:**

* **Camino preferido — MicoPay con multifirma:** pedir a MicoPay que su inicio de sesión respete umbrales de cuentas multifirma, que el QR dure lo suficiente para bajar a la cabecera y que agregue una palabra clave para cobrar. Si lo acepta: escrow de Trustless Work → cuenta del grupo → retiro en efectivo en una tienda elegida por la artesana.
* **Plan B — cuenta invisible por artesana:** escrow *multi-release* que paga directo a una cuenta de cada artesana (por ejemplo, billeteras embebidas de Etherfuse, con llave que guarda ella). Solo si en campo se confirma que suficientes artesanas tienen celular propio, y RFC para cobrar por SPEI.
* **Descartado:** una cuenta puente a nombre de una responsable. Pondría el dinero de varias socias a nombre de una persona (riesgo de abuso, fiscal y de prevención de lavado).
* **Disputas:** las resuelve un tercero o una multifirma de la asamblea, nunca Yucu (#103).

## 4. Qué cambia

**Ahora (fase 1)**
* **Contratos** (una sola issue de Rust y un solo redespliegue, junto con el rol `certifier` del PR #102):
  * `register_lot(caller /*certifier*/, group, lot_ref, …)`: firman el certificador y la cuenta del grupo.
  * `perpetual_royalties`: registra la pieza con el grupo y la referencia; receptor de regalías cambiable (`set_royalty_recipient`).
  * El pasaporte no debe expirar: función pública para extender su TTL y tarea periódica.
  * Inicialización atada a quien despliega (constructor o despliegue e inicialización en la misma transacción).
  * `revoke_certification` por si se filtra la llave del certificador.
  * Una regalía a una cuenta sin trustline no debe revertir la reventa.
* **#91:** billetera de las **responsables del grupo**, con firmas parciales para la multifirma.
* **#92 y #93:** el registro lo firman el grupo y el certificador; la referencia es por lote.
* **#97:** la pantalla de firma muestra "Esperando a 1 compañera más".

**Después (fase 2, si se resuelve la investigación)**
* **#96** (escrow) y un nuevo puerto `PayoutPort` para el riel elegido.
* El contrato didáctico `fair_escrow` aclara que su modelo de "autoridad MicoPay" no corresponde a cómo funciona MicoPay.

## 5. Preguntas abiertas

1. **MicoPay:** ¿acepta cuentas multifirma, un QR de mayor duración y la palabra clave? ¿Haría un piloto en la Mixteca? ¿Cuándo llega a mainnet?
2. **Etherfuse:** ¿se puede pagar a una artesana verificada desde la cuenta del grupo como socio? ¿Hay alternativa al RFC? ¿Las billeteras embebidas pueden recibir USDC de un contrato?
3. **Campo** (guion en la validación): cuántas artesanas tienen RFC y celular propio, si confían en el QR, quiénes serían las responsables, qué tienda sería la primera.
4. **Legal:** ¿un grupo no constituido puede repartir el dinero de sus socias? ¿Qué figura le conviene (cooperativa, SPR, A.C.)? ¿Una referencia con HMAC en una cadena pública es dato personal? Se consulta con un abogado antes de la fase 2.

## 6. Consecuencias

**A favor**
* La artesana no aprende nada de cripto ni cuida una llave.
* La fase 1 entrega lo que pidieron (defender su precio) con lo que ya existe, sin mover dinero en la cadena.
* Riesgo legal bajo mientras no haya fase 2.
* La plataforma sigue sin custodiar nada.

**En contra / riesgos**
* Sin compradores del extranjero hasta resolver la fase 2.
* El grupo podría registrar lotes a nombre de una socia sin que ella lo sepa: lo mitigan el PIN, el libro por socia y la revisión en asamblea.
* Juntar 2 firmas en pocos minutos exige que las responsables estén disponibles.
* Requiere cambiar y redesplegar `lot_passport` y `perpetual_royalties`.
