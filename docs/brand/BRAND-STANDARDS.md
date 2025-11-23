# Brand Standards - Midwest Underground of Minnesota Inc

<!-- Last Updated: 2025-11-23 -->
<!-- Version: 2.0.0 -->

Official brand guidelines for all digital properties, including this application.

---

## 🎨 Color Palette

### Primary

| Name       | Hex       | Usage                            |
|------------|-----------|----------------------------------|
| Charcoal   | `#23272A` | Primary text, logo, headers      |
| Charcoal-900 | `#1E2226` | Dark backgrounds, dark mode base |
| Steel      | `#4F5B66` | Secondary text and muted UI      |

### Accent

| Name           | Hex       | Usage                            |
|----------------|-----------|----------------------------------|
| Safety Orange  | `#FF5A1F` | CTAs, primary accents, important |
| Utility Yellow | `#FFC400` | Highlights, warnings             |

### Neutrals

| Name  | Hex       | Usage                      |
|-------|-----------|----------------------------|
| Sand  | `#F2EDE5` | Light backgrounds, cards   |
| White | `#FFFFFF` | Background, text on dark   |

### Deprecated Colors

Do not use these legacy colors:

| Old Color Name | Hex       | Replacement    |
|----------------|-----------|----------------|
| Primary Blue   | `#003B5C` | Charcoal       |
| Old Orange     | `#FF6B35` | Safety Orange  |
| Accent Blue    | `#2EA3F2` | Utility Yellow |

---

## 🖌 Typography

- **Headings:** Montserrat
- **Body:** Roboto
- **Code:** Fira Code or system monospace

Example type scale:

```css
h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
h2 { font-size: 2rem;   font-weight: 700; line-height: 1.3; }
h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
body { font-size: 1rem; line-height: 1.6; }
```

---

## 🌗 Theme Variables

### Light Mode

```css
:root {
  --primary-charcoal: #23272A;
  --charcoal-900: #1E2226;
  --steel: #4F5B66;
  --safety-orange: #FF5A1F;
  --utility-yellow: #FFC400;
  --sand: #F2EDE5;
  --white: #FFFFFF;

  --bg-primary: #FFFFFF;
  --bg-secondary: #F2EDE5;
  --text-primary: #23272A;
  --text-secondary: #4F5B66;
  --color-primary: #23272A;
  --color-secondary: #FF5A1F;
  --color-accent: #FFC400;
  --border-color: #D1CCC3;
}
```

### Dark Mode

```css
[data-theme="dark"] {
  --bg-primary: #1E2226;
  --bg-secondary: #23272A;
  --text-primary: #F2EDE5;
  --text-secondary: #D1CCC3;
  --color-primary: #F2EDE5;
  --color-secondary: #FF5A1F;
  --color-accent: #FFC400;
  --border-color: #4F5B66;
}
```

---

## ♿ Accessibility

Target WCAG 2.1 AA or better.

Examples:

* Charcoal on White: strong contrast, AAA.
* Sand on Charcoal-900: strong contrast, AAA.
* Ensure all text on orange and yellow meets at least AA for appropriate sizes.

Best practices:

* Minimum body font 16px.
* Touch targets at least 44x44px.
* Visible focus states with sufficient contrast.
* Alt text for meaningful images.

---

## 🖼 Logo

See `docs/brand/LOGO-USAGE.md` for full details.

Rules:

* Maintain clear space around the logo.
* Do not stretch, skew, apply drop shadows or outlines.
* Use Charcoal version on light backgrounds, white version on dark backgrounds.
* For high-emphasis cases, Safety Orange variant may be used.

---

## 🎯 Design Tokens

### Spacing

```css
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;
--space-2xl: 3rem;
--space-3xl: 4rem;
```

### Radius

```css
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--radius-lg: 1rem;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.18);
```

---

## 🧩 Component Patterns

### Buttons

Primary CTA:

```css
.button-primary {
  background: var(--safety-orange);
  color: var(--white);
  border-radius: var(--radius-md);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
}
```

Secondary:

```css
.button-secondary {
  background: var(--primary-charcoal);
  color: var(--white);
}
```

Outline:

```css
.button-outline {
  background: transparent;
  border: 2px solid var(--primary-charcoal);
  color: var(--primary-charcoal);
}
```

---

## 📐 Layout

Breakpoints (example mapping to Tailwind):

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

Container:

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}
```

---

## ✅ Brand Checklist

When adding or updating UI:

* [ ] Use official color palette only.
* [ ] Verify color contrast.
* [ ] Use consistent typography.
* [ ] Use spacing and radius tokens.
* [ ] Confirm responsive behavior.
* [ ] Match logo usage guidelines.

---

**Maintained by:** @nice-and-precise
**Last Updated:** 2025-11-23
**Version:** 2.0.0
