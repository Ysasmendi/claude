# Mac CLI-Only Setup Script — Spec

**File:** `new_mac_cli/new_mac_cli_setup.sh`
**Target:** macOS (Apple Silicon), fresh install or re-run.
**Run:** `chmod +x new_mac_cli_setup.sh && ./new_mac_cli_setup.sh`

## Overview

CLI-only sibling of `new_mac_personal_setup.sh`. Same shape, same idempotency. No GUI casks, no Mac App Store apps, no VS Code extensions, no `mas`. Tuned for a headless Mac Mini that hosts long-running services (e.g. **OpenClaw**) and is reached over SSH.

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
| Core | git, gh, jq, curl, wget, ripgrep, fzf, tree, htop, btop, ncdu |
| Headless / remote | tmux, mosh, tailscale |
| Shell QoL | starship, direnv, glow, git-delta |
| GNU coreutils | coreutils, gnu-sed |
| Languages & version managers | nvm, pnpm, pyenv, go |
| Python tooling | uv |
| Cloud CLIs | supabase (via supabase/tap/supabase), awscli |
| Media | yt-dlp, ffmpeg, atomicparsley, aria2, deno, streamlink, mkvtoolnix |

Plus `gcloud-cli` as a Homebrew cask. It's the only cask in this script — Google ships gcloud as a cask but it has no GUI app, just CLI binaries.

### 5. Oh My Zsh
Installs Oh My Zsh unattended if not present.

### 6. Node.js via nvm
- Sources nvm from Homebrew path.
- Adds nvm init snippet to `~/.zshrc`.
- **Installs Node 24 explicitly** (`nvm install 24` → `nvm use 24` → `nvm alias default 24`) — OpenClaw recommends Node 24, latest LTS may still be 22.x at install time.

### 7. Python via pyenv
- Adds pyenv init snippet to `~/.zshrc`.
- Installs latest stable Python 3.x and sets it as global default.

### 8. Global npm Packages
| Package | Purpose |
|---|---|
| `@anthropic-ai/claude-code` | Claude Code CLI |
| `vercel` | Vercel deployment CLI |
| `pm2` | Process manager — keeps OpenClaw / other Node services alive across reboots |
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

### 12. Remote Login (SSH)
Enables the macOS SSH server (`sudo systemsetup -setremotelogin on`) so you can `ssh` into the Mac Mini from another machine. Idempotent — checks current state with `systemsetup -getremotelogin` first. Prints the SSH target and the local IP at the end so you can connect immediately.

### 13. Sleep / Wake
Configures the box for always-on operation:
- `sudo pmset -a sleep 0` — never sleep the system.
- `sudo pmset -a displaysleep 0` — never sleep the (probably absent) display.
- `sudo pmset -a womp 1` — Wake-on-Network-Access (Wake-on-LAN equivalent).
- `sudo pmset -a powernap 1` — allow background tasks while idle.
- `sudo pmset -a autorestart 1` — auto-reboot after a power failure.

## Using Remote Login (SSH)

After the script enables Remote Login, you'll have an `sshd` listening on TCP 22 of the Mac Mini. Here's the practical bootstrap.

### 1. Find the Mac Mini on the network

The script prints the SSH target at the end of the run, but you can re-derive it any time:

```bash
# On the Mac Mini itself
scutil --get LocalHostName        # → e.g. mac-mini-jaime  (use as mac-mini-jaime.local)
ipconfig getifaddr en0            # → primary wired IP
ipconfig getifaddr en1            # → primary Wi-Fi IP if en0 is empty
```

`*.local` (mDNS / Bonjour) works from another macOS or Linux+Avahi machine on the same LAN. From Windows you'll typically use the IP.

### 2. First connection

```bash
# From your laptop:
ssh-copy-id <user>@mac-mini-jaime.local      # uploads your laptop's pubkey to the Mini's authorized_keys
ssh <user>@mac-mini-jaime.local              # should now log in without a password
```

If you don't have a key on the laptop yet:
```bash
ssh-keygen -t ed25519 -C "laptop"
```

### 3. Make it survive reboots & network blips

```bash
# tmux: persistent sessions on the Mini
ssh <user>@mac-mini-jaime.local
tmux new -s work        # start a session — survives the SSH disconnect
# detach: Ctrl-B then d
# reattach later:        tmux attach -t work

# mosh: roaming SSH (better Wi-Fi handover, survives sleep on the laptop side)
mosh <user>@mac-mini-jaime.local
```

### 4. Reach it from outside the LAN

The script installs the `tailscale` CLI but does **not** start it. Do this once:

```bash
sudo tailscale up                    # opens a browser for SSO; afterwards the Mini is on your tailnet
tailscale ip -4                      # → e.g. 100.64.x.y, accessible from anywhere
```

Then `ssh <user>@<tailscale-ip>` (or the MagicDNS hostname) works from any device on your tailnet, regardless of NAT.

### 5. Verify state

```bash
sudo systemsetup -getremotelogin     # → "Remote Login: On"
sudo pmset -g                        # → confirm sleep=0, womp=1, autorestart=1
sudo launchctl list | grep ssh       # → com.openssh.sshd should be loaded
```

### 6. Lock it down (optional but recommended)

`sshd` defaults are reasonable, but you can harden:

```bash
# Disable password auth — keys only
sudo sed -i '' 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo launchctl kickstart -k system/com.openssh.sshd
```

## Not Included (Use `new_mac_personal_setup.sh` for these)
- GUI casks: Firefox, Chrome, Slack, Notion, VS Code, Sublime Text, Claude desktop, Codex Bar, Thaw, Raycast, Obsidian, Rectangle, etc.
- Mac App Store apps: Amphetamine, ToothFairy, Meeter, Keynote.
- VS Code Claude Code extension.

## Also Not Done (Handle Manually)
- Git identity (`user.name`, `user.email`, signing config).
- SSH key generation on the Mac Mini itself (for git pull / push as the Mini's user).
- GitHub CLI auth (`gh auth login`).
- Claude Code `~/.claude/settings.json`.
- Cloud CLI authentication: `gcloud auth login`, `aws configure`, `vercel login`, `supabase login`.
- `claude login` (or set `ANTHROPIC_API_KEY`).
- Tailscale login (`sudo tailscale up`) — script only installs the binary.
- OpenClaw install + pm2 boot (see end-of-run checklist).

## Post-Run Manual Steps
1. Open a new terminal so `~/.zshrc` changes load.
2. Configure git identity + defaults.
3. Generate / register an SSH key with GitHub.
4. `gh auth login -p ssh -w`.
5. `claude login`.
6. Authenticate gcloud / aws / vercel / supabase.
7. `sudo tailscale up` (Tailscale SSO).
8. Test Remote Login from another machine: `ssh <user>@<hostname>.local`.
9. Install OpenClaw (per current OpenClaw docs at https://openclaw.ai/), boot under pm2:
   ```bash
   pm2 start openclaw --name openclaw
   pm2 startup
   pm2 save
   ```
10. Verify Node 24 is active: `node --version` → `v24.x`.
