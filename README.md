# Control Panel for Twitter (Fork)

Personal fork of [insin/control-panel-for-twitter](https://github.com/insin/control-panel-for-twitter) with custom defaults and extra features (hide avatars, blur media, hide emojis, gray links, hashtag checkmarks).

## Quick Deploy

```bash
make build             # MV2 + MV3 zips
make safari            # Safari app (self-healing Xcode)
make all               # everything: clean + build + safari + deploy
```

### Firefox (fastest iteration)

```bash
npm run firefox        # launches temp profile with extension auto-loaded
```

Uses `web-ext run` -- the extension hot-reloads on file changes. Press `r` in the terminal to force reload.

### Chrome / Edge

```bash
npm run chrome         # launches Chromium with extension
npm run edge-mac       # launches Edge on macOS
```

Same as Firefox -- temp profile, auto-loaded, press `r` to reload.

### Safari

```bash
make safari            # builds via xcodebuild, no Xcode GUI needed
make safari-open       # opens the built app (registers extension with Safari)
```

If Xcode's system components are stale (the `runFirstLaunch` error), `make safari` detects it and runs `xcodebuild -runFirstLaunch` automatically, then retries the build. No manual intervention needed.

The Xcode project references `script.js`, `content.js`, and `background.js` directly from the repo root via relative paths, so code changes are picked up on rebuild without copying files.

After first run, enable in Safari > Settings > Extensions.

### Sideload (persistent)

For daily use without `web-ext run`:

**Firefox:** `about:debugging#/runtime/this-firefox` > Load Temporary Add-on > select `manifest.mv2.json`. Survives until Firefox restarts.

**Chrome:** Copy `manifest.mv3.json` to `manifest.json`, then `chrome://extensions` > Developer Mode > Load unpacked > select repo root.

**Safari:** `make safari && make safari-open`. The app persists. Re-run `make safari` after code changes.

## Build Artifacts

Output goes to `web-ext-artifacts/`:
- `control_panel_for_twitter-{version}.mv2.zip` -- Firefox
- `control_panel_for_twitter-{version}.mv3.zip` -- Chrome, Edge

Safari app: `safari/build/Build/Products/Release/Control Panel for Twitter.app`

## Fork Maintenance

After syncing with upstream (`/my-sync-fork`):

```bash
node scripts/extract-config.js   # regenerate config + auto-bump version
make all                          # rebuild everything
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
