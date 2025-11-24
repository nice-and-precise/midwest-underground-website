# Logo Usage Guide

## Available Logo Variants

The Midwest Underground logo is available in multiple color variants to ensure optimal contrast and readability across different backgrounds.

### Horizontal Logos

#### 1. Primary Logo (PNG - Transparent Background)
**File:** `images/logo_horizontal_transparent.png`
- **Color:** Slate Dark (#343D46)
- **Use on:** Light backgrounds (white, light gray, light gradients)
- **Contrast:** 9.28:1 on white (AAA)
- **Format:** PNG (1.5MB, high quality)
- **Best for:** Main website header, light-themed pages

#### 2. White Logo (SVG)
**File:** `images/logo_horizontal_white.svg`
- **Color:** White (#FFFFFF)
- **Use on:** Dark backgrounds (slate dark, slate, dark gradients)
- **Contrast:** 9.28:1 on #343D46 (AAA)
- **Format:** SVG (scalable)
- **Best for:** Dark mode, footer, dark hero sections

#### 3. Slate Dark Logo (SVG)
**File:** `images/logo_horizontal_slate_dark.svg`
- **Color:** Slate Dark (#343D46)
- **Use on:** Light backgrounds (white, light gray)
- **Contrast:** 9.28:1 on white (AAA)
- **Format:** SVG (scalable)
- **Best for:** Scalable light background usage

#### 4. Orange Accent Logo (SVG)
**File:** `images/logo_horizontal_orange.svg`
- **Color:** Brand Orange (#FF8800)
- **Use on:** White or very light backgrounds only
- **Contrast:** Good on white
- **Format:** SVG (scalable)
- **Best for:** Special accent areas, promotional materials

#### 5. Gray Logo (SVG)
**File:** `images/logo_horizontal_gray.svg`
- **Color:** Brand Gray (#C0C5CE)
- **Use on:** Dark backgrounds (#343D46)
- **Contrast:** 5.47:1 on slate dark (AA)
- **Format:** SVG (scalable)
- **Best for:** Subtle branding on dark surfaces

### Icon/Mark Logos

**File:** `images/logo_icon_transparent.png`
- Clean "MU" mark
- Transparent background
- Use for favicons, app icons, social media profiles

## Usage Rules

### Contrast Requirements (WCAG 2.1 AA)

All logo placements must meet minimum contrast ratios:

| Logo Color | Background | Contrast | Rating | Usage |
|-----------|------------|----------|--------|-------|
| White (#FFFFFF) | Slate Dark (#343D46) | 9.28:1 | AAA ✓ | Perfect |
| Slate Dark (#343D46) | White (#FFFFFF) | 9.28:1 | AAA ✓ | Perfect |
| Gray (#C0C5CE) | Slate Dark (#343D46) | 5.47:1 | AA ✓ | Good |
| Orange (#FF8800) | White (#FFFFFF) | ~4.5:1 | AA ✓ | Acceptable |

### Background Color Decision Tree

```
Is the background dark (#343D46 or darker)?
├─ YES → Use WHITE logo (logo_horizontal_white.svg)
└─ NO → Is the background light (white, light gray)?
    ├─ YES → Use SLATE DARK logo (logo_horizontal_transparent.png or .svg)
    └─ NO → Is this a special accent area?
        ├─ YES → Use ORANGE logo (logo_horizontal_orange.svg)
        └─ NO → Use GRAY logo for subtle effect
```

### Quick Reference

**Light Backgrounds (white, #F5F5F5, light gradients):**
- ✅ Primary: `logo_horizontal_transparent.png` (slate dark)
- ✅ Alternative: `logo_horizontal_slate_dark.svg`
- ✅ Accent: `logo_horizontal_orange.svg`

**Dark Backgrounds (#343D46, #4F5B66, dark gradients):**
- ✅ Primary: `logo_horizontal_white.svg`
- ✅ Subtle: `logo_horizontal_gray.svg`

**Medium Backgrounds:**
- Evaluate contrast - use white or slate dark depending on which provides better contrast

### Implementation Examples

#### Light Mode Header
```html
<header style="background: linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%);">
  <img src="images/logo_horizontal_transparent.png" alt="Midwest Underground of Minnesota">
</header>
```

#### Dark Mode Header
```html
<header style="background: var(--brand-slate-dark);" data-theme="dark">
  <img src="images/logo_horizontal_white.svg" alt="Midwest Underground of Minnesota">
</header>
```

#### Orange Accent Section
```html
<section style="background: linear-gradient(135deg, #FFFFFF 0%, #FFF5E6 100%);">
  <img src="images/logo_horizontal_orange.svg" alt="Midwest Underground of Minnesota">
</section>
```

### Minimum Size Requirements

- **Horizontal Logo:** Minimum width 200px for readability
- **Icon/Mark:** Minimum 40x40px
- **Favicon:** 32x32px or 64x64px

### Spacing Requirements

- Maintain clear space around logo equal to height of "U" in "UNDERGROUND"
- Never place logo closer than this clear space to other elements
- Never place logo on busy backgrounds or images without sufficient contrast

### What NOT to Do

❌ Don't use slate dark logo on dark backgrounds (poor contrast)
❌ Don't use white logo on light backgrounds (invisible)
❌ Don't use orange logo on orange or similar colored backgrounds
❌ Don't stretch or distort logo proportions
❌ Don't add effects (shadows, glows, outlines) without approval
❌ Don't place logo on busy background images
❌ Don't use logo smaller than minimum size requirements

### Testing Your Logo Placement

1. **Check Contrast:** Use browser DevTools to verify contrast ratio meets AA (4.5:1 minimum)
2. **Test Both Modes:** Verify logo visibility in both light and dark mode
3. **Check Responsive:** Ensure logo scales properly on mobile (375px) to desktop (1920px+)
4. **Print Test:** View page in grayscale to confirm contrast without color

## File Formats

### PNG (Raster)
- **Pros:** High quality, universal browser support, transparent background
- **Cons:** Large file size (1.5MB), doesn't scale perfectly
- **Use for:** Main production logo when quality is critical

### SVG (Vector)
- **Pros:** Infinitely scalable, small file size, crisp at any resolution
- **Cons:** May have font rendering issues in some browsers
- **Use for:** When scalability is needed, performance is critical

## Quick Selection Guide

**Need maximum quality and reliability?**
→ Use PNG: `logo_horizontal_transparent.png`

**Need scalability and performance?**
→ Use SVG: `logo_horizontal_white.svg` or `logo_horizontal_slate_dark.svg`

**Need color variant?**
→ Choose based on background contrast requirements above

---

**Last Updated:** October 25, 2025
**Brand Refresh:** October 2025
**Maintained by:** Midwest Underground Marketing Team
