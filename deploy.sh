#!/bin/bash

# Control Panel for Twitter Extension Deploy Script
# Creates organized folder structure in /Volumes/Shared/boot/extensions

set -e

EXTENSION_NAME="control-panel-for-twitter"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXTENSIONS_DIR="/Volumes/Shared/boot/extensions"
TARGET_DIR="$EXTENSIONS_DIR/$EXTENSION_NAME"

echo "🚀 Deploying Control Panel for Twitter extension..."
echo "Source: $SOURCE_DIR"
echo "Target: $TARGET_DIR"

# Create main extension directory
mkdir -p "$TARGET_DIR"

# Function to copy extension files
copy_extension_files() {
  local dest_dir="$1"
  local manifest_file="$2"
  echo "📁 Creating $dest_dir"

  # Create directory structure
  mkdir -p "$dest_dir"

  # Copy all extension files except build artifacts and dev files
  rsync -av --exclude='web-ext-artifacts' \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='safari' \
    --exclude='*.md' \
    --exclude='deploy.sh' \
    --exclude='Makefile' \
    --exclude='manifest.json' \
    --exclude='manifest.mv2.json' \
    --exclude='manifest.mv3.json' \
    --exclude='package.json' \
    --exclude='package-lock.json' \
    --exclude='scripts' \
    --exclude='promo' \
    --exclude='screenshots' \
    --exclude='.github' \
    --exclude='.vscode' \
    "$SOURCE_DIR/" "$dest_dir/"

  # Copy the appropriate manifest
  cp "$SOURCE_DIR/$manifest_file" "$dest_dir/manifest.json"
}

# Create MV2 (Firefox/Chromium Manifest V2) version
copy_extension_files "$TARGET_DIR/mv2-firefox" "manifest.mv2.json"

# Create MV3 (Chromium Manifest V3) version
copy_extension_files "$TARGET_DIR/mv3-chromium" "manifest.mv3.json"

# Create Chrome version (same as MV3)
echo "🔄 Creating Chrome version..."
rm -rf "$TARGET_DIR/chrome"
copy_extension_files "$TARGET_DIR/chrome" "manifest.mv3.json"

# Create Edge version (same as MV3)
echo "🔄 Creating Edge version..."
rm -rf "$TARGET_DIR/edge"
copy_extension_files "$TARGET_DIR/edge" "manifest.mv3.json"

# Copy packed extension files if they exist
if [ -d "$SOURCE_DIR/web-ext-artifacts" ]; then
  echo "📦 Copying packed extension files..."
  mkdir -p "$TARGET_DIR/packed"
  cp "$SOURCE_DIR/web-ext-artifacts"/*.zip "$TARGET_DIR/packed/" 2>/dev/null || echo "No packed files found"
fi

# Create a README for the extension folder
cat >"$TARGET_DIR/README.md" <<'EOF'
# Control Panel for Twitter Extension Versions

This folder contains different versions of the Control Panel for Twitter extension for various browsers.

## Versions

- `mv2-firefox/`: Manifest V2 version for Firefox
- `mv3-chromium/`: Manifest V3 version for Chrome/Chromium browsers
- `chrome/`: Chrome-optimized version (MV3)
- `edge/`: Microsoft Edge version (MV3)
- `packed/`: Packed extension files (.zip) ready for distribution

## Loading Extensions

### Firefox (MV2):
1. Open `about:debugging`
2. Click "This Firefox" → "Load Temporary Add-on"
3. Select `mv2-firefox/manifest.json`

### Chrome (MV3):
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome` or `mv3-chromium` folder

### Microsoft Edge (MV3):
1. Open `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `edge` folder

## Features

Control Panel for Twitter allows you to:
- Customize your Twitter/X experience
- Hide promoted content
- Manage timeline settings
- Control UI elements
- And much more!

EOF

echo "✅ Deployment complete!"
echo "📂 Extension versions created in: $TARGET_DIR"
echo ""
echo "Available versions:"
ls -la "$TARGET_DIR" | grep "^d" | awk '{print "  - " $9}'

if [ -d "$TARGET_DIR/packed" ]; then
  echo ""
  echo "📦 Packed files (ready for distribution):"
  ls -lh "$TARGET_DIR/packed"/*.zip 2>/dev/null | awk '{print "  - " $9 " (" $5 ")"}'
fi

echo ""
echo "To load in Firefox:"
echo "  about:debugging → Load Temporary Add-on → $TARGET_DIR/mv2-firefox/manifest.json"
echo ""
echo "To load in Chrome:"
echo "  chrome://extensions/ → Load unpacked → $TARGET_DIR/chrome/"

