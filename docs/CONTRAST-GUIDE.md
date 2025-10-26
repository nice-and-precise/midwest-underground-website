# Text Contrast Guide

## Simple Rules for Good Contrast

### Light Backgrounds (Gray/White sections)
**Always use:** `color: var(--brand-slate-dark)`
- Dark slate text (#343D46) on light backgrounds
- Meets WCAG AAA standard (9.28:1 ratio)

### Dark Backgrounds (Dark gray/charcoal sections)
**Always use:** `color: var(--brand-white)`
- White text (#FFFFFF) on dark backgrounds
- Excellent contrast for readability

### Orange Accent Backgrounds
**Always use:** `color: var(--brand-black)`
- Black text (#000000) on orange (#FF8800)
- Meets WCAG AAA standard (9.44:1 ratio)
- **Never use white text on orange**

## Gradient Sections

Use the `.gradient-bg-light` class for light gradient backgrounds:

```html
<section class="section gradient-bg-light">
  <h2 style="color: var(--brand-slate-dark);">Heading</h2>
  <p style="color: var(--brand-slate-dark);">Body text</p>
</section>
```

**What it does:**
- Light mode: Gray gradient with dark text
- Dark mode: Dark gradient with white text (automatic)

## Don't Use These

❌ `color: var(--text-primary)` on gradient backgrounds
❌ `color: var(--text-secondary)` on gradient backgrounds
❌ `color: var(--neutral-light)` anywhere
❌ White text on light backgrounds
❌ Light gray text on light backgrounds

## Quick Check

If you can't easily read the text, the contrast is wrong. Always test in both light and dark modes.
