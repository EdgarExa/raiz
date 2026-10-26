# ADR-004: La artesana cobra en pesos con una cuenta invisible

* **Estado:** Fase 1 aceptada · Fase 2 aceptada solo en testnet (mainnet requiere resolver la sección 5)
* **Fecha:** 26 de octubre de 2026
* **Decide:** Mantenedores de Yucu Protocol (Open Hub TecNM, Tlaxiaco), después de una validación de arquitectura con revisión de código, contratos, integraciones, amenazas, privacidad y experiencia de uso
* **Relación:** Confirma [ADR-003](./ADR-003-NO-CUSTODIAL-Y-TRUSTLESS-WORK.md) (no custodial; D5: llave en el teléfono de cada persona) y lo adapta a personas mayores con celular compartido. Retoma la tarjeta QR comunitaria de [ADR-002](./ADR-002-OFFLINE-FIRST-PWA-AND-RURAL-IDENTITY.md).

> El nombre del archivo dice "sin billetera" porque así se llamó la primera propuesta. La decisión final es que la artesana **sí tiene su propia cuenta**, pero **invisible**: nunca ve la palabra billetera ni nada de cripto.

---

## 1. Contexto

| Lo que sabemos de las comunidades | Qué implica |
|---|---|
| Las artesanas piensan y cobran en **pesos**; hoy, en efectivo. Piden defender su precio (QR de origen), vender directo y **cobrar rápido**. | La interfaz no habla de cripto. |
| Los grupos están **organizados (asamblea, presidente) pero no constituidos legalmente**: sin RFC ni cuenta bancaria. | El grupo **no debe recibir ni repartir dinero de sus socias**: sería custodia de dinero de terceros por un grupo informal. |
| **Algunas artesanas tienen cuenta bancaria y otras no.** | Hacen falta dos formas de cobrar: SPEI y efectivo. |
| La mayoría tiene **Android y WhatsApp, pero comparte el celular con sus hijos**. | Desbloquear el celular no debe bastar para firmar. |
| Algunas **no tienen celular**. | Hace falta una forma de firmar sin celular propio. |
| Para cobrar en efectivo irían a **tiendas de la cabecera municipal**. | Una red de tiendas es viable si se recluta localmente. |
| Se quiere vender **primero en México y después en el extranjero**. | La primera fase no mueve dinero en Stellar. |

**Requisito legal y de diseño:** para ser no custodial de punta a punta, **la artesana firma y recibe en su propia cuenta**. Ni Yucu ni el grupo controlan su llave ni su dinero. En el registro del lote, su firma es además su **consentimiento y la prueba de su autoría**.

## 2. Qué encontró la validación

| Supuesto | Resultado | Evidencia |
|---|---|---|
| `lot_passport` exige la firma de la productora | ✅ Ya lo hace | `register_lot`: `producer.require_auth()`. |
| Trustless Work paga a un receptor distinto por hito | ✅ | Escrow *multi-release*; el receptor puede ser distinto del *service provider*. Necesita trustline de USDC. Comisión del protocolo: 0.3 %. |
| MicoPay acepta una cuenta de **una sola llave** para crear un retiro | ✅ | Su backend inicia sesión verificando una llave (`challenge.service.ts`); su contrato exige la firma de quien paga. |
| MicoPay acepta una cuenta **multifirma** | ❌ | Por eso se descarta que el grupo reciba el dinero. |
| El QR de MicoPay se cobra horas después | ❌ | Dura **15 minutos** a propósito, por seguridad; la tienda se elige antes de bloquear. El retiro se crea **en la tienda**. |
| Etherfuse paga por SPEI a cualquier artesana | ⚠️ | Exige **CURP, RFC**, selfie y una cuenta bancaria **a su nombre**, desde su propia cuenta Stellar. Solo para quien tenga RFC. |
| Yucu puede resolver disputas | ❌ | Quien resuelve decide a dónde va el dinero: contradice ADR-003 D1. |
| Un PIN de 4 dígitos protege una llave copiada del celular | ⚠️ | Son 10 000 combinaciones: se pueden probar todas fuera de la app. Se mitiga con llave no exportable, límites y avisos. |

## 3. Decisiones

### Fase 1 — aceptada

**D1. La artesana solo ve pesos.** Tiene su propia cuenta Stellar, pero la interfaz nunca muestra "billetera", USDC, XLM, direcciones, hashes ni llaves. Ve su lote, su QR, cuánto le pagarán en pesos y cuándo.

**D2. Compradores en México: el dinero va directo y en pesos.** SPEI a la artesana con banco, o efectivo al entregar. **El dinero no pasa por Stellar.** En Stellar solo va el **pasaporte del lote**.

**D3. La artesana firma el registro de su lote.** Lo firman **ella y el certificador** (ADR-003 D6). El grupo puede acompañarla, pero no firma por ella.

**D4. Dónde vive su llave.**
* **Con celular:** la llave se genera en su celular, cifrada con un **PIN de 4 dígitos** (botones grandes, issue #97). Se guarda **no exportable** cuando el navegador lo permite. Tarjeta de recuperación en papel que se queda con ella.
* **Sin celular:** su llave va en su **tarjeta QR**, cifrada con un **PIN de 6 dígitos**. La promotora del grupo escanea la tarjeta en su celular, la artesana escribe su PIN, se firma y **la llave se borra de ese celular al terminar**. Nunca se guarda en el celular de otra persona.
* **Límites y avisos:** límite por cobro y aviso por WhatsApp a ella, o a una persona de confianza que ella elija, en cada cobro.

**D5. Una cuenta por artesana y lo mínimo en la cadena.** En el registro van: municipio o región (no la comunidad exacta), categoría y variedad de una lista cerrada, volumen por rangos, hash de la foto y **ningún monto**. Sus lotes quedan ligados a su dirección; esa es la contraparte de firmar ella misma, y la reducción de datos evita que la identifiquen fácilmente.

**D6. El teléfono arma el resumen de lo que se firma** a partir de la transacción, no del texto que manda el servidor.

### Fase 2 — se construye en testnet

Compradores del extranjero y compras protegidas. Los estudiantes la construyen en testnet, sin dinero real. Pasar a mainnet exige resolver la sección 5.

**D7. Pago del comprador.** USDC **desde su propia billetera** (por ejemplo, Freighter), con una guía neutral para conseguirlo. Yucu no integra la compra de USDC (exigiría registrar a Yucu como organización ante Etherfuse) y no ve datos de identidad del comprador. Los compradores de México que prefieran pesos usan la fase 1.

**D8. Escrow de Trustless Work (V1, testnet), *multi-release*.**

| Rol | Quién | ¿Toca dinero? |
|---|---|---|
| Receptora de cada hito | **La artesana** (su cuenta) | Sí, le llega directo |
| Marca el hito como "enviado" (*service provider*) | El grupo o la promotora | No |
| Aprueba los hitos | El comprador | No |
| Resuelve disputas | Un tercero, como parámetro (en testnet, una cuenta multifirma de prueba de la asamblea; nunca Yucu) | Decide el reparto en disputa; no recibe |

Hitos: **30 %** cuando el grupo marca "enviado" y el comprador aprueba; **70 %** cuando el comprador confirma que recibió. Si no aprueba, se puede abrir disputa **15 días** después de "enviado" (plazo que aplica la app). Porcentajes, plazo y comisión del protocolo (0.3 %) en `src/config/protocolFees.ts`. Cada equipo de estudiantes usa su propia API key de testnet en su `.env` local; el CI usa una versión simulada.

**D9. Salida a pesos desde su propia cuenta, detrás de `PayoutPort`.**
* **Efectivo — MicoPay:** cuando la artesana ya está en la tienda, crea el retiro desde su cuenta con su PIN y recibe el QR (vale 15 minutos). No espera a nadie.
* **SPEI — Etherfuse:** solo para quien tenga RFC y cuenta bancaria a su nombre, desde su propia cuenta.
* Las dos van detrás de `PayoutPort`, con una versión simulada para construir sin esperar a los proveedores.

**D10. El grupo nunca recibe dinero.** Sus roles son: acompañar el registro, marcar "enviado", y poner el **sello comunitario** en las regalías (`perpetual_royalties`). Se descarta cualquier diseño en que una cuenta del grupo o de una responsable reciba el dinero de las socias.

## 4. Qué cambia

**Fase 1**
* **Contratos** (#110, un solo redespliegue junto con el rol `certifier` del PR #102): se mantiene la firma de la productora; pasaporte que no expira; inicialización segura; `revoke_certification`; regalías robustas ante falta de trustline; campos con formato cerrado.
* **#91:** billetera de cada artesana con PIN, llave no exportable, límites y avisos.
* **Tarjeta QR con la llave cifrada** y firma en el celular de la promotora (issue nueva).
* **#92 y #93:** registro firmado por la artesana y el certificador.
* **Configuración de red** (issue nueva): leer `contracts/deployments/testnet.json` y elegir entre la versión simulada y testnet.

**Fase 2 (testnet)**
* **#96:** escrow *multi-release* con la artesana como receptora.
* **#112:** `PayoutPort` desde la cuenta de la artesana.
* **#114:** "Ya estoy en la tienda": la artesana crea su propio retiro.
* **#115:** billetera del comprador. **#116:** guía para conseguir USDC.
* **"Mis cobros"** (issue nueva): la artesana ve en pesos lo que ha recibido.

## 5. Preguntas abiertas (antes de mainnet)

1. **Campo** (guía en `docs/ux-testing/`): ¿las artesanas recuerdan su PIN? ¿Quién guarda la tarjeta? ¿Cuántas tienen celular propio y RFC? ¿Qué tienda sería la primera?
2. **MicoPay:** ¿haría un piloto en la Mixteca? ¿Agregaría una palabra clave para cobrar? ¿Cuándo llega a mainnet? (Está en desarrollo.)
3. **Etherfuse:** ¿hay alternativa al RFC? ¿Límites por persona?
4. **Disputas:** quién resuelve (#103).
5. **Legal:** confirmar con un abogado que este diseño no tiene custodia por parte de Yucu ni del grupo, y que una dirección por persona en una cadena pública es aceptable con la reducción de datos.

## 6. Consecuencias

**A favor**
* No custodial de punta a punta: ni Yucu ni el grupo controlan la llave o el dinero de la artesana.
* Su firma prueba su autoría y su consentimiento.
* El dinero le llega directo, y MicoPay funciona con su cuenta tal como está hoy.
* Ella sigue viendo solo pesos.

**En contra / riesgos**
* Tiene que recordar un PIN (4 dígitos con celular, 6 con tarjeta).
* Si pierde el celular y la tarjeta de recuperación, o la tarjeta QR, pierde el acceso.
* Sus lotes quedan ligados a una dirección pública (mitigado con lo mínimo en la cadena).
* Un PIN corto se puede adivinar si alguien copia la llave cifrada (mitigado con llave no exportable, límites y avisos).
