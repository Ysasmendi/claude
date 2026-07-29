#!/usr/bin/env bash
# =============================================================================
# sync.sh — el comando del dia a dia.
#
#   ./sync.sh            Baja los cambios de los otros Macs y rehace symlinks
#   ./sync.sh "mensaje"  Sube lo que hayas cambiado en este Mac
#
# Si has editado una skill directamente en ~/.claude/skills, estas editando el
# fichero del repo (es un symlink), asi que el cambio ya esta aqui. Este script
# solo lo commitea y lo sube.
# =============================================================================
set -euo pipefail

SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=tools/lib.sh
. "$SELF_DIR/tools/lib.sh"

cd "$SELF_DIR"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
MSG="${1:-}"

push_with_retry() {
  local delay=2 attempt
  for attempt in 1 2 3 4 5; do
    if git push -u origin "$BRANCH"; then return 0; fi
    if [ "$attempt" = "5" ]; then die "El push ha fallado 5 veces."; fi
    warn "push fallido (intento $attempt), reintentando en ${delay}s"
    sleep "$delay"
    delay=$(( delay * 2 ))
  done
}

if [ -n "$MSG" ]; then
  info "Subiendo cambios de este Mac"

  # Refresca los manifiestos antes de commitear, para que el repo refleje
  # lo que de verdad hay instalado en este Mac.
  if command -v brew >/dev/null 2>&1; then
    brew bundle dump --force --describe --file "$SELF_DIR/Brewfile"
    ok "Brewfile actualizado"
  fi
  if command -v npm >/dev/null 2>&1; then
    npm ls -g --depth=0 --json 2>/dev/null | python3 -c '
import json, sys
try:
    deps = json.load(sys.stdin).get("dependencies", {})
except Exception:
    deps = {}
for name in sorted(deps):
    if name not in {"npm", "corepack"}:
        print(name)
' > "$SELF_DIR/npm-globals.txt"
    ok "npm-globals.txt actualizado"
  fi

  python3 "$SELF_DIR/tools/scan_secrets.py" || die "Abortado: hay secretos sin limpiar."

  git add -A
  if git diff --cached --quiet; then
    ok "no hay nada que subir"
    exit 0
  fi
  git -c core.pager=cat diff --cached --stat
  git commit -q -m "$MSG"
  push_with_retry
  ok "subido"
else
  info "Bajando cambios"
  delay=2
  for attempt in 1 2 3 4 5; do
    if git pull --ff-only origin "$BRANCH"; then break; fi
    if [ "$attempt" = "5" ]; then die "El pull ha fallado 5 veces."; fi
    warn "pull fallido (intento $attempt), reintentando en ${delay}s"
    sleep "$delay"
    delay=$(( delay * 2 ))
  done
  "$SELF_DIR/install.sh" --links-only
  ok "al dia. Si han entrado MCP o CLIs nuevos, ejecuta ./install.sh completo."
fi
