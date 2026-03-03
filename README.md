# Control Panel for Twitter (Fork)

Personal fork of [insin/control-panel-for-twitter](https://github.com/insin/control-panel-for-twitter) with custom defaults and extra features (hide avatars, blur media, hide emojis, gray links, hashtag checkmarks).

## Permanent Install

### Chrome / Edge / Brave (recommended)

One-time setup:
```bash
make chrome-manifest   # copies manifest.mv3.json -> manifest.json
```
Then `chrome://extensions` > Developer Mode ON > Load unpacked > select this repo folder.

**Update after rebuild:** click the reload icon on the extension card, or Cmd+R the Twitter tab. The "Load unpacked" path points at the repo -- files change in-place.

### Firefox Developer Edition

Firefox Dev Edition allows unsigned extensions. Regular Firefox does not.

One-time setup:
1. `about:config` > set `xpinstall.signatures.required` = `false`
2. `about:addons` > gear icon > Install Add-on From File > pick `web-ext-artifacts/*.mv2.zip`

**Update after rebuild:** same path -- `about:addons` > gear > Install Add-on From File > pick the new zip. Replaces in-place.

### Safari

One-time setup:
```bash
make safari && make safari-open
```
Then Safari > Settings > Extensions > enable "Control Panel for Twitter".

**Update after rebuild:** `make safari`. Safari picks up changes on next page load -- no need to re-enable.

## Build

```bash
make build             # MV2 + MV3 zips
make safari            # Safari app (self-healing Xcode)
make all               # clean + build + safari + deploy
```

### Dev mode (temp profile, hot reload)

```bash
npm run firefox        # press r to reload
npm run chrome         # press r to reload
npm run edge-mac       # press r to reload
```

### Safari build details

`make safari` builds via `xcodebuild` with ad-hoc signing (no Apple developer cert needed). If Xcode's system components are stale (`runFirstLaunch` error), it detects and fixes automatically.

The Xcode project references `script.js`, `content.js`, `background.js` directly from the repo root via relative paths -- no file copying needed.

## Build Artifacts

`web-ext-artifacts/`:
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
