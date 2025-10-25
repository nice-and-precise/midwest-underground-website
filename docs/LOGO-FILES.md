# Logo Files - Official Reference

## Current Implementation (As of Oct 25, 2025)

### Active Logo Files

**Primary Header Logo:**
- **File:** `images/logo_horizontal_official.png`
- **Source:** `/c/Users/Owner/Desktop/MU_Logo/updated_logo/MidwestUnderground_Logo (1).png`
- **Description:** Full horizontal logo with MU icon + "MIDWEST UNDERGROUND" text
- **Usage:** All website headers (11 pages total)
- **Background:** Transparent PNG - works on both light and dark backgrounds
- **Size:** Height 80px in CSS

**Icon/Favicon:**
- **File:** `images/mu_icon_official.png`
- **Source:** `/c/Users/Owner/Desktop/MU_Logo/updated_logo/MU_Logo (1).png`
- **Description:** MU icon only (lettermark)
- **Usage:** Favicon, footer, possibly future use
- **Background:** Transparent PNG

## File Naming Convention

### Official Files (USE THESE)
- `logo_horizontal_official.png` - Full logo with text (ACTIVE IN USE)
- `mu_icon_official.png` - Icon only (ACTIVE IN USE)

### Legacy/Experimental Files (DO NOT USE)
- `mu_icon_slate_dark.svg` - Custom SVG that only shows "M" letter (BROKEN)
- `mu_icon_white.svg` - Custom SVG that only shows "M" letter (BROKEN)
- `logo_horizontal_slate_dark.svg` - Custom SVG (NOT OFFICIAL)
- `logo_horizontal_white.svg` - Custom SVG (NOT OFFICIAL)
- `logo_primary.svg` - Old version
- `logo_icon_clean.svg` - Experimental

## How to Update Logo

If you need to change the logo in the future:

1. Get official PNG files from client
2. Copy to `images/` folder with `_official` suffix
3. Update HTML files:
   ```html
   <img src="images/logo_horizontal_official.png?v=7" alt="Midwest Underground of Minnesota" class="logo-image">
   ```
4. Increment version number (?v=7) to bust browser cache
5. Update CSS if size needs adjustment:
   ```css
   .logo-image {
     height: 80px; /* Adjust as needed */
     width: auto;
   }
   ```

## Logo Switching (Dark Mode)

**CURRENT STATUS:** Disabled

The transparent PNG logo works on both light and dark backgrounds, so no JavaScript switching is needed.

If future requirements need different logos for light/dark mode:
- Light mode logo: Name it `logo_horizontal_light.png`
- Dark mode logo: Name it `logo_horizontal_dark.png`
- Update `js/main.js` `updateLogos()` function to switch between them

## Pages Using Logo

### Public Pages (5)
1. index.html
2. services.html
3. about.html
4. projects.html
5. contact.html

### Dashboard Pages (6)
1. dashboard/index.html
2. dashboard/customers.html
3. dashboard/equipment.html
4. dashboard/financials.html
5. dashboard/projects.html
6. dashboard/reports.html

## Common Issues

### Problem: Logo showing just "M" letter
**Cause:** Using custom SVG files (`mu_icon_slate_dark.svg`) instead of official PNG
**Fix:** Use `logo_horizontal_official.png` instead

### Problem: Logo not updating in browser
**Cause:** Browser cache
**Fix:** Increment version number in URL (?v=6 → ?v=7) and hard refresh (Ctrl+Shift+R)

### Problem: Logo too small/large
**Cause:** CSS height setting
**Fix:** Update `.logo-image { height: 80px; }` in css/styles.css

## Official Source Files

**Location:** `/c/Users/Owner/Desktop/MU_Logo/updated_logo/`

Files:
- `MidwestUnderground_Logo (1).png` - Full horizontal logo (1.5MB transparent PNG)
- `MU_Logo (1).png` - MU icon only (1.5MB transparent PNG)

These are the OFFICIAL files provided by the client. Always reference these as the source of truth.
