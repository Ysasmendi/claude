#!/usr/bin/env bash
# Funciones compartidas por los scripts de dotclaude.
# Compatible con bash 3.2 (el que trae macOS de serie).

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

info()    { printf "${BLUE}[INFO]${NC} %s\n" "$*"; }
ok()      { printf "${GREEN}[OK]${NC} %s\n" "$*"; }
warn()    { printf "${YELLOW}[WARN]${NC} %s\n" "$*"; }
err()     { printf "${RED}[FAIL]${NC} %s\n" "$*" >&2; }
die()     { err "$*"; exit 1; }

# Entradas de ~/.claude que dotclaude gestiona. Todo lo demas se queda local.
MANAGED="settings.json CLAUDE.md keybindings.json skills agents commands hooks"

need() { command -v "$1" >/dev/null 2>&1 || die "$1 no esta instalado. $2"; }

repo_root() { cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd; }

# Resuelve symlinks. `readlink -f` no existe en el macOS antiguo, python3 si.
realpath_of() { python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' "$1"; }

# same_file <a> <b> — cierto si ambas rutas resuelven al mismo sitio.
# Sin esto, reejecutar el bootstrap en un Mac ya instalado vaciaria el
# destino cuando el destino ES el origen (el symlink apunta al repo).
same_file() { [ "$(realpath_of "$1")" = "$(realpath_of "$2")" ]; }

# mirror_dir <origen> <destino>
# Deja <destino> como copia exacta de <origen>, resolviendo symlinks.
# Sin rsync a proposito: una dependencia menos.
mirror_dir() {
  local src="$1" dst="$2"

  # Guardarrail: solo se vacia algo que este dentro de claude/ de este repo.
  case "$dst" in
    */claude/skills|*/claude/agents|*/claude/commands|*/claude/hooks) : ;;
    *) die "mirror_dir: destino no permitido: $dst" ;;
  esac

  mkdir -p "$dst"
  find "$dst" -mindepth 1 -maxdepth 1 -exec rm -rf {} + 2>/dev/null || true
  if [ -n "$(ls -A "$src" 2>/dev/null)" ]; then
    # -L resuelve symlinks: si tenias una skill enlazada, se copia el contenido.
    cp -RL "$src/." "$dst/" 2>/dev/null || cp -R "$src/." "$dst/"
  fi
  find "$dst" -name '.DS_Store' -delete 2>/dev/null || true
  find "$dst" -name '.gitkeep' -delete 2>/dev/null || true
}
