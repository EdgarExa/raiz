#!/usr/bin/env bash
# Despliega e inicializa los 4 contratos de Yucu en Stellar TESTNET.
#
# Requisitos: stellar-cli >= 22 y `rustup target add wasm32v1-none`.
# Uso (desde la raíz del repo):  bash contracts/scripts/deploy-testnet.sh
#
# Crea (si no existen) cuatro identidades locales de testnet, fondeadas con Friendbot:
#   yucu-admin     -> administrador de los contratos (despliega, inicializa y cambia el certificador).
#   yucu-certifier -> nodo certificador de lot_passport: registra y certifica lotes (ADR-003, D6).
#                     Su llave secreta va al servidor como STELLAR_CERTIFIER_SECRET.
#                     Ninguna de las dos firma por productores: ellos firman en su teléfono.
#   yucu-tequio  -> tesorería comunitaria (Tequio)
#   yucu-micopay -> autoridad de pago en efectivo (solo para el contrato didáctico fair_escrow)
# Las llaves secretas se quedan en ~/.config/stellar; NUNCA se suben al repo.
#
# Nota: el escrow real es Trustless Work (ADR-001/ADR-003). fair_escrow se despliega solo como
# material didáctico para aprender Soroban; no se usa con dinero real.
#
# Resultado: contracts/deployments/testnet.json con los IDs de contrato (público, sí se versiona).
set -euo pipefail

NETWORK=testnet
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WASM_DIR="$ROOT/contracts/target/wasm32v1-none/release"
OUT="$ROOT/contracts/deployments/testnet.json"

ensure_identity() {
  if ! stellar keys address "$1" >/dev/null 2>&1; then
    stellar keys generate "$1" --network "$NETWORK" --fund >/dev/null
  fi
  stellar keys address "$1"
}

deploy() {
  stellar contract deploy --network "$NETWORK" --source yucu-admin --wasm "$WASM_DIR/$1.wasm" 2>/dev/null | tail -1
}

invoke() {
  local id="$1"; shift
  stellar contract invoke --network "$NETWORK" --source yucu-admin --id "$id" -- "$@" >/dev/null
}

echo "==> Identidades"
ADMIN=$(ensure_identity yucu-admin)
TEQUIO=$(ensure_identity yucu-tequio)
MICOPAY=$(ensure_identity yucu-micopay)
CERTIFIER=$(ensure_identity yucu-certifier)
echo "admin=$ADMIN"
echo "certifier=$CERTIFIER"

echo "==> Compilando contratos (wasm32v1-none)"
(cd "$ROOT/contracts" && cargo build --locked --release --target wasm32v1-none)

echo "==> Desplegando"
REGISTRY=$(deploy yucu_attestation_registry)
LOT=$(deploy lot_passport)
ROYALTIES=$(deploy yucu_perpetual_royalties)
ESCROW=$(deploy yucu_fair_escrow)

echo "==> Inicializando"
invoke "$REGISTRY"  initialize --admin "$ADMIN"
invoke "$LOT"       initialize --admin "$ADMIN" --certifier "$CERTIFIER"
invoke "$ROYALTIES" initialize --admin "$ADMIN" --communal_treasury "$TEQUIO"
invoke "$ESCROW"    initialize --admin "$ADMIN" --attestation_registry "$REGISTRY" \
                               --micopay_authority "$MICOPAY" --communal_treasury "$TEQUIO"

mkdir -p "$(dirname "$OUT")"
cat > "$OUT" <<EOF
{
  "network": "testnet",
  "networkPassphrase": "Test SDF Network ; September 2015",
  "rpcUrl": "https://soroban-testnet.stellar.org",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "commit": "$(git -C "$ROOT" rev-parse --short HEAD)",
  "accounts": {
    "admin": "$ADMIN",
    "certifier": "$CERTIFIER",
    "communalTreasury": "$TEQUIO",
    "micopayAuthority": "$MICOPAY"
  },
  "contracts": {
    "attestationRegistry": "$REGISTRY",
    "lotPassport": "$LOT",
    "perpetualRoyalties": "$ROYALTIES",
    "fairEscrow": "$ESCROW"
  }
}
EOF
echo "==> Listo: $OUT"
cat "$OUT"
