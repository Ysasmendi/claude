#!/bin/bash
# =============================================================================
# Mac CLI-Only Setup Script — Jaime
# =============================================================================
# Run: chmod +x new_mac_cli_setup.sh && ./new_mac_cli_setup.sh
#
# CLI-only sibling of new_mac_personal_setup.sh. Same shape, same idempotency,
# but no GUI casks and no Mac App Store apps.
#
# What this does:
#   1.  Installs Xcode Command Line Tools
#   2.  Installs Rosetta 2 (Apple Silicon)
#   3.  Installs Homebrew
#   4.  Installs CLI tools (formulae) + the gcloud-cli cask (CLI-only payload)
#   5.  Installs Oh My Zsh
#   6.  Configures Node.js via nvm (LTS)
#   7.  Configures Python via pyenv (latest 3.x)
#   8.  Installs global npm packages (Claude Code CLI, Vercel, language servers, MCP servers)
#   9.  Adds starship + direnv shell hooks to ~/.zshrc
#   10. Configures yt-dlp (mp4 output, + plugins for PO token / TLS impersonation)
#   11. Installs fzf key bindings
#
# What this does NOT do:
#   - No GUI casks (Firefox, Slack, VS Code, etc.) — see new_mac_personal_setup.sh
#   - No Mac App Store apps (Amphetamine, Keynote, etc.) — same script handles those
#   - No git identity, SSH keys, GitHub auth, Claude Code settings.json,
#     macOS system preferences (handle manually post-run)
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
WARN_LOG=$(mktemp -t mac-cli-setup-warn.XXXXXX)
FAIL_LOG=$(mktemp -t mac-cli-setup-fail.XXXXXX)
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
echo "  Mac CLI Setup — Let's go"
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

    # Languages & version managers
    nvm
    pyenv
    go

    # Python tools
    uv

    # Cloud CLIs
    supabase/tap/supabase
    awscli

    # Media tools
    yt-dlp
    ffmpeg
    atomicparsley
    aria2
    deno          # JS runtime — REQUIRED by yt-dlp 2025.11+ for YouTube
    streamlink    # complement to yt-dlp for live streams (Twitch, YT Live, etc.)
    mkvtoolnix    # MKV muxing / chapter editing
)

for formula in "${BREW_FORMULAE[@]}"; do
    if brew list "$formula" &>/dev/null 2>&1; then
        success "$formula already installed."
    else
        info "Installing $formula..."
        brew install "$formula" || warn "Failed to install $formula — continuing."
    fi
done

# Google Cloud SDK — cask, but ships CLI only (no GUI app)
info "Installing gcloud-cli..."
if brew list --cask gcloud-cli &>/dev/null 2>&1; then
    success "gcloud-cli already installed."
else
    brew install --cask gcloud-cli || warn "Failed to install gcloud-cli."
fi

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
if [[ -s "$(brew --prefix nvm)/nvm.sh" ]]; then
    source "$(brew --prefix nvm)/nvm.sh"
fi

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

    # Language servers
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
# 9. Shell hooks (starship + direnv)
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
# 10. yt-dlp config
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
# 11. fzf key bindings
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
echo -e "  ${GREEN}CLI setup complete!${NC}"
echo "============================================="
echo ""
echo -e "${YELLOW}== STILL TO DO MANUALLY ==${NC}"
echo ""
echo "Shell & dev environment:"
echo "  [ ] Open a new terminal for ~/.zshrc changes (nvm, pyenv, starship, direnv) to load"
echo "  [ ] Configure git identity:    git config --global user.name '...' && git config --global user.email '...'"
echo "  [ ] Generate / register an SSH key with GitHub"
echo "  [ ] Authenticate gh:           gh auth login -p ssh -w"
echo "  [ ] Log in to Claude Code:     claude login   (or set ANTHROPIC_API_KEY in ~/.zshrc)"
echo "  [ ] Authenticate gcloud:       gcloud auth login"
echo "  [ ] Authenticate AWS:          aws configure"
echo "  [ ] Authenticate Vercel:       vercel login"
echo "  [ ] Authenticate Supabase:     supabase login"
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
