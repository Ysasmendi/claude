# Mac CLI-Only Setup Script — Spec

**File:** `new_mac_cli/new_mac_cli_setup.sh`
**Target:** macOS (Apple Silicon), fresh install or re-run.
**Run:** `chmod +x new_mac_cli_setup.sh && ./new_mac_cli_setup.sh`

## Overview

CLI-only sibling of `new_mac_personal_setup.sh`. Same shape, same idempotency. No GUI casks, no Mac App Store apps, no VS Code extensions, no `mas`. Use this on a server, a remote login, a build VM, or a Mac you only ever touch via the terminal.

Safe to re-run — Homebrew skips already-installed packages.

Requires admin privileges (sudo acquired upfront and kept alive).

## What It Does

### 1. Xcode Command Line Tools
Installs Apple's CLI developer tools (`xcode-select --install`). If not yet installed, prompts the user and exits — re-run after installation.

### 2. Rosetta 2
Installs Rosetta 2 on Apple Silicon Macs. Required for Intel-only binaries. Skips on Intel Macs. Detects existing install via the `oahd` daemon.

### 3. Homebrew
Installs Homebrew if missing. Adds `/opt/homebrew/bin/brew` to PATH for Apple Silicon. Updates if already installed.

### 4. CLI Tools (via `brew install`)
| Category | Packages |
|---|---|
| Core | git, gh, jq, curl, wget, ripgrep, fzf, tree, htop, btop |
| Shell QoL | starship, direnv, glow, git-delta |
| GNU coreutils | coreutils, gnu-sed |
| Languages & version managers | nvm, pyenv, go |
| Python tooling | uv |
| Cloud CLIs | supabase (via supabase/tap/supabase), awscli |
| Media | yt-dlp, ffmpeg, atomicparsley, aria2, deno, streamlink, mkvtoolnix |

Plus `gcloud-cli` as a Homebrew cask. It's the only cask in this script — Google ships gcloud as a cask but it has no GUI app, just CLI binaries.

### 5. Oh My Zsh
Installs Oh My Zsh unattended if not present.

### 6. Node.js via nvm
- Sources nvm from Homebrew path.
- Adds nvm init snippet to `~/.zshrc`.
- Installs latest LTS and sets it as default.

### 7. Python via pyenv
- Adds pyenv init snippet to `~/.zshrc`.
- Installs latest stable Python 3.x and sets it as global default.

### 8. Global npm Packages
| Package | Purpose |
|---|---|
| `@anthropic-ai/claude-code` | Claude Code CLI |
| `vercel` | Vercel deployment CLI |
| `pyright` | Python language server |
| `typescript` | TypeScript compiler |
| `ts-node` | TS execution / REPL |
| `@modelcontextprotocol/server-github` | GitHub MCP server |
| `@modelcontextprotocol/server-filesystem` | Filesystem MCP server |

### 9. Shell hooks
Appends to `~/.zshrc` if not already present:
- `eval "$(starship init zsh)"`
- `eval "$(direnv hook zsh)"`

### 10. yt-dlp config
Creates `~/.config/yt-dlp/config` with:
- aria2c downloader (16 parallel connections, 1M segments)
- Output: mp4 (`--merge-output-format mp4`, `--remux-video mp4`, mp4-preferring format selector)
- Embeds: metadata, thumbnail, subs (en+es, auto + uploaded), chapters
- SponsorBlock: mark all categories, auto-remove `sponsor`
- Archival: writes `.info.json` and `.description`
- Output template: `%(title)s [%(id)s].%(ext)s`
- Resilience: 10 retries, 5s sleep, no-overwrite, continue, ignore-errors, no-playlist
- Throttle dodge (`--throttled-rate 100K`) + `--geo-bypass`
- Browser cookies lines commented (firefox / chrome)

Plugins installed into yt-dlp's bundled Homebrew venv:
- `bgutil-ytdlp-pot-provider`
- `curl-cffi`

### 11. fzf Key Bindings
Installs fzf shell key bindings and completion for zsh.

## Not Included (Use `new_mac_personal_setup.sh` for these)
- GUI casks: Firefox, Chrome, Slack, Notion, VS Code, Sublime Text, Claude desktop, Codex Bar, Thaw, Raycast, Obsidian, Rectangle, etc.
- Mac App Store apps: Amphetamine, ToothFairy, Meeter, Keynote.
- VS Code Claude Code extension.

## Also Not Done (Handle Manually)
- Git identity (`user.name`, `user.email`, signing config).
- SSH key generation + GitHub registration.
- GitHub CLI auth (`gh auth login`).
- Claude Code `~/.claude/settings.json`.
- macOS system preferences.
- Cloud CLI authentication: `gcloud auth login`, `aws configure`, `vercel login`, `supabase login`.
- `claude login` (or set `ANTHROPIC_API_KEY`).

## Post-Run Manual Steps
1. Open a new terminal so `~/.zshrc` changes load.
2. Configure git identity + defaults.
3. Generate / register an SSH key.
4. `gh auth login -p ssh -w`.
5. `claude login`.
6. Authenticate gcloud / aws / vercel / supabase.
