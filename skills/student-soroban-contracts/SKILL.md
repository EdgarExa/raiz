---
name: student-soroban-contracts
description: Guía y skill pedagógica para estudiantes de ingeniería del TecNM Campus Tlaxiaco para diseñar, compilar y probar Smart Contracts en Soroban (Rust/Wasm) en la red Stellar.
---

# 🎓 Skill TecNM: Desarrollo de Smart Contracts en Soroban (Rust)

Esta guía paso a paso está diseñada para que los estudiantes residentes e investigadores del **Instituto Tecnológico de Tlaxiaco (TecNM)** aprendan a construir contratos inteligentes seguros en Soroban sin necesidad de conocimientos previos en Solidity o EVM.

---

## 1. Estructura Mínima de un Contrato Soroban en Rust

Todo contrato en Soroban opera bajo la directiva `#![no_std]` (sin biblioteca estándar de Rust) para generar archivos binarios WebAssembly (`.wasm`) ultraligeros (< 25 KB).

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, BytesN, Env, Symbol};

// 1. Definición de Estructura de Datos
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LoteCosecha {
    pub productor: Address,
    pub rango_volumen: u32, // código de rango (ADR-004, D5), nunca kilos exactos ni montos
    pub variedad: Symbol,
    pub digest_hash: BytesN<32>,
}

// 2. Definición del Contrato
#[contract]
pub struct ContratoCosechaMixteca;

// 3. Implementación de Funciones
#[contractimpl]
impl ContratoCosechaMixteca {
    /// Registra una cosecha en el almacenamiento persistente con TTL
    pub fn registrar_lote(
        env: Env,
        productor: Address,
        rango_volumen: u32,
        variedad: Symbol,
        digest_hash: BytesN<32>,
    ) -> bool {
        // Validación obligatoria de firma
        productor.require_auth();

        // Un lote ya registrado no se sobrescribe
        if env.storage().persistent().has(&digest_hash) {
            return false;
        }

        let lote = LoteCosecha {
            productor: productor.clone(),
            rango_volumen,
            variedad,
            digest_hash: digest_hash.clone(),
        };

        // Guardar en almacenamiento persistente
        env.storage().persistent().set(&digest_hash, &lote);

        // Renovar el TTL de renta. Se mide en ledgers (~5 s cada uno), no en segundos,
        // y la red pone un máximo (`max_entry_ttl`): consúltalo antes de elegir el número.
        env.storage().persistent().extend_ttl(&digest_hash, 100_000, 500_000);

        true
    }

    /// Consulta un lote registrado
    pub fn consultar_lote(env: Env, digest_hash: BytesN<32>) -> Option<LoteCosecha> {
        env.storage().persistent().get(&digest_hash)
    }
}
```

---

## 2. Los 3 Mandamientos de Seguridad en Soroban para Estudiantes

1. **Siempre exigir autorización (`require_auth`):**
   * Nunca modifiques saldo o estado sin invocar `cuenta.require_auth()`. De lo contrario, cualquier persona podría registrar o gastar en nombre del productor.
2. **Elegir el tipo correcto de almacenamiento:**
   * Usa `env.storage().temporary()` para datos de tránsito y pesaje que caducarán en 60 días.
   * Usa `env.storage().persistent()` solo para títulos de propiedad y atestaciones de origen.
3. **Escribir Pruebas Unitarias (`#[test]`):**
   * Soroban permite simular el entorno de blockchain directamente con `cargo test` sin gastar fondos reales ni levantar nodos locales pesados.
   * Una prueba positiva y una negativa por cada regla. Para errores usa `try_...` y `assert_eq!(res, Err(Ok(Error::X)))`.
   * `mock_all_auths()` aprueba **todas** las firmas, así que no prueba quién firmó. Para probar la autorización usa `mock_auths` con solo las firmas que quieres (ver #101 [W11]).
4. **Inicializa en el despliegue:** usa `__constructor` en lugar de una función `initialize` que cualquiera puede llamar primero (ver #110 [W17]).
5. **Nada de datos personales en la cadena:** ni nombres, ni comunidades exactas, ni montos. Lo que se escribe en la cadena no se puede borrar.

> El escrow de la app es **Trustless Work** (ADR-003). `contracts/fair_escrow` es solo material didáctico.

---

## 3. Comandos Esenciales de Soroban CLI en la Terminal

```bash
# Requisitos: stellar-cli >= 22 y `rustup target add wasm32v1-none`
# (el CLI antes se llamaba `soroban`; ahora es `stellar`)

# 1. Compilar el contrato a WebAssembly optimizado
cargo build --release --target wasm32v1-none

# 2. Desplegar en la red de pruebas (Stellar Testnet)
stellar contract deploy \
  --wasm target/wasm32v1-none/release/contrato.wasm \
  --source-account alice \
  --network testnet

# 3. Invocar una función pública del contrato
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source-account alice \
  --network testnet \
  -- registrar_lote \
  --productor G... \
  --rango_volumen 2 \
  --variedad "TYPICA" \
  --digest_hash cebc5b...
```
