# Twitter Media DOM Guide

Quick reference for finding and manipulating Twitter media elements.

## How to Find DOM Elements (For Humans & LLMs)

### Step 1: Save the Page HTML
**What to provide:**
- Save complete Twitter page: File → Save Page As → "Webpage, Complete"
- Or right-click → Inspect → right-click `<html>` → Copy → Copy outerHTML
- Save to `examples/` folder with descriptive name

**Why:** Saved HTML lets you search without being logged in or rate-limited.

### Step 2: Identify the Target Element

**In Browser DevTools:**
1. Right-click on the element you want to target → "Inspect Element"
2. **Look upward** in the DOM tree for these markers:
   - `data-testid="..."` attributes (most stable)
   - `role="..."` attributes (semantic meaning)
   - `aria-label="..."` attributes (descriptive text)
3. **Note the structure:** How many layers? What wraps what?

**Example - Finding a tweet image:**
```
You see: An image in a tweet
↓ Right-click → Inspect shows:
  <img src="..." />                           ← The actual image
  ↑ Parent: <div data-testid="tweetPhoto">    ← **This is your target!**
  ↑ Parent: <a role="link">                   ← Link wrapper (blocks clicks)
  ↑ Parent: <div>                             ← Spacing/layout
```

### Step 3: Search in Saved HTML

```bash
# Find all unique data-testid values (discover what exists)
rg -o 'data-testid="[^"]*"' examples/*.html | sort -u

# Find specific element with context
rg 'data-testid="tweetPhoto"' examples/*.html -B 10 -A 10

# Find by attribute pattern
rg 'role="link"' examples/*.html -B 2 -A 5

# Find background images
rg 'background-image: url' examples/*.html | head -20
```

### Step 4: Understanding Multi-Layer Structures

**Problem:** Twitter nests elements deeply (10+ layers common)

**What data to provide to LLM:**
```bash
# Get full context around an element (adjust -B/-A numbers as needed)
rg 'data-testid="tweetPhoto"' examples/page.html -B 15 -A 15 > context.txt
```

**Reading the structure:**
```html
<!-- LAYER 1: Click wrapper -->
<a href="..." role="link" class="...">

  <!-- LAYER 2: Spacing container -->
  <div class="css-175oi2r r-1adg3ll r-1udh08x">

    <!-- LAYER 3: Padding -->
    <div class="r-1adg3ll r-13qz1uu" style="padding-bottom: 56.25%;"></div>

    <!-- LAYER 4: Absolute positioning wrapper -->
    <div class="r-1p0dtai r-1pi2tsx ...">

      <!-- LAYER 5: Your target! -->
      <div data-testid="tweetPhoto">

        <!-- LAYER 6: Background image -->
        <div style="background-image: url(...)"></div>

        <!-- LAYER 7: Actual img element -->
        <img src="..." alt="Image" />
      </div>
    </div>
  </div>
</a>
```

**Key insight:** Target `data-testid="tweetPhoto"` but apply styles to children (img, background div).

### Step 5: Handling Scroll Covers & Overlays

**Problem:** Absolute positioned elements cover content

**How to find them:**
```bash
# Find elements with z-index (often overlays)
rg 'z-index:' examples/*.html | head -30

# Find position: absolute/fixed
rg 'position: absolute|position: fixed' examples/*.html

# Find elements that might block interaction
rg 'pointer-events' examples/*.html
```

**What to check:**
- Element with higher `z-index` covers lower ones
- `pointer-events: none` makes element non-interactive (good for overlays)
- `position: absolute` with `top: 0; left: 0; right: 0; bottom: 0` = full cover

**Solution pattern:**
```css
/* Your overlay should be on top but not block interaction */
element::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #1a1a1a;
  z-index: 10;                    /* High enough to cover content */
  pointer-events: none;           /* Don't block clicks! */
}
```

### Step 6: Finding Repeatable Elements

**Problem:** Same element type appears multiple times (e.g., all tweet images)

**Search strategy:**
```bash
# Count occurrences
rg 'data-testid="tweetPhoto"' examples/*.html | wc -l

# See all instances with line numbers
rg -n 'data-testid="tweetPhoto"' examples/*.html

# Compare first and last occurrence
rg 'data-testid="tweetPhoto"' examples/*.html -B 5 -A 5 | head -30
rg 'data-testid="tweetPhoto"' examples/*.html -B 5 -A 5 | tail -30
```

**What to verify:**
- Structure is identical across instances → Safe to use single selector
- Structure varies → Need more specific selector (e.g., combine with parent selector)

**Example:**
```bash
# If structure is the same everywhere:
[data-testid="tweetPhoto"]  # Works for all

# If it varies (e.g., timeline vs profile):
body.Timeline [data-testid="tweetPhoto"]  # Only in timeline
body.Profile [data-testid="tweetPhoto"]   # Only in profile
```

## Reading DOM Successfully (LLM Guide)

When analyzing Twitter DOM structure:

1. **Request full context** - Ask for -B 20 -A 20 or more around target element
2. **Identify the pattern** - Twitter uses consistent class names like `css-175oi2r`, `r-*` utilities
3. **Find stable selectors** - Priority: `data-testid` > `role` > `aria-label` > classes
4. **Map the layers** - Count parent levels, note which layer handles what (click, display, style)
5. **Check for blockers** - Look for wrapping `<a>`, `<button>`, or elements with click handlers
6. **Understand the wrapper** - If `<a>` or interactive element wraps target, style children not parent

**What to ask the human for:**
```
1. Saved HTML file or snippet with rg output
2. What element are you trying to target? (describe visually)
3. What action? (hide, blur, change color, add overlay)
4. Does it need to be interactive? (hover, click)
5. Should it work in one place or everywhere?
```

## Finding Media Elements

## Media Element Structure

### Images (tweetPhoto)
```html
<a href="..." role="link">                          <!-- Link wrapper (captures clicks) -->
  <div ...>
    <div data-testid="tweetPhoto">                  <!-- Container selector -->
      <div style="background-image: url(...)"></div> <!-- Background version -->
      <img alt="Image" src="..." />                 <!-- Actual img element -->
    </div>
  </div>
</a>
```

**Key Points:**
- Target: `[data-testid="tweetPhoto"]`
- Images inside as: `img` tags AND `div[style*="background-image"]`
- Apply styles to **child elements**, not container (link wrapper blocks interaction)
- Hover on container: `[data-testid="tweetPhoto"]:hover img`

### Videos
```html
<div data-testid="videoPlayer">
  <video autoplay ...>
    <source src="..." />
  </video>
</div>
```

**Key Points:**
- Target: `[data-testid="videoPlayer"]` or `[data-testid="videoComponent"]`
- Videos autoplay by default - disable via JavaScript
- Can apply filters directly to container

### Profile Banners
```html
<a href="username/header_photo">
  <div ...>
    <img alt="" src="profile_banners/..." />
  </div>
</a>
```

**Key Points:**
- Target: `a[href$="/header_photo"]`
- Safe to style the `<a>` directly

### Link Preview Cards
```html
<div data-testid="card.wrapper">
  <div ...>
    <img ... />
  </div>
</div>
```

**Key Points:**
- Target: `[data-testid="card.wrapper"]`
- Contains images/videos from link previews

## Common Pitfalls

### ❌ Wrong: Blur on container when link wraps it
```css
[data-testid="tweetPhoto"] {
  filter: blur(20px); /* Doesn't work - link blocks hover */
}
```

### ❌ Wrong: Using display:none loses interaction
```css
[data-testid="tweetPhoto"] {
  display: none; /* Kills click/hover events */
}
```

### ✅ Correct: Dark overlay with pointer-events:none
```css
[data-testid="tweetPhoto"] {
  position: relative;
}
[data-testid="tweetPhoto"]::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #1a1a1a;              /* Very dark grey */
  z-index: 10;
  pointer-events: none;              /* Don't block interaction */
}
[data-testid="tweetPhoto"]:hover::before {
  opacity: 0;                        /* Reveal on hover */
}
```

### ✅ Alternative: Blur on child elements (more distracting)
```css
[data-testid="tweetPhoto"] img,
[data-testid="tweetPhoto"] div[style*="background-image"] {
  filter: blur(50px) brightness(0.2);
}
[data-testid="tweetPhoto"]:hover img,
[data-testid="tweetPhoto"]:hover div[style*="background-image"] {
  filter: blur(0) brightness(1);
}
```

## Testing Selectors

### Quick Test in Console
```javascript
// Count how many images exist
document.querySelectorAll('[data-testid="tweetPhoto"]').length

// Test blur on all images
document.querySelectorAll('[data-testid="tweetPhoto"] img').forEach(img => {
  img.style.filter = 'blur(50px) brightness(0.2)';
});

// Check if selector works
document.querySelector('[data-testid="videoPlayer"]')
```

### Verify in Extension
1. Make changes to `script.js`
2. Run `make all`
3. Reload extension in `about:debugging`
4. Hard refresh Twitter page (Cmd+Shift+R)
5. Check browser console for errors

## Cover/Filter Recommendations

### Dark Grey Overlay (Recommended - Less Distracting)
```css
element::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #1a1a1a;              /* Very dark grey */
  z-index: 10;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
element:hover::before {
  opacity: 0;                        /* Remove on hover */
}
```

### Black Overlay with Opacity
```css
element::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--background-color, #000);
  opacity: 0.9;
  z-index: 10;
  pointer-events: none;
}
```

### Blur Filters (More Distracting)

**For white/light images:**
```css
filter: blur(50px) brightness(0.2) contrast(0.5);
```

**For dark images/videos:**
```css
filter: blur(30px) brightness(0.5);
```

## Data Attributes Reference

Common `data-testid` values:
- `tweetPhoto` - Tweet images
- `videoPlayer`, `videoComponent` - Videos
- `card.wrapper` - Link preview cards
- `Tweet-User-Avatar` - Avatar containers
- `UserAvatar-Container-{username}` - User-specific avatars
