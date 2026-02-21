# Build Configuration System

## Overview

The extension can automatically inject a configuration from `current.config.txt` during the build process. This allows you to maintain your preferred default settings and automatically apply them to new builds.

## Setup

1. **Create your config file**: Export your current settings from the extension options page to create a config file.

2. **Create the symlink**: Create a symlink named `current.config.txt` pointing to your config file:
   ```bash
   ln -s control-panel-for-twitter-v4.15.2_your-config.txt current.config.txt
   ```

3. **Build**: Run the build command as usual:
   ```bash
   npm run build
   ```

## How It Works

When you run `npm run build`:

1. **Config Injection** (`prebuild` step):
   - Reads `current.config.txt` (if it exists)
   - Extracts app version from `manifest.mv3.json`
   - Adds metadata:
     - `_appVersion`: Version from manifest (e.g., "4.15.2")
     - `_buildDate`: Build date in YYYY-MM-DD format
   - Replaces the default config in `script.js`

2. **Browser Action Creation**: Creates `browser_action.html`

3. **Extension Build**: Packages the extension for both MV2 and MV3

## Config Metadata

After injection, your config will include:

```javascript
const config = {
  // ... your settings ...
  _appVersion: '4.15.2',
  _buildDate: '2025-11-21',
}
```

## Manual Build Without Config

If `current.config.txt` doesn't exist, the build continues with the hardcoded defaults in `script.js`.

## Testing Changes

To test config changes:

1. Update your config file (or the file `current.config.txt` points to)
2. Run `npm run build`
3. Test in browser with `npm run firefox` or `npm run chrome`

## Deployment

The `deploy.sh` script doesn't run the build process - it only copies existing files. To deploy with updated config:

```bash
npm run build && ./deploy.sh
```
