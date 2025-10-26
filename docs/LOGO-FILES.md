# Logo Implementation Guide

## Current Logo Setup

**File:** `images/logo_horizontal_official.png`
- Full horizontal logo with "MIDWEST UNDERGROUND" text
- Transparent PNG (1.5MB)
- Used on all 11 website pages

## How the Logo Works

The logo automatically changes color based on the background:
- **Light backgrounds:** Logo appears BLACK via CSS filter
- **Dark backgrounds:** Logo appears WHITE via CSS filter

**CSS Implementation:**
```css
.logo-image {
  filter: brightness(0) saturate(100%); /* Black in light mode */
}

[data-theme="dark"] .logo-image {
  filter: brightness(0) saturate(100%) invert(1); /* White in dark mode */
}
```

## Logo Sizes

- **Desktop (769px+):** 160px height
- **Tablet:** 80px height
- **Mobile:** 60px height

## How to Update the Logo

1. Get new PNG file from client
2. Replace `images/logo_horizontal_official.png`
3. Increment version in HTML: `?v=7` → `?v=8`
4. Hard refresh browser (Ctrl+Shift+R)

## Source File

**Location:** `C:\Users\Owner\Desktop\MU_Logo\updated_logo\MidwestUnderground_Logo (1).png`
