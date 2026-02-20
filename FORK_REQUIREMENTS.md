# Fork Requirements - Control Panel for Twitter

## Overview
Add two new features to Control Panel for Twitter extension with configurable styling.

## Feature 1: Hide Media with Gray Overlay

### Behavior
- Hide all large media (images, GIFs, videos) with a gray overlay
- **Hover**: Temporarily reveals media (fades overlay away)
- **Click once**: Permanently reveals media for that tweet
- **Click again**: Opens media viewer normally

### Media Types to Hide
- `[data-testid="tweetPhoto"]` - Images
- `[data-testid="videoPlayer"]` - Videos
- `[data-testid="card.layoutLarge.media"]` - Large card media
- `[data-testid="card.layoutSmall.media"]` - Small card media

### Configuration
- **Setting name**: `hideMediaWithOverlay`
- **Default**: `true` (enabled by default)
- **Type**: `boolean`

### Styling (Easily Configurable)
Located in `script.js` around line 3682:
```javascript
const MEDIA_OVERLAY_COLOR = 'rgba(128, 128, 128, 0.9)' // Mid gray, 90% opacity
const MEDIA_OVERLAY_TRANSITION = '0.2s ease'            // Fade speed
const MEDIA_OVERLAY_BORDER_RADIUS = 'inherit'           // Match Twitter's style
```

## Feature 2: Hide Avatars

### Behavior
- Completely hide all user avatars (not overlay - actual hiding)
- Uses `display: none !important`

### Elements to Hide
- `[data-testid="Tweet-User-Avatar"]` - Main tweet avatars
- `[data-testid^="UserAvatar-Container-"]` - All avatar containers
- `[role="link"] img[src*="profile_images"]` - Profile image links

### Configuration
- **Setting name**: `hideAvatars`
- **Default**: `true` (enabled by default)
- **Type**: `boolean`

## UI Changes

### Options Page Structure

#### 1. Fork Features Section (at top, after "Enabled" toggle)
```html
<section class="group labelled">
  <label id="forkFeaturesLabel">Fork Features</label>

  <section class="checkbox">
    <label>
      <span id="hideMediaWithOverlayLabel">Hide media with gray overlay (reveal on hover/click)</span>
      <input type="checkbox" name="hideMediaWithOverlay">
      <span class="toggle"></span>
    </label>
  </section>

  <section class="checkbox">
    <label>
      <span id="hideAvatarsLabel">Hide avatars</span>
      <input type="checkbox" name="hideAvatars">
      <span class="toggle"></span>
    </label>
  </section>
</section>
```

#### 2. Import/Export Buttons (moved to top)
- Position: Right after "Enabled" toggle, before Fork Features
- Button text: "Import Config" and "Export Config"
- Layout: Side-by-side with flexbox
- Remove old Configuration section from bottom

#### 3. Build Timestamp
- Display at top of options page
- Format: "Build: MM/DD/YYYY, HH:MM:SS"
- Updates every time extension is built
- Helps verify fresh code is loading

## Code Organization

### Files to Modify

#### 1. `types.d.ts`
Add new config properties:
```typescript
export type Config = {
  // Fork Features
  hideMediaWithOverlay: boolean
  hideAvatars: boolean
  // ... existing properties
}
```

#### 2. `script.js`
- Add defaults in config object (both `true`)
- Add `//#region Fork Features` section
- Create `setupMediaRevealHandlers()` function for click/hover
- Inject CSS for overlay and avatar hiding
- Call handlers in timeline processing

#### 3. `options.js`
- Add defaults (both `true`)
- Add translation IDs to localization array

#### 4. `options.html`
- Add Fork Features section at top
- Move import/export buttons to top
- Add build timestamp display

#### 5. `_locales/en/messages.json`
- Add English labels for new features
- Do NOT remove existing localizations

#### 6. `scripts/create-browser-action.js`
- Inject build timestamp into HTML

## Browser Compatibility

### Must work in:
- Firefox (Manifest V2)
- Microsoft Edge (Manifest V3)
- Chrome (Manifest V3)

### Known Issues
- CSS `:hover` on `::before/::after` pseudo-elements unreliable in Firefox/Edge
- Solution: Use real DOM elements or JavaScript event listeners

## Implementation Notes

### Media Overlay Approach
Use real `<div>` elements created by JavaScript:
1. Create `<div class="cpft_media_overlay">`
2. Append to media element
3. CSS handles positioning and hover
4. Click listener removes overlay permanently

### Why Not CSS Pseudo-elements
- `::before/::after` with `pointer-events: none` don't support hover in Firefox
- `::before/::after` without `pointer-events: none` block all clicks
- Real DOM elements are more reliable cross-browser

## Build Process

### Commands
- `npm run ff-dev` - Test in Firefox Developer Edition
- `npm run firefox` - Test in Firefox with temp profile
- `make all` - Clean, build, and deploy to `/Volumes/Shared/boot/extensions/`
- `make clean` - Remove build artifacts and stale directories

### Build Artifacts Cleaned
- `web-ext-artifacts/`
- `unpacked/`
- `manifest.json`
- `browser_action.html`

## Testing Checklist

- [ ] Media overlay appears on photos/videos
- [ ] Hover temporarily reveals media (works in Firefox/Edge)
- [ ] Click permanently reveals media
- [ ] Second click opens media viewer
- [ ] Avatars completely hidden
- [ ] Fork section appears first in options
- [ ] Import/Export buttons at top
- [ ] Both features enabled by default for new users
- [ ] Settings save/load correctly
- [ ] Build timestamp updates on each build
- [ ] Works in Firefox, Edge, and Chrome
- [ ] Desktop and mobile versions work

## File Structure
```
control-panel-for-twitter/
├── types.d.ts                    # Add config types
├── script.js                     # Main extension logic + Fork features
├── options.js                    # Options page logic
├── options.html                  # Options page UI
├── _locales/en/messages.json     # English labels
├── scripts/
│   └── create-browser-action.js  # Build timestamp injection
├── Makefile                      # Build commands
└── deploy.sh                     # Deployment script
```

## Configuration Constants Location

**`script.js:3682-3684`** - Easy to find and modify:
```javascript
const MEDIA_OVERLAY_COLOR = 'rgba(128, 128, 128, 0.9)'
const MEDIA_OVERLAY_TRANSITION = '0.2s ease'
const MEDIA_OVERLAY_BORDER_RADIUS = 'inherit'
```

Change these values to customize overlay appearance without touching CSS.
