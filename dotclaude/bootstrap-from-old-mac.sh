#!/usr/bin/env bash
# =============================================================================
# bootstrap-from-old-mac.sh
#
# EJECUTAR EN EL MAC VIEJO, UNA SOLA VEZ.
#
# Recoge la parte declarativa de ~/.claude, la deja en este repo, escanea
# secretos, hace el primer commit y lo sube a GitHub.
#
# No toca nada de ~/.claude: solo lee.
# Idempotente: se puede reejecutar para recoger cambios posteriores.
# =============================================================================
set -euo pipefail

SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=tools/lib.sh
. "$SELF_DIR/tools/lib.sh"

SRC="$HOME/.claude"
GH_REPO="${DOTCLAUDE_REPO:-Ysasmendi/dotclaude}"
BRANCH="main"

echo ""
info "dotclaude — recogida desde el Mac viejo"
info "origen:  $SRC"
info "destino: $SELF_DIR"
echo ""

# --- Preflight ---------------------------------------------------------------
need git "Instalalo con: xcode-select --install"
need python3 "Instalalo con: xcode-select --install"
[ -d "$SRC" ] || die "No existe $SRC. ¿Seguro que estas en el Mac viejo y has usado Claude Code aqui?"

if ! git config --get user.email >/dev/null 2>&1; then
  die "git no tiene identidad configurada. Ejecuta primero:
     git config --global user.name  'Jaime de la Torre'
     git config --global user.email 'jaime.delatorre@dcycle.io'"
fi

if [ -d "$SELF_DIR/.git" ]; then
  existing_remote="$(git -C "$SELF_DIR" remote get-url origin 2>/dev/null || echo '')"
  case "$existing_remote" in
    *"/claude.git"|*"/claude")
      die "Este directorio apunta al repo de conocimiento ($existing_remote).
     Copialo fuera antes de continuar:  cp -R '$SELF_DIR' ~/dotclaude"
      ;;
  esac
fi

# --- 1. Directorios declarativos --------------------------------------------
info "1/6  Copiando skills, agents, commands y hooks"
for d in skills agents commands hooks; do
  if [ -d "$SRC/$d" ]; then
    # Si este Mac ya esta instalado, ~/.claude/$d es un symlink a este repo.
    # Copiar seria vaciar el origen: se salta.
    if same_file "$SRC/$d" "$SELF_DIR/claude/$d"; then
      ok "     $d: ya enlazado al repo, nada que recoger"
      continue
    fi
    mirror_dir "$SRC/$d" "$SELF_DIR/claude/$d"
    count="$(find "$SELF_DIR/claude/$d" -mindepth 1 -maxdepth 1 | wc -l | tr -d ' ')"
    if [ "$count" = "0" ]; then
      touch "$SELF_DIR/claude/$d/.gitkeep"
      info "     $d: vacio"
    else
      ok "     $d: $count entradas"
    fi
  else
    mkdir -p "$SELF_DIR/claude/$d"
    touch "$SELF_DIR/claude/$d/.gitkeep"
    info "     $d: no existe en este Mac"
  fi
done

# --- 2. Ficheros sueltos -----------------------------------------------------
info "2/6  Copiando settings.json, CLAUDE.md y keybindings.json"
for f in settings.json CLAUDE.md keybindings.json; do
  if [ -f "$SRC/$f" ]; then
    if same_file "$SRC/$f" "$SELF_DIR/claude/$f"; then
      ok "     $f: ya enlazado al repo, nada que recoger"
    else
      cp -L "$SRC/$f" "$SELF_DIR/claude/$f"
      ok "     $f"
    fi
  else
    info "     $f: no existe en este Mac"
  fi
done

python3 "$SELF_DIR/tools/merge_settings.py"

# Scripts de hook sueltos en la raiz de ~/.claude: no se mueven solos porque
# settings.json los referencia por ruta y moverlos rompe la referencia.
loose="$(find "$SRC" -maxdepth 1 -type f \( -name '*.sh' -o -name '*.py' \) 2>/dev/null || true)"
if [ -n "$loose" ]; then
  echo ""
  warn "Hay scripts en la raiz de ~/.claude que dotclaude NO gestiona:"
  echo "$loose" | sed 's|^|       |'
  warn "Muevelos a ~/.claude/hooks/, actualiza las rutas en settings.json,"
  warn "y reejecuta este script para que entren en el repo."
  echo ""
fi

# --- 3. Servidores MCP -------------------------------------------------------
info "3/6  Extrayendo servidores MCP de scope user"
python3 "$SELF_DIR/tools/collect_mcp.py"

# --- 4. Brewfile -------------------------------------------------------------
info "4/6  Volcando Brewfile"
if command -v brew >/dev/null 2>&1; then
  brew bundle dump --force --describe --file "$SELF_DIR/Brewfile"
  brew_count="$(grep -cE '^(brew|cask|tap|mas) ' "$SELF_DIR/Brewfile" || true)"
  ok "     Brewfile con $brew_count entradas"
else
  warn "     brew no esta instalado, se deja el Brewfile como esta"
fi

# --- 5. npm globals ----------------------------------------------------------
info "5/6  Volcando paquetes npm globales"
if command -v npm >/dev/null 2>&1; then
  npm ls -g --depth=0 --json 2>/dev/null | python3 -c '
import json, sys
try:
    deps = json.load(sys.stdin).get("dependencies", {})
except Exception:
    deps = {}
skip = {"npm", "corepack"}
for name in sorted(deps):
    if name not in skip:
        print(name)
' > "$SELF_DIR/npm-globals.txt"
  npm_count="$(wc -l < "$SELF_DIR/npm-globals.txt" | tr -d ' ')"
  ok "     npm-globals.txt con $npm_count paquetes"
else
  warn "     npm no esta instalado, se deja npm-globals.txt como esta"
fi

# --- 6. Escaneo de secretos y push ------------------------------------------
info "6/6  Escaneando secretos"
if ! python3 "$SELF_DIR/tools/scan_secrets.py"; then
  echo ""
  die "Abortado antes de commitear. Limpia los secretos y reejecuta."
fi

echo ""
info "Preparando el repositorio git"
cd "$SELF_DIR"

if [ ! -d .git ]; then
  git init -q
  git symbolic-ref HEAD "refs/heads/$BRANCH"
  ok "repositorio git inicializado en $BRANCH"
fi

git add -A
if git diff --cached --quiet; then
  ok "no hay cambios que commitear, el repo ya estaba al dia"
else
  git commit -q -m "Sync de configuracion de Claude desde el Mac viejo"
  ok "commit creado"
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  if command -v gh >/dev/null 2>&1; then
    info "Creando $GH_REPO en GitHub (privado)"
    if gh repo create "$GH_REPO" --private --source=. --remote=origin; then
      ok "repo creado y remote configurado"
    else
      warn "gh no pudo crear el repo (¿ya existe?). Configurando el remote a mano."
      git remote add origin "git@github.com:$GH_REPO.git"
    fi
  else
    warn "gh no esta instalado."
    warn "Crea el repo PRIVADO en https://github.com/new con nombre 'dotclaude'"
    warn "y luego ejecuta:"
    echo ""
    echo "  git -C '$SELF_DIR' remote add origin git@github.com:$GH_REPO.git"
    echo "  git -C '$SELF_DIR' push -u origin $BRANCH"
    echo ""
    exit 0
  fi
fi

info "Haciendo push con reintentos"
delay=2
for attempt in 1 2 3 4 5; do
  if git push -u origin "$BRANCH"; then
    ok "push completado"
    break
  fi
  if [ "$attempt" = "5" ]; then
    die "El push ha fallado 5 veces. Revisa la red y tu acceso a GitHub."
  fi
  warn "push fallido (intento $attempt), reintentando en ${delay}s"
  sleep "$delay"
  delay=$(( delay * 2 ))
done

echo ""
ok "Mac viejo listo."
echo ""
echo "Ahora, en el Mac NUEVO:"
echo ""
echo "  git clone git@github.com:$GH_REPO.git ~/dotclaude"
echo "  cd ~/dotclaude && ./install.sh"
echo ""
if [ -f "$SELF_DIR/mcp/REQUIRED_ENV.md" ]; then
  echo "Y revisa mcp/REQUIRED_ENV.md: ahi estan las variables de entorno"
  echo "que hay que exportar en cada Mac para que los MCP arranquen."
  echo ""
fi
