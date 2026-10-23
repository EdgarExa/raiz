---
name: student-soroban-contracts
description: Guía y skill pedagógica para estudiantes de ingeniería del TecNM Campus Tlaxiaco para diseñar, compilar y auditar Smart Contracts en Soroban (Rust/Wasm) en la red Stellar.
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
    pub kilos: u32,
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
        kilos: u32,
        variedad: Symbol,
        digest_hash: BytesN<32>,
    ) -> bool {
        // Validación obligatoria de firma
        productor.require_auth();

        let lote = LoteCosecha {
            productor: productor.clone(),
            kilos,
            variedad,
            digest_hash: digest_hash.clone(),
        };

        // Guardar en almacenamiento persistente
        env.storage().persistent().set(&digest_hash, &lote);

        // Renovar TTL de renta por 1 año (aproximadamente 6,307,200 ledgers)
        env.storage().persistent().extend_ttl(&digest_hash, 6307200, 6307200);

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

---

## 3. Comandos Esenciales de Soroban CLI en la Terminal

```bash
# 1. Compilar el contrato a WebAssembly optimizado
cargo build --target wasm32-unknown-unknown --release

# 2. Desplegar en la red de pruebas (Stellar Testnet)
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/contrato.wasm \
  --source-account alice \
  --network testnet

# 3. Invocar una función pública del contrato
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source-account alice \
  --network testnet \
  -- registrar_lote \
  --productor G... \
  --kilos 120 \
  --variedad "TYPICA" \
  --digest_hash cebc5b...
```
