# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Control Panel for Twitter is a browser extension that provides customization and enhanced control over Twitter/X. It supports both Manifest V2 (Firefox) and Manifest V3 (Chrome/Edge) across desktop and mobile platforms.

## Build Commands

### Building
- `npm run build` - Build both MV2 and MV3 versions (runs prebuild to create browser_action.html)
- `npm run build-mv2` - Build Manifest V2 version only
- `npm run build-mv3` - Build Manifest V3 version only
- `make build` - Same as `npm run build`

The build process:
1. Copies `manifest.mv{2,3}.json` to `manifest.json`
2. Runs `web-ext build` to create a zip in `web-ext-artifacts/`
3. Renames zip to include version and manifest version (e.g., `control_panel_for_twitter-4.15.2.mv2.zip`)
4. Removes temporary `manifest.json`

### Testing in Browsers
- `npm run firefox` - Run in Firefox (MV2) with test tweet
- `npm run chrome` - Run in Chrome (MV3) with test tweet
- `npm run edge` - Run in Edge on Windows (MV3)
- `npm run edge-mac` - Run in Edge on macOS (MV3)
- `npm run android` - Run in Firefox for Android (MV2)

All test commands open to: https://twitter.com/badlogicgames/status/1991612272289161300

### Linting
- `npm run lint-mv2` - Lint MV2 version with web-ext
- `npm run lint-mv3` - Lint MV3 version with web-ext

### Helper Scripts
- `npm run create-browser-action` - Generate `browser_action.html` from templates (runs in prebuild)
- `npm run create-store-description` - Generate store listing descriptions
- `npm run release` - Release script for version management

## Architecture

### Extension Structure
The extension uses a standard three-layer browser extension architecture:

1. **background.js** - Background service worker/script
   - Updates toolbar icon based on enabled state
   - Listens for storage changes to sync icon state
   - Detects Safari vs other browsers for platform-specific icon handling

2. **content.js** - Content script (runs at document_start)
   - Injects initial config from `chrome.storage.local` into page as `<script id="cpftSettings">` element
   - Handles logo replacement (Twitter bird vs X logo) before page renders
   - Injects `script.js` into the page context
   - Bridges messages between page and extension for config updates
   - Updates `localStorage.cpftEnabled` and `localStorage.cpftReplaceLogo` for fast access

3. **script.js** - Main injected script (runs in page context, not extension context)
   - 270KB+ file containing all DOM manipulation and feature logic
   - Reads config from `#cpftSettings` script element
   - Patches `XMLHttpRequest.prototype.open` to modify API requests (e.g., sort replies)
   - Uses MutationObserver for dynamic DOM changes
   - Organized with `//#region` comments for code navigation
   - Detects desktop vs mobile Twitter versions
   - Contains all feature implementations for hiding/showing UI elements

### Config System
- Config defined in `types.d.ts` as TypeScript interface with 100+ boolean/enum options
- Default config in `script.js` (lines 40-146)
- Stored in `chrome.storage.local`
- Changes flow: options page → storage → background.js (broadcasts) → content.js → script.js
- Fast checks use `localStorage.cpftEnabled` and `localStorage.cpftReplaceLogo`

**Firefox-specific:** Config updates use message passing from background to content scripts because Firefox's `storage.onChanged` doesn't reliably fire in content scripts (especially inactive tabs). Background script broadcasts changes using `browser.tabs.sendMessage()` to all tabs.

### Manifest Versions
Two manifest files with different APIs:
- **manifest.mv2.json** - Firefox, uses `browser_action`, persistent background
- **manifest.mv3.json** - Chrome/Edge, uses `action`, service worker
- Active manifest copied to `manifest.json` during build/test

## Code Style Guidelines

### TypeScript/JSDoc
- Use JSDoc type annotations: `/** @type {boolean} */`
- Import types from `./types`: `/** @type {import("./types").Config} */`
- No semicolons at end of lines
- 2-space indentation
- ES2022 target with NodeNext modules (per jsconfig.json)

### Conventions
- camelCase for variables and functions
- IIFE pattern wraps main code: `void function() { ... }`
- Boolean platform flags: `/** @type {boolean} */ let desktop` / `let mobile`
- Region comments for organization: `//#region Default config`
- Locale strings via `chrome.i18n.getMessage()`

### Browser Detection
- Safari: `navigator.userAgent.includes('Safari/') && !/Chrom(e|ium)\//.test(navigator.userAgent)`
- Different logo handling for Safari (MutationObserver) vs others (CSS injection)
- Firefox: Uses `browser` API namespace instead of `chrome` (background.js handles this automatically)

## Working with Twitter Media

**See TWITTER_MEDIA_GUIDE.md** for detailed guide on finding and manipulating Twitter media elements (images, videos, cards, banners).

Key points:
- Use `data-testid` attributes to target elements (e.g., `tweetPhoto`, `videoPlayer`)
- Apply filters to **child elements** (img, background-image divs), not containers
- Link wrappers block interaction - target children and use parent `:hover` state
- Test selectors in saved HTML files: `rg 'data-testid="tweetPhoto"' examples/*.html`

## Key Technical Details

### Logo/Branding Replacement
- Twitter bird path stored in `twitterLogoPath` constant
- X logo path in `xLogoPath` constant
- Replacement happens in content.js before page fully loads
- Uses CSS path replacement in non-Safari browsers
- Uses MutationObserver in Safari due to CSS limitations

### DOM Manipulation Pattern
- Heavy use of MutationObserver for dynamic content
- Query selectors often use data attributes from Twitter's React app
- Helper functions like `isOnHomePage()`, `isOnProfilePage()` for page detection
- Utility functions: `addStyle()`, `dedent()`, `disconnectObservers()`

### Feature Implementation
- Most features implemented by adding/removing CSS classes or injecting styles
- Some features require DOM element removal/hiding
- API request modifications via XMLHttpRequest patching
- Configuration changes trigger re-application of features

## Testing Notes

No dedicated test framework. Manual testing workflow:
1. Make code changes
2. Run appropriate `npm run [browser]` command
3. Test on the opened Twitter page
4. Check browser console for errors (set `debug: true` in config for verbose logging)

## Localization

- Support for 7 languages in `_locales/` (en, es, fr, it, ja, ko, zh_CN)
- Message format: `chrome.i18n.getMessage('messageName')`
- Base locales stored in `scripts/locales/base-locales.json`
- Scripts available for updating translations

## Safari Support

Safari extension in `safari/` directory with different architecture:
- Uses Safari Web Extension framework
- Shares core extension files via Resources
- Has separate Xcode project for app wrapper
- Manifest copied to `safari/Shared (Extension)/Resources/manifest.json`
