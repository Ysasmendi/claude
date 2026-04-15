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
#   5. Installs Mac App Store apps via mas
#   6. Configures Oh My Zsh, nvm, pyenv
#   7. Installs global npm packages (Claude Code CLI, Vercel)
#   8. Sets up Git identity, file-based SSH key (bootstrap), GitHub CLI auth,
#      Touch ID for sudo, SSH commit signing (Secretive enclave key set up manually)
#   9. Configures yt-dlp (+ pip plugins for PO token / TLS impersonation) + fzf
#  10. Pre-seeds ~/.claude/settings.json (permissions allowlist + GitHub & filesystem MCP servers)
#  11. Applies macOS system preferences (defaults write)
#
# What this does NOT install (manual install required):
#   - Affinity 3 (download from serif.com)
#   - Nuo-Stems 4 (download from vendor)
#   - iStat Menus 6 (cask installs latest version; get v6 from vendor if needed)
#   - Insta360 Wave Controller (download from insta360.com)
#   - Fathom (cask currently broken — download from fathom.video/download)
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
# 1b. Rosetta 2 (for Intel-only binaries on Apple Silicon)
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
    btop
    dockutil      # CLI tool to add/remove Dock items (used at end of script)

    # Shell quality-of-life
    starship      # cross-shell prompt
    direnv        # per-directory env vars
    glow          # markdown renderer for the terminal
    git-delta     # syntax-highlighted git diff

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
    claude

    # Productivity
    raycast
    obsidian
    rectangle
    the-unarchiver

    # Hardware-backed identity (Secure Enclave SSH keys)
    secretive

    # Utilities
    transmission
    balenaetcher
    syncthing
    maestral
    daisydisk
    blip
    bartender    # Bartender 6 — menu bar manager (cask tracks latest major version)

    # Music Production
    native-access

    # Microsoft Office
    microsoft-word
    microsoft-excel
    onedrive       # Microsoft OneDrive (cask was renamed from microsoft-onedrive)
)

for cask in "${BREW_CASKS[@]}"; do
    if brew list --cask "$cask" &>/dev/null 2>&1; then
        success "$cask already installed."
    else
        info "Installing $cask..."
        brew install --cask "$cask" || warn "Failed to install $cask — continuing."
    fi
done

# --- VS Code extensions ---
if command -v code &>/dev/null; then
    info "Installing VS Code Claude Code extension..."
    code --install-extension anthropic.claude-code --force >/dev/null 2>&1 \
        && success "anthropic.claude-code installed in VS Code." \
        || warn "Failed to install Claude Code VS Code extension — install manually from the marketplace."
else
    warn "VS Code 'code' CLI not on PATH. Open VS Code → Cmd+Shift+P → 'Shell Command: Install code command in PATH', then run: code --install-extension anthropic.claude-code"
fi

# =============================================================================
# 5. Mac App Store apps (via mas)
# =============================================================================
info "Installing Mac App Store apps..."

MAS_APPS=(
    "937984704:Amphetamine"      # keep-awake utility
    "1191449274:ToothFairy"      # one-click Bluetooth audio switcher
    "1510445899:Meeter"          # meeting links in menu bar
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
# 6. Oh My Zsh
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
# 7. Node.js via nvm
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
# 8. Python via pyenv
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
# 9. Global npm packages
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
# 10. Git identity
# =============================================================================
info "Configuring Git identity..."

if [[ -z "$(git config --global user.name)" ]]; then
    git config --global user.name "ysasmendi"
    git config --global user.email "ikatza@proton.me"
    success "Git identity set (ysasmendi <ikatza@proton.me>)."
else
    success "Git identity already configured: $(git config --global user.name) <$(git config --global user.email)>"
fi

# Sensible Git defaults
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global push.autoSetupRemote true

# Use delta as the git pager (syntax-highlighted diffs)
if command -v delta &>/dev/null; then
    git config --global core.pager "delta"
    git config --global interactive.diffFilter "delta --color-only"
    git config --global delta.navigate true
    git config --global merge.conflictstyle "zdiff3"
    success "delta configured as git pager."
fi

# --- starship & direnv shell hooks ------------------------------------------
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

# =============================================================================
# 11. SSH key for GitHub
# =============================================================================
info "Checking SSH key..."

SSH_KEY="$HOME/.ssh/id_ed25519"
if [[ -f "$SSH_KEY" ]]; then
    success "SSH key already exists at $SSH_KEY."
else
    info "Generating SSH key..."
    ssh-keygen -t ed25519 -C "ikatza@proton.me" -f "$SSH_KEY" -N ""
    eval "$(ssh-agent -s)" >/dev/null
    ssh-add --apple-use-keychain "$SSH_KEY" 2>/dev/null || ssh-add "$SSH_KEY"
    success "SSH key generated. Public key:"
    cat "${SSH_KEY}.pub"
    echo ""
    warn "Add this key to GitHub: gh ssh-key add ${SSH_KEY}.pub --title \"Mac $(date +%Y)\""
fi

# =============================================================================
# 11b. Hardware-backed identity (Secure Enclave + Touch ID)
# =============================================================================
# Secretive is installed as a cask. This block:
#   - Enables Touch ID for sudo (survives macOS updates via sudo_local).
#   - Pre-configures git to sign commits with an SSH key (set user.signingkey
#     manually after creating the enclave key in Secretive).
#   - Leaves ~/.ssh/config alone — see the manual checklist for the
#     IdentityAgent line (only safe to add AFTER Secretive has a key).
info "Configuring hardware-backed identity..."

# --- Touch ID for sudo --------------------------------------------------------
SUDO_LOCAL="/etc/pam.d/sudo_local"
SUDO_TEMPLATE="/etc/pam.d/sudo_local.template"

if [[ -f "$SUDO_LOCAL" ]] && grep -q '^auth.*pam_tid.so' "$SUDO_LOCAL"; then
    success "Touch ID for sudo already enabled."
elif [[ -f "$SUDO_TEMPLATE" ]]; then
    info "Enabling Touch ID for sudo via $SUDO_LOCAL..."
    sudo cp "$SUDO_TEMPLATE" "$SUDO_LOCAL"
    sudo sed -i '' 's/^#auth\(.*\)pam_tid.so/auth\1pam_tid.so/' "$SUDO_LOCAL"
    success "Touch ID for sudo enabled."
else
    warn "$SUDO_TEMPLATE not found — cannot enable Touch ID for sudo automatically."
    warn "Add this line manually to /etc/pam.d/sudo (above the Apple lines):"
    warn "  auth       sufficient     pam_tid.so"
fi

# --- Git: sign commits with SSH (Secure Enclave key once created) ------------
git config --global gpg.format ssh
git config --global commit.gpgsign true
git config --global tag.gpgsign true
# user.signingkey will be set manually after the Secretive key exists.
# Tell git to trust the same allowed_signers file for verifying commits:
ALLOWED_SIGNERS="$HOME/.ssh/allowed_signers"
mkdir -p "$HOME/.ssh"
touch "$ALLOWED_SIGNERS"
git config --global gpg.ssh.allowedSignersFile "$ALLOWED_SIGNERS"
success "Git configured for SSH commit signing (set user.signingkey after creating enclave key)."

# =============================================================================
# 12. GitHub CLI authentication
# =============================================================================
info "Checking GitHub CLI auth..."

if gh auth status &>/dev/null 2>&1; then
    success "GitHub CLI already authenticated."
else
    warn "GitHub CLI not authenticated. Running interactive login..."
    gh auth login -p ssh -w || warn "gh auth login failed — run it manually after setup."
fi

# =============================================================================
# 13. yt-dlp config
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

# --- Format: best video + best audio, prefer mkv as it accepts every codec
-f "bv*+ba/b"
--merge-output-format mkv
--remux-video mkv

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
# 14. fzf key bindings
# =============================================================================
info "Setting up fzf key bindings..."
if [[ -f "$(brew --prefix fzf)/install" ]]; then
    "$(brew --prefix fzf)/install" --key-bindings --completion --no-update-rc --no-bash --no-fish
    success "fzf key bindings installed."
fi

# =============================================================================
# 15. Claude Code config (~/.claude/settings.json)
# =============================================================================
info "Configuring Claude Code defaults..."

CLAUDE_DIR="$HOME/.claude"
CLAUDE_SETTINGS="$CLAUDE_DIR/settings.json"
mkdir -p "$CLAUDE_DIR"

if [[ ! -f "$CLAUDE_SETTINGS" ]]; then
    cat > "$CLAUDE_SETTINGS" << 'CCEOF'
{
  "permissions": {
    "allow": [
      "Bash(cd:*)",
      "Bash(ls:*)",
      "Bash(pwd)",
      "Bash(git:*)",
      "Bash(gh:*)",
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Bash(node:*)",
      "Bash(python3:*)",
      "Bash(pip3:*)",
      "Bash(uv:*)",
      "Bash(brew:*)",
      "Bash(curl:*)",
      "Bash(wget:*)",
      "Bash(jq:*)",
      "Bash(rg:*)",
      "Bash(tree:*)",
      "Bash(docker:*)",
      "Edit",
      "Write",
      "Read",
      "Glob",
      "Grep",
      "WebFetch",
      "WebSearch",
      "Skill"
    ]
  },
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${HOME}"]
    }
  }
}
CCEOF
    success "Claude Code settings written to $CLAUDE_SETTINGS"
else
    success "Claude Code settings already exist at $CLAUDE_SETTINGS — leaving untouched."
fi

# Add ANTHROPIC_API_KEY placeholder + GITHUB_TOKEN reminder to ~/.zshrc if absent
if ! grep -q 'ANTHROPIC_API_KEY' ~/.zshrc 2>/dev/null; then
    cat >> ~/.zshrc << 'ENVEOF'

# Claude Code / Anthropic
# export ANTHROPIC_API_KEY="sk-ant-..."   # Uncomment + paste your key (or rely on `claude login`)
# export GITHUB_TOKEN="ghp_..."           # Used by the GitHub MCP server in ~/.claude/settings.json
ENVEOF
    info "Added ANTHROPIC_API_KEY / GITHUB_TOKEN placeholders to ~/.zshrc"
fi

# =============================================================================
# 16. macOS System Preferences
# =============================================================================
# ⚠️  macOS Tahoe (26+) note:
# Apple has tightened preference sandboxing in recent macOS releases.
# A growing number of the `defaults write` calls below are silently ignored
# on Tahoe — especially anything touching Lock Screen, Siri, AirDrop
# discoverability, Software Update, Widget appearance, and BezelServices.
#
# The block still runs (no-ops are harmless) but don't assume every setting
# actually applied. For settings that MUST stick, either:
#   1. Set them manually in System Settings after the script finishes, or
#   2. Push them via a configuration profile / MDM (Mosyle for Dcycle machines).
#
# Dock, Trackpad, Keyboard, Appearance, Finder, Language/Region, DNS, Firewall
# and pmset (battery / display sleep) are the blocks most likely to still work.
# =============================================================================
info "Applying macOS system preferences (see Tahoe caveat above)..."

# --- Appearance ---------------------------------------------------------------
# Dark mode
defaults write NSGlobalDomain AppleInterfaceStyle -string "Dark"
# Accent color: Graphite (-1)
defaults write NSGlobalDomain AppleAccentColor -int -1
# Highlight color: Graphite
defaults write NSGlobalDomain AppleHighlightColor -string "0.847059 0.847059 0.862745 Graphite"
# Sidebar icon size: Large (3)
defaults write NSGlobalDomain NSTableViewDefaultSizeMode -int 3
# Show scroll bars: Always
defaults write NSGlobalDomain AppleShowScrollBars -string "Always"
# Click scroll bar to jump to spot clicked
defaults write NSGlobalDomain AppleScrollerPagingBehavior -int 1

success "Appearance configured."

# --- Dock ---------------------------------------------------------------------
# Dock icon size
defaults write com.apple.dock tilesize -int 48
# Magnification off
defaults write com.apple.dock magnification -bool false
# Position: bottom
defaults write com.apple.dock orientation -string "bottom"
# Minimize using Genie effect
defaults write com.apple.dock mineffect -string "genie"
# Double-click title bar to fill
defaults write NSGlobalDomain AppleActionOnDoubleClick -string "Fill"
# Minimize windows into application icon
defaults write com.apple.dock minimize-to-application -bool true
# Auto-hide the Dock
defaults write com.apple.dock autohide -bool true
# Animate opening applications
defaults write com.apple.dock launchanim -bool true
# Show indicators for open applications
defaults write com.apple.dock show-process-indicators -bool true
# Show suggested and recent apps in Dock
defaults write com.apple.dock show-recents -bool true

success "Dock configured."

# --- Mission Control ----------------------------------------------------------
# Don't automatically rearrange Spaces based on most recent use
defaults write com.apple.dock mru-spaces -bool false
# Group windows by application
defaults write com.apple.dock expose-group-apps -bool true

success "Mission Control configured."

# --- Desktop & Stage Manager --------------------------------------------------
# Click wallpaper to reveal desktop: Only in Stage Manager
defaults write com.apple.WindowManager EnableStandardClickToShowDesktop -bool false
# Widget style: Monochrome
defaults write com.apple.widgets widgetAppearance -int 0

success "Desktop & Stage Manager configured."

# --- Finder (general macOS window behavior) -----------------------------------
# Prefer tabs when opening documents: Always
defaults write NSGlobalDomain AppleWindowTabbingMode -string "always"
# Default browser: Firefox (set via open command, not defaults)

success "Window behavior configured."

# --- Display ------------------------------------------------------------------
# Disable auto brightness (requires restart or re-login to fully apply)
# Note: This may require SIP adjustments on some macOS versions
defaults write com.apple.BezelServices dAuto -bool false 2>/dev/null || true

success "Display configured."

# --- Sound --------------------------------------------------------------------
# Alert sound: Bubble
defaults write NSGlobalDomain com.apple.sound.beep.sound -string "/System/Library/Sounds/Bubble.aiff"
# Disable startup sound
sudo nvram StartupMute=%01 2>/dev/null || warn "Could not set startup mute (needs sudo)."
# UI sound effects on
defaults write NSGlobalDomain com.apple.sound.uiaudio.enabled -bool true
# Play feedback when volume is changed
defaults write NSGlobalDomain com.apple.sound.beep.feedback -bool true

success "Sound configured."

# --- Trackpad -----------------------------------------------------------------
# Tap to click
defaults write com.apple.AppleMultitouchTrackpad Clicking -bool true
defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad Clicking -bool true
# Light click (0 = light, 1 = medium, 2 = firm)
defaults write com.apple.AppleMultitouchTrackpad FirstClickThreshold -int 0
defaults write com.apple.AppleMultitouchTrackpad SecondClickThreshold -int 0
# Force Click and haptic feedback
defaults write com.apple.AppleMultitouchTrackpad ForceSuppressed -bool false
defaults write com.apple.AppleMultitouchTrackpad ActuateDetents -int 1
# Tracking speed (~70%)
defaults write NSGlobalDomain com.apple.trackpad.scaling -float 1.5
# Disable natural scrolling
defaults write NSGlobalDomain com.apple.swipescrolldirection -bool false
# Three-finger look up
defaults write com.apple.AppleMultitouchTrackpad TrackpadThreeFingerTapGesture -int 2
# Secondary click: two-finger click/tap
defaults write com.apple.AppleMultitouchTrackpad TrackpadRightClick -bool true
# Smart zoom
defaults write com.apple.AppleMultitouchTrackpad TrackpadTwoFingerDoubleTapGesture -int 1
# Pinch to zoom
defaults write com.apple.AppleMultitouchTrackpad TrackpadPinch -int 1
# Rotate
defaults write com.apple.AppleMultitouchTrackpad TrackpadRotate -int 1
# Swipe between pages: two or three fingers
defaults write NSGlobalDomain AppleEnableSwipeNavigateWithScrolls -bool true
# Swipe between full-screen apps: four fingers
defaults write com.apple.AppleMultitouchTrackpad TrackpadFourFingerHorizSwipeGesture -int 2
# Mission Control: three-finger swipe up
defaults write com.apple.AppleMultitouchTrackpad TrackpadThreeFingerVertSwipeGesture -int 2
# App Expose: three-finger swipe down
defaults write com.apple.dock showAppExposeGestureEnabled -bool true
# Notification Center gesture: off
defaults write com.apple.AppleMultitouchTrackpad TrackpadTwoFingerFromRightEdgeSwipeGesture -int 0
# Launchpad: on (pinch with thumb and three fingers)
defaults write com.apple.dock showLaunchpadGestureEnabled -bool true
# Show Desktop gesture: off
defaults write com.apple.dock showDesktopGestureEnabled -bool false

success "Trackpad configured."

# --- Keyboard -----------------------------------------------------------------
# Fast key repeat rate
defaults write NSGlobalDomain KeyRepeat -int 2
# Short delay until repeat
defaults write NSGlobalDomain InitialKeyRepeat -int 15
# Adjust keyboard brightness in low light
defaults write com.apple.BezelServices kDim -bool true 2>/dev/null || true
# Keyboard backlight off after inactivity: Never (0)
defaults write com.apple.BezelServices kDimTime -int 0 2>/dev/null || true
# Globe key: Do Nothing (0)
defaults write com.apple.HIToolbox AppleFnUsageType -int 0

success "Keyboard configured."

# --- Lock Screen --------------------------------------------------------------
# Start screen saver after 5 minutes (300 seconds)
defaults -currentHost write com.apple.screensaver idleTime -int 300
# Require password 5 seconds after screen saver
defaults write com.apple.screensaver askForPassword -int 1
defaults write com.apple.screensaver askForPasswordDelay -int 5
# Display off on battery: 10 minutes
sudo pmset -b displaysleep 10 2>/dev/null || warn "Could not set battery display sleep (needs sudo)."
# Display off on power adapter: 10 minutes
sudo pmset -c displaysleep 10 2>/dev/null || warn "Could not set power display sleep (needs sudo)."
# Show large clock on lock screen
defaults write com.apple.loginwindow AdminHostInfo -string "HostName"
# Lock screen message
defaults write com.apple.loginwindow LoginwindowText -string "Jaime de la Torre de Ysasi-Ysasmendi
jaime@omg.lol | +34 646 282 833"
# Login window: Name and password (not list of users)
defaults write com.apple.loginwindow SHOWFULLNAME -bool true
# Show Sleep, Restart, Shut Down buttons
defaults write com.apple.loginwindow PowerOffDisabled -bool false

success "Lock Screen configured."

# --- Network / DNS (Cloudflare) -----------------------------------------------
# Set DNS to Cloudflare (1.1.1.1 / 1.0.0.1) on Wi-Fi
networksetup -setdnsservers Wi-Fi 1.1.1.1 1.0.0.1
# Enable firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on 2>/dev/null || warn "Could not enable firewall (needs sudo)."
# Limit IP address tracking
defaults write com.apple.Safari EnableEnhancedPrivacy -bool true 2>/dev/null || true

success "Network configured."

# --- Battery ------------------------------------------------------------------
# Low Power Mode: Never (0 = never, 1 = always)
sudo pmset -a lowpowermode 0 2>/dev/null || warn "Could not set low power mode (needs sudo)."

success "Battery configured."

# --- Software Update ----------------------------------------------------------
# Disable automatic download of new updates
defaults write com.apple.SoftwareUpdate AutomaticDownload -bool false
# Disable automatic macOS updates
defaults write com.apple.SoftwareUpdate AutomaticallyInstallMacOSUpdates -bool false
# Enable App Store auto-updates
defaults write com.apple.commerce AutoUpdate -bool true
# Enable Security Responses
defaults write com.apple.SoftwareUpdate CriticalUpdateInstall -bool true

success "Software Update configured."

# --- AirDrop & Handoff --------------------------------------------------------
# AirDrop: Everyone
defaults write com.apple.sharingd DiscoverableMode -string "Everyone"

success "AirDrop configured."

# --- Siri & Apple Intelligence ------------------------------------------------
# Disable Siri
defaults write com.apple.assistant.support "Assistant Enabled" -bool false
# Disable Apple Intelligence
defaults write com.apple.assistant.support "Apple Intelligence Enabled" -bool false 2>/dev/null || true
# Remove Siri from menu bar
defaults write com.apple.Siri StatusMenuVisible -bool false

success "Siri & Apple Intelligence disabled."

# --- Control Center -----------------------------------------------------------
# Wi-Fi: show in menu bar
defaults write com.apple.controlcenter "NSStatusItem Visible WiFi" -bool true
# Spotlight: don't show in menu bar
defaults write com.apple.Spotlight "NSStatusItem Visible Item-0" -bool false 2>/dev/null || true
# Auto-hide menu bar: In Full Screen Only
defaults write NSGlobalDomain _HIHideMenuBar -bool false
defaults write NSGlobalDomain AppleMenuBarVisibleInFullscreen -bool true
# Recent documents, apps, servers: 10
defaults write NSGlobalDomain NSRecentDocumentsLimit -int 10

success "Control Center configured."

# --- Spotlight ----------------------------------------------------------------
# Disable "Help Apple Improve Search"
defaults write com.apple.Spotlight SiriSuggestionsEnabled -bool false 2>/dev/null || true

success "Spotlight configured."

# --- Notifications ------------------------------------------------------------
# Show previews: When Unlocked (1 = when unlocked)
defaults write com.apple.ncprefs content_visibility -int 1 2>/dev/null || true

success "Notifications configured."

# --- Language & Region --------------------------------------------------------
# Languages: English (US) primary, Spanish
defaults write NSGlobalDomain AppleLanguages -array "en-US" "es"
# Region: Spain
defaults write NSGlobalDomain AppleLocale -string "en_ES"
# Temperature: Celsius
defaults write NSGlobalDomain AppleTemperatureUnit -string "Celsius"
# Measurement: Metric
defaults write NSGlobalDomain AppleMeasurementUnits -string "Centimeters"
defaults write NSGlobalDomain AppleMetricUnits -bool true
# First day of week: Monday (2)
defaults write NSGlobalDomain AppleFirstWeekday -dict gregorian -int 2
# Live Text: off
defaults write NSGlobalDomain AppleLiveTextEnabled -bool false 2>/dev/null || true

success "Language & Region configured."

# --- Sharing ------------------------------------------------------------------
# Disable all sharing services
sudo launchctl disable system/com.apple.screensharing 2>/dev/null || true
sudo launchctl disable system/com.apple.smbd 2>/dev/null || true

success "Sharing configured."

# --- Privacy: App Permissions -------------------------------------------------
# TCC permissions (camera, mic, screen recording) require manual approval.
# Open the relevant System Settings panes so the user can grant them.
info "Opening Privacy settings — grant Camera, Microphone, and Screen Recording to Chrome, Firefox, and Slack."

open "x-apple.systempreferences:com.apple.preference.security?Privacy_Camera"
echo "  → Add: Google Chrome, Firefox, Slack"
echo "  Press Enter when done..."
read -r

open "x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone"
echo "  → Add: Google Chrome, Firefox, Slack"
echo "  Press Enter when done..."
read -r

open "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture"
echo "  → Add: Google Chrome, Firefox, Slack"
echo "  Press Enter when done..."
read -r

success "Privacy permissions configured (manual)."

# --- Dock layout: wipe everything except Finder, then add the 4 essentials --
# Finder is always pinned at position 1 and cannot be removed from the Dock.
if command -v dockutil &>/dev/null; then
    info "Setting Dock layout (Firefox, Claude, Spotify, System Settings)..."
    dockutil --remove all --no-restart "$HOME" >/dev/null 2>&1 || true

    DOCK_APPS=(
        "/Applications/Firefox.app"
        "/Applications/Claude.app"
        "/Applications/Spotify.app"
        "/System/Applications/System Settings.app"
    )
    for app in "${DOCK_APPS[@]}"; do
        if [[ -d "$app" ]]; then
            dockutil --add "$app" --no-restart "$HOME" >/dev/null \
                || warn "dockutil failed to add $app to Dock."
        else
            warn "$app not found — skipping Dock add."
        fi
    done
    success "Dock layout set."
else
    warn "dockutil not available — skipping Dock layout."
fi

# --- Restart affected apps ----------------------------------------------------
info "Restarting Dock, Finder, and SystemUIServer to apply changes..."
killall Dock 2>/dev/null || true
killall Finder 2>/dev/null || true
killall SystemUIServer 2>/dev/null || true

success "macOS system preferences applied."

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
echo "  [ ] Log in to Claude Code:           claude login   (or set ANTHROPIC_API_KEY in ~/.zshrc)"
echo "  [ ] Set GITHUB_TOKEN in ~/.zshrc     (needed by the GitHub MCP server: gh auth token | pbcopy)"
echo "  [ ] Add SSH key to GitHub:           gh ssh-key add ~/.ssh/id_ed25519.pub --title \"Mac $(date +%Y) (file)\""
echo "  [ ] Verify GitHub SSH:               ssh -T git@github.com"
echo "  [ ] Authenticate gcloud:             gcloud auth login"
echo "  [ ] Authenticate AWS:                aws configure"
echo "  [ ] Authenticate Vercel:             vercel login"
echo "  [ ] Authenticate Supabase:           supabase login"
echo "  [ ] Open Claude Desktop & verify it sees CLI + MCP servers"
echo ""
echo "Hardware-backed identity (Secretive — do this BEFORE removing the file-based key):"
echo "  [ ] Open Secretive.app → grant Accessibility + Notifications + Login Item permissions"
echo "  [ ] Click '+' → create a new key (Ed25519 or ECDSA-256), require auth = Touch ID always"
echo "  [ ] Copy the public key (Secretive shows a copy button)"
echo "  [ ] Register as auth key:    gh ssh-key add - --title \"Mac Enclave (auth)\"   (paste pubkey, ^D)"
echo "  [ ] Register as signing key: gh ssh-key add - --type signing --title \"Mac Enclave (sign)\""
echo "  [ ] Set git signing key:     git config --global user.signingkey 'key::<paste pubkey>'"
echo "  [ ] Add to allowed_signers:  echo \"ikatza@proton.me <paste pubkey>\" >> ~/.ssh/allowed_signers"
echo "  [ ] Point ssh at Secretive's agent — append to ~/.ssh/config:"
echo "        Host *"
echo "          IdentityAgent ~/Library/Containers/com.maxgoedjen.Secretive.SecretAgent/Data/socket.ssh"
echo "  [ ] Test: ssh -T git@github.com   (should pop a Touch ID prompt)"
echo "  [ ] Test: git commit --allow-empty -m 'sig test' && git log --show-signature -1"
echo "  [ ] Once verified end-to-end, delete the file-based key from GitHub + ~/.ssh/id_ed25519*"
echo ""
echo "Apps to install manually (no Homebrew/App Store):"
echo "  [ ] Affinity 3                → https://affinity.serif.com"
echo "  [ ] Nuo-Stems 4               → vendor website"
echo "  [ ] iStat Menus 6             → https://bjango.com/mac/istatmenus/  (cask = latest, get v6 from vendor)"
echo "  [ ] Insta360 Wave Controller  → https://www.insta360.com/download"
echo "  [ ] Fathom                    → https://fathom.video/download  (Homebrew cask currently broken)"
echo ""
echo "Sign in / activate apps:"
echo "  [ ] Proton (Mail, Pass, VPN)"
echo "  [ ] Ente Auth"
echo "  [ ] Spotify, Slack, Notion, Discord"
echo "  [ ] OneDrive / Microsoft 365"
echo "  [ ] Maestral (Dropbox)"
echo "  [ ] Syncthing (configure devices)"
echo "  [ ] Native Access (Native Instruments account)"
echo "  [ ] Bartender 6 (license + import preset)"
echo "  [ ] ToothFairy (add Bluetooth devices)"
echo "  [ ] Meeter (grant Calendar access)"
echo "  [ ] Fathom (install from URL above, then sign in, grant mic + screen recording)"
echo ""
echo "App config:"
echo "  [ ] Raycast            → set ⌘Space, import settings, enable extensions"
echo "  [ ] Rectangle          → grant Accessibility, set shortcuts"
echo "  [ ] iTerm2             → import profile, set as default terminal"
echo "  [ ] VS Code / Cursor   → sign in to sync settings & extensions"
echo "  [ ] Obsidian           → open vault from iCloud / sync"
echo ""
echo "macOS settings that need the GUI:"
echo "  [ ] Touch ID & passcode"
echo "  [ ] iCloud sign-in & which apps sync"
echo "  [ ] Apple ID / App Store sign-in (needed before mas can install)"
echo "  [ ] Time Machine / backup destination"
echo "  [ ] Login items (Bartender, iStat Menus, Rectangle, Maestral, Syncthing, Amphetamine)"
echo "  [ ] Default browser:        System Settings → Desktop & Dock → Default web browser"
echo "  [ ] Keyboard shortcuts you customise"
echo "  [ ] Privacy: Full Disk Access (iTerm2, Claude Code, backup tools)"
echo "  [ ] Privacy: Accessibility (Rectangle, Raycast)"
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
