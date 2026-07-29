#!/usr/bin/env bash
# =============================================================================
# test-e2e.sh — verifica el flujo completo en un sandbox temporal.
#
#   ./tools/test-e2e.sh
#
# No toca tu ~/.claude ni tu repo real: monta dos Macs falsos y un remote bare
# en un directorio temporal que se borra al salir. Ejecutalo despues de tocar
# cualquier script.
# =============================================================================
set -uo pipefail
SRC_REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SB="$(mktemp -d -t dotclaude-test)"
trap 'rm -rf "$SB"' EXIT
OLD="$SB/t-old"; NEW="$SB/t-new"; BARE="$SB/t-remote.git"
rm -rf "$OLD" "$NEW" "$BARE"
FAILED=0
check() { if [ "$1" = "0" ]; then echo "  PASS  $2"; else echo "  FAIL  $2"; FAILED=$((FAILED+1)); fi; }

# ---------- Mac viejo ----------
mkdir -p "$OLD/.claude/skills/gmail-police" "$OLD/.claude/skills/premortem" "$OLD/.claude/agents" "$OLD/.claude/hooks"
printf -- '---\nname: gmail-police\ndescription: x\n---\ncuerpo\n' > "$OLD/.claude/skills/gmail-police/SKILL.md"
printf -- '---\nname: premortem\ndescription: x\n---\ncuerpo\n' > "$OLD/.claude/skills/premortem/SKILL.md"
printf -- '---\nname: revisor\ndescription: x\n---\ncuerpo\n' > "$OLD/.claude/agents/revisor.md"
printf '#!/bin/sh\necho hook\n' > "$OLD/.claude/hooks/pre.sh"; chmod +x "$OLD/.claude/hooks/pre.sh"
printf '# Memoria vieja\n' > "$OLD/.claude/CLAUDE.md"
printf '{"permissions":{"allow":["Read"]},"hooks":{"SessionStart":[{"matcher":"","hooks":[{"type":"command","command":"echo mio"}]}]}}\n' > "$OLD/.claude/settings.json"
cat > "$OLD/.claude.json" <<EOF
{"mcpServers":{
  "notion":{"type":"http","url":"https://mcp.notion.com/mcp"},
  "airtable":{"type":"stdio","command":"npx","args":["-y","airtable-mcp"],"env":{"AIRTABLE_API_KEY":"patSuperSecreto123"}},
  "filesystem":{"type":"stdio","command":"$OLD/.nvm/versions/node/v22/bin/npx","args":["-y","@modelcontextprotocol/server-filesystem","$OLD/dev"]}
 },
 "projects":{"$OLD/dev/x":{"mcpServers":{"solo-local":{"type":"stdio","command":"foo"}}}}}
EOF
git init -q --bare "$BARE" && git -C "$BARE" symbolic-ref HEAD refs/heads/main

echo "=== 1. bootstrap en el Mac viejo ==="
cp -R "$SRC_REPO" "$OLD/dotclaude"
( export HOME="$OLD"; cd "$OLD/dotclaude"
  git config --global user.name T; git config --global user.email t@e.com
  DOTCLAUDE_REPO=x/y bash ./bootstrap-from-old-mac.sh >"$SB/log-boot.txt" 2>&1
  git remote add origin "$BARE" && git push -q -u origin main )
grep -q "skills: 2 entradas" "$SB/log-boot.txt"; check $? "recoge las 2 skills"
grep -q "hooks: 1 entradas" "$SB/log-boot.txt"; check $? "recoge el hook"
grep -q "escritos 3 servidores MCP" "$SB/log-boot.txt"; check $? "extrae 3 MCP de scope user"
! grep -q "solo-local" "$OLD/dotclaude/mcp/servers.json"; check $? "excluye el MCP de scope local"
! grep -q "patSuperSecreto123" "$OLD/dotclaude/mcp/servers.json"; check $? "el secreto NO esta en el repo"
grep -q 'AIRTABLE_AIRTABLE_API_KEY' "$OLD/dotclaude/mcp/servers.json"; check $? "el secreto es un placeholder"
grep -q '\${HOME}' "$OLD/dotclaude/mcp/servers.json"; check $? "normaliza rutas a \${HOME}"
grep -q 'echo mio' "$OLD/dotclaude/claude/settings.json"; check $? "conserva el hook que ya tenia"
[ "$(grep -c DOTCLAUDE_AUTOPULL "$OLD/dotclaude/claude/settings.json")" = 1 ]; check $? "anade el auto-pull una sola vez"
[ -x "$OLD/dotclaude/claude/hooks/pre.sh" ]; check $? "preserva el bit de ejecucion del hook"

echo "=== 2. reejecutar bootstrap en el mismo Mac (idempotencia) ==="
( export HOME="$OLD"; cd "$OLD/dotclaude"; bash ./bootstrap-from-old-mac.sh >"$SB/log-boot2.txt" 2>&1 )
[ "$(grep -c DOTCLAUDE_AUTOPULL "$OLD/dotclaude/claude/settings.json")" = 1 ]; check $? "el hook sigue sin duplicarse"
[ "$(ls "$OLD/dotclaude/claude/skills" | wc -l | tr -d ' ')" = 2 ]; check $? "las skills siguen ahi"

echo "=== 3. clone + install en el Mac nuevo ==="
mkdir -p "$NEW/.claude/skills/algo-local" "$NEW/.claude/projects/foo"
printf 'skill previa del mac nuevo\n' > "$NEW/.claude/skills/algo-local/SKILL.md"
printf '{"viejo":true}\n' > "$NEW/.claude/settings.json"
printf 'transcripcion\n' > "$NEW/.claude/projects/foo/s.jsonl"
( export HOME="$NEW"; git clone -q "$BARE" "$NEW/dotclaude"
  cd "$NEW/dotclaude"; bash ./install.sh --links-only >"$SB/log-inst.txt" 2>&1 )
[ -L "$NEW/.claude/skills" ]; check $? "skills es un symlink"
[ "$(readlink "$NEW/.claude/skills")" = "$NEW/dotclaude/claude/skills" ]; check $? "skills apunta al repo"
[ -L "$NEW/.claude/settings.json" ]; check $? "settings.json es un symlink"
[ -L "$NEW/.claude/hooks" ]; check $? "hooks es un symlink"
[ -f "$NEW/.claude/skills/gmail-police/SKILL.md" ]; check $? "la skill del Mac viejo se ve en el nuevo"
ls "$NEW"/.claude/skills.bak.*/algo-local/SKILL.md >/dev/null 2>&1; check $? "la skill previa del Mac nuevo se respaldo"
[ -f "$NEW/.claude/projects/foo/s.jsonl" ]; check $? "el estado mutable no se toca"
! [ -L "$NEW/.claude/commands" ]; check $? "no enlaza directorios vacios"

echo "=== 4. reejecutar install (idempotencia, sin backups nuevos) ==="
before="$(ls -d "$NEW"/.claude/*.bak.* 2>/dev/null | wc -l | tr -d ' ')"
( export HOME="$NEW"; cd "$NEW/dotclaude"; bash ./install.sh --links-only >"$SB/log-inst2.txt" 2>&1 )
after="$(ls -d "$NEW"/.claude/*.bak.* 2>/dev/null | wc -l | tr -d ' ')"
[ "$before" = "$after" ]; check $? "no crea backups de mas al reejecutar"
grep -q "ya enlazado" "$SB/log-inst2.txt"; check $? "detecta que ya estaba enlazado"

echo "=== 5. bootstrap en un Mac YA instalado (el caso que borraba datos) ==="
( export HOME="$NEW"; cd "$NEW/dotclaude"
  git config --global user.name T; git config --global user.email t@e.com
  bash ./bootstrap-from-old-mac.sh >"$SB/log-boot3.txt" 2>&1 )
[ "$(ls "$NEW/dotclaude/claude/skills" | wc -l | tr -d ' ')" = 2 ]; check $? "NO se come las skills"
[ -f "$NEW/dotclaude/claude/skills/gmail-police/SKILL.md" ]; check $? "gmail-police intacta"
grep -q "ya enlazado al repo" "$SB/log-boot3.txt"; check $? "detecta el enlace y se salta la copia"
! grep -qi "are the same file" "$SB/log-boot3.txt"; check $? "sin error de cp 'same file'"

echo "=== 6. doctor detecta la desincronizacion ==="
( export HOME="$NEW"; cd "$NEW/dotclaude"; bash ./doctor.sh >"$SB/log-doc.txt" 2>&1 )
grep -q "Todo en orden" "$SB/log-doc.txt"; check $? "doctor limpio cuando todo esta bien"
rm "$NEW/.claude/settings.json"; printf '{"reescrito":true}\n' > "$NEW/.claude/settings.json"
( export HOME="$NEW"; cd "$NEW/dotclaude"; bash ./doctor.sh >"$SB/log-doc2.txt" 2>&1 )
grep -q "fichero REAL" "$SB/log-doc2.txt"; check $? "doctor detecta que Claude reescribio settings.json"

echo "=== 7. sync.sh sube y baja ==="
( export HOME="$NEW"; cd "$NEW/dotclaude"
  mkdir -p claude/skills/nueva-skill
  printf -- '---\nname: nueva-skill\ndescription: x\n---\ncuerpo\n' > claude/skills/nueva-skill/SKILL.md
  bash ./sync.sh "anade nueva-skill" >"$SB/log-sync.txt" 2>&1 )
grep -q "subido" "$SB/log-sync.txt"; check $? "sync sube el cambio"
( export HOME="$OLD"; cd "$OLD/dotclaude"; bash ./sync.sh >"$SB/log-sync2.txt" 2>&1 )
[ -f "$OLD/.claude/skills/nueva-skill/SKILL.md" ] || [ -f "$OLD/dotclaude/claude/skills/nueva-skill/SKILL.md" ]; check $? "el otro Mac recibe la skill nueva"

echo ""
if [ "$FAILED" = "0" ]; then echo "TODOS LOS TESTS PASAN"; else echo "$FAILED TEST(S) FALLAN"; fi
exit "$FAILED"
