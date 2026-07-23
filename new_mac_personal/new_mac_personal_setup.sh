#!/bin/bash
# =============================================================================
# Mac Dev Setup Script — Jaime's Machine
# =============================================================================
# Run: chmod +x new_mac_personal_setup.sh && ./new_mac_personal_setup.sh
#
# What this does:
#   1.  Installs Xcode Command Line Tools
#   2.  Installs Rosetta 2 (Apple Silicon)
#   3.  Installs Homebrew
#   4.  Installs CLI tools, languages, runtimes, cloud CLIs
#   5.  Installs GUI apps via Homebrew Cask
#   6.  Installs Mac App Store apps via mas
#   7.  Installs Oh My Zsh
#   8.  Configures Node.js via nvm (LTS)
#   9.  Configures Python via pyenv (latest 3.x)
#   10. Installs global npm packages (Claude Code CLI, Vercel, language servers, MCP servers)
#   11. Adds starship + direnv shell hooks to ~/.zshrc
#   12. Configures yt-dlp (mp4 output, + plugins for PO token / TLS impersonation)
#   13. Installs fzf key bindings
#
# What this does NOT install (manual install required):
#   - Affinity 3 (download from serif.com)
#   - Nuo-Stems 4 (download from vendor)
#   - iStat Menus 6 (cask installs latest version; get v6 from vendor if needed)
#   - Microsoft Word / Excel / OneDrive (install manually from Microsoft 365)
#
# What this NO LONGER does (removed; handle manually):
#   - Git identity (user.name / user.email / signing config)
#   - SSH key generation
#   - Hardware-backed identity (Secretive, Touch ID for sudo, SSH commit signing)
#   - GitHub CLI authentication
#   - Claude Code settings.json pre-seeding
#   - macOS system preferences (defaults write, Dock layout, DNS, firewall, etc.)
#
# Safe to re-run — Homebrew skips already-installed packages.
# =============================================================================

set -euo pipefail

# --- Colors ------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logs for end-of-run summary
WARN_LOG=$(mktemp -t mac-setup-warn.XXXXXX)
FAIL_LOG=$(mktemp -t mac-setup-fail.XXXXXX)
trap 'rm -f "$WARN_LOG" "$FAIL_LOG"' EXIT

info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC} $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; echo "$*" >> "$WARN_LOG"; }
fail()    { echo -e "${RED}[FAIL]${NC} $*"; echo "$*" >> "$FAIL_LOG"; }

# --- Preflight ---------------------------------------------------------------
if [[ "$(uname)" != "Darwin" ]]; then
    fail "This script is for macOS only."
    exit 1
fi

# --- Acquire sudo upfront -----------------------------------------------------
info "Requesting administrator privileges..."
sudo -v
# Keep sudo alive for the duration of the script
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

echo ""
echo "============================================="
echo "  Mac Dev Setup — Let's go"
echo "============================================="
echo ""

# =============================================================================
# 1. Xcode Command Line Tools
# =============================================================================
info "Checking Xcode Command Line Tools..."
if xcode-select -p &>/dev/null; then
    success "Xcode CLI tools already installed."
else
    info "Installing Xcode Command Line Tools..."
    xcode-select --install
    echo ""
    warn "A dialog should appear. Click 'Install', then re-run this script."
    exit 0
fi

# =============================================================================
# 2. Rosetta 2 (for Intel-only binaries on Apple Silicon)
# =============================================================================
if [[ "$(uname -m)" == "arm64" ]]; then
    if /usr/bin/pgrep -q oahd; then
        success "Rosetta 2 already installed."
    else
        info "Installing Rosetta 2..."
        softwareupdate --install-rosetta --agree-to-license
        success "Rosetta 2 installed."
    fi
else
    success "Intel Mac — Rosetta not needed."
fi

# =============================================================================
# 3. Homebrew
# =============================================================================
info "Checking Homebrew..."
if command -v brew &>/dev/null; then
    success "Homebrew already installed."
    info "Updating Homebrew..."
    brew update
else
    info "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ -f /opt/homebrew/bin/brew ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    fi
    success "Homebrew installed."
fi

# =============================================================================
# 4. CLI Tools
# =============================================================================
info "Installing core CLI tools..."

BREW_FORMULAE=(
    # Core tools
    git
    gh
    jq
    curl
    wget
    ripgrep
    fzf
    tree
    htop
    btop

    # Shell quality-of-life
    starship      # cross-shell prompt
    direnv        # per-directory env vars
    glow          # markdown renderer for the terminal
    git-delta     # syntax-highlighted git diff (configure manually if desired)

    # GNU coreutils (so Bash-tool commands behave portably)
    coreutils
    gnu-sed
    # gnu-grep dropped: no longer a Homebrew formula; use `brew install grep`
    # (ships GNU grep as `ggrep`) if you need it. Ripgrep covers most use cases.

    # Languages & version managers
    nvm
    pyenv
    go

    # Note: clangd is only available via `brew install llvm` (~1.5GB). Skipped;
    # VS Code's C/C++ extension ships its own clangd, and Xcode has its own.

    # Python tools
    uv

    # Cloud CLIs
    supabase/tap/supabase
    awscli

    # Mac App Store CLI
    mas

    # Media tools
    yt-dlp
    ffmpeg
    atomicparsley
    aria2
    deno          # JS runtime — REQUIRED by yt-dlp 2025.11+ for YouTube
    streamlink    # complement to yt-dlp for live streams (Twitch, YT Live, etc.)
    mkvtoolnix    # MKV muxing / chapter editing (kept for archival use)
)

for formula in "${BREW_FORMULAE[@]}"; do
    if brew list "$formula" &>/dev/null 2>&1; then
        success "$formula already installed."
    else
        info "Installing $formula..."
        brew install "$formula" || warn "Failed to install $formula — continuing."
    fi
done

# Google Cloud SDK (cask renamed from google-cloud-sdk)
info "Installing Google Cloud SDK..."
if brew list --cask gcloud-cli &>/dev/null 2>&1; then
    success "gcloud-cli already installed."
else
    brew install --cask gcloud-cli || warn "Failed to install gcloud-cli."
fi

# =============================================================================
# 5. GUI Apps (Casks)
# =============================================================================
info "Installing GUI applications..."

BREW_CASKS=(
    # Browsers
    firefox
    google-chrome

    # Privacy & Security
    proton-mail
    proton-pass
    protonvpn
    ente-auth

    # Media
    vlc
    spotify
    stremio
    calibre
    audacity

    # Communication
    discord
    slack
    notion

    # Meetings
    granola       # AI meeting recorder / notepad

    # Dev Tools
    zed
    claude

    # LLM tooling (menu bar) — third-party tap, fully qualified
    steipete/tap/codexbar    # menu bar usage monitor for Codex and Claude

    # Productivity
    raycast
    obsidian
    rectangle
    the-unarchiver

    # Menu bar
    thaw          # menu bar manager

    # Utilities
    transmission
    balenaetcher
    localsend     # open-source AirDrop alternative
    daisydisk
    blip
    soulseek      # SoulseekQt — P2P file-sharing network (slsknet.org)

    # Music Production
    native-access
)

for cask in "${BREW_CASKS[@]}"; do
    if brew list --cask "$cask" &>/dev/null 2>&1; then
        success "$cask already installed."
    else
        info "Installing $cask..."
        brew install --cask "$cask" || warn "Failed to install $cask — continuing."
    fi
done

# =============================================================================
# 6. Mac App Store apps (via mas)
# =============================================================================
info "Installing Mac App Store apps..."

MAS_APPS=(
    "937984704:Amphetamine"      # keep-awake utility
    "361285480:Keynote"          # Apple presentation app
)

if command -v mas &>/dev/null; then
    for entry in "${MAS_APPS[@]}"; do
        id="${entry%%:*}"
        name="${entry##*:}"
        if mas list | grep -q "^$id "; then
            success "$name already installed."
        else
            info "Installing $name (App Store ID $id)..."
            mas install "$id" || warn "Failed to install $name — you may need to sign in to the App Store first."
        fi
    done
else
    warn "mas not available. Install it first (brew install mas), then run:"
    for entry in "${MAS_APPS[@]}"; do
        echo "  mas install ${entry%%:*}   # ${entry##*:}"
    done
fi

# =============================================================================
# 7. Oh My Zsh
# =============================================================================
info "Checking Oh My Zsh..."
if [[ -d "$HOME/.oh-my-zsh" ]]; then
    success "Oh My Zsh already installed."
else
    info "Installing Oh My Zsh..."
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
    success "Oh My Zsh installed."
fi

# =============================================================================
# 8. Node.js via nvm
# =============================================================================
info "Setting up Node.js via nvm..."

export NVM_DIR="$HOME/.nvm"
# nvm installed via Homebrew puts its script here:
if [[ -s "$(brew --prefix nvm)/nvm.sh" ]]; then
    source "$(brew --prefix nvm)/nvm.sh"
fi

# Add nvm to shell config if not already there
NVM_SNIPPET='export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix nvm)/nvm.sh" ] && source "$(brew --prefix nvm)/nvm.sh"
[ -s "$(brew --prefix nvm)/etc/bash_completion.d/nvm" ] && source "$(brew --prefix nvm)/etc/bash_completion.d/nvm"'

if ! grep -q 'NVM_DIR' ~/.zshrc 2>/dev/null; then
    echo "" >> ~/.zshrc
    echo "# nvm" >> ~/.zshrc
    echo "$NVM_SNIPPET" >> ~/.zshrc
    info "Added nvm to ~/.zshrc"
fi

if command -v nvm &>/dev/null; then
    info "Installing Node.js LTS..."
    nvm install --lts
    nvm use --lts
    nvm alias default node
    success "Node.js $(node --version) installed."
else
    warn "nvm not available in this shell. Open a new terminal and run: nvm install --lts"
fi

# =============================================================================
# 9. Python via pyenv
# =============================================================================
info "Setting up Python via pyenv..."

PYENV_SNIPPET='export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"'

if ! grep -q 'PYENV_ROOT' ~/.zshrc 2>/dev/null; then
    echo "" >> ~/.zshrc
    echo "# pyenv" >> ~/.zshrc
    echo "$PYENV_SNIPPET" >> ~/.zshrc
    info "Added pyenv to ~/.zshrc"
fi

if command -v pyenv &>/dev/null; then
    LATEST_PY=$(pyenv install --list | grep -E '^\s*3\.[0-9]+\.[0-9]+$' | tail -1 | tr -d ' ')
    if [[ -n "$LATEST_PY" ]]; then
        info "Installing Python $LATEST_PY..."
        pyenv install -s "$LATEST_PY"
        pyenv global "$LATEST_PY"
        success "Python $LATEST_PY installed."
    fi
else
    warn "pyenv not available in this shell. Open a new terminal and run: pyenv install 3.x.x"
fi

# =============================================================================
# 10. Global npm packages
# =============================================================================
info "Installing global npm packages..."

NPM_GLOBALS=(
    "@anthropic-ai/claude-code"
    "vercel"

    # Language servers (Claude Code shells out to these)
    "pyright"
    "typescript"
    "ts-node"

    # MCP servers
    "@modelcontextprotocol/server-github"
    "@modelcontextprotocol/server-filesystem"
)

if command -v npm &>/dev/null; then
    for pkg in "${NPM_GLOBALS[@]}"; do
        info "Installing $pkg..."
        npm install -g "$pkg" || warn "Failed to install $pkg."
    done
    success "Global npm packages installed."
else
    warn "npm not available. Install Node.js first, then run:"
    for pkg in "${NPM_GLOBALS[@]}"; do
        echo "  npm install -g $pkg"
    done
fi

# =============================================================================
# 11. Shell hooks (starship + direnv)
# =============================================================================
info "Configuring shell hooks..."

if ! grep -q 'starship init' ~/.zshrc 2>/dev/null; then
    echo "" >> ~/.zshrc
    echo "# starship prompt" >> ~/.zshrc
    echo 'eval "$(starship init zsh)"' >> ~/.zshrc
    info "Added starship to ~/.zshrc"
fi

if ! grep -q 'direnv hook' ~/.zshrc 2>/dev/null; then
    echo "" >> ~/.zshrc
    echo "# direnv" >> ~/.zshrc
    echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
    info "Added direnv to ~/.zshrc"
fi

success "Shell hooks configured."

# =============================================================================
# 12. yt-dlp config
# =============================================================================
info "Configuring yt-dlp..."

YT_DLP_CONFIG_DIR="$HOME/.config/yt-dlp"
YT_DLP_CONFIG="$YT_DLP_CONFIG_DIR/config"

mkdir -p "$YT_DLP_CONFIG_DIR"

if [[ ! -f "$YT_DLP_CONFIG" ]]; then
    cat > "$YT_DLP_CONFIG" << 'YTEOF'
# --- Downloader: aria2c with 16 parallel connections ----------------------
# (yt-dlp falls back to ffmpeg automatically for HLS/DASH streams)
--downloader aria2c
--downloader-args aria2c:"-x 16 -s 16 -k 1M"

# --- Format: prefer mp4-compatible streams; remux to mp4 when needed -------
# Falls back to best video + best audio if mp4-native streams aren't offered.
-f "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/bv*+ba/b"
--merge-output-format mp4
--remux-video mp4

# --- Metadata & embeds ------------------------------------------------------
--embed-metadata
--embed-thumbnail
--embed-subs
--embed-chapters
--sub-langs "en.*,es.*"
--write-subs
--write-auto-subs

# --- SponsorBlock (YouTube): mark all categories, auto-cut sponsors --------
--sponsorblock-mark all
--sponsorblock-remove sponsor

# --- Archival info files ----------------------------------------------------
--write-info-json
--write-description

# --- Output: title + id keeps filenames collision-proof --------------------
-o "%(title)s [%(id)s].%(ext)s"

# --- Resilience -------------------------------------------------------------
--retries 10
--fragment-retries 10
--retry-sleep 5
--file-access-retries 3
--no-overwrites
--continue
--ignore-errors
--no-playlist

# --- Throttle dodge & geo bypass -------------------------------------------
--throttled-rate 100K
--geo-bypass

# --- Browser cookies (uncomment ONE) ---------------------------------------
# Firefox works cleanly on macOS; Chrome prompts Keychain; Safari is broken.
# --cookies-from-browser firefox
# --cookies-from-browser chrome
YTEOF
    success "yt-dlp config created at $YT_DLP_CONFIG"
else
    success "yt-dlp config already exists."
fi

# --- yt-dlp plugins --------------------------------------------------------
# yt-dlp is installed via Homebrew which sets up its own Python venv at
# $(brew --prefix yt-dlp)/libexec. Install plugins INTO that venv — yt-dlp
# picks them up automatically. This sidesteps PEP 668's "externally-managed-
# environment" error you get from system pip3 on macOS.
# Caveat: a `brew upgrade yt-dlp` may reset the venv; safe to re-run this script.
YT_DLP_PREFIX="$(brew --prefix yt-dlp 2>/dev/null || true)"
YT_DLP_PIP="$YT_DLP_PREFIX/libexec/bin/pip"
if [[ -n "$YT_DLP_PREFIX" && -x "$YT_DLP_PIP" ]]; then
    info "Installing yt-dlp plugins into its bundled venv..."
    "$YT_DLP_PIP" install --upgrade bgutil-ytdlp-pot-provider \
        || warn "Failed to install bgutil-ytdlp-pot-provider into yt-dlp venv."
    "$YT_DLP_PIP" install --upgrade curl-cffi \
        || warn "Failed to install curl-cffi into yt-dlp venv."
    success "yt-dlp plugins installed."
else
    warn "yt-dlp's bundled pip not found. After yt-dlp is installed, run:"
    echo "  \"\$(brew --prefix yt-dlp)/libexec/bin/pip\" install bgutil-ytdlp-pot-provider curl-cffi"
fi

# =============================================================================
# 13. fzf key bindings
# =============================================================================
info "Setting up fzf key bindings..."
if [[ -f "$(brew --prefix fzf)/install" ]]; then
    "$(brew --prefix fzf)/install" --key-bindings --completion --no-update-rc --no-bash --no-fish
    success "fzf key bindings installed."
fi

# =============================================================================
# Done
# =============================================================================
echo ""
echo "============================================="
echo -e "  ${GREEN}Setup complete!${NC}"
echo "============================================="
echo ""
echo -e "${YELLOW}== STILL TO DO MANUALLY ==${NC}"
echo ""
echo "Shell & dev environment:"
echo "  [ ] Open a new terminal for ~/.zshrc changes (nvm, pyenv, starship, direnv) to load"
echo "  [ ] Configure git identity:    git config --global user.name '...' && git config --global user.email '...'"
echo "  [ ] Generate / register an SSH key with GitHub (file-based or Secure Enclave via Secretive)"
echo "  [ ] Authenticate gh:           gh auth login -p ssh -w"
echo "  [ ] Log in to Claude Code:     claude login   (or set ANTHROPIC_API_KEY in ~/.zshrc)"
echo "  [ ] Authenticate gcloud:       gcloud auth login"
echo "  [ ] Authenticate AWS:          aws configure"
echo "  [ ] Authenticate Vercel:       vercel login"
echo "  [ ] Authenticate Supabase:     supabase login"
echo ""
echo "Apps to install manually (no Homebrew/App Store):"
echo "  [ ] Affinity 3                → https://affinity.serif.com"
echo "  [ ] Nuo-Stems 4               → vendor website"
echo "  [ ] iStat Menus 6             → https://bjango.com/mac/istatmenus/  (cask = latest, get v6 from vendor)"
echo "  [ ] Microsoft Word / Excel / OneDrive → https://www.microsoft.com/microsoft-365"
echo ""
echo "Sign in / activate apps:"
echo "  [ ] Proton (Mail, Pass, VPN)"
echo "  [ ] Ente Auth"
echo "  [ ] Spotify, Slack, Notion, Discord"
echo "  [ ] Microsoft 365 (Word, Excel, OneDrive)"
echo "  [ ] Granola (sign in; grant mic + screen / system-audio recording)"
echo "  [ ] Native Access (Native Instruments account)"
echo "  [ ] Soulseek (create account / sign in)"
echo "  [ ] Thaw (configure menu bar layout)"
echo "  [ ] Codex Bar (sign in / configure)"
echo ""
echo "App config:"
echo "  [ ] Raycast            → set ⌘Space, import settings, enable extensions"
echo "  [ ] Rectangle          → grant Accessibility, set shortcuts"
echo "  [ ] Zed                → sign in (settings sync / collaboration)"
echo "  [ ] Obsidian           → open vault from iCloud / sync"
echo ""
echo "macOS settings (now ALL manual — the defaults block was removed):"
echo "  [ ] Appearance, Dock, Trackpad, Keyboard, Lock Screen, Sound, Mission Control"
echo "  [ ] DNS (1.1.1.1 / 1.0.0.1), firewall, AirDrop, Siri, Apple Intelligence"
echo "  [ ] Software Update, Language & Region, Sharing, Notifications"
echo "  [ ] Touch ID & passcode (incl. Touch ID for sudo via /etc/pam.d/sudo_local)"
echo "  [ ] iCloud sign-in & which apps sync"
echo "  [ ] Apple ID / App Store sign-in (needed before mas can install)"
echo "  [ ] Time Machine / backup destination"
echo "  [ ] Login items (iStat Menus, Rectangle, Amphetamine, Thaw, Codex Bar, Granola)"
echo "  [ ] Default browser:        System Settings → Desktop & Dock → Default web browser"
echo "  [ ] Privacy: Camera / Microphone / Screen Recording for Chrome, Firefox, Slack, Granola"
echo "  [ ] Privacy: Full Disk Access (Claude Code, backup tools)"
echo "  [ ] Privacy: Accessibility (Rectangle, Raycast)"
echo ""
echo "Claude Code config (was auto-pre-seeded; now manual):"
echo "  [ ] Create ~/.claude/settings.json with your permissions allowlist + MCP servers"
echo "  [ ] Set GITHUB_TOKEN in ~/.zshrc (gh auth token | pbcopy)"
echo ""

# =============================================================================
# Summary: collected warnings and errors
# =============================================================================
WARN_COUNT=0
FAIL_COUNT=0
[[ -s "$WARN_LOG" ]] && WARN_COUNT=$(wc -l < "$WARN_LOG" | tr -d ' ')
[[ -s "$FAIL_LOG" ]] && FAIL_COUNT=$(wc -l < "$FAIL_LOG" | tr -d ' ')

echo "============================================="
if (( FAIL_COUNT == 0 && WARN_COUNT == 0 )); then
    echo -e "  ${GREEN}Run summary: clean — no warnings or errors.${NC}"
    echo "============================================="
    echo ""
else
    echo -e "  Run summary: ${RED}${FAIL_COUNT} error(s)${NC}, ${YELLOW}${WARN_COUNT} warning(s)${NC}"
    echo "============================================="
    echo ""
    if (( FAIL_COUNT > 0 )); then
        echo -e "${RED}Errors:${NC}"
        nl -ba -w2 -s'. ' "$FAIL_LOG" | sed 's/^/  /'
        echo ""
    fi
    if (( WARN_COUNT > 0 )); then
        echo -e "${YELLOW}Warnings:${NC}"
        nl -ba -w2 -s'. ' "$WARN_LOG" | sed 's/^/  /'
        echo ""
    fi
    echo "Review the items above before considering the setup finished."
    echo ""
fi
