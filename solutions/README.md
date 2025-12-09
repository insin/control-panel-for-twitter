# Media Spoiler Solutions

This directory contains ready-to-use solutions for hiding media (images and videos) with hover-to-preview and click-to-reveal functionality.

## Solutions Included

### 1. CSS Hover + Click Spoiler (`css-hover-click-spoiler.css`)
- Pure CSS solution
- Hover to preview (reduced blur)
- Click to permanently reveal
- Simple overlay with instructions

### 2. Blur Overlay Spoiler (`blur-overlay-spoiler.css`)
- CSS-only with backdrop-filter
- Modern blur effect using CSS backdrop-filter
- Hover reduces blur intensity
- Click removes overlay permanently

### 3. JavaScript Spoiler (`js-spoiler-hover-click.js`)
- IIFE (Immediately Invoked Function Expression)
- Auto-applies to elements with `data-spoiler="true"`
- Hover and click functionality
- Smooth transitions

### 4. Advanced Media Spoiler (`advanced-media-spoiler.js`)
- Full-featured solution
- Supports custom warning text
- Auto-detects images/videos
- Smooth reveal animations
- Manual API for custom integration

## Usage

### Basic CSS Usage
```html
<!-- Add class to any media element -->
<img src="sensitive-image.jpg" class="spoiler-media" alt="Sensitive content">
```

### JavaScript Auto-Apply
```html
<!-- Add data attribute for auto-application -->
<img src="sensitive-image.jpg" data-spoiler="true" alt="Sensitive content">
```

### Advanced Usage
```html
<!-- Custom warning text -->
<img src="sensitive-image.jpg" data-spoiler data-spoiler-text="⚠️ Contains spoilers!" alt="Spoiler content">
```

### Manual JavaScript API
```javascript
// Make any element a spoiler
MediaSpoiler.makeSpoiler(document.querySelector('.my-image'))
```

## Features

- ✅ Hover to preview (reduced blur)
- ✅ Click to permanently reveal
- ✅ Smooth CSS transitions
- ✅ Customizable warning messages
- ✅ Works with images and videos
- ✅ Multiple implementation options
- ✅ No external dependencies
- ✅ Lightweight and performant

## Browser Support

- Modern browsers with CSS `filter` and `backdrop-filter` support
- Fallback for older browsers (graceful degradation)

## Integration Notes

These solutions are designed to be easily integrated into browser extensions like the Control Panel for Twitter. Simply include the appropriate CSS/JS files and apply the classes or data attributes to target media elements.