# dotclaude

Un solo Claude, sincronizado entre todos tus Macs: settings, skills, subagentes,
slash commands, hooks, plugins, `CLAUDE.md` de usuario, servidores MCP y CLIs.

El repo guarda **solo lo declarativo**. El estado mutable de `~/.claude`
(transcripciones, historial, caches, credenciales) se queda en cada Mac, donde
tiene que estar.

---

## Cómo funciona, en una frase

`~/.claude/` sigue siendo un directorio real, y dentro se enlazan por symlink
las entradas que este repo gestiona. Editas una skill en `~/.claude/skills/` y
estás editando el fichero del repo, así que el cambio ya está versionado.

```
~/.claude/
├── settings.json   -> ~/dotclaude/claude/settings.json
├── CLAUDE.md       -> ~/dotclaude/claude/CLAUDE.md
├── skills/         -> ~/dotclaude/claude/skills/
├── agents/         -> ~/dotclaude/claude/agents/
├── commands/       -> ~/dotclaude/claude/commands/
├── hooks/          -> ~/dotclaude/claude/hooks/
├── projects/           (real, local, NO se sincroniza)
├── history.jsonl       (real, local, NO se sincroniza)
└── plugins/            (cache, se reconstruye sola)
```

Se enlazan las hojas y nunca la raíz, porque si enlazas `~/.claude` entero metes
en el repo las transcripciones de cada sesión y el fichero de credenciales.

---

## PARTE A — En el Mac VIEJO

Esto se hace una vez. El script solo **lee** de `~/.claude`, no modifica nada.

### A.1 — Abre Terminal

`Cmd + Espacio` → escribe `Terminal` → `Enter`.

### A.2 — Comprueba que tienes lo mínimo

```bash
git --version
python3 --version
```

Si alguno falla:

```bash
xcode-select --install
```

Sale una ventana, dale a **Instalar** y espera a que termine.

### A.3 — Comprueba que git sabe quién eres

```bash
git config --get user.name
git config --get user.email
```

Si están vacíos:

```bash
git config --global user.name "Jaime de la Torre"
git config --global user.email "jaime.delatorre@dcycle.io"
```

### A.4 — Comprueba que llegas a GitHub por SSH

```bash
ssh -T git@github.com
```

Tiene que responder `Hi Ysasmendi! You've successfully authenticated`. Si dice
`Permission denied`, genera y registra una clave:

```bash
ssh-keygen -t ed25519 -C "mac-viejo"
pbcopy < ~/.ssh/id_ed25519.pub
```

Pega la clave en <https://github.com/settings/keys> → **New SSH key** → guarda,
y repite el `ssh -T`.

### A.5 — Trae los scripts

Vienen dentro del repo de conocimiento, en la rama
`claude/migrate-claude-new-mac-nvcoya`:

```bash
cd ~
git clone git@github.com:Ysasmendi/claude.git ~/claude-kb-tmp
cd ~/claude-kb-tmp
git checkout claude/migrate-claude-new-mac-nvcoya
cp -R dotclaude ~/dotclaude
cd ~ && rm -rf ~/claude-kb-tmp
```

Si ya tienes el repo clonado en `~/claude`, ahórrate el clone:

```bash
cd ~/claude && git fetch origin claude/migrate-claude-new-mac-nvcoya
git checkout claude/migrate-claude-new-mac-nvcoya
cp -R dotclaude ~/dotclaude
```

### A.6 — Instala `gh` si no lo tienes (opcional pero cómodo)

Con `gh` el script crea el repo en GitHub él solo. Sin `gh` te dirá qué hacer a
mano.

```bash
brew install gh
gh auth login -p ssh -w
```

### A.7 — Ejecuta la recogida

```bash
cd ~/dotclaude
./bootstrap-from-old-mac.sh
```

Qué hace, en orden:

- Copia `skills/`, `agents/`, `commands/` y `hooks/` de `~/.claude` al repo.
- Copia `settings.json`, `CLAUDE.md` y `keybindings.json`.
- Inyecta el hook de auto-pull en `settings.json` sin tocar los hooks que ya tuvieras.
- Extrae los servidores MCP de scope user de `~/.claude.json`, sustituyendo cada
  secreto por un placeholder `${VARIABLE}` y cada ruta del home por `${HOME}`.
- Vuelca `Brewfile` y `npm-globals.txt` con lo que tienes instalado.
- Escanea secretos y **aborta antes de commitear** si encuentra alguno.
- Crea el repo privado `Ysasmendi/dotclaude` en GitHub y hace push con reintentos.

### A.8 — Si el escaneo de secretos te para

Verás algo así:

```
ESCANEO DE SECRETOS: posibles credenciales en el repo
  mcp/servers.json:18  credencial en query string de una URL  (?token=a...)
```

Es un token metido en la URL de un MCP, que no se puede sustituir
automáticamente sin romper el servidor. Sácalo a una variable:

```bash
# 1. Edita ~/.claude.json y cambia el valor por un placeholder
open -e ~/.claude.json
#    "url": "https://api.example.com/mcp?token=abc123"
# -> "url": "https://api.example.com/mcp?token=${MI_SERVIDOR_TOKEN}"

# 2. Exporta el valor real en tu shell, fuera del repo
echo 'export MI_SERVIDOR_TOKEN="abc123"' >> ~/.zshrc

# 3. Reejecuta
./bootstrap-from-old-mac.sh
```

### A.9 — Si `gh` no estaba instalado

El script te imprime los dos comandos que faltan. Antes, crea el repo en
<https://github.com/new>: nombre `dotclaude`, **Private**, sin README ni
`.gitignore`. Luego:

```bash
cd ~/dotclaude
git remote add origin git@github.com:Ysasmendi/dotclaude.git
git push -u origin main
```

### A.10 — Apunta las variables de entorno que necesitas

```bash
cat ~/dotclaude/mcp/REQUIRED_ENV.md
```

Ahí está la lista de variables que tendrás que exportar en cada Mac para que los
MCP con credenciales arranquen. Los valores están en tu Mac viejo, en
`~/.claude.json`, y en Proton Pass si los guardaste. **Cópialos ahora**, que
luego el Mac viejo puede estar ya formateado.

---

## PARTE B — En el Mac NUEVO

### B.1 — Requisitos previos

```bash
xcode-select --install        # git, python3, herramientas de compilación
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Después de instalar Homebrew, añade `brew` al PATH (en Apple Silicon):

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Node, que hace falta para el CLI de Claude:

```bash
brew install nvm
mkdir -p ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && . "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
source ~/.zshrc
nvm install --lts && nvm alias default node
```

### B.2 — Clave SSH y GitHub

```bash
ssh-keygen -t ed25519 -C "mac-nuevo"
pbcopy < ~/.ssh/id_ed25519.pub
```

Pégala en <https://github.com/settings/keys> → **New SSH key**. Comprueba:

```bash
ssh -T git@github.com
```

### B.3 — Clona y ejecuta

```bash
git clone git@github.com:Ysasmendi/dotclaude.git ~/dotclaude
cd ~/dotclaude
./install.sh
```

El repo **tiene que estar en `~/dotclaude`**: el hook de auto-pull apunta ahí. Si
lo pones en otro sitio, el script te avisa y tendrás que editar el hook.

Qué hace:

- Enlaza cada entrada gestionada dentro de `~/.claude`. Lo que ya existiera se
  guarda como `<nombre>.bak.<fecha>`, no se pierde nada.
- Instala lo del `Brewfile`.
- Instala los paquetes de `npm-globals.txt`.
- Registra los servidores MCP, saltando los que ya existan.

### B.4 — Autentica

```bash
claude login
gh auth login -p ssh -w
```

### B.5 — Exporta las variables de los MCP

```bash
cat ~/dotclaude/mcp/REQUIRED_ENV.md
```

Para cada fila de la tabla:

```bash
echo 'export NOMBRE_DE_LA_VARIABLE="el-valor-real"' >> ~/.zshrc
source ~/.zshrc
```

### B.6 — Reconecta los MCP con OAuth

Los tokens viven en el Keychain, no en el repo. Hay que reconectar a mano:

```bash
claude
```

Dentro de la sesión, `/mcp`, y reconecta uno a uno los que pidan login (Slack,
Notion, Gmail, Fathom, Fireflies, Vanta, HubSpot…).

### B.7 — Permisos de macOS

**Ajustes del Sistema → Privacidad y seguridad → Acceso total al disco**: añade
tu terminal y Claude Code. Sin esto, Claude no puede leer fuera de la carpeta del
proyecto y te lo va a parecer un bug del código.

Si usas Rectangle o Raycast, también **Accesibilidad**.

### B.8 — Verifica

```bash
cd ~/dotclaude && ./doctor.sh
```

Tiene que decir `Todo en orden`, con todos los symlinks en `ok`.

---

## PARTE C — El día a día

### Bajar lo que cambiaste en otro Mac

```bash
cd ~/dotclaude && ./sync.sh
```

Aunque no lo hagas, el hook `SessionStart` hace `git pull --ff-only` cada vez que
arrancas una sesión de Claude Code, así que normalmente ya estarás al día. El
pull es silencioso y no bloquea el arranque.

### Subir lo que cambiaste en este Mac

```bash
cd ~/dotclaude && ./sync.sh "que has cambiado"
```

Antes de commitear regenera el `Brewfile` y `npm-globals.txt` con lo que
realmente tienes instalado, y escanea secretos.

### Añadir una skill nueva

Créala donde siempre; como `~/.claude/skills` es un symlink, ya está en el repo:

```bash
mkdir -p ~/.claude/skills/mi-skill
cat > ~/.claude/skills/mi-skill/SKILL.md <<'EOF'
---
name: mi-skill
description: cuando usarla
---

Las instrucciones.
EOF

cd ~/dotclaude && ./sync.sh "nueva skill mi-skill"
```

Claude Code vigila el directorio de skills, así que la coge sin reiniciar la
sesión. Solo hay que reiniciar si el directorio `skills/` no existía al arrancar.

### Añadir un servidor MCP

Añádelo normal y vuelve a extraer:

```bash
claude mcp add --transport http algo https://mcp.algo.com/mcp --scope user
python3 ~/dotclaude/tools/collect_mcp.py
cd ~/dotclaude && ./sync.sh "nuevo MCP: algo"
```

### Instalar un CLI nuevo en todos los Macs

```bash
brew install lo-que-sea
cd ~/dotclaude && ./sync.sh "anade lo-que-sea"
```

En los demás Macs, `./install.sh` completo (no `sync.sh`, que solo rehace
symlinks).

---

## Lo que este repo NO sincroniza, y por qué

| Cosa | Por qué no |
|---|---|
| Credenciales de Claude | Están en el Keychain. `claude login` en cada Mac. |
| `~/.claude.json` | Estado de OAuth, proyectos por ruta absoluta, caches. Copiarlo entre Macs arrastra rutas que no existen. De ahí solo se extraen los MCP. |
| `projects/`, `history.jsonl`, `sessions/` | Transcripciones. Pesan, no aportan, y dos Macs escribiéndolas a la vez se pisan. |
| `plugins/` | Cache. Lo declarativo son `enabledPlugins` y `extraKnownMarketplaces` dentro de `settings.json`, y eso sí va. |
| MCP de scope local | Viven bajo `.projects[ruta]` en `~/.claude.json`. Son de un proyecto y de una ruta concretos. |
| `settings.local.json` de cada proyecto | Es local a propósito: ahí van los permisos que apruebas sobre la marcha. |
| Tokens y API keys | Nunca. Variables de entorno, Keychain o Proton Pass. |

---

## La trampa: esto cubre solo los Macs

Sincronizar `~/.claude/` cubre **las sesiones locales de Claude Code**. No cubre
todo lo demás, y es un fallo que se manifiesta tarde:

- **Cowork y las sesiones cloud, routines incluidas, no leen `~/.claude/skills/`.**
  Cargan las skills habilitadas en tu cuenta de claude.ai, sincronizadas al
  arrancar la sesión. Se gestionan desde **Customize** en la barra lateral de la
  app de escritorio, o desde los ajustes de skills en claude.ai.
- **Las sesiones cloud** además cargan las skills que estén commiteadas en
  `.claude/skills/` del repo que clonan.
- **Las scheduled tasks de la app de escritorio** son la excepción: corren en
  local y sí leen `~/.claude/skills/`.

Traducido: una skill que solo esté en este repo funciona en tus Macs y en ningún
otro sitio. Si una routine remota la invoca, Claude dirá que no la encuentra.

Así que el diseño completo son tres capas:

- **Este repo** → tus Macs. Es la fuente de verdad.
- **Skills habilitadas en la cuenta de claude.ai** → Cowork, routines, sesiones
  cloud. Réplica manual de las que necesites en remoto.
- **`.claude/skills/` de cada proyecto** → skills específicas de ese repo.

Las que quieras en todas partes están duplicadas a propósito.

---

## Cuando algo se rompe

### `doctor.sh` dice `fichero REAL, no symlink`

Claude reescribió `settings.json` o `CLAUDE.md` reemplazando el fichero en vez de
editarlo, y se rompió el enlace. La sincronización estaba muerta desde ese
momento. Compara antes de decidir:

```bash
diff ~/.claude/settings.json ~/dotclaude/claude/settings.json
```

Si la versión buena es la de `~/.claude`, cópiala al repo y súbela:

```bash
cp ~/.claude/settings.json ~/dotclaude/claude/settings.json
cd ~/dotclaude && ./sync.sh "recupera settings del Mac"
./install.sh --links-only
```

Si la buena es la del repo, rehaz el enlace directamente:

```bash
cd ~/dotclaude && ./install.sh --links-only
```

Para que pase lo menos posible, mantén el `settings.json` de usuario mínimo
—hooks, marketplaces, `enabledPlugins`, modelo— y deja que los permisos volátiles
caigan en el `settings.local.json` de cada proyecto, que tiene más prioridad y no
se sincroniza.

### Una skill no aparece

```bash
ls -l ~/.claude/skills                    # ¿es un symlink al repo?
ls ~/dotclaude/claude/skills              # ¿está en el repo?
cat ~/dotclaude/claude/skills/X/SKILL.md  # ¿tiene frontmatter name y description?
```

Si el directorio `skills/` no existía cuando arrancaste la sesión, reinicia
Claude Code: el vigilante de cambios solo cubre directorios que ya existían.

### Un MCP sale como `Needs authentication`

Normal, es OAuth: `claude` → `/mcp` → reconecta.

Si sale con aviso de variable sin definir, te falta un `export` de
`mcp/REQUIRED_ENV.md`.

### El auto-pull no se ejecuta

```bash
grep -A3 DOTCLAUDE_AUTOPULL ~/.claude/settings.json
git -C ~/dotclaude status
```

El hook hace `--ff-only`: si tienes cambios locales sin commitear o el historial
ha divergido, no hace nada a propósito. Resuélvelo a mano con `./sync.sh`.

### He tocado un script y quiero saber si lo he roto

```bash
cd ~/dotclaude && ./tools/test-e2e.sh
```

Monta dos Macs falsos y un remote en un directorio temporal, ejecuta el flujo
entero y comprueba 28 cosas, incluida la que de verdad importa: que reejecutar el
bootstrap en un Mac ya instalado no se coma las skills. No toca tu `~/.claude`.

---

## Qué hace cada fichero

| Fichero | Cuándo se usa |
|---|---|
| `bootstrap-from-old-mac.sh` | Una vez, en el Mac de origen. Recoge y publica. |
| `install.sh` | En cada Mac nuevo, y cuando entren CLIs o MCP nuevos. |
| `install.sh --links-only` | Solo rehacer symlinks. Lo llama `sync.sh`. |
| `sync.sh` | Día a día. Sin argumentos baja, con mensaje sube. |
| `doctor.sh` | Cuando algo huele raro. |
| `tools/collect_mcp.py` | Extrae MCP de `~/.claude.json` limpiando secretos. |
| `tools/apply_mcp.py` | Registra los MCP en este Mac. |
| `tools/merge_settings.py` | Inyecta el hook de auto-pull sin duplicarlo. |
| `tools/scan_secrets.py` | Corta el commit si hay credenciales. |
| `tools/test-e2e.sh` | Verifica el flujo completo en un sandbox. |
| `tools/lib.sh` | Funciones compartidas. |
| `Brewfile` / `npm-globals.txt` | Manifiestos de CLIs, regenerados automáticamente. |
| `mcp/servers.json` | MCP declarados, con placeholders en lugar de secretos. |
| `mcp/REQUIRED_ENV.md` | Las variables que hay que exportar en cada Mac. |
