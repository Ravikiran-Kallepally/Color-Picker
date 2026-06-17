# Color Picker Remastered

The best color picker extension for designers and developers. Beautiful UI, more features, zero bloat.

---

## What's New in v1.1.0

### New Features

**WCAG Contrast Checker (inline)**
Every color you pick instantly shows contrast ratios against white and black backgrounds, with AA and AAA accessibility pass/fail badges. No switching tools — it's right there on the picker.

**Color Harmonies**
Five harmony swatches appear automatically for every color: Complementary, Analogous (−30° / +30°), and Triadic (120° / 240°). Click any swatch to load it as your active color.

**Settings Panel**
- Auto-copy on pick: enable to have the color instantly copied to clipboard the moment you pick it
- Copy format preference: choose HEX, RGB, HSL, HSV, or CMYK as your default copy format
- Open with the gear icon in the header

**Keyboard Shortcut**
Press `Alt+Shift+C` on any page to trigger the eyedropper without opening the popup first.

**Palette CSS Export**
Each palette now has an export button. One click copies the entire palette as CSS custom properties:
```css
:root {
  --brand-colors-1: #3B82F6;
  --brand-colors-2: #EF4444;
}
```

**Pending Color Recovery**
If you pick a color via keyboard shortcut while the popup is closed, the color is saved and applied the next time you open the extension.

---

## All Features

| Feature | Description |
|---|---|
| Eyedropper | Native browser eyedropper — picks any pixel from any page |
| 5 Color Formats | HEX, RGB, HSL, HSV, CMYK — all visible at once, all copyable |
| WCAG Contrast | Contrast ratio vs white & black with AA/AAA badges |
| Color Harmonies | Complementary, Analogous, Triadic swatches auto-generated |
| Color Naming | HSL-based color name (e.g. "Dark Muted Blue") |
| Luminance Bar | WCAG relative luminance visualized |
| Native Picker | `<input type="color">` for palette-based selection |
| History | Up to 60 recent colors, click to reload |
| Palettes | Named collections with CSS export |
| Auto-copy | Optional: copy on pick with format preference |
| Keyboard Shortcut | `Alt+Shift+C` — eyedropper without opening popup |
| Settings | Persistent preferences via chrome.storage |

---

## Why Better Than ColorZilla

| | Color Picker Remastered | ColorZilla |
|---|---|---|
| WCAG contrast inline | ✓ | — |
| Color harmonies | ✓ | — |
| Modern dark UI | ✓ | dated |
| All formats at once | ✓ (5 formats) | one at a time |
| CSS palette export | ✓ | — |
| Keyboard shortcut | ✓ | ✓ |
| Auto-copy setting | ✓ | ✓ |
| Privacy | no data collected | no data collected |

---

## Icon Regeneration

To regenerate PNG icons (requires Node.js + `canvas` package):

```sh
npm install canvas
node generate-icons.js
```

Or open `make-icons.html` in Chrome and download each size.

---

## v1.0.0 — Initial Release

- Eyedropper via native EyeDropper API
- HEX, RGB, HSL, HSV, CMYK format display and copy
- Color naming (exact + HSL-approximate)
- Luminance bar
- Native color picker input
- Color history (up to 60 colors)
- Named palettes with add/delete
