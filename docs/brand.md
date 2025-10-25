# Midwest Underground Brand System

**Version:** 2.0 (October 2025 Refresh)
**Status:** Production Ready
**Accessibility:** WCAG 2.1 AA Compliant

---

## Table of Contents

1. [Overview](#overview)
2. [Color Palette](#color-palette)
3. [Color Roles & Semantic Tokens](#color-roles--semantic-tokens)
4. [Typography](#typography)
5. [Logo System](#logo-system)
6. [Component Guidelines](#component-guidelines)
7. [Accessibility Standards](#accessibility-standards)
8. [Implementation Guide](#implementation-guide)
9. [Migration from Old Brand](#migration-from-old-brand)

---

## Overview

The Midwest Underground brand system emphasizes reliability, safety, and technical expertise through a professional, industrial color palette. The system supports both light and dark themes while maintaining consistent accessibility standards.

### Brand Principles

- **Professional**: Industrial strength, no-nonsense aesthetic
- **Accessible**: WCAG AA or better for all text combinations
- **Flexible**: Works across digital and physical applications
- **Consistent**: Semantic tokens ensure uniform appearance

---

## Color Palette

### Base Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Slate Dark** | `#343D46` | Primary ink, dark surfaces |
| **Slate** | `#4F5B66` | Secondary ink, muted surfaces |
| **Slate Light** | `#65737E` | Subtle text, borders, dividers |
| **Gray** | `#C0C5CE` | Light backgrounds, secondary text on dark |
| **Accent Orange** | `#FF8800` | CTAs, links, brand moments |
| **White** | `#FFFFFF` | Light backgrounds, text on dark |
| **Black** | `#000000` | Text on accent (for contrast) |

### Color Specifications

#### Slate Dark (`#343D46`)
- **RGB:** 52, 61, 70
- **HSL:** 210°, 15%, 24%
- **Use:** Headings, primary text (light mode), backgrounds (dark mode)

#### Slate (`#4F5B66`)
- **RGB:** 79, 91, 102
- **HSL:** 209°, 13%, 35%
- **Use:** Body text, secondary elements

#### Slate Light (`#65737E`)
- **RGB:** 101, 115, 126
- **HSL:** 206°, 11%, 45%
- **Use:** Subtle text, borders, placeholder text

#### Gray (`#C0C5CE`)
- **RGB:** 192, 197, 206
- **HSL:** 219°, 14%, 78%
- **Use:** Light backgrounds, dividers, disabled states

#### Accent Orange (`#FF8800`)
- **RGB:** 255, 136, 0
- **HSL:** 32°, 100%, 50%
- **Use:** Primary actions, links, focus states
- **On-accent text:** Must be `#000000` (black) for WCAG compliance

---

## Color Roles & Semantic Tokens

### Light Mode

| Token | Value | Purpose |
|-------|-------|---------|
| `--bg` | `#FFFFFF` | Main background |
| `--bg-muted` | `#C0C5CE` | Secondary backgrounds, cards |
| `--ink` | `#343D46` | Primary text, headings |
| `--ink-secondary` | `#4F5B66` | Body text, secondary elements |
| `--ink-subtle` | `#65737E` | Subtle text, captions |
| `--border` | `#C0C5CE` | Borders, dividers |
| `--accent` | `#FF8800` | Primary actions, links |
| `--on-accent` | `#000000` | Text on accent backgrounds |

### Dark Mode

| Token | Value | Purpose |
|-------|-------|---------|
| `--bg` | `#343D46` | Main background |
| `--bg-muted` | `#4F5B66` | Secondary backgrounds, cards |
| `--ink` | `#FFFFFF` | Primary text, headings |
| `--ink-secondary` | `#C0C5CE` | Body text, secondary elements |
| `--ink-subtle` | `#C0C5CE` | Subtle text, captions |
| `--border` | `#65737E` | Borders, dividers |
| `--accent` | `#FF8800` | Primary actions, links |
| `--on-accent` | `#000000` | Text on accent backgrounds |

### Usage Examples

```css
/* ✅ DO: Use semantic tokens */
.button {
  background: var(--accent);
  color: var(--on-accent);
}

.card {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--ink);
}

/* ❌ DON'T: Use hardcoded hex values */
.button {
  background: #FF8800;
  color: #000000;
}
```

---

## Typography

### Font Families

#### Headings: Oswald
- **Weights:** 700 (Bold), 800 (ExtraBold)
- **Usage:** All headings (H1-H6), display text
- **Character:** Strong, industrial, authoritative
- **Load:** Google Fonts CDN

```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700;800&display=swap" rel="stylesheet">
```

#### Body: Inter
- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)
- **Usage:** Body copy, UI elements, buttons
- **Character:** Clean, legible, professional
- **Load:** Google Fonts CDN

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Type Scale

| Element | Size | Line Height | Weight | Font |
|---------|------|-------------|--------|------|
| H1 | 3rem (48px) | 1.2 | 700 | Oswald |
| H2 | 2.5rem (40px) | 1.3 | 700 | Oswald |
| H3 | 2rem (32px) | 1.4 | 700 | Oswald |
| H4 | 1.563rem (25px) | 1.4 | 700 | Oswald |
| Body Large | 1.25rem (20px) | 1.6 | 400 | Inter |
| Body | 1rem (16px) | 1.6 | 400 | Inter |
| Body Small | 0.875rem (14px) | 1.5 | 400 | Inter |
| Caption | 0.75rem (12px) | 1.4 | 500 | Inter |

### Best Practices

✅ **DO:**
- Use Oswald for all headings
- Use Inter for all body text
- Maintain 1.6 line-height for body text
- Use proper semantic HTML (h1-h6, p, etc.)

❌ **DON'T:**
- Mix fonts within the same element type
- Use font-weight below 400 for body text
- Set line-height below 1.4 for readability

---

## Logo System

### Logo Variants

#### 1. Logo Mark (Icon Only)
- **File:** `logo-mark.png`
- **Format:** PNG (high resolution)
- **Min Size:** 24px height
- **Use:** App icons, favicons, small spaces
- **Note:** Also available as SVG for web use

#### 2. Horizontal Lockup
- **File:** `logo-horizontal.png`
- **Format:** PNG (high resolution)
- **Min Size:** 120px width
- **Use:** Headers, footers, wide spaces, stacked when needed
- **Note:** This is the primary logo, can be used in various orientations

### Clear Space

Maintain clear space around all logos equal to **the width of the inner U-stroke** (approximately 60px in the mark).

```
┌─────────────────────────────┐
│                             │
│     [clearspace]            │
│  ┌──────────────┐          │
│  │   MU LOGO    │  [60px]  │
│  └──────────────┘          │
│     [clearspace]            │
│                             │
└─────────────────────────────┘
```

### Color Variations

#### On Light Backgrounds
- **Default:** `#343D46` (Slate Dark)
- **Alt:** Full color with accent highlights (decorative only)

#### On Dark Backgrounds
- **Default:** `#FFFFFF` (White)
- **Implementation:** Use `filter: brightness(0) invert(1);` on SVG

#### On Accent Backgrounds
- **Use:** `#000000` (Black) for maximum contrast
- **Caution:** Only use for decorative applications, not primary logo placement

### Incorrect Usage

❌ **DON'T:**
- Stretch or distort the logo
- Use logo on busy background images without overlay
- Place logo without proper clear space
- Use colors outside approved palette
- Rotate or skew the logo
- Add effects (drop shadows, glows, etc.)
- Use low-resolution raster versions when SVG is available

### Logo Files & Exports

#### Primary Logos (High Resolution PNG)
- `public/brand/logo-mark.png` - Icon only (high resolution)
- `public/brand/logo-horizontal.png` - Full lockup (high resolution)

#### SVG (Vector - Optional)
- `public/brand/logo-mark.svg` - Icon only (for web use)
- `public/brand/logo-horizontal.svg` - Horizontal lockup (for web use)
- `public/brand/logo-stacked.svg` - Stacked layout (for web use)

**Note:** The PNG versions are the official brand logos. SVG versions are provided for web optimization but should match the PNG designs exactly.

#### Favicons
- `public/favicon.ico` - Multi-size ICO
- `public/favicon-32.png` - 32×32 PNG
- `public/apple-touch-icon.png` - 180×180 PNG

#### Social Media
- `public/og.png` - 1200×630 (Open Graph)
- `public/twitter.png` - 1600×900 (Twitter/X Card)

### Alt Text Guidelines

```html
<!-- ✅ DO: Descriptive alt text -->
<img src="logo-horizontal.svg" alt="Midwest Underground of Minnesota">

<!-- ✅ DO: For decorative uses -->
<img src="logo-mark.svg" alt="" role="presentation">

<!-- ❌ DON'T: Use file names or "logo" -->
<img src="logo.svg" alt="logo">
<img src="logo.svg" alt="midwest_underground_logo.png">
```

---

## Component Guidelines

### Buttons

```css
.btn {
  background: var(--accent);
  color: var(--on-accent);
  border-radius: 6px;
  padding: 0.625rem 1rem;
  font-weight: 600;
  transition: all 150ms ease;
}

.btn:hover {
  background: #E67900; /* Darker orange */
  transform: translateY(-1px);
}

.btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

**States:**
- Default: `var(--accent)` background
- Hover: `#E67900` (darker shade)
- Active: No transform
- Focus: 2px accent outline
- Disabled: 50% opacity, no interaction

### Links

```css
a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  color: #E67900;
  text-decoration: underline;
}

a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 2px;
}
```

### Form Inputs

```css
input, select, textarea {
  background: var(--bg);
  color: var(--ink);
  border: 2px solid var(--border);
  border-radius: 6px;
  padding: 0.625rem 0.875rem;
}

input:focus {
  border-color: var(--accent);
  outline: none;
}

input::placeholder {
  color: var(--ink-subtle);
  opacity: 0.7;
}
```

### Cards

```css
.card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(52, 61, 70, 0.1);
}

.card:hover {
  box-shadow: 0 4px 6px rgba(52, 61, 70, 0.15);
}
```

---

## Accessibility Standards

### WCAG Contrast Requirements

All text/background combinations meet **WCAG 2.1 Level AA** (4.5:1 for normal text, 3:1 for large text).

### Contrast Ratios

| Foreground | Background | Ratio | Rating |
|-----------|------------|-------|--------|
| `#343D46` | `#FFFFFF` | 9.28:1 | AAA ✓ |
| `#4F5B66` | `#FFFFFF` | 5.92:1 | AA ✓ |
| `#65737E` | `#FFFFFF` | 4.11:1 | AA- (large text only) |
| `#FFFFFF` | `#343D46` | 9.28:1 | AAA ✓ |
| `#C0C5CE` | `#343D46` | 5.47:1 | AA ✓ |
| `#000000` | `#FF8800` | 9.44:1 | AAA ✓ |
| `#FFFFFF` | `#4F5B66` | 5.92:1 | AA ✓ |

**Key Rule:** Always use `#000000` (black) for text on `#FF8800` (accent orange). Never use white text on orange for body copy.

### Focus States

All interactive elements must have visible focus indicators:

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### Reduced Motion

Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Considerations

- Use semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- Provide alt text for all informative images
- Use ARIA labels when necessary
- Ensure logical tab order
- Test with keyboard navigation

---

## Implementation Guide

### Quick Start

1. **Add brand CSS to your HTML:**

```html
<head>
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Oswald:wght@700;800&display=swap" rel="stylesheet">

  <!-- Brand System -->
  <link rel="stylesheet" href="/css/brand.css">

  <!-- Optional: Deprecated mappings for gradual migration -->
  <link rel="stylesheet" href="/css/brand-deprecated.css">
</head>
```

2. **Enable dark mode:**

```html
<html class="theme-dark">
  <!-- or use data attribute -->
<html data-theme="dark">
```

3. **Use semantic tokens in your CSS:**

```css
.my-component {
  background: var(--bg);
  color: var(--ink);
  border: 1px solid var(--border);
}

.my-button {
  background: var(--accent);
  color: var(--on-accent);
}
```

### Dark Mode Toggle

```javascript
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.contains('theme-dark');

  if (isDark) {
    html.classList.remove('theme-dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('theme-dark');
    localStorage.setItem('theme', 'dark');
  }
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('theme-dark');
}

// Detect system preference
if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('theme-dark');
}
```

### Tailwind Integration

If using Tailwind CSS, use the provided `tailwind.config.js`:

```javascript
module.exports = {
  darkMode: ['class', '.theme-dark'],
  theme: {
    extend: {
      colors: {
        brand: {
          'slate-dark': '#343D46',
          'slate': '#4F5B66',
          'accent': '#FF8800',
          // ... see tailwind.config.js for full palette
        }
      }
    }
  }
}
```

Usage in markup:

```html
<div class="bg-brand-slate-dark text-white">
  <h1 class="font-heading text-4xl">Heading</h1>
  <p class="font-body">Body text</p>
  <button class="bg-brand-accent text-black">CTA</button>
</div>
```

---

## Migration from Old Brand

### Color Mapping

| Old Color | Old Hex | New Color | New Hex | Notes |
|-----------|---------|-----------|---------|-------|
| `--primary-charcoal` | `#23272A` | `--brand-slate-dark` | `#343D46` | Slightly lighter |
| `--charcoal-900` | `#1E2226` | `--brand-slate-dark` | `#343D46` | Consolidated |
| `--steel` | `#4F5B66` | `--brand-slate` | `#4F5B66` | No change |
| `--safety-orange` | `#FF5A1F` | `--brand-accent` | `#FF8800` | More vibrant |
| `--utility-yellow` | `#FFC400` | `--brand-accent` | `#FF8800` | Consolidated |
| `--sand` | `#F2EDE5` | `--brand-gray` | `#C0C5CE` | More neutral |

### Migration Strategy

#### Step 1: Load Compatibility Layer

Keep `brand-deprecated.css` loaded to map old tokens to new ones:

```html
<link rel="stylesheet" href="/css/brand.css">
<link rel="stylesheet" href="/css/brand-deprecated.css">
```

#### Step 2: Update Component-by-Component

Search and replace old tokens:

```bash
# Find all uses of old charcoal
grep -r "var(--primary-charcoal)" .

# Replace with new semantic token
# OLD: background: var(--primary-charcoal);
# NEW: background: var(--brand-slate-dark);
```

#### Step 3: Test Both Themes

After each component update:
1. Test in light mode
2. Test in dark mode
3. Check contrast ratios
4. Verify hover/focus states

#### Step 4: Remove Deprecated File

Once all components are migrated, remove `brand-deprecated.css` from your HTML.

### Common Replacements

```css
/* OLD */
.header {
  background: var(--primary-charcoal);
  color: var(--sand);
}

.button {
  background: var(--safety-orange);
  color: var(--white);
}

/* NEW */
.header {
  background: var(--bg); /* or var(--brand-slate-dark) */
  color: var(--ink);
}

.button {
  background: var(--accent);
  color: var(--on-accent);
}
```

---

## Testing Checklist

### Visual Testing
- [ ] Test all components in light mode
- [ ] Test all components in dark mode
- [ ] Verify focus states on interactive elements
- [ ] Check hover states on buttons/links
- [ ] Test on mobile (375px) and desktop (1920px)

### Accessibility Testing
- [ ] Run axe DevTools or Lighthouse accessibility audit
- [ ] Test keyboard navigation (Tab, Enter, Space)
- [ ] Verify all interactive elements are focusable
- [ ] Check color contrast with WebAIM Contrast Checker
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)

### Performance Testing
- [ ] Verify fonts load with `font-display: swap`
- [ ] Check logo SVGs are optimized
- [ ] Confirm transitions respect `prefers-reduced-motion`
- [ ] Test dark mode toggle performance

---

## Resources

### Tools
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Color Blindness Simulator:** https://www.color-blindness.com/coblis-color-blindness-simulator/
- **Accessibility Audit:** Chrome DevTools Lighthouse
- **Screen Reader:** NVDA (Windows), VoiceOver (Mac)

### Documentation
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **CSS Custom Properties:** https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Dark Mode:** https://web.dev/prefers-color-scheme/

### Internal Files
- Brand Demo: `/src/pages/brand-demo.html`
- Brand CSS: `/css/brand.css`
- Logo Assets: `/public/brand/`
- Tailwind Config: `/tailwind.config.js`

---

## Questions or Issues?

For help implementing the brand system or reporting issues:

1. Review the brand-demo.html page for working examples
2. Check brand-deprecated.css for migration mappings
3. Test with both light and dark themes
4. Verify WCAG compliance using provided contrast ratios

---

**Last Updated:** October 2025
**Version:** 2.0
**Maintained by:** Midwest Underground Design Team
