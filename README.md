# Control Panel for Twitter (Fork)

Personal fork of [insin/control-panel-for-twitter](https://github.com/insin/control-panel-for-twitter) with custom defaults and extra features (hide avatars, blur media, hide emojis, gray links, hashtag checkmarks).

## Quick Deploy

After any code change, rebuild and load into browsers:

```bash
npm run build          # builds both .mv2.zip and .mv3.zip
```

### Firefox (fastest iteration)

```bash
npm run firefox        # launches temp profile with extension auto-loaded
```

This uses `web-ext run` -- the extension **hot-reloads** on file changes. No manual install needed. Press `r` in the terminal to force reload.

For Firefox Developer Edition specifically:

```bash
npx web-ext run --firefox=/Applications/Firefox.app/Contents/MacOS/firefox \
  --start-url https://x.com
```

### Chrome / Edge

```bash
npm run chrome         # launches Chromium with extension
npm run edge-mac       # launches Edge on macOS
```

Same as Firefox -- temp profile, auto-loaded, press `r` to reload.

### Safari

Safari requires building through Xcode. The Xcode project references `script.js`, `content.js`, and `background.js` directly from the repo root via relative paths (`../../../script.js`), so no file copying is needed after a rebuild.

```bash
# One-time: fix Xcode first-launch if needed
xcodebuild -runFirstLaunch

# Build and run from Xcode
open safari/Control\ Panel\ for\ Twitter.xcodeproj
# Then: Product > Run (Cmd+R) with "macOS (App)" scheme
```

After the first Xcode build, enable the extension:
1. Safari > Settings > Extensions > enable "Control Panel for Twitter"
2. Check "Allow in Private Browsing" if needed

On subsequent code changes, just rebuild in Xcode (Cmd+R) -- it picks up the changed files automatically since they're referenced by path.

### Permanent Install (sideload)

For daily use without `web-ext run`:

**Firefox:** Go to `about:debugging#/runtime/this-firefox` > Load Temporary Add-on > select `manifest.mv2.json` from the repo root. Survives until Firefox restarts.

**Chrome:** Go to `chrome://extensions` > Enable Developer Mode > Load unpacked > select the repo root directory. Copy `manifest.mv3.json` to `manifest.json` first:

```bash
cp manifest.mv3.json manifest.json
# then load the repo folder in chrome://extensions
```

**Safari:** The Xcode-built app persists. After `Product > Run`, the extension stays installed. Just re-run from Xcode after code changes.

## Build Artifacts

Output goes to `web-ext-artifacts/`:
- `control_panel_for_twitter-{version}.mv2.zip` -- Firefox
- `control_panel_for_twitter-{version}.mv3.zip` -- Chrome, Edge

## Fork Maintenance

After syncing with upstream (`/my-sync-fork`):

```bash
node scripts/extract-config.js   # regenerate config + auto-bump version
npm run build                     # rebuild with correct config
```

`extract-config.js` does three things:
1. Regenerates `current.config.txt` from the config block in `script.js`
2. Appends `.1` to manifest versions if not already present (e.g., `4.23.0` -> `4.23.0.1`)
3. Sets `version_name: "4.23.0-fork"` in MV3 manifest

The `inject-config` prebuild step reads `current.config.txt` and writes config values into `script.js`. If you rebase onto upstream without regenerating the config file, the build will silently revert your fork's custom defaults.

## Version Scheme

- Upstream releases `4.23.0` -> after rebase, manifests say `4.23.0`
- `extract-config.js` bumps to `4.23.0.1` automatically
- MV3 gets `version_name: "4.23.0-fork"` for display in chrome://extensions
- Idempotent: running again on `4.23.0.1` is a no-op

## Upstream

Original project: https://github.com/insin/control-panel-for-twitter
