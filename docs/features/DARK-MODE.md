# Dark Mode Implementation Guide

Complete guide for adding dark mode toggle to the Midwest Underground website.

---

## Overview

**Feature:** Dark/Light Theme Toggle
**Implementation Time:** ~2 hours
**Complexity:** Medium
**Files Modified:** 3 (css/styles.css, js/main.js, all HTML files)

---

## Complete Feature Request

Copy and paste this into Claude Code:

```markdown
# FEATURE REQUEST: Dark Mode Toggle

## Context
Read CLAUDE.md and review the current codebase, particularly:
- css/styles.css (current color variables)
- All HTML files (structure and layout)
- js/main.js (existing JavaScript)

## Feature Requirements

**What:** Add a dark mode toggle that allows users to switch between light and dark color schemes, with preference saved to localStorage.

**Why:** Improves user experience for users who prefer dark interfaces, especially during nighttime use. Shows modern web development practices.

**User Story:** As a website visitor, I want to toggle between light and dark modes so that I can view the website comfortably in different lighting conditions.

**Acceptance Criteria:**
- [ ] Toggle button/switch visible in header (desktop and mobile)
- [ ] Smooth color transition animation (0.3s)
- [ ] Dark mode uses construction-appropriate dark colors
- [ ] User preference saved to localStorage
- [ ] Preference loads on page refresh
- [ ] All text remains readable (WCAG AA contrast)
- [ ] All images/graphics work in both modes
- [ ] Toggle state is visually clear (sun/moon icon)
- [ ] Mobile responsive toggle button
- [ ] Accessible (keyboard, screen reader announcements)
- [ ] Performance maintained (Lighthouse > 90)
- [ ] Documentation updated

## Color Specifications

**Light Mode Colors (Current):**
- Background: #FFFFFF
- Text: #333333
- Primary: #003B5C (deep blue)
- Secondary: #FF6B35 (safety orange)
- Accent: #F5F5F5 (light gray)

**Dark Mode Colors (New):**
- Background: #1a1a1a (very dark gray, not pure black)
- Surface: #2d2d2d (card/section background)
- Text: #e5e5e5 (off-white, easier on eyes than pure white)
- Text Secondary: #b0b0b0 (muted text)
- Primary: #3a7ca5 (lighter blue for contrast)
- Secondary: #ff8c61 (lighter orange for contrast)
- Borders: #404040 (subtle borders)

## Implementation Steps

### Phase 1: CSS Preparation (15 minutes)

1. **Update CSS Custom Properties**

Add to css/styles.css at the root level:

```css
:root {
  /* Light mode (default) */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --color-primary: #003B5C;
  --color-secondary: #FF6B35;
  --border-color: #e0e0e0;
}

[data-theme="dark"] {
  /* Dark mode */
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #e5e5e5;
  --text-secondary: #b0b0b0;
  --color-primary: #3a7ca5;
  --color-secondary: #ff8c61;
  --border-color: #404040;
}

/* Smooth transitions */
*,
*::before,
*::after {
  transition: background-color 0.3s ease,
              color 0.3s ease,
              border-color 0.3s ease;
}
```

2. **Replace Hardcoded Colors**

Find all instances of hardcoded colors and replace with CSS variables:

```css
/* Before */
body {
  background-color: #FFFFFF;
  color: #333333;
}

/* After */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
```

3. **Add Toggle Button Styles**

```css
/* Dark Mode Toggle */
.dark-mode-toggle {
  position: relative;
  width: 60px;
  height: 30px;
  background-color: var(--neutral-light);
  border: 2px solid var(--neutral-medium);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  padding: 0;
}

.dark-mode-toggle:hover {
  border-color: var(--secondary-orange);
}

.dark-mode-toggle:focus {
  outline: 2px solid var(--secondary-orange);
  outline-offset: 2px;
}

/* Toggle Circle */
.toggle-circle {
  position: absolute;
  width: 22px;
  height: 22px;
  background-color: var(--white);
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

[data-theme="dark"] .toggle-circle {
  transform: translateX(30px);
}

/* Icons */
.sun-icon,
.moon-icon {
  width: 16px;
  height: 16px;
  position: absolute;
  transition: opacity var(--transition-fast);
}

.sun-icon {
  left: 8px;
  opacity: 1;
}

.moon-icon {
  right: 8px;
  opacity: 0.5;
}

[data-theme="dark"] .sun-icon {
  opacity: 0.5;
}

[data-theme="dark"] .moon-icon {
  opacity: 1;
}

/* Mobile placement */
@media (max-width: 1023px) {
  .dark-mode-toggle {
    margin: var(--space-md) 0;
  }
}
```

### Phase 2: HTML Updates (10 minutes)

Add toggle button to header in all HTML files:

```html
<!-- Add this inside .header-container, after .site-logo -->
<button
  id="dark-mode-toggle"
  class="dark-mode-toggle hide-mobile"
  aria-label="Toggle dark mode"
  aria-pressed="false"
  title="Toggle dark/light mode"
>
  <span class="toggle-circle">
    <span class="sun-icon">☀️</span>
  </span>
  <span class="moon-icon">🌙</span>
</button>
```

For mobile menu, add inside `.mobile-menu`:

```html
<div style="padding: var(--space-md); border-top: 1px solid var(--neutral-light);">
  <label for="mobile-dark-mode-toggle" style="display: flex; align-items: center; justify-content: space-between;">
    <span>Dark Mode</span>
    <button
      id="mobile-dark-mode-toggle"
      class="dark-mode-toggle"
      aria-label="Toggle dark mode"
      aria-pressed="false"
    >
      <span class="toggle-circle">
        <span class="sun-icon">☀️</span>
      </span>
      <span class="moon-icon">🌙</span>
    </button>
  </label>
</div>
```

### Phase 3: JavaScript Implementation (20 minutes)

Add to js/main.js:

```javascript
// ==========================================================================
// DARK MODE
// ==========================================================================

/**
 * Dark Mode Implementation
 * Handles theme toggle, localStorage persistence, and system preference detection
 */

class DarkMode {
  constructor() {
    this.toggleButtons = [
      document.getElementById('dark-mode-toggle'),
      document.getElementById('mobile-dark-mode-toggle')
    ].filter(btn => btn !== null);

    this.html = document.documentElement;
    this.storageKey = 'midwest-underground-theme';
  }

  init() {
    // Load saved preference or check system preference
    const savedTheme = localStorage.getItem(this.storageKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.setTheme('dark');
    }

    // Setup toggle buttons
    this.toggleButtons.forEach(button => {
      button.addEventListener('click', () => this.toggleTheme());
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem(this.storageKey)) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
  }

  setTheme(theme) {
    if (theme === 'dark') {
      this.html.setAttribute('data-theme', 'dark');
    } else {
      this.html.removeAttribute('data-theme');
    }

    this.updateToggleButtons(theme === 'dark');
    this.announceThemeChange(theme);
  }

  toggleTheme() {
    const currentTheme = this.html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    this.setTheme(newTheme);
    localStorage.setItem(this.storageKey, newTheme);
  }

  updateToggleButtons(isDark) {
    this.toggleButtons.forEach(button => {
      button.setAttribute('aria-pressed', isDark.toString());
      if (isDark) {
        button.setAttribute('title', 'Switch to light mode');
        button.setAttribute('aria-label', 'Switch to light mode');
      } else {
        button.setAttribute('title', 'Switch to dark mode');
        button.setAttribute('aria-label', 'Switch to dark mode');
      }
    });
  }

  announceThemeChange(theme) {
    // Create screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `${theme === 'dark' ? 'Dark' : 'Light'} mode activated`;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Initialize dark mode on page load
document.addEventListener('DOMContentLoaded', function() {
  const darkMode = new DarkMode();
  darkMode.init();

  // ... rest of existing DOMContentLoaded code ...
});
```

### Phase 4: Testing (20 minutes)

**Test Checklist:**

1. **Functionality**
   - [ ] Toggle switches between light and dark modes
   - [ ] Preference persists on page refresh
   - [ ] System preference respected when no saved preference
   - [ ] Both desktop and mobile toggles work

2. **Visual**
   - [ ] All text readable in both modes
   - [ ] All colors have sufficient contrast (WCAG AA)
   - [ ] Images visible in both modes
   - [ ] Smooth transition animation (no flash)
   - [ ] Toggle icon changes appropriately

3. **Accessibility**
   - [ ] Toggle accessible via keyboard (Tab, Enter/Space)
   - [ ] Screen reader announces theme changes
   - [ ] ARIA attributes correct
   - [ ] Focus indicators visible

4. **Performance**
   - [ ] No performance regression
   - [ ] Lighthouse score maintained (>90)
   - [ ] No console errors

5. **Browser Compatibility**
   - [ ] Works in Chrome, Firefox, Safari, Edge
   - [ ] Works on mobile devices

### Phase 5: Documentation (15 minutes)

**Update the following files:**

1. **README.md:**
```markdown
### Dark Mode Toggle
- Light/dark theme switcher in header
- Preference saved to browser
- Respects system theme preference
- Smooth color transitions
- Fully accessible
```

2. **docs/ARCHITECTURE.md:**
```markdown
## Dark Mode Implementation

**Technology:** CSS Custom Properties + localStorage

**Files:**
- css/styles.css - Theme color variables and toggle styles
- js/main.js - DarkMode class for theme management
- All HTML files - Toggle button in header

**Key Functions:**
- `DarkMode.init()` - Initializes dark mode, checks saved preference
- `DarkMode.toggleTheme()` - Switches between themes
- `DarkMode.setTheme()` - Sets theme and updates UI
- `DarkMode.announceThemeChange()` - Screen reader announcement

**localStorage Key:** `midwest-underground-theme`

**Color Variables:**
All colors use CSS custom properties that change based on `[data-theme="dark"]` attribute on `<html>` element.

**Future Enhancements:**
- Custom color picker for advanced users
- Multiple theme options (blue, green, etc.)
- Automatic theme switching based on time of day
```

3. **docs/MAINTENANCE.md:**
```markdown
## Maintaining Dark Mode

**How to modify colors:**

1. Open `css/styles.css`
2. Find the `:root` and `[data-theme="dark"]` sections
3. Modify CSS custom property values
4. Ensure WCAG AA contrast maintained (check with WebAIM contrast checker)

**Testing dark mode:**
1. Toggle between themes using button in header
2. Check all pages in both themes
3. Verify readability and contrast
4. Test on mobile devices

**Troubleshooting:**

- **Problem:** Colors not changing
  **Solution:** Check that all color values use CSS custom properties (var(--variable-name))

- **Problem:** Preference not saving
  **Solution:** Check browser localStorage is enabled, verify `storageKey` in JavaScript

- **Problem:** Flash of wrong theme on load
  **Solution:** Add inline script in `<head>` to set theme before page renders
```

## Quality Gates

- ✅ Toggle works in all browsers
- ✅ Preference persists across sessions
- ✅ All text meets WCAG AA contrast
- ✅ Smooth transitions (no flash)
- ✅ Mobile responsive
- ✅ Keyboard accessible
- ✅ Screen reader announces changes
- ✅ No performance regression
- ✅ Documentation updated

## Troubleshooting

**Issue:** Flash of light theme on page load in dark mode
**Solution:** Add inline script in `<head>` before CSS:

```html
<script>
  // Prevent flash of light theme
  (function() {
    const savedTheme = localStorage.getItem('midwest-underground-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
</script>
```

**Issue:** Images look bad in dark mode
**Solution:** Consider adding filter for certain images or providing dark mode variants:

```css
[data-theme="dark"] .needs-inversion {
  filter: invert(1) hue-rotate(180deg);
}
```

---

**Implementation Time:** ~2 hours
**Complexity:** Medium
**Business Value:** High (improves UX, shows modern development)
