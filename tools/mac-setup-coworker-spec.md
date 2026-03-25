# Mac Dev Setup Script — Coworker Machine

**File:** `tools/mac-setup-coworker.sh`
**Target:** macOS (Apple Silicon), fresh install or re-run.
**Run:** `chmod +x mac-setup-coworker.sh && ./mac-setup-coworker.sh`

## Overview

Single idempotent bash script that takes a clean Mac from zero to a fully configured Dcycle dev machine. Safe to re-run — Homebrew skips already-installed packages, config writes are upserted.

Prompts the user for their name and email at the start (used for Git identity and SSH key).

Requires admin privileges (sudo acquired upfront and kept alive).

## What It Does

### 1. Xcode Command Line Tools
Installs Apple's CLI developer tools (`xcode-select --install`). If not yet installed, prompts the user and exits — re-run after installation.

### 1b. Rosetta 2
Installs Rosetta 2 on Apple Silicon Macs (`softwareupdate --install-rosetta --agree-to-license`). Required for Intel-only binaries. Skips on Intel Macs. Detects existing install by checking for the `oahd` daemon.

### 2. User Identity
Prompts for full name and email. Used in Git config and SSH key generation.

### 3. Homebrew
Installs Homebrew if missing. Adds `/opt/homebrew/bin/brew` to PATH for Apple Silicon. Updates if already installed.

### 4. CLI Tools (via `brew install`)
| Category | Packages |
|---|---|
| Core | git, gh, jq, curl, wget, ripgrep, fzf, tree, htop |
| Languages & version managers | nvm, pyenv, go |
| Python tooling | uv |
| Cloud CLIs | supabase, awscli |

Google Cloud SDK installed separately as a cask.

### 5. GUI Apps (via `brew install --cask`)
| Category | Apps |
|---|---|
| Browsers | Firefox, Google Chrome |
| Privacy & Security | Proton Mail, Proton Pass, ProtonVPN, Ente Auth |
| Media | VLC, Spotify, Audacity |
| Communication | Slack, Notion |
| Dev Tools | iTerm2, VS Code, Sublime Text, Claude |
| Utilities | Rectangle, The Unarchiver, Blip |

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
- Sets `user.name` and `user.email` from prompted values.
- Defaults: `init.defaultBranch main`, `pull.rebase true`, `push.autoSetupRemote true`.

### 11. SSH Key
- Generates Ed25519 key at `~/.ssh/id_ed25519` if missing.
- Adds to ssh-agent with Apple Keychain integration.
- Prints public key and instructions to add to GitHub.

### 12. GitHub CLI Auth
Runs `gh auth login` interactively if not already authenticated.

### 13. fzf Key Bindings
Installs fzf shell key bindings and completion for zsh.

### 14. macOS System Preferences (`defaults write`)

| Area | Key settings |
|---|---|
| Appearance | Dark mode, Graphite accent, large sidebar icons, always show scroll bars |
| Dock | 48px icons, auto-hide, minimize to app icon, bottom position, show recents |
| Mission Control | Don't rearrange Spaces, group windows by app |
| Desktop | Click wallpaper reveals desktop only in Stage Manager, monochrome widgets |
| Trackpad | Tap to click, light click, natural scroll OFF, tracking speed 1.5, three-finger Mission Control/App Exposé |
| Keyboard | Fast repeat (KeyRepeat 2, InitialKeyRepeat 15), Globe key does nothing |
| Lock Screen | 5 min screen saver, password after 5 sec, 10 min display sleep (battery & power) |
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

## Post-Run Manual Steps
1. Open new terminal for shell changes.
2. `claude login` to authenticate Claude Code.
3. Sign in to apps (Proton, Spotify, Slack, Notion, etc.).
