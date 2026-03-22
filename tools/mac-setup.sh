#!/bin/bash
# =============================================================================
# Mac Dev Setup Script — Jaime's Machine
# =============================================================================
# Run: chmod +x mac-setup.sh && ./mac-setup.sh
#
# What this does:
#   1. Installs Xcode Command Line Tools
#   2. Installs Homebrew
#   3. Installs CLI tools, languages, runtimes, cloud CLIs
#   4. Installs GUI apps via Homebrew Cask
#   5. Configures Oh My Zsh, nvm, pyenv, yt-dlp
#
# What this does NOT install (manual install required):
#   - Amphetamine (Mac App Store only)
#   - Affinity 3 (download from serif.com)
#   - Nuo-Stems 4 (download from vendor)
#   - iStat Menus 6 (cask installs latest version; get v6 from vendor if needed)
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

info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC} $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
fail()    { echo -e "${RED}[FAIL]${NC} $*"; }

# --- Preflight ---------------------------------------------------------------
if [[ "$(uname)" != "Darwin" ]]; then
    fail "This script is for macOS only."
    exit 1
fi

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
# 2. Homebrew
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
# 3. CLI Tools
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

    # Languages & version managers
    nvm
    pyenv
    go

    # Cloud CLIs
    supabase/tap/supabase
    awscli

    # Media tools
    yt-dlp
    ffmpeg
    atomicparsley
    aria2
)

for formula in "${BREW_FORMULAE[@]}"; do
    if brew list "$formula" &>/dev/null 2>&1; then
        success "$formula already installed."
    else
        info "Installing $formula..."
        brew install "$formula" || warn "Failed to install $formula — continuing."
    fi
done

# Google Cloud SDK (separate tap)
info "Installing Google Cloud SDK..."
if brew list --cask google-cloud-sdk &>/dev/null 2>&1; then
    success "google-cloud-sdk already installed."
else
    brew install --cask google-cloud-sdk || warn "Failed to install google-cloud-sdk."
fi

# =============================================================================
# 4. GUI Apps (Casks)
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

    # Dev Tools
    iterm2
    visual-studio-code
    sublime-text
    docker
    bruno
    claude

    # Productivity
    raycast
    obsidian
    rectangle
    the-unarchiver

    # Utilities
    transmission
    balenaetcher
    syncthing
    maestral
    daisydisk
    appcleaner
    shottr

    # Microsoft Office
    microsoft-word
    microsoft-excel
    microsoft-onedrive
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
# 5. Oh My Zsh
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
# 6. Node.js via nvm
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
# 7. Python via pyenv
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
# 8. Global npm packages
# =============================================================================
info "Installing global npm packages..."

NPM_GLOBALS=(
    "@anthropic-ai/claude-code"
    "vercel"
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
# 9. yt-dlp config
# =============================================================================
info "Configuring yt-dlp..."

YT_DLP_CONFIG_DIR="$HOME/.config/yt-dlp"
YT_DLP_CONFIG="$YT_DLP_CONFIG_DIR/config"

mkdir -p "$YT_DLP_CONFIG_DIR"

if [[ ! -f "$YT_DLP_CONFIG" ]]; then
    cat > "$YT_DLP_CONFIG" << 'YTEOF'
# Use aria2 for faster downloads (16 connections)
--downloader aria2c
--downloader-args aria2c:"-x 16 -s 16"

# Embed metadata and thumbnails
--embed-metadata
--embed-thumbnail

# Output template
-o "%(title)s.%(ext)s"
YTEOF
    success "yt-dlp config created at $YT_DLP_CONFIG"
else
    success "yt-dlp config already exists."
fi

# =============================================================================
# 10. fzf key bindings
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
echo "Manual steps remaining:"
echo "  1. Open a new terminal for shell changes to take effect"
echo "  2. Install from Mac App Store:"
echo "     - Amphetamine"
echo "  3. Install manually (not available via Homebrew):"
echo "     - Affinity 3       → https://affinity.serif.com"
echo "     - Nuo-Stems 4      → vendor website"
echo "     - iStat Menus 6    → https://bjango.com/mac/istatmenus/"
echo "     - Blip              → vendor website"
echo "  4. Sign in to apps: Proton, Spotify, Slack, Notion, etc."
echo "  5. Configure Raycast (replaces Spotlight with ⌘Space)"
echo ""
