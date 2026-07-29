#!/usr/bin/env bash
# =============================================================================
# install.sh
#
# EJECUTAR EN CUALQUIER MAC, tantas veces como quieras.
#
# Enlaza la parte declarativa del repo dentro de ~/.claude, instala los CLIs
# del Brewfile y de npm-globals.txt, y registra los servidores MCP.
#
# Enlaza HOJA POR HOJA, nunca ~/.claude entero, porque ese directorio tiene
# que seguir siendo real para el estado mutable (transcripciones, historial,
# caches). Lo que ya existiera se guarda con sufijo .bak.<timestamp>.
#
#   ./install.sh                Todo
#   ./install.sh --links-only   Solo los symlinks (lo que usa sync.sh)
# =============================================================================
set -euo pipefail

SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=tools/lib.sh
. "$SELF_DIR/tools/lib.sh"

DEST="$HOME/.claude"
STAMP="$(date +%Y%m%d-%H%M%S)"
LINKS_ONLY=0
[ "${1:-}" = "--links-only" ] && LINKS_ONLY=1

# --- Enlaza una entrada del repo dentro de ~/.claude -------------------------
link_one() {
  local item="$1"
  local src="$SELF_DIR/claude/$item"
  local dst="$DEST/$item"

  [ -e "$src" ] || { info "     $item: no esta en el repo, se salta"; return 0; }

  # Un directorio que solo contiene .gitkeep no aporta nada: no lo enlaces,
  # o taparias el directorio real de este Mac con uno vacio.
  if [ -d "$src" ]; then
    local real
    real="$(find "$src" -mindepth 1 -maxdepth 1 ! -name '.gitkeep' | wc -l | tr -d ' ')"
    if [ "$real" = "0" ]; then
      info "     $item: vacio en el repo, se salta"
      return 0
    fi
  fi

  if [ -L "$dst" ]; then
    if [ "$(readlink "$dst")" = "$src" ]; then
      ok "     $item: ya enlazado"
      return 0
    fi
    rm "$dst"
  elif [ -e "$dst" ]; then
    mv "$dst" "$dst.bak.$STAMP"
    warn "     $item: existia de antes, guardado en $item.bak.$STAMP"
  fi

  ln -s "$src" "$dst"
  ok "     $item -> repo"
}

echo ""
info "dotclaude — instalacion en este Mac"
info "repo:    $SELF_DIR"
info "destino: $DEST"
echo ""

need git "Instalalo con: xcode-select --install"
need python3 "Instalalo con: xcode-select --install"

if [ "$SELF_DIR" != "$HOME/dotclaude" ]; then
  warn "El repo no esta en ~/dotclaude sino en $SELF_DIR."
  warn "El hook de auto-pull de settings.json apunta a \$HOME/dotclaude,"
  warn "asi que o mueves el repo, o editas ese hook."
  echo ""
fi

mkdir -p "$DEST"

info "Enlazando configuracion"
for item in $MANAGED; do
  link_one "$item"
done

if [ "$LINKS_ONLY" = "1" ]; then
  echo ""
  ok "Symlinks al dia."
  exit 0
fi

# --- Homebrew ----------------------------------------------------------------
echo ""
if [ -f "$SELF_DIR/Brewfile" ] && grep -qE '^(brew|cask|tap|mas) ' "$SELF_DIR/Brewfile"; then
  if command -v brew >/dev/null 2>&1; then
    info "Instalando lo del Brewfile (tarda, es normal)"
    brew bundle --file "$SELF_DIR/Brewfile" || warn "brew bundle ha terminado con errores; revisa la salida"
  else
    warn "brew no esta instalado. Instalalo primero:"
    echo '       /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
  fi
else
  info "Brewfile vacio, nada que instalar"
fi

# --- npm globals -------------------------------------------------------------
echo ""
if [ -s "$SELF_DIR/npm-globals.txt" ]; then
  if command -v npm >/dev/null 2>&1; then
    info "Instalando paquetes npm globales"
    grep -vE '^\s*(#|$)' "$SELF_DIR/npm-globals.txt" | while read -r pkg; do
      [ -n "$pkg" ] || continue
      printf "     %s ... " "$pkg"
      if npm install -g "$pkg" >/dev/null 2>&1; then echo "ok"; else echo "FALLO"; fi
    done
  else
    warn "npm no esta instalado. Instala Node antes (nvm o brew) y reejecuta."
  fi
else
  info "npm-globals.txt vacio, nada que instalar"
fi

# --- MCP ---------------------------------------------------------------------
echo ""
if command -v claude >/dev/null 2>&1; then
  info "Registrando servidores MCP de scope user"
  python3 "$SELF_DIR/tools/apply_mcp.py"
else
  warn "El CLI claude aun no esta en el PATH."
  warn "Abre una terminal nueva y ejecuta:  python3 $SELF_DIR/tools/apply_mcp.py"
fi

# --- Checklist ---------------------------------------------------------------
cat <<EOF

$(printf "${GREEN}Instalacion terminada.${NC}")

Lo que queda es manual a la fuerza, porque son credenciales:

  [ ] claude login
  [ ] gh auth login -p ssh -w
  [ ] Exporta en ~/.zshrc las variables de mcp/REQUIRED_ENV.md
  [ ] Reconecta los MCP con OAuth:  claude  ->  /mcp
  [ ] Ajustes del Sistema > Privacidad y seguridad > Acceso total al disco
      para tu terminal y para Claude Code
  [ ] App de escritorio de Claude: login y permisos
  [ ] Habilita tus skills en la cuenta de claude.ai (Customize en la app de
      escritorio) para que Cowork, las routines y las sesiones cloud las vean.
      Esas NO leen ~/.claude/skills.

Comprueba que todo esta en su sitio:

  ./doctor.sh

EOF
