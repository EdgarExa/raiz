# ADR-003: Arquitectura no custodial con Trustless Work

* **Estado:** Aceptada
* **Fecha:** 26 de octubre de 2026
* **Decide:** Mantenedores de Yucu Protocol (Open Hub TecNM, Tlaxiaco)
* **Relación:** Confirma [ADR-001](./ADR-001-TRUSTLESS-WORK-ESCROW.md) (Trustless Work como escrow) y la complementa con el modelo de firma.

---

## 1. Contexto

La auditoría técnica de octubre de 2026 mostró que la integración con Stellar era simulada: hashes inventados en varios componentes, un escrow en un `Map` en memoria y ninguna transacción real. Para que el proyecto sea verificable (y elegible para programas como Drips Wave) hay que conectar la app a la red. La pregunta es **quién controla las llaves y el dinero**.

Si la plataforma guarda las llaves de los productores o retiene fondos de terceros, asume la custodia de activos. Eso trae obligaciones legales (en México, la Ley Fintech y la supervisión de la CNBV) que un proyecto académico no puede cumplir.

## 2. Decisiones

**D1. No custodial.** Yucu nunca genera, guarda, recibe ni recupera la llave privada de nadie, y nunca retiene fondos. Cada transacción la firma, en su propio dispositivo, la persona a quien corresponde.

**D2. El escrow es Trustless Work.** Las compras con pago condicionado usan los contratos auditados de [Trustless Work](https://docs.trustlesswork.com). Su API prepara transacciones sin firmar; las firma la billetera de cada rol. El contrato `contracts/fair_escrow` queda como **material didáctico** para aprender Soroban: no se usa en la app ni se despliega en mainnet.

**D3. Patrón único: preparar → firmar → enviar.**

```
  App (teléfono)                 Servidor / API externa             Stellar
  ──────────────                 ──────────────────────             ───────
  1. pide la operación ───────▶  2. arma la transacción SIN firmar
                                    (Trustless Work API, o server.ts
                                     para lot_passport / attestation)
  3. el campesino firma  ◀──────    devuelve el XDR
     en su teléfono (PIN)
  4. envía el XDR firmado ──────▶  5. (opcional) envuelve en fee-bump
                                    para pagar la comisión  ─────────▶ 6. se ejecuta
```

El servidor puede **preparar** y **pagar comisiones** (fee-bump, CAP-15) y **patrocinar reservas** (CAP-33). Nunca puede **firmar** en nombre de un productor, comprador o cooperativa.

**D4. Testnet primero.** Todo se desarrolla y se demuestra en Stellar testnet. Los IDs de los contratos propios están en [`contracts/deployments/testnet.json`](../../contracts/deployments/testnet.json). Pasar a mainnet requiere una nueva decisión (ADR) con revisión legal.

**D5. La llave vive en el teléfono del campesino (propuesta inicial).** Se genera en el dispositivo una cuenta Stellar (`G…`). La llave secreta se guarda **cifrada con un PIN** en IndexedDB, y se imprime una **tarjeta de recuperación** en papel que se queda con la persona (o con quien ella elija), nunca con el proyecto. La plataforma patrocina la reserva de la cuenta y las comisiones para que el productor no necesite XLM.

> Pendiente de validar en campo: si las llaves de acceso (*passkeys*) con billeteras inteligentes de Soroban son más usables que el PIN, y si son compatibles con el flujo de transacciones de Trustless Work. Hasta entonces, D5 es la base.

Con la tarjeta de recuperación y un PIN nuevo, la persona recupera su cuenta en otro teléfono (`WalletPort.restoreAccount`). La tarjeta nunca se envía al servidor.

**D6. El nodo certificador co-firma el registro de lotes.** `register_lot` en `lot_passport` exige dos firmas: la del nodo certificador (el `admin` del contrato) y la del productor. El flujo es:

1. `server.ts` prepara la transacción y firma **solo la autorización del nodo certificador** (su *auth entry* de Soroban).
2. La cuenta fuente de la transacción es la del productor: el teléfono firma el sobre con su PIN.
3. El teléfono envía el XDR firmado (`LotRegistryPort.submit`). El servidor puede envolverlo en un fee-bump (D5) sin modificar la transacción interna.

La llave del nodo certificador es **de la plataforma, no de una persona**, así que no contradice D1. Vive solo en el `.env` del servidor (`STELLAR_CERTIFIER_SECRET`), nunca en el código ni en el cliente. El servidor nunca firma por el productor: sin su firma, la transacción no es válida.

## 3. Puertos de la arquitectura (`src/core/chain/`)

La interfaz de usuario **solo** habla con estos puertos; nunca con el SDK de Stellar ni con Trustless Work directamente.

| Puerto | Responsabilidad | Implementación real | Implementación de demostración |
|---|---|---|---|
| `WalletPort` | Crear la cuenta en el dispositivo, desbloquear con PIN, **firmar** XDR. | Llave cifrada en IndexedDB | Firma simulada |
| `WalletPort` (recuperación) | Restaurar la cuenta con la tarjeta de recuperación y un PIN nuevo. | En el dispositivo | Acepta solo la tarjeta de demostración |
| `LotRegistryPort` | Registrar y consultar lotes en `lot_passport`. | `server.ts` prepara, el teléfono firma la autorización del productor, el servidor co-firma como nodo certificador (D6) | `SimulatedChain` |
| `EscrowPort` | Crear (devuelve el `escrowId`), fondear, aprobar hitos, liberar, abrir y resolver disputas. | Trustless Work API | `SimulatedChain` |

Reglas del escrow que toda implementación debe respetar:

* Los hitos suman 100 %.
* Los roles de aprobar, liberar y resolver disputas son personas o la cooperativa, **nunca la plataforma**.
* El ID del escrow solo se conoce después de enviar la creación: `submitCreate` lo devuelve (en Trustless Work es el `contractId`).
* Al resolver una disputa, el porcentaje para el productor va de 0 a 100; el resto regresa al comprador.

Cada resultado indica su origen (`source: 'testnet' | 'simulated'`). Si es `simulated`, la UI muestra `<DemoBadge />`. **Está prohibido inventar un hash o un número de ledger fuera de `SimulatedChain`.**

## 4. Consecuencias

**A favor**
* Sin custodia de llaves ni de fondos: se elimina el mayor riesgo legal y de seguridad.
* El código de escrow lo mantiene y audita Trustless Work, no el equipo de estudiantes.
* Un solo patrón (preparar → firmar → enviar) que cada issue repite y que se puede probar.

**En contra / riesgos**
* **Recuperación:** si la persona pierde el teléfono y la tarjeta, pierde el acceso. Hay que diseñar con la comunidad el resguardo de la tarjeta (issue de UX).
* **Usabilidad:** firmar con PIN debe ser comprensible para personas mayores y sin experiencia digital; se valida en campo.
* **Dependencia externa:** si la API de Trustless Work cambia, solo cambia `EscrowPort`.
* Patrocinar comisiones y reservas cuesta XLM a la plataforma: hay que limitarlo por cuenta.

## 5. Qué NO se hace

* Derivar o generar llaves de productores en el servidor.
* Guardar llaves secretas sin cifrar, enviarlas por la red o registrarlas en logs.
* Usar `fair_escrow` para dinero real.
* Mostrar como "certificado" o "pagado" algo que no se confirmó en la red.

---

*Esta decisión reduce el riesgo legal pero no sustituye la opinión de un abogado antes de operar con dinero real.*
