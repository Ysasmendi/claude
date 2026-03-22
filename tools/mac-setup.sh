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
#   6. Configures Oh My Zsh, nvm, pyenv, yt-dlp
#   7. Applies macOS system preferences (defaults write)
#
# What this does NOT install (manual install required):
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

    # Utilities
    transmission
    balenaetcher
    syncthing
    maestral
    daisydisk
    blip

    # Music Production
    native-access

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
# 5. Mac App Store apps (via mas)
# =============================================================================
info "Installing Mac App Store apps..."

if command -v mas &>/dev/null; then
    # Amphetamine (keep-awake utility) — App Store ID: 937984704
    if mas list | grep -q "937984704"; then
        success "Amphetamine already installed."
    else
        info "Installing Amphetamine..."
        mas install 937984704 || warn "Failed to install Amphetamine — you may need to sign in to the App Store first."
    fi
else
    warn "mas not available. Install it first (brew install mas), then run: mas install 937984704"
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
# 10. yt-dlp config
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
# 11. fzf key bindings
# =============================================================================
info "Setting up fzf key bindings..."
if [[ -f "$(brew --prefix fzf)/install" ]]; then
    "$(brew --prefix fzf)/install" --key-bindings --completion --no-update-rc --no-bash --no-fish
    success "fzf key bindings installed."
fi

# =============================================================================
# 12. macOS System Preferences
# =============================================================================
info "Applying macOS system preferences..."

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
echo "Manual steps remaining:"
echo "  1. Open a new terminal for shell changes to take effect"
echo "  2. Install manually (not available via Homebrew or App Store):"
echo "     - Affinity 3       → https://affinity.serif.com"
echo "     - Nuo-Stems 4      → vendor website"
echo "     - iStat Menus 6    → https://bjango.com/mac/istatmenus/"
echo "  3. Sign in to apps: Proton, Spotify, Slack, Notion, etc."
echo "  4. Configure Raycast (replaces Spotlight with ⌘Space)"
echo ""
