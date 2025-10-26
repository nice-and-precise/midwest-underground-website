# Website Structure Guide - Public vs Dashboard

**Date:** October 26, 2025
**Purpose:** Define clear separation between public-facing content and admin dashboard

---

## 🎯 Core Philosophy

**TWO DISTINCT AUDIENCES = TWO DISTINCT EXPERIENCES**

### Public Website (SEO & Business Development)
**Audience:** Potential customers, contractors, municipalities, broadband providers
**Purpose:** Generate leads, showcase services, build trust, rank in search engines
**Content:** Business services, company history, project portfolio, contact information

### Admin Dashboard (Internal Operations)
**Audience:** Company employees, field crews, project managers
**Purpose:** Track operations, manage projects, maintain compliance, generate reports
**Content:** Bore logs, field reports, 811 tickets, equipment tracking, analytics

---

## 📊 Content Matrix

| Page Type | Audience | Content Focus | SEO Priority | Access |
|-----------|----------|---------------|--------------|--------|
| **PUBLIC HOMEPAGE** | Potential Clients | Business Services (HDD, Fiber, Utilities) | 🔴 CRITICAL | Open |
| **SERVICES PAGE** | Potential Clients | Service Descriptions, Capabilities | 🔴 CRITICAL | Open |
| **PROJECTS PAGE** | Potential Clients | Portfolio, Case Studies | 🟡 HIGH | Open |
| **ABOUT PAGE** | Potential Clients | Company History, Team, Values | 🟡 HIGH | Open |
| **CONTACT PAGE** | Potential Clients | Contact Form, Location, Hours | 🔴 CRITICAL | Open |
| **DASHBOARD** | Staff Only | Operational Tools, Reports | ⚪ NONE | Protected |
| **LOGIN PAGE** | Staff Only | Authentication | ⚪ NONE | Open |

---

## ❌ CRITICAL MISTAKES TO AVOID

### 1. DON'T Show Dashboard Content on Public Pages

**❌ WRONG:**
```jsx
// Homepage showing dashboard features
<h2>HDD Management Features</h2>
<p>Professional tools for tracking drilling operations...</p>

<div className="service-card">
  <h3>Bore Log Management</h3>
  <p>Track drilling operations with rod-by-rod logging...</p>
  <Link href="/dashboard/bore-logs">Manage Bore Logs</Link>
</div>
```

**✅ CORRECT:**
```jsx
// Homepage showing business services
<h2>Our Core Services</h2>
<p>From precision directional drilling to complete fiber optic networks...</p>

<article className="service-card">
  <h3>Horizontal Directional Drilling</h3>
  <p>Precision underground utility installation with minimal surface disruption...</p>
  <Link href="/services#hdd">Learn More</Link>
</article>
```

### 2. DON'T Use Low-Contrast Buttons

**❌ WRONG:**
```css
.btn-secondary {
  background-color: transparent; /* Invisible on dark backgrounds! */
  color: var(--color-primary);
}
```

**✅ CORRECT:**
```css
.btn-secondary {
  background-color: var(--color-secondary); /* Visible orange */
  color: var(--black); /* High contrast */
  font-weight: 700;
}
```

### 3. DON'T Put "System Status" on Public Homepage

**❌ WRONG:**
```jsx
<section>
  <h2>System Status</h2>
  <div>Active - System Status</div>
  <div>Ready - Database Connected</div>
  <div>17+ Data Models</div>
</section>
```

This confuses potential customers and provides no business value.

**✅ CORRECT:**
```jsx
<section>
  <h2>Why Minnesota Chooses Midwest Underground</h2>
  <div>34+ Years Experience</div>
  <div>Safety First</div>
  <div>Advanced Equipment</div>
  <div>Expert Team</div>
</section>
```

---

## 🎨 Color & Contrast Best Practices

### WCAG 2.1 AA Requirements
- **Normal text:** 4.5:1 contrast ratio minimum
- **Large text:** 3:1 contrast ratio minimum
- **Interactive elements (buttons):** Must be clearly visible

### Our Color Palette with Contrast Ratios

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| Black (#000000) | Orange (#FF8800) | 9.44:1 | ✅ AAA |
| White (#FFFFFF) | Slate Dark (#343D46) | 9.28:1 | ✅ AAA |
| Slate (#4F5B66) | White (#FFFFFF) | 5.92:1 | ✅ AA |
| White (#FFFFFF) | Blue (#003B5C) | 8.59:1 | ✅ AAA |
| Orange (#FF8800) | White (#FFFFFF) | 2.37:1 | ❌ FAIL |

### Button Color Guidelines

#### Primary Buttons (CTAs)
```css
/* FOR LIGHT BACKGROUNDS */
.btn-primary {
  background-color: var(--color-primary); /* Slate Dark #343D46 */
  color: var(--white);
  border: 2px solid var(--color-primary);
}

/* FOR DARK BACKGROUNDS */
.btn-primary-on-dark {
  background-color: var(--color-secondary); /* Orange #FF8800 */
  color: var(--black); /* Use black, not white! */
  border: 2px solid var(--color-secondary);
  font-weight: 700;
}
```

#### Secondary Buttons
```css
/* ALWAYS use solid backgrounds, never transparent */
.btn-secondary {
  background-color: var(--white);
  color: var(--color-primary);
  border: 2px solid var(--white);
  font-weight: 700;
}
```

### Dark Mode Considerations

#### ✅ DO:
- Test every button in BOTH light and dark modes
- Use opacity on text over solid backgrounds
- Provide clear focus states (2px outline)

#### ❌ DON'T:
- Use `background-color: transparent` on buttons
- Rely on border-only buttons (invisible on same-color backgrounds)
- Use gray text on gray backgrounds

---

## 📝 Content Guidelines

### Public Homepage - What to Include

#### Hero Section
- **Headline:** Company positioning ("Minnesota's Precision Underground Experts")
- **Subheadline:** Core services (Directional Drilling, Fiber Optic, Utilities)
- **CTAs:** "Get Free Quote" and "Call (phone number)"

#### Services Section
- **Headline:** "Our Core Services"
- **Services:** HDD, Fiber Optic, Underground Utilities, Telecommunications, Road Crossings, Emergency Services
- **Each Card:** Service name, brief description, "Learn More" link to services page

#### Why Choose Us Section
- **Headline:** "Why Minnesota Chooses Midwest Underground"
- **Benefits:** Experience, Safety, Equipment, Team
- **Focus:** Trust signals, credentials, differentiators

#### Final CTA
- **Headline:** "Ready to Start Your Project?"
- **Copy:** Reinforce value proposition
- **CTAs:** "Get Free Quote" and "Call (phone number)"
- **Small text:** Staff login link (unobtrusive)

### Dashboard Homepage - What to Include

#### For Authenticated Users Only
- **System Overview:** Active projects, pending tasks, alerts
- **Quick Actions:** Create bore log, submit field report, view 811 tickets
- **Recent Activity:** Latest updates, changes, completions
- **KPIs:** Metrics relevant to operations

---

## 🔍 SEO Optimization

### Public Pages MUST Have:

1. **Unique, Descriptive Titles**
   ```html
   <title>Midwest Underground of Minnesota | Directional Drilling & Fiber Optic Installation</title>
   ```

2. **Meta Descriptions (150-160 characters)**
   ```html
   <meta name="description" content="34 years of precision directional drilling, fiber optic installation, and underground utilities expertise in central Minnesota.">
   ```

3. **H1 Tags with Keywords**
   ```html
   <h1>Minnesota's Precision Underground Experts</h1>
   ```

4. **Alt Text on Images**
   ```html
   <img src="drilling-rig.jpg" alt="Midwest Underground HDD rig installing fiber optic cable">
   ```

5. **Internal Linking**
   ```html
   <Link href="/services#hdd">Learn more about our directional drilling services</Link>
   ```

6. **Schema Markup (LocalBusiness)**
   ```json
   {
     "@type": "LocalBusiness",
     "name": "Midwest Underground of Minnesota Inc",
     "telephone": "(320) 382-6636",
     "address": {...}
   }
   ```

### Dashboard Pages SHOULD HAVE:

1. **noindex Meta Tag**
   ```html
   <meta name="robots" content="noindex, nofollow">
   ```

2. **Generic Titles**
   ```html
   <title>Dashboard | Midwest Underground</title>
   ```

3. **No Schema Markup**
   (Not relevant for internal tools)

---

## 🚫 Common Pitfalls

### Pitfall #1: Confusing Audiences
**Problem:** Showing "Bore Log Management" on public homepage
**Impact:** Potential customers confused, think site is for employees only
**Fix:** Show "Horizontal Directional Drilling" business services instead

### Pitfall #2: Poor Button Visibility
**Problem:** Transparent button on dark blue background
**Impact:** Users can't see the CTA, conversion rate drops
**Fix:** Use solid orange (#FF8800) with black text

### Pitfall #3: Dashboard Content in Search Results
**Problem:** Google indexes "/dashboard" pages
**Impact:** Potential customers land on login page, bounce immediately
**Fix:** Add `noindex` to all dashboard routes, use middleware to redirect

### Pitfall #4: Generic Content
**Problem:** "Get Started" without explaining what service you provide
**Impact:** Low SEO ranking, unclear value proposition
**Fix:** "Get a Free Quote for Directional Drilling in Minnesota"

---

## ✅ Quality Checklist

### Before Launching Public Pages:

- [ ] **Content Audit:** Zero references to dashboard features (bore logs, field reports, etc.)
- [ ] **CTA Audit:** All buttons clearly visible in light AND dark mode
- [ ] **SEO Audit:** Unique titles, meta descriptions, H1 tags, alt text
- [ ] **Link Audit:** All links point to relevant pages (not dashboard)
- [ ] **Copy Audit:** Focus on customer benefits, not internal operations
- [ ] **Mobile Audit:** All text readable, buttons tappable (44px minimum)
- [ ] **Accessibility Audit:** 4.5:1 contrast on all text, keyboard navigation works

### Before Launching Dashboard Pages:

- [ ] **Authentication:** All routes protected by middleware
- [ ] **noindex:** Meta tags prevent search indexing
- [ ] **Generic Titles:** Don't expose internal structure
- [ ] **Staff-Focused Copy:** Assume user knows the company
- [ ] **Functional Focus:** Optimize for task completion, not persuasion

---

## 📊 Analytics & Measurement

### Public Website Metrics (Track These)
- **Organic Search Traffic** - Is SEO working?
- **Bounce Rate** - Are visitors engaged?
- **Contact Form Submissions** - Lead generation
- **Phone Calls** - Call tracking (CallRail, etc.)
- **Time on Site** - Content quality indicator

### Dashboard Metrics (Track These)
- **Login Success Rate** - Authentication issues?
- **Feature Usage** - Which tools are used most?
- **Error Rates** - Technical problems?
- **Task Completion Time** - Efficiency metrics

---

## 🔧 Technical Implementation

### Route Structure

```
/                          → Public Homepage (SEO-optimized)
/services                  → Public Services Page (SEO-optimized)
/projects                  → Public Projects Page (SEO-optimized)
/about                     → Public About Page (SEO-optimized)
/contact                   → Public Contact Page (SEO-optimized)
/auth/login                → Login Page (open, but not indexed)
/dashboard                 → Dashboard Homepage (protected, noindex)
/dashboard/bore-logs       → Bore Log Tool (protected, noindex)
/dashboard/field-reports   → Field Report Tool (protected, noindex)
...etc
```

### Middleware Protection

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protect ALL /dashboard routes
  if (path.startsWith('/dashboard')) {
    const token = request.cookies.get('next-auth.session-token')
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}
```

---

## 📞 Need Help?

If you're unsure whether content belongs on the public site or dashboard:

**Ask yourself:**
1. **Who is this for?** Customer (public) or Employee (dashboard)
2. **What's the goal?** Generate leads (public) or Complete task (dashboard)
3. **Is this SEO-relevant?** Yes (public) or No (dashboard)

**When in doubt:** If it's operational/technical → Dashboard. If it's business/marketing → Public.

---

## 🎯 Success Criteria

**Public Homepage Success:**
- ✅ Ranks for "directional drilling Minnesota"
- ✅ Clear value proposition in < 5 seconds
- ✅ Multiple CTAs visible without scrolling
- ✅ Builds trust (experience, safety, equipment)
- ✅ Mobile-friendly, fast loading

**Dashboard Success:**
- ✅ Fast task completion (< 2 minutes to create bore log)
- ✅ Zero confusion about what to do
- ✅ Accessible from field (mobile-responsive)
- ✅ Reliable data entry and retrieval
- ✅ Intuitive for non-technical users

---

**Last Updated:** October 26, 2025
**Maintained By:** Development Team
**Review Frequency:** Quarterly or after major content changes

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
