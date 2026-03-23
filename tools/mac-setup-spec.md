# Mac Dev Setup Script — Spec

**File:** `tools/mac-setup.sh`
**Target:** macOS (Apple Silicon), fresh install or re-run.
**Run:** `chmod +x mac-setup.sh && ./mac-setup.sh`

## Overview

Single idempotent bash script that takes a clean Mac from zero to fully configured dev machine. Safe to re-run — Homebrew skips already-installed packages, config writes are upserted.

Requires admin privileges (sudo acquired upfront and kept alive).

## What It Does

### 1. Xcode Command Line Tools
Installs Apple's CLI developer tools (`xcode-select --install`). If not yet installed, prompts the user and exits — re-run after installation.

### 2. Homebrew
Installs Homebrew if missing. Adds `/opt/homebrew/bin/brew` to PATH for Apple Silicon. Updates if already installed.

### 3. CLI Tools (via `brew install`)
| Category | Packages |
|---|---|
| Core | git, gh, jq, curl, wget, ripgrep, fzf, tree, htop |
| Languages & version managers | nvm, pyenv, go |
| Python tooling | uv |
| Cloud CLIs | supabase, awscli |
| Mac App Store CLI | mas |
| Media | yt-dlp, ffmpeg, atomicparsley, aria2 |

Google Cloud SDK installed separately as a cask.

### 4. GUI Apps (via `brew install --cask`)
| Category | Apps |
|---|---|
| Browsers | Firefox, Google Chrome |
| Privacy & Security | Proton Mail, Proton Pass, ProtonVPN, Ente Auth |
| Media | VLC, Spotify, Stremio, Calibre, Audacity |
| Communication | Discord, Slack, Notion |
| Dev Tools | iTerm2, VS Code, Sublime Text, Claude |
| Productivity | Raycast, Obsidian, Rectangle, The Unarchiver |
| Utilities | Transmission, balenaEtcher, Syncthing, Maestral, DaisyDisk, Blip |
| Music Production | Native Access |
| Microsoft Office | Word, Excel, OneDrive |

### 5. Mac App Store Apps (via `mas`)
- **Amphetamine** (ID: 937984704) — keep-awake utility.

### 6. Shell: Oh My Zsh
Installs Oh My Zsh unattended if not present.

### 7. Node.js via nvm
- Sources nvm from Homebrew path.
- Adds nvm init snippet to `~/.zshrc`.
- Installs latest LTS and sets it as default.
- `npx` is included with npm — no separate install.

### 8. Python via pyenv
- Adds pyenv init snippet to `~/.zshrc`.
- Installs latest stable Python 3.x and sets it as global default.

### 9. Global npm Packages
| Package | Purpose |
|---|---|
| `@anthropic-ai/claude-code` | Claude Code CLI |
| `vercel` | Vercel deployment CLI |

### 10. Git Identity
- Sets `user.name` and `user.email` (Jaime de la Torre / jaime@dcycle.io).
- Defaults: `init.defaultBranch main`, `pull.rebase true`, `push.autoSetupRemote true`.

### 11. SSH Key
- Generates Ed25519 key at `~/.ssh/id_ed25519` if missing.
- Adds to ssh-agent with Apple Keychain integration.
- Prints public key and instructions to add to GitHub.

### 12. GitHub CLI Auth
Runs `gh auth login` interactively if not already authenticated.

### 13. Clone Knowledge Base
Clones `git@github.com:Ysasmendi/claude.git` to `~/claude` if not present.

### 14. yt-dlp Config
Creates `~/.config/yt-dlp/config` with:
- aria2c downloader (16 connections).
- Embedded metadata and thumbnails.
- Clean output template (`%(title)s.%(ext)s`).

### 15. fzf Key Bindings
Installs fzf shell key bindings and completion for zsh.

### 16. macOS System Preferences (`defaults write`)

| Area | Key settings |
|---|---|
| Appearance | Dark mode, Graphite accent, large sidebar icons, always show scroll bars |
| Dock | 48px icons, auto-hide, minimize to app icon, bottom position, show recents |
| Mission Control | Don't rearrange Spaces, group windows by app |
| Desktop | Click wallpaper reveals desktop only in Stage Manager, monochrome widgets |
| Trackpad | Tap to click, light click, natural scroll OFF, tracking speed 1.5, three-finger Mission Control/App Exposé |
| Keyboard | Fast repeat (KeyRepeat 2, InitialKeyRepeat 15), Globe key does nothing |
| Lock Screen | 5 min screen saver, password after 5 sec, 10 min display sleep (battery & power), contact info on lock screen |
| Sound | Bubble alert, startup mute, UI sounds on, volume feedback on |
| Network | DNS → Cloudflare (1.1.1.1, 1.0.0.1), firewall enabled |
| Battery | Low Power Mode off |
| Software Update | Auto-download off, auto-macOS-update off, App Store auto-update on, security responses on |
| AirDrop | Discoverable by everyone |
| Siri | Disabled, removed from menu bar |
| Apple Intelligence | Disabled |
| Control Center | Wi-Fi in menu bar, Spotlight hidden from menu bar |
| Spotlight | Siri Suggestions disabled |
| Language & Region | English (US) + Spanish, region Spain, Celsius, metric, Monday first day |
| Sharing | Screen sharing and SMB disabled |

Restarts Dock, Finder, and SystemUIServer to apply.

## Not Automated (Manual Install Required)
- **Affinity 3** — download from serif.com.
- **Nuo-Stems 4** — download from vendor.
- **iStat Menus 6** — cask installs latest; get v6 from vendor if needed.

## Post-Run Manual Steps
1. Open new terminal for shell changes.
2. `claude login` to authenticate Claude Code.
3. Install manual apps listed above.
4. Sign in to apps (Proton, Spotify, Slack, Notion, etc.).
5. Configure Raycast to replace Spotlight (⌘Space).
