# ADR-004: La artesana cobra en pesos, sin billetera

* **Estado:** Propuesta (para discutir con el equipo y validar en campo)
* **Fecha:** 26 de octubre de 2026
* **Propone:** Mantenedores de Yucu Protocol (Open Hub TecNM, Tlaxiaco)
* **Relación:** Ajusta [ADR-003](./ADR-003-NO-CUSTODIAL-Y-TRUSTLESS-WORK.md) (D5: llave en el teléfono de cada campesino) y retoma la tarjeta QR comunitaria de [ADR-002](./ADR-002-OFFLINE-FIRST-PWA-AND-RURAL-IDENTITY.md).

---

## 1. Contexto

ADR-003 propone que cada productora tenga una cuenta Stellar en su teléfono con PIN y tarjeta de recuperación (issue #91). Al revisar la investigación de campo (`docs/research/`) y lo que sabe el equipo de las comunidades, eso no encaja:

| Lo que sabemos | Qué implica |
|---|---|
| Las artesanas piensan y cobran en **pesos**; hoy, en efectivo. Piden defender su precio (QR de origen), vender directo y **cobrar rápido**. | La interfaz no debe hablar de cripto. |
| Los grupos están **organizados (asamblea, presidente) pero no constituidos legalmente**: sin RFC ni cuenta bancaria. | El grupo no puede verificarse ante una casa de cambio como Etherfuse. Sí puede tener una cuenta Stellar (Stellar no pide constitución legal). |
| **Algunas artesanas tienen cuenta bancaria y otras no.** | Hacen falta dos formas de cobrar: SPEI y efectivo. |
| La mayoría tiene **Android y WhatsApp, pero comparte el celular con sus hijos**. | Un QR por WhatsApp funciona; una llave guardada en el celular queda al alcance de otras personas. |
| Para cobrar en efectivo irían a **tiendas de la cabecera municipal**. | Una red de tiendas proveedoras es viable si se recluta localmente. |
| Se quiere vender **primero en México y después en el extranjero**. | La primera fase puede no mover dinero en Stellar. |

Además, el diseño actual deja el dinero en **USDC** (escrow de Trustless Work y `perpetual_royalties` pagan a la dirección `G…` de la productora) y **ningún ADR dice cómo convertirlo a pesos**.

El equipo acordó dos rieles de salida a pesos:

* **Etherfuse:** casa de cambio en Stellar que deposita pesos por **SPEI**. Según la integración de MicoPay, la persona verifica su identidad y **su propia cuenta** firma un pago a Etherfuse con un memo; Etherfuse deposita a su banco.
* **MicoPay** ([micopay-protocol](https://github.com/Micopay/micopay-protocol)): protocolo **de persona a persona** en Stellar. Quien quiere efectivo **bloquea USDC desde su cuenta** en un escrow de Soroban y recibe un **QR** (también como enlace `claim_url`, sin instalar app). Una tienda proveedora entrega el efectivo, escanea el QR y recibe el USDC. Hoy está en testnet; el registro abierto de tiendas y la integración real con Etherfuse están en su hoja de ruta, y su red objetivo inicial es la Ciudad de México.

Consecuencia: **ni Etherfuse ni MicoPay reciben pagos "a nombre de alguien" desde un contrato.** Alguien tiene que tener una cuenta Stellar con USDC y firmar el retiro. Esta propuesta decide quién.

## 2. Decisiones propuestas

**D1. La artesana solo ve pesos.** Su interfaz no muestra "billetera", USDC, XLM, hashes ni llaves. Ve su lote, su QR, cuánto le pagarán en pesos, cuándo y cómo cobrar.

**D2. Dos fases según el comprador.**

* **Fase 1 — compradores en México.** El pago va **directo y en pesos** (SPEI a la artesana con banco, o efectivo al entregar). **El dinero no pasa por Stellar.** En Stellar solo va el **pasaporte del lote** (`lot_passport`, `attestation_registry`): el QR de origen que pidieron para defender su precio.
* **Fase 2 — compradores del extranjero o compras protegidas en México.** El comprador paga USDC a un escrow de Trustless Work (desde México, primero cambia pesos a USDC con Etherfuse). Al liberar, el dinero llega a la **cuenta del grupo** (D3) y de ahí a cada artesana (D4).

**D3. La cuenta del grupo es multifirma.** Cada grupo tiene una cuenta Stellar que necesita la firma de **varias responsables** (por ejemplo, 2 de 3: presidente, tesorera y otra socia elegida por la asamblea). Nadie mueve el dinero sola y **la plataforma no tiene ninguna firma** (ADR-003, D1). Esa cuenta es el receptor (*receiver*) del escrow de Trustless Work.

**D4. Cada artesana elige cómo cobrar, y lo puede cambiar.**

| Artesana | Riel | Cómo le llega | Qué necesita |
|---|---|---|---|
| Con cuenta bancaria | **Etherfuse** | SPEI a su cuenta | Verificar su identidad con Etherfuse. Por confirmar si el pago puede salir de la cuenta del grupo o tiene que salir de una cuenta propia (D6). |
| Sin cuenta bancaria | **MicoPay** | Efectivo en una tienda del municipio | Solo el QR, que el grupo le manda por WhatsApp tras bloquear el USDC. |

**D5. El grupo firma por sus socias.** El registro de un lote lo firma una responsable del grupo con su cuenta, después de escanear la tarjeta QR de la artesana (ADR-002), junto con el certificador (ADR-003, D6). En la cadena, el lote guarda la cuenta del grupo y un **identificador anónimo** de la artesana (hash con sal, sin datos personales) para rastrear sus lotes, sus pagos y sus regalías. `register_lot` y `register_heritage_item` dejan de exigir la firma de la artesana.

**D6. Cuenta personal opcional.** La billetera del teléfono (`WalletPort`, #91) se usa para las **responsables del grupo** (multifirma) y, solo si ella quiere o si Etherfuse lo exige, para la artesana. Si una artesana tiene cuenta propia, es "invisible": sin palabras técnicas, sin saldo acumulado (cobra y retira en el mismo momento) y con protección extra por el celular compartido (D7).

**D7. Protección por el celular compartido.**

* El QR de MicoPay funciona como efectivo: quien tiene el enlace cobra. Se propondrá a MicoPay una **palabra clave** que la artesana diga en la tienda.
* Para firmar desde una cuenta personal se pide algo que solo ella sepa (PIN corto), además del desbloqueo del celular.
* Límite por cobro y **aviso por WhatsApp** a ella, o a una persona de confianza que ella elija, en cada cobro.
* Si un hijo le ayuda, que sea con su permiso y quede registrado. Se valida en campo qué prefiere cada quien.

## 3. Quién necesita qué

| Actor | ¿Billetera? | Qué firma | Qué ve |
|---|---|---|---|
| Artesana | **No** (opcional, D6) | Nada | Pesos, su lote, su QR de cobro |
| Responsables del grupo | **Sí**, multifirma | Registro de lotes, retiros, aprobación de hitos | Pesos y lo pagado a cada socia |
| Comprador en México | No | Nada (paga en pesos) | Pasaporte del lote |
| Comprador del extranjero | Sí, la suya | Pago al escrow | Pasaporte y estado del pago |
| Tienda proveedora | Sí, la de MicoPay | Recibir USDC | App de MicoPay |
| Certificador (servidor) | Llave de la plataforma | Registro y certificación de lotes | — |
| Plataforma Yucu | **No** | Nada que mueva fondos | — |

## 4. Qué cambia en el código y en las issues (si se acepta)

* **Fase 1 primero:** el pasaporte del lote y el pago directo en pesos. No requiere escrow ni rieles de salida.
* **`lot_passport` y `perpetual_royalties`:** firma del grupo en lugar de la artesana y campo `producer_ref: BytesN<32>`. Se redespliega una sola vez, junto con el rol `certifier` del PR #102.
* **#91:** billetera multifirma para las responsables del grupo, no una por artesana.
* **#92 y #93:** firma la responsable del grupo.
* **#96:** el receptor del escrow es la cuenta multifirma del grupo (fase 2).
* **Nuevo puerto `PayoutPort`** (fase 2): cotizar en pesos, preparar el retiro por Etherfuse o MicoPay y consultar si ya se entregó. Issues nuevas para cada riel.
* **`fair_escrow`:** su modelo de "autoridad MicoPay" no corresponde a cómo funciona MicoPay. Se aclara en el contrato didáctico.

## 5. Preguntas abiertas (antes de aceptar)

1. **Etherfuse:** ¿puede pagar por SPEI a una artesana verificada cuando el pago sale de la cuenta del grupo? ¿Qué pide para verificar y cuánto cobra?
2. **MicoPay:** ¿haría un piloto con tiendas de la Mixteca? ¿Agregaría la palabra clave para cobrar? ¿Cuándo tendrá el registro de tiendas?
3. **Tiendas:** ¿qué tienda del municipio sería la primera proveedora? Necesita efectivo suficiente, cuenta Stellar y banco para recuperar sus pesos.
4. **Grupo:** ¿quiénes serían las responsables de la multifirma y cómo las elige la asamblea? ¿Qué pasa con las artesanas que venden solas?
5. **Legal:** ¿un grupo no constituido puede recibir y repartir el dinero de sus socias? ¿Qué implica para la responsable que verifica su identidad? Hay que consultarlo con un abogado antes de operar con dinero real.

## 6. Consecuencias

**A favor**
* La artesana no aprende nada de cripto ni cuida una llave.
* La fase 1 entrega valor con lo que ya existe (pasaporte del lote en testnet), sin mover dinero en la cadena.
* Cobra como ya sabe (banco o efectivo), pero directo, rápido y con registro.
* La plataforma sigue sin custodiar nada.

**En contra / riesgos**
* **Depende de terceros:** Etherfuse, MicoPay, las tiendas y el grupo.
* **El grupo podría volverse otro intermediario.** El registro público de lo pagado a cada identificador y la multifirma ayudan, pero no lo impiden.
* **Celular compartido:** riesgo de que otra persona cobre (D7).
* **Las artesanas sin grupo** necesitan la cuenta personal opcional.
* Requiere cambiar y redesplegar `lot_passport` y `perpetual_royalties`.
