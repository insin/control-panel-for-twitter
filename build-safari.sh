#!/usr/bin/env bash

# Safari Extension Build Script
# Builds and installs Control Panel for Twitter for Safari

set -e

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SOURCE_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Config
TEAM_ID=9L4NY85FDF
APP_NAME="Control Panel for Twitter"
XCODEPROJ="safari/$APP_NAME.xcodeproj"
SCHEME="$APP_NAME (macOS)"
INSTALL_PATH="/Applications/$APP_NAME.app"

# Check signing certificates
echo "Checking signing certificates..."
VALID_CERTS=$(security find-identity -v -p codesigning 2>/dev/null | grep -v REVOKED | grep -v "valid identities" || true)

if [ -z "$VALID_CERTS" ]; then
  echo -e "${RED}No valid code signing certificates found${NC}"
  REVOKED=$(security find-identity -v -p codesigning 2>/dev/null | grep REVOKED || true)
  if [ -n "$REVOKED" ]; then
    echo "Revoked certificates found - delete them in Keychain Access:"
    echo "$REVOKED"
  fi
  echo ""
  echo "To fix: Open Xcode > Settings > Accounts > Manage Certificates > +"
  exit 1
fi

echo -e "${GREEN}Certificate:${NC}"
echo "$VALID_CERTS" | head -1

# Check for Xcode.app
XCODE_PATH=$(xcode-select -p 2>/dev/null)
if [[ "$XCODE_PATH" != *"Xcode.app"* ]]; then
  echo -e "${RED}Error: Full Xcode.app required (not just Command Line Tools)${NC}"
  echo "Current: $XCODE_PATH"
  echo "Fix: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
  exit 1
fi

# Get version from manifest
VERSION=$(node -p "require('./manifest.mv3.json').version" 2>/dev/null || echo "unknown")
echo -e "${YELLOW}Building Safari extension v${VERSION}${NC}"

# Run prebuild (generates browser_action.html, injects config)
echo "Running prebuild..."
npm run prebuild --silent

# Clean previous build to avoid stale artifacts
BUILD_DIR="$SOURCE_DIR/safari/build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Build with Xcode (Release only)
echo "Building with Xcode..."
if xcodebuild \
  -project "$XCODEPROJ" \
  -scheme "$SCHEME" \
  -configuration Release \
  -derivedDataPath "$BUILD_DIR" \
  DEVELOPMENT_TEAM="$TEAM_ID" \
  CODE_SIGN_STYLE=Automatic \
  CODE_SIGN_INJECT_BASE_ENTITLEMENTS=NO \
  OTHER_CODE_SIGN_FLAGS="--timestamp" \
  2>&1 | tee "$SOURCE_DIR/safari/build.log" | grep -E "(error:|warning:|BUILD|Signing Identity)"; then

  echo -e "${GREEN}Build successful!${NC}"

  APP_PATH="$BUILD_DIR/Build/Products/Release/$APP_NAME.app"

  if [ -d "$APP_PATH" ]; then
    # Verify signature before installing
    echo "Verifying signature..."
    if ! codesign --verify --deep --strict "$APP_PATH" 2>/dev/null; then
      echo -e "${RED}Signature verification failed${NC}"
      exit 1
    fi

    # Remove quarantine and install
    xattr -cr "$APP_PATH" 2>/dev/null || true

    if [ -d "$INSTALL_PATH" ]; then
      rm -rf "$INSTALL_PATH"
    fi
    cp -r "$APP_PATH" "$INSTALL_PATH"
    xattr -cr "$INSTALL_PATH" 2>/dev/null || true

    # Unregister build folder app, register /Applications one
    /System/Library/Frameworks/CoreServices.framework/Versions/Current/Frameworks/LaunchServices.framework/Versions/Current/Support/lsregister -u "$APP_PATH" 2>/dev/null || true
    /System/Library/Frameworks/CoreServices.framework/Versions/Current/Frameworks/LaunchServices.framework/Versions/Current/Support/lsregister -f "$INSTALL_PATH"

    # Clean build artifacts (keep log)
    rm -rf "$BUILD_DIR/Build" "$BUILD_DIR/Logs" "$BUILD_DIR/ModuleCache.noindex" "$BUILD_DIR/info.plist" "$BUILD_DIR/SourcePackages"

    echo -e "${GREEN}Installed to $INSTALL_PATH${NC}"
    echo ""
    echo "Enable in Safari > Settings > Extensions"
    echo "If extension doesn't appear, restart Safari"
  else
    echo -e "${RED}App not found at $APP_PATH${NC}"
    exit 1
  fi
else
  echo -e "${RED}Build failed. See safari/build.log${NC}"
  echo "Debug: open '$XCODEPROJ'"
  exit 1
fi
