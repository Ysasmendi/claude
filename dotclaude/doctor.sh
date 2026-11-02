#!/usr/bin/env bash
# =============================================================================
# doctor.sh — comprueba que la sincronizacion sigue viva.
#
# El fallo que importa: Claude reescribe settings.json y CLAUDE.md el solo
# (cuando apruebas un permiso a nivel usuario, cuando toqueteas /config, cuando
# usas # para anadir a memoria). Si lo hace reemplazando el fichero, tu symlink
# se convierte en fichero normal y la sincronizacion muere en silencio.
# Este script lo detecta.
# =============================================================================
set -uo pipefail

SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=tools/lib.sh
. "$SELF_DIR/tools/lib.sh"

DEST="$HOME/.claude"
PROBLEMS=0

echo ""
info "dotclaude — diagnostico"
echo ""

echo "Symlinks:"
for item in $MANAGED; do
  src="$SELF_DIR/claude/$item"
  dst="$DEST/$item"

  if [ ! -e "$src" ]; then
    printf "  ${BLUE}-${NC} %-18s no esta en el repo\n" "$item"
    continue
  fi
  if [ -d "$src" ]; then
    real="$(find "$src" -mindepth 1 -maxdepth 1 ! -name '.gitkeep' | wc -l | tr -d ' ')"
    if [ "$real" = "0" ]; then
      printf "  ${BLUE}-${NC} %-18s vacio en el repo\n" "$item"
      continue
    fi
  fi

  if [ -L "$dst" ] && [ "$(readlink "$dst")" = "$src" ]; then
    printf "  ${GREEN}ok${NC} %-18s -> repo\n" "$item"
  elif [ -L "$dst" ]; then
    printf "  ${RED}!!${NC} %-18s enlazado a otro sitio: %s\n" "$item" "$(readlink "$dst")"
    PROBLEMS=$((PROBLEMS + 1))
  elif [ -e "$dst" ]; then
    printf "  ${RED}!!${NC} %-18s fichero REAL, no symlink: se ha desincronizado\n" "$item"
    PROBLEMS=$((PROBLEMS + 1))
  else
    printf "  ${YELLOW}??${NC} %-18s no existe en ~/.claude\n" "$item"
    PROBLEMS=$((PROBLEMS + 1))
  fi
done

echo ""
echo "Git:"
if git -C "$SELF_DIR" rev-parse --git-dir >/dev/null 2>&1; then
  branch="$(git -C "$SELF_DIR" rev-parse --abbrev-ref HEAD)"
  dirty="$(git -C "$SELF_DIR" status --porcelain | wc -l | tr -d ' ')"
  printf "  rama:            %s\n" "$branch"
  printf "  sin commitear:   %s fichero(s)\n" "$dirty"
  git -C "$SELF_DIR" fetch -q origin "$branch" 2>/dev/null || warn "  no se ha podido hacer fetch"
  behind="$(git -C "$SELF_DIR" rev-list --count "HEAD..origin/$branch" 2>/dev/null || echo '?')"
  ahead="$(git -C "$SELF_DIR" rev-list --count "origin/$branch..HEAD" 2>/dev/null || echo '?')"
  printf "  por bajar:       %s commit(s)\n" "$behind"
  printf "  por subir:       %s commit(s)\n" "$ahead"
else
  err "  esto no es un repositorio git"
  PROBLEMS=$((PROBLEMS + 1))
fi

echo ""
echo "Claude:"
if command -v claude >/dev/null 2>&1; then
  printf "  version:         %s\n" "$(claude --version 2>/dev/null || echo desconocida)"
  echo "  MCP:"
  claude mcp list 2>/dev/null | sed 's|^|    |' || echo "    no se ha podido listar"
else
  err "  el CLI claude no esta en el PATH"
  PROBLEMS=$((PROBLEMS + 1))
fi

echo ""
echo "Contenido sincronizado:"
for d in skills agents commands hooks; do
  if [ -d "$SELF_DIR/claude/$d" ]; then
    n="$(find "$SELF_DIR/claude/$d" -mindepth 1 -maxdepth 1 ! -name '.gitkeep' | wc -l | tr -d ' ')"
    printf "  %-10s %s\n" "$d" "$n"
  fi
done

echo ""
if [ "$PROBLEMS" = "0" ]; then
  ok "Todo en orden."
else
  warn "$PROBLEMS problema(s). Para los symlinks roto o ausentes:  ./install.sh --links-only"
  warn "Si un fichero se ha vuelto real, compara antes de sobreescribir:"
  warn "  diff ~/.claude/settings.json claude/settings.json"
fi
echo ""
