# Contrast Fix Plan - Brand Compliance + Readability

## Problem Analysis

### Issues Found:
1. **Logo broken** - Showing as blue box instead of logo
2. **About page timeline** - Gray text on dark gray background (invisible)
3. **Emergency section** - White text on orange (violates brand guide)
4. **General text** - Using `var(--steel)` on dark backgrounds (low contrast)

## Brand Guide Rules (from docs/brand.md):

### Contrast Ratios:
- `#343D46` on `#FFFFFF` = 9.28:1 (AAA) ✓
- `#4F5B66` on `#FFFFFF` = 5.92:1 (AA) ✓
- `#65737E` on `#FFFFFF` = 4.11:1 (AA for large text ONLY)
- `#FFFFFF` on `#343D46` = 9.28:1 (AAA) ✓
- `#C0C5CE` on `#343D46` = 5.47:1 (AA) ✓
- **`#000000` on `#FF8800` = 9.44:1 (AAA) ✓** ← USE FOR TEXT ON ORANGE

### CRITICAL RULE:
**"Always use #000000 (black) for text on #FF8800 (accent orange). Never use white text on orange for body copy."**

## Fixes Required:

### 1. Logo SVG (images/logo_primary.svg)
- Issue: Not rendering properly, showing as blue box
- Fix: Test SVG in browser, ensure proper XML/SVG syntax
- Verify: Should show "MIDWEST UNDERGROUND" text + MU mark

### 2. About Page Timeline (about.html lines 720-850)
- Issue: Using `var(--steel)` for text which is gray
- Current: Gray on dark background = invisible
- Fix Options:
  a) Light mode: Keep `var(--steel)` (5.92:1 on white) ✓
  b) Dark mode: Use `var(--text-primary)` which maps to white
- Solution: Add specific dark mode text colors

### 3. Emergency Section (services.html line 507)
- Issue: White text on orange background
- Current: `color: var(--white); opacity: 0.9`
- Fix: Change to `color: var(--brand-black)` or `#000000`
- Result: Black text on orange = 9.44:1 (AAA) ✓

### 4. CSS Variables (css/styles.css)
- Issue: Text colors not adapting properly in dark mode
- Fix: Ensure semantic variables work for both themes

## Implementation Order:

1. ✅ Fix emergency section: white → black text
2. ✅ Fix logo SVG rendering
3. ✅ Fix about page timeline text colors
4. ✅ Test on all pages (light + dark mode)
5. ✅ Verify against brand demo page
6. ✅ Commit with detailed documentation

## Testing Checklist:

- [ ] Logo displays on all 11 pages
- [ ] Emergency section: black text on orange
- [ ] About timeline: readable in light AND dark modes
- [ ] All text meets WCAG AA minimum (4.5:1)
- [ ] Matches brand demo standards
- [ ] Works in both light/dark themes
