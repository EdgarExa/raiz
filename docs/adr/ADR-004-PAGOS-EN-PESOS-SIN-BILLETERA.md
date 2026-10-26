# ADR-004: La artesana cobra en pesos, sin billetera

* **Estado:** Propuesta (para discutir con el equipo y validar en campo)
* **Fecha:** 26 de octubre de 2026
* **Propone:** Mantenedores de Yucu Protocol (Open Hub TecNM, Tlaxiaco)
* **Relación:** Ajusta [ADR-003](./ADR-003-NO-CUSTODIAL-Y-TRUSTLESS-WORK.md) (D5: llave en el teléfono de cada campesino) y retoma la tarjeta QR comunitaria de [ADR-002](./ADR-002-OFFLINE-FIRST-PWA-AND-RURAL-IDENTITY.md).

---

## 1. Contexto

ADR-003 propone que cada productora tenga una cuenta Stellar en su teléfono, protegida con PIN y una tarjeta de recuperación (issue #91). Al revisar la investigación de campo (`docs/research/`) aparecen tres problemas:

1. **Las artesanas piensan y cobran en pesos.** Hoy les pagan en efectivo. Lo que piden es defender su precio (el QR con el origen del lote), vender directo y **cobrar rápido**, no tener cripto.
2. **El dinero se queda en USDC.** El escrow de Trustless Work y `perpetual_royalties` pagan a la dirección `G…` de la productora. Ningún ADR ni issue dice cómo convertir ese saldo a pesos. Aunque la billetera funcione, la artesana tendría un saldo que no puede gastar.
3. **La billetera personal tiene costos para ella:** recordar un PIN, guardar una tarjeta y el riesgo de perder el acceso. Muchas personas mayores no tienen teléfono propio. ADR-002 ya prevé que el promotor de la cooperativa escanee una tarjeta QR comunitaria.

El equipo ya acordó los rieles de salida a pesos: **Etherfuse** (SPEI a una cuenta bancaria) y **MicoPay** (efectivo en la red comunitaria). El contrato didáctico `fair_escrow` ya los modela (`EtherfuseSpeiBanxico` y `MicoPayScaleCash`).

## 2. Decisiones propuestas

**D1. La artesana solo ve pesos.** La interfaz de la artesana no muestra "billetera", USDC, XLM, hashes ni llaves. Ve su lote, su QR, cuánto le pagarán en pesos y cuándo.

**D2. Salida a pesos por Etherfuse o MicoPay.** Cada artesana elige cómo cobrar, y lo puede cambiar:

| Riel | Para quién | Cómo le llega |
|---|---|---|
| **Etherfuse** | Quien tiene cuenta bancaria (p. ej. Banco del Bienestar) | SPEI a su cuenta |
| **MicoPay** | Quien no tiene cuenta o prefiere efectivo | Efectivo en un punto de la red MicoPay |

**D3. El dinero liberado va directo al riel de salida.** En el escrow de Trustless Work, el rol **receptor** (*receiver*) es la dirección del riel elegido (Etherfuse o MicoPay) con una referencia de pago de la artesana, no una cuenta de la artesana. Así nadie le pide manejar USDC, y **la plataforma sigue sin tocar fondos** (ADR-003, D1). Mientras el dinero está en MicoPay o Etherfuse, lo custodia ese tercero, no Yucu (igual que hoy en `fair_escrow`).

**D4. La cooperativa firma por sus socias.** Para registrar un lote, firma el promotor de la cooperativa con su propia cuenta, después de escanear la tarjeta QR de la artesana (ADR-002). En la cadena, el lote guarda la cuenta de la cooperativa y un **identificador anónimo** de la artesana (hash con sal, sin datos personales), que sirve para rastrear sus lotes y sus regalías. `register_lot` deja de exigir la firma de la artesana.

**D5. Cuenta personal opcional.** La billetera del teléfono (`WalletPort`, #91) se mantiene, pero para el **promotor de la cooperativa, el comprador y la artesana que quiera** su propia cuenta. No es obligatoria para vender ni para cobrar.

## 3. Qué cambia en el código y en las issues (si se acepta)

* **Nuevo puerto `PayoutPort`** en `src/core/chain/ports.ts`: cotizar en pesos, preparar el pago al riel elegido y consultar si ya se entregó. Sus implementaciones serían Etherfuse y MicoPay (issues nuevas).
* **`lot_passport`:** campo `producer_ref: BytesN<32>` (identificador anónimo) y firma de la cooperativa en lugar de la de la artesana. Hay que redesplegarlo.
* **#91 (billetera):** baja de prioridad y se enfoca en el promotor y el comprador.
* **#92 y #93:** quien firma es la cooperativa, no la artesana.
* **#96 (escrow):** el receptor es la dirección del riel de salida.
* **`perpetual_royalties`:** las regalías también salen por el riel de la artesana.

## 4. Preguntas abiertas (hay que responderlas antes de aceptar)

1. **Etherfuse:** ¿acepta pagos SPEI a una persona cuando el dinero viene del escrow y no de una cuenta de esa persona? ¿Qué verificación de identidad pide, y cuánto cobra?
2. **MicoPay:** ¿hay puntos de pago en las comunidades de la Mixteca donde están las artesanas? ¿Cuánto cobra y cuánto tarda?
3. **Confianza:** ¿las artesanas aceptan que el promotor de la cooperativa firme por ellas? ¿Qué pasa con las que no están en una cooperativa (p. ej. las de palma que venden solas)?
4. **Legal:** ¿cambia algo que el promotor firme y que un tercero reciba el pago? Hay que consultarlo con un abogado antes de operar con dinero real.
5. **Compradores nacionales:** si pagan por SPEI, ¿conviene que el pago no pase por la cadena y que solo el pasaporte del lote vaya en Stellar?

## 5. Consecuencias

**A favor**
* La artesana no tiene que aprender nada de cripto ni cuidar una llave.
* Cobra en la forma que ya conoce (efectivo o banco), pero rápido y con registro público.
* Sigue sin haber custodia de la plataforma.
* Menos riesgo de perder el acceso: la cooperativa y la tarjeta QR hacen de respaldo.

**En contra / riesgos**
* **Depende de terceros** (Etherfuse, MicoPay, la cooperativa). Si uno falla, la artesana no cobra.
* **La cooperativa podría volverse otro intermediario.** El registro público de lo que se pagó a cada identificador ayuda, pero no lo impide.
* **Las artesanas sin cooperativa** necesitan otro camino, por ejemplo la cuenta personal opcional (D5).
* Requiere cambiar y redesplegar `lot_passport`.
