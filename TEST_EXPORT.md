# Testing Config Export

## Test the new export functionality:

1. Load the extension in your browser
2. Go to the extension options page
3. Click "Export configuration"
4. Check the downloaded file:
   - **Filename format**: `control-panel-for-twitter-v4.15.2.config.2511211640.txt`
     - Where `2511211640` is the current date/time (Nov 25, 2025 16:40)
   - **File contents** should include metadata at the bottom:
     ```json
     {
       "enabled": true,
       ...
       "_appVersion": "4.15.2",
       "_buildDate": "2025-11-21",
       "_exportDate": "2025-11-21",
       "_exportTime": "16:40:25"
     }
     ```

## Metadata fields:

- `_appVersion`: Version from manifest (injected during build)
- `_buildDate`: Date when extension was built (injected during build)
- `_exportDate`: Date when config was exported (YYYY-MM-DD)
- `_exportTime`: Time when config was exported (HH:MM:SS)

## Using exported configs:

1. Save your exported config
2. Create/update symlink:
   ```bash
   ln -sf control-panel-for-twitter-v4.15.2.config.2511211640.txt current.config.txt
   ```
3. Build:
   ```bash
   npm run build
   ```
4. The new build will use your exported config as defaults!
