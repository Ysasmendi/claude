# Mac Dev Setup Script — Spec

**File:** `new_mac_personal/new_mac_personal_setup.sh`
**Target:** macOS (Apple Silicon), fresh install or re-run.
**Run:** `chmod +x new_mac_personal_setup.sh && ./new_mac_personal_setup.sh`

## Overview

Single idempotent bash script that takes a clean Mac from zero to a configured dev machine — packages, languages, runtimes, and a couple of shell hooks. Identity, auth, and macOS preferences are NOT handled here; do them manually after the run.

Safe to re-run — Homebrew skips already-installed packages.

Requires admin privileges (sudo acquired upfront and kept alive).

## What It Does

### 1. Xcode Command Line Tools
Installs Apple's CLI developer tools (`xcode-select --install`). If not yet installed, prompts the user and exits — re-run after installation.

### 2. Rosetta 2
Installs Rosetta 2 on Apple Silicon Macs (`softwareupdate --install-rosetta --agree-to-license`). Required for Intel-only binaries. Skips on Intel Macs. Detects existing install by checking for the `oahd` daemon.

### 3. Homebrew
Installs Homebrew if missing. Adds `/opt/homebrew/bin/brew` to PATH for Apple Silicon. Updates if already installed.

### 4. CLI Tools (via `brew install`)
| Category | Packages |
|---|---|
| Core | git, git-crypt, gh, jq, curl, wget, ripgrep, fzf, tree, htop, btop |
| Shell QoL | starship, direnv, glow, git-delta, shellcheck |
| GNU coreutils | coreutils, gnu-sed |
| Languages & version managers | nvm, pyenv, go |
| Python tooling | uv |
| Cloud CLIs | supabase (via supabase/tap/supabase), awscli |
| Mac App Store CLI | mas |
| Media | yt-dlp, ffmpeg, atomicparsley, aria2, deno, streamlink, mkvtoolnix |
| Document toolchain | pandoc, tectonic, poppler |
| Graphics libs | gdk-pixbuf, pango (orphaned leaves mirrored from the current Mac — likely deps) |

Google Cloud SDK installed separately as a cask.

### 5. GUI Apps (via `brew install --cask`)
| Category | Apps |
|---|---|
| Browsers | Firefox, Google Chrome |
| Privacy & Security | Proton Mail, Proton Pass, ProtonVPN, Tailscale, Ente Auth |
| Media | VLC, Spotify, Stremio, Calibre, Audacity |
| Communication | Discord, Slack, Notion |
| Meetings | Granola (AI meeting recorder) |
| Dev Tools | Zed, Claude, Slack CLI |
| LLM tooling (menu bar) | Codex Bar |
| Productivity | Raycast, Obsidian, Rectangle, The Unarchiver |
| Menu bar | Thaw |
| Utilities | Transmission, balenaEtcher, LocalSend, DaisyDisk, Blip, Soulseek, Android Platform Tools |
| Music Production | Native Access |
| Fonts | Hack Nerd Font, Inter |

No editor extension is scripted — Zed runs Claude Code natively (built-in terminal / agent support), so no `--install-extension` step is needed.

### 6. Mac App Store Apps (via `mas`)
| ID | App |
|---|---|
| 937984704 | Amphetamine (keep-awake) |
| 361285480 | Keynote (Apple presentation app) |

### 7. Oh My Zsh
Installs Oh My Zsh unattended if not present.

### 8. Node.js via nvm
- Sources nvm from Homebrew path.
- Adds nvm init snippet to `~/.zshrc`.
- Installs latest LTS and sets it as default.
- `npx` is included with npm — no separate install.

### 9. Python via pyenv
- Adds pyenv init snippet to `~/.zshrc`.
- Installs latest stable Python 3.x and sets it as global default.

### 10. Global npm Packages
| Package | Purpose |
|---|---|
| `@anthropic-ai/claude-code` | Claude Code CLI |
| `vercel` | Vercel deployment CLI |
| `netlify-cli` | Netlify deployment CLI |
| `pyright` | Python language server |
| `typescript` | TypeScript compiler |
| `ts-node` | TS execution / REPL |
| `@modelcontextprotocol/server-github` | GitHub MCP server |
| `@modelcontextprotocol/server-filesystem` | Filesystem MCP server |

### 11. Shell hooks
Appends to `~/.zshrc` if not already present:
- `eval "$(starship init zsh)"`
- `eval "$(direnv hook zsh)"`

### 12. yt-dlp config
Creates `~/.config/yt-dlp/config` with:
- aria2c downloader (16 parallel connections, 1M segments)
- **Output: mp4** (`--merge-output-format mp4`, `--remux-video mp4`, format selector prefers mp4-native streams and falls back to best+best with remux)
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

### 13. fzf Key Bindings
Installs fzf shell key bindings and completion for zsh.

## Not Automated (Manual Install Required)
- **Affinity 3** — download from serif.com.
- **Nuo-Stems 4** — download from vendor.
- **iStat Menus 6** — cask installs latest; get v6 from vendor if needed.
- **Microsoft Word / Excel / OneDrive** — install manually from Microsoft 365.

## Removed From This Script (Handle Manually)
The following were previously automated and have been removed. They now belong to the post-run manual checklist.
- **Git identity** — `user.name`, `user.email`, `init.defaultBranch`, `pull.rebase`, `push.autoSetupRemote`, delta as pager.
- **SSH key** — Ed25519 generation, ssh-agent + Apple Keychain, GitHub registration.
- **Hardware-backed identity** — Secretive cask, Touch ID for sudo, SSH commit signing config, `allowed_signers`.
- **GitHub CLI auth** — `gh auth login`.
- **Claude Code config** — `~/.claude/settings.json` (permissions allowlist + GitHub & filesystem MCP servers), `ANTHROPIC_API_KEY` / `GITHUB_TOKEN` placeholders in `~/.zshrc`.
- **macOS system preferences** — every `defaults write`, `pmset`, `nvram`, `networksetup`, `socketfilterfw`, `launchctl disable`, the interactive privacy panes, and the dockutil-driven Dock layout.

## Post-Run Manual Steps
1. Open a new terminal so `~/.zshrc` changes (nvm, pyenv, starship, direnv) load.
2. Configure git: `git config --global user.name '...'`, `user.email`, defaults, signing.
3. Generate / register an SSH key with GitHub (file-based or Secure Enclave via Secretive — install Secretive separately if going that route).
4. `gh auth login -p ssh -w`.
5. `claude login` (or set `ANTHROPIC_API_KEY` in `~/.zshrc`).
6. Authenticate cloud CLIs: `gcloud auth login`, `aws configure`, `vercel login`, `supabase login`.
7. Install the manual apps listed above.
8. Sign in to apps (Proton, Spotify, Slack, Notion, Microsoft 365, Granola, Native Access, Soulseek, Thaw, Codex Bar). Granola needs mic + screen / system-audio recording permission.
9. Configure Raycast (⌘Space), Rectangle (Accessibility), Zed (sign-in / sync), Obsidian vault.
10. Create `~/.claude/settings.json` (permissions allowlist + MCP servers); set `GITHUB_TOKEN` in `~/.zshrc`.
11. Set every macOS preference manually: Appearance, Dock, Trackpad, Keyboard, Lock Screen, Sound, Mission Control, DNS, Firewall, AirDrop, Siri / Apple Intelligence, Software Update, Language & Region, Sharing, Notifications, Touch ID (incl. for sudo via `/etc/pam.d/sudo_local`), iCloud, Time Machine, Login items, default browser, Privacy panes (Camera, Mic, Screen Recording, Full Disk Access, Accessibility).
