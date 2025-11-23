<!-- TOC -->

## Table of Contents

- [📋 Overview](#overview)
- [🔧 Critical Issues Fixed](#critical-issues-fixed)
  - [Issue #1: Dev Server Cache Corruption ✅ FIXED](#issue-1-dev-server-cache-corruption-fixed)
- [🌐 Static HTML Version Testing (Port 8080)](#static-html-version-testing-port-8080)
  - [Public Pages (5 total)](#public-pages-5-total)
    - [1. Homepage (index.html)](#1-homepage-indexhtml)
    - [2. Services Page (services.html)](#2-services-page-serviceshtml)
    - [3. About Page (about.html)](#3-about-page-abouthtml)
    - [4. Projects Page (projects.html)](#4-projects-page-projectshtml)
    - [5. Contact Page (contact.html)](#5-contact-page-contacthtml)
  - [Dashboard Pages (6 total)](#dashboard-pages-6-total)
    - [6. Dashboard Home (dashboard/index.html)](#6-dashboard-home-dashboardindexhtml)
    - [7. Projects Dashboard (dashboard/projects.html)](#7-projects-dashboard-dashboardprojectshtml)
    - [8. Customers Dashboard (dashboard/customers.html)](#8-customers-dashboard-dashboardcustomershtml)
    - [9. Equipment Dashboard (dashboard/equipment.html)](#9-equipment-dashboard-dashboardequipmenthtml)
    - [10. Financials Dashboard (dashboard/financials.html)](#10-financials-dashboard-dashboardfinancialshtml)
    - [11. Reports Dashboard (dashboard/reports.html)](#11-reports-dashboard-dashboardreportshtml)
  - [Static Site Performance](#static-site-performance)
- [⚛️ Next.js App Testing (Port 3000)](#nextjs-app-testing-port-3000)
  - [Authentication System](#authentication-system)
    - [Login Flow](#login-flow)
    - [Protected Routes](#protected-routes)
  - [Public Routes](#public-routes)
    - [Homepage (/)](#homepage)
  - [Dashboard Routes (All require authentication)](#dashboard-routes-all-require-authentication)
    - [12. Main Dashboard (/dashboard)](#12-main-dashboard-dashboard)
    - [13. 811 Tickets (/dashboard/811-tickets)](#13-811-tickets-dashboard811-tickets)
    - [14. 811 Ticket Detail (/dashboard/811-tickets/[id])](#14-811-ticket-detail-dashboard811-ticketsid)
    - [15. Bore Logs (/dashboard/bore-logs)](#15-bore-logs-dashboardbore-logs)
    - [16. Bore Log Detail (/dashboard/bore-logs/[id])](#16-bore-log-detail-dashboardbore-logsid)
    - [17. Customers (/dashboard/customers)](#17-customers-dashboardcustomers)
    - [18. Customer Detail (/dashboard/customers/[id])](#18-customer-detail-dashboardcustomersid)
    - [19. Equipment (/dashboard/equipment)](#19-equipment-dashboardequipment)
    - [20. Equipment Detail (/dashboard/equipment/[id])](#20-equipment-detail-dashboardequipmentid)
    - [21. Field Reports (/dashboard/field-reports)](#21-field-reports-dashboardfield-reports)
    - [22. Field Report Detail (/dashboard/field-reports/[id])](#22-field-report-detail-dashboardfield-reportsid)
    - [23. New Field Report (/dashboard/field-reports/new)](#23-new-field-report-dashboardfield-reportsnew)
    - [24. Financials (/dashboard/financials)](#24-financials-dashboardfinancials)
    - [25. HDD 811 Compliance (/dashboard/hdd/811-compliance)](#25-hdd-811-compliance-dashboardhdd811-compliance)
    - [26. HDD Daily Report (/dashboard/hdd/daily-report)](#26-hdd-daily-report-dashboardhdddaily-report)
    - [27. HDD Rod Logger (/dashboard/hdd/rod-logger)](#27-hdd-rod-logger-dashboardhddrod-logger)
    - [28. Inspections (/dashboard/inspections)](#28-inspections-dashboardinspections)
    - [29. Inspection Detail (/dashboard/inspections/[id])](#29-inspection-detail-dashboardinspectionsid)
    - [30. Projects (/dashboard/projects)](#30-projects-dashboardprojects)
    - [31. Project Detail (/dashboard/projects/[id])](#31-project-detail-dashboardprojectsid)
    - [32. Reports (/dashboard/reports)](#32-reports-dashboardreports)
  - [API Routes Testing](#api-routes-testing)
    - [Authentication API](#authentication-api)
    - [811 Tickets API](#811-tickets-api)
    - [Daily Reports API](#daily-reports-api)
    - [Projects API](#projects-api)
    - [Rod Passes API](#rod-passes-api)
    - [Other APIs (Basic Smoke Test)](#other-apis-basic-smoke-test)
  - [Next.js App Performance](#nextjs-app-performance)
    - [Build & Compilation](#build-compilation)
    - [Runtime Performance](#runtime-performance)
    - [Developer Experience](#developer-experience)
- [🎨 Cross-Browser Testing](#cross-browser-testing)
  - [Desktop Browsers](#desktop-browsers)
  - [Mobile Browsers](#mobile-browsers)
  - [Browser Features to Test](#browser-features-to-test)
- [📱 Responsive Design Testing](#responsive-design-testing)
  - [Breakpoints to Test](#breakpoints-to-test)
  - [Elements to Verify at Each Breakpoint](#elements-to-verify-at-each-breakpoint)
- [♿ Accessibility Testing (WCAG 2.1 AA)](#accessibility-testing-wcag-21-aa)
  - [Keyboard Navigation](#keyboard-navigation)
  - [Screen Reader Testing](#screen-reader-testing)
  - [Color Contrast](#color-contrast)
  - [Forms](#forms)
- [🔒 Security Testing](#security-testing)
  - [Authentication](#authentication)
  - [Authorization](#authorization)
  - [Data Validation](#data-validation)
- [📊 SEO Testing](#seo-testing)
  - [Meta Tags](#meta-tags)
  - [Content](#content)
  - [Technical SEO](#technical-seo)
- [🔍 Known Issues & Placeholders](#known-issues-placeholders)
  - [Content Placeholders to Replace](#content-placeholders-to-replace)
  - [Mock Data](#mock-data)
  - [Future Enhancements](#future-enhancements)
- [📸 Screenshot Testing](#screenshot-testing)
  - [Pages to Screenshot](#pages-to-screenshot)
- [🚀 Deployment Readiness](#deployment-readiness)
  - [Pre-Deployment Checks](#pre-deployment-checks)
  - [Post-Deployment Checks](#post-deployment-checks)
- [🐛 Bug Reporting Template](#bug-reporting-template)
- [✅ Sign-Off](#sign-off)
  - [QA Tester Information](#qa-tester-information)
  - [Test Results Summary](#test-results-summary)
  - [Critical Issues Found](#critical-issues-found)
  - [Recommendations](#recommendations)
  - [Approval Status](#approval-status)
- [📝 Notes](#notes)
  - [Testing Tips](#testing-tips)
  - [Resources](#resources)

<!-- /TOC -->

# QA Audit Checklist - Midwest Underground Website
**Version:** 2.0.0 (Next.js Migration)
**Date:** October 26, 2025
**Branch:** feat/nextjs-migration
**Status:** Ready for QA Testing

---

## 📋 Overview

This checklist is for comprehensive QA testing of both the **Static HTML** and **Next.js App** versions of the Midwest Underground website. Test each item and mark status.

**Testing Environments:**
- **Static HTML:** http://127.0.0.1:8080 (or your local server)
- **Next.js App:** http://localhost:3000 (dev) or production URL

---

## 🔧 Critical Issues Fixed

### Issue #1: Dev Server Cache Corruption ✅ FIXED
**Problem:** Pages showing blank/white screen with 500 errors
**Error:** "Cannot find module './1989.js'" and "entryCSSFiles" errors
**Root Cause:** Corrupted `.next` build cache from previous sessions
**Fix Applied:**
- Cleared `.next` cache completely (`rm -rf .next`)
- Killed all node processes on ports 3000-3001
- Restarted dev server with fresh cache
- Server now starts cleanly without errors

**QA Test:**
- [ ] Navigate to http://localhost:3000
- [ ] Homepage loads successfully (not blank)
- [ ] No console errors about missing modules
- [ ] All navigation links work
- [ ] Pages compile without 500 errors

---

## 🌐 Static HTML Version Testing (Port 8080)

### Public Pages (5 total)

#### 1. Homepage (index.html)
- [ ] Page loads completely
- [ ] Hero section displays with background image
- [ ] Logo displays correctly (horizontal official version)
- [ ] Navigation menu works (desktop & mobile)
- [ ] Mobile menu toggle functions
- [ ] Service cards display (8 services)
- [ ] CTA buttons work
- [ ] Footer displays with contact info
- [ ] Responsive on mobile (375px)
- [ ] Responsive on tablet (768px)
- [ ] Responsive on desktop (1920px+)

#### 2. Services Page (services.html)
- [ ] All 8 services listed with descriptions
- [ ] Service icons/images display
- [ ] Layout is responsive
- [ ] Navigation works
- [ ] Contact CTA displays

**Services to verify:**
1. Horizontal Directional Drilling (HDD)
2. Fiber Optic Cable Installation
3. Underground Utilities Installation
4. Telecommunications Infrastructure
5. Power & Water Line Installation
6. Communications Facilities Splicing
7. Underground Geothermal Systems
8. Road Crossings & Utility Conduit

#### 3. About Page (about.html)
- [ ] Company history section displays
- [ ] "34+ years experience" mentioned
- [ ] Team information (if present)
- [ ] Values/certifications section
- [ ] Company contact details
- [ ] Page is responsive

#### 4. Projects Page (projects.html)
- [ ] Project portfolio displays
- [ ] Project images load correctly
- [ ] Project descriptions visible
- [ ] Placeholder text noted (for replacement)
- [ ] Layout is responsive
- [ ] Filter/sorting works (if present)

#### 5. Contact Page (contact.html)
- [ ] Contact form displays
- [ ] Form fields present:
  - [ ] Name
  - [ ] Email
  - [ ] Phone
  - [ ] Message
- [ ] Form validation works (client-side)
- [ ] Submit button present
- [ ] Formspree placeholder URL noted
- [ ] Google Maps embed shows location
- [ ] Location: 4320 County Rd 8 SE, Willmar, MN 56201
- [ ] Phone: (320) 382-6636
- [ ] Email: info@midwestundergroundmn.com

### Dashboard Pages (6 total)

#### 6. Dashboard Home (dashboard/index.html)
- [ ] Page loads
- [ ] Charts/graphs display (if using Chart.js)
- [ ] Dashboard statistics cards show
- [ ] Navigation sidebar works
- [ ] Links to other dashboard pages work
- [ ] Icon displays correctly (mu_icon.png)

#### 7. Projects Dashboard (dashboard/projects.html)
- [ ] Project list displays
- [ ] Add new project button present
- [ ] Project cards/table responsive
- [ ] Filter/search works (if present)

#### 8. Customers Dashboard (dashboard/customers.html)
- [ ] Customer list displays
- [ ] Customer data formatted correctly
- [ ] Add customer functionality present

#### 9. Equipment Dashboard (dashboard/equipment.html)
- [ ] Equipment list displays
- [ ] Equipment details visible
- [ ] Status indicators work

#### 10. Financials Dashboard (dashboard/financials.html)
- [ ] Financial data displays
- [ ] Charts render correctly
- [ ] Number formatting correct (currency)

#### 11. Reports Dashboard (dashboard/reports.html)
- [ ] Report list displays
- [ ] Export functionality noted
- [ ] Report filters work

### Static Site Performance
- [ ] Homepage loads in < 3 seconds
- [ ] All images optimized and loading
- [ ] No 404 errors in console
- [ ] No JavaScript errors in console
- [ ] CSS styles apply correctly
- [ ] Dark mode toggle works (if present)
- [ ] Print styles work (if present)

---

## ⚛️ Next.js App Testing (Port 3000)

### Authentication System

#### Login Flow
- [ ] Navigate to http://localhost:3000/auth/login
- [ ] Login page loads correctly
- [ ] Login form displays:
  - [ ] Email field
  - [ ] Password field
  - [ ] Remember me checkbox (if present)
  - [ ] Submit button
- [ ] Form validation works:
  - [ ] Empty email shows error
  - [ ] Invalid email format shows error
  - [ ] Empty password shows error
- [ ] Submit with test credentials
- [ ] Redirects to dashboard on success
- [ ] Shows error message on failure
- [ ] Session persists after page refresh

**Test Credentials (if configured):**
- Email: [Check .env.local or seed data]
- Password: [Check .env.local or seed data]

#### Protected Routes
- [ ] Dashboard routes redirect to login when not authenticated
- [ ] Can't access /dashboard/* without login
- [ ] Callback URL preserves intended destination
- [ ] Logout functionality works
- [ ] Session timeout handled gracefully

### Public Routes

#### Homepage (/)
- [ ] Page loads without errors
- [ ] Parallax hero section works
- [ ] Scroll effects function smoothly
- [ ] Background images load
- [ ] Feature cards display
- [ ] Links to dashboard pages work
- [ ] Responsive design works
- [ ] No hydration errors in console

### Dashboard Routes (All require authentication)

#### 12. Main Dashboard (/dashboard)
- [ ] Redirects to login if not authenticated
- [ ] After login, dashboard loads
- [ ] Navigation sidebar displays
- [ ] User info shows in header
- [ ] Logout button present
- [ ] Dashboard widgets load
- [ ] Charts render (if using recharts)
- [ ] Statistics cards display
- [ ] Links to sub-pages work

#### 13. 811 Tickets (/dashboard/811-tickets)
- [ ] Page loads
- [ ] Ticket list displays
- [ ] Add new ticket button works
- [ ] Table/grid is responsive
- [ ] Search/filter functions
- [ ] Mock data displays correctly

#### 14. 811 Ticket Detail (/dashboard/811-tickets/[id])
- [ ] Individual ticket page loads
- [ ] Ticket details display
- [ ] Status indicators work
- [ ] Edit functionality present
- [ ] Breadcrumb navigation works

#### 15. Bore Logs (/dashboard/bore-logs)
- [ ] Bore log list displays
- [ ] Rod-by-rod data shows
- [ ] Depth profiles visible
- [ ] Linear feet calculations correct

#### 16. Bore Log Detail (/dashboard/bore-logs/[id])
- [ ] Individual bore log loads
- [ ] Bore Log #[id] displays in title
- [ ] All bore data visible
- [ ] Charts/graphs render
- [ ] Edit log button present

#### 17. Customers (/dashboard/customers)
- [ ] Customer list displays
- [ ] Customer cards/table responsive
- [ ] Add customer button works
- [ ] Search/filter functions

#### 18. Customer Detail (/dashboard/customers/[id])
- [ ] Customer profile loads
- [ ] Contact information displays
- [ ] Project history shows
- [ ] Activity log present

#### 19. Equipment (/dashboard/equipment)
- [ ] Equipment list displays
- [ ] Equipment status indicators work
- [ ] Maintenance info shows
- [ ] Add equipment button present

#### 20. Equipment Detail (/dashboard/equipment/[id])
- [ ] Equipment details load
- [ ] Maintenance history displays
- [ ] Documents section shows
- [ ] Hour meter data visible

#### 21. Field Reports (/dashboard/field-reports)
- [ ] Report list displays
- [ ] Status filters work
- [ ] Date range filter works
- [ ] Add report button present

#### 22. Field Report Detail (/dashboard/field-reports/[id])
- [ ] Report details load
- [ ] Crew information displays correctly (comma-separated names, not array)
- [ ] Work performed section shows
- [ ] Equipment used listed
- [ ] Materials listed
- [ ] Weather conditions display
- [ ] Photos section present

#### 23. New Field Report (/dashboard/field-reports/new)
- [ ] Form loads
- [ ] All fields present
- [ ] Form validation works
- [ ] Submit creates new report

#### 24. Financials (/dashboard/financials)
- [ ] Financial dashboard loads
- [ ] Revenue charts display
- [ ] Expense tracking shows
- [ ] Budget vs actual visible

#### 25. HDD 811 Compliance (/dashboard/hdd/811-compliance)
- [ ] Compliance dashboard loads
- [ ] Ticket statistics display
- [ ] Project dropdown works (.json() not .ok() typo fixed)
- [ ] Compliance metrics show

#### 26. HDD Daily Report (/dashboard/hdd/daily-report)
- [ ] Daily report form loads
- [ ] All form sections present:
  - [ ] Project selection
  - [ ] Crew selection
  - [ ] Production data
  - [ ] Labor hours
  - [ ] Equipment hours
  - [ ] Materials used
  - [ ] Weather conditions
- [ ] Form submission works
- [ ] Validation functions

#### 27. HDD Rod Logger (/dashboard/hdd/rod-logger)
- [ ] Rod logger interface loads
- [ ] Rod-by-rod entry fields present
- [ ] Depth tracking works
- [ ] Linear feet calculation auto-updates
- [ ] Fluid mix tracking works
- [ ] Save functionality present

#### 28. Inspections (/dashboard/inspections)
- [ ] Inspection list displays
- [ ] Status indicators work
- [ ] Add inspection button present

#### 29. Inspection Detail (/dashboard/inspections/[id])
- [ ] Inspection details load
- [ ] Signatures section displays
- [ ] License field handled with type assertion
- [ ] Photos/documents show
- [ ] Inspection results visible

#### 30. Projects (/dashboard/projects)
- [ ] Project list displays
- [ ] Customer name shows (not "client")
- [ ] Status filters work
- [ ] Add project button present

#### 31. Project Detail (/dashboard/projects/[id])
- [ ] Project details load
- [ ] Project timeline shows
- [ ] Recent activity displays
- [ ] Related documents list

#### 32. Reports (/dashboard/reports)
- [ ] Reports dashboard loads
- [ ] Report types listed
- [ ] Export functionality present

### API Routes Testing

#### Authentication API
- [ ] POST /api/auth/[...nextauth] works
- [ ] Login returns JWT token
- [ ] Session management functional

#### 811 Tickets API
- [ ] GET /api/hdd/811-tickets returns data
- [ ] POST /api/hdd/811-tickets creates ticket (schema aligned: no location/type fields)
- [ ] GET /api/hdd/811-tickets/[id]/responses works

#### Daily Reports API
- [ ] GET /api/hdd/daily-reports returns data
- [ ] POST /api/hdd/daily-reports creates report (schema fixed: createdById not submittedById)
- [ ] Report audit creation works (changedById not userId)

#### Projects API
- [ ] GET /api/hdd/projects returns projects
- [ ] POST /api/hdd/projects creates project (customerName not client)
- [ ] Fields include: customerName, customerContact, description

#### Rod Passes API
- [ ] POST /api/hdd/rod-passes creates bore and passes
- [ ] Bore fields aligned (totalLength not totalDepth)
- [ ] RodPass fields correct (startedAt/completedAt not startTime/endTime)
- [ ] Sequence and loggedById fields present

#### Other APIs (Basic Smoke Test)
- [ ] /api/bore-logs responds
- [ ] /api/customers responds
- [ ] /api/equipment responds
- [ ] /api/field-reports responds
- [ ] /api/inspections responds
- [ ] /api/projects responds

### Next.js App Performance

#### Build & Compilation
- [ ] Production build completes without errors (`npm run build`)
- [ ] All 45 routes compile successfully
- [ ] 0 TypeScript errors
- [ ] Bundle sizes reasonable (100-126 kB per route)
- [ ] Code splitting working

#### Runtime Performance
- [ ] Homepage loads in < 3 seconds
- [ ] Route transitions smooth
- [ ] No hydration errors
- [ ] No "Cannot read properties of undefined" errors
- [ ] Images load progressively
- [ ] Lazy loading works

#### Developer Experience
- [ ] Dev server starts without errors
- [ ] Hot reload works
- [ ] Changes reflect immediately
- [ ] No infinite reload loops
- [ ] TypeScript types resolve correctly

---

## 🎨 Cross-Browser Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Android Firefox

### Browser Features to Test
- [ ] CSS Grid layouts
- [ ] Flexbox layouts
- [ ] CSS custom properties (variables)
- [ ] Async/await JavaScript
- [ ] Fetch API
- [ ] LocalStorage (if used)
- [ ] SessionStorage (if used)

---

## 📱 Responsive Design Testing

### Breakpoints to Test
- [ ] Mobile Portrait: 375px
- [ ] Mobile Landscape: 667px
- [ ] Tablet Portrait: 768px
- [ ] Tablet Landscape: 1024px
- [ ] Desktop: 1280px
- [ ] Large Desktop: 1920px+

### Elements to Verify at Each Breakpoint
- [ ] Navigation (hamburger menu on mobile)
- [ ] Hero section scaling
- [ ] Service cards stacking
- [ ] Dashboard sidebar (collapse on mobile)
- [ ] Tables (horizontal scroll on mobile)
- [ ] Forms (single column on mobile)
- [ ] Footer layout
- [ ] Touch targets (min 44x44px)

---

## ♿ Accessibility Testing (WCAG 2.1 AA)

### Keyboard Navigation
- [ ] Tab order logical
- [ ] All interactive elements focusable
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Skip links present (if applicable)

### Screen Reader Testing
- [ ] Headings hierarchical (h1 → h2 → h3)
- [ ] Images have alt text
- [ ] Form labels associated with inputs
- [ ] Error messages announced
- [ ] ARIA labels present where needed
- [ ] Landmarks defined (header, nav, main, footer)

### Color Contrast
- [ ] Text contrast ratio ≥ 4.5:1 (normal text)
- [ ] Text contrast ratio ≥ 3:1 (large text 18pt+)
- [ ] Dark mode contrast meets standards
- [ ] Link text distinguishable from body text
- [ ] Button states visible (hover, focus, active)

### Forms
- [ ] All inputs have labels
- [ ] Required fields indicated
- [ ] Error messages descriptive
- [ ] Success messages announced
- [ ] Fieldsets used for related inputs

---

## 🔒 Security Testing

### Authentication
- [ ] Passwords not visible in plain text
- [ ] Sessions timeout appropriately
- [ ] CSRF protection enabled
- [ ] XSS prevention in place
- [ ] SQL injection prevention (Prisma ORM)
- [ ] Secure cookie flags set

### Authorization
- [ ] Dashboard routes protected
- [ ] API routes require authentication
- [ ] User can only access own data
- [ ] Role-based access working (if implemented)

### Data Validation
- [ ] Client-side validation present
- [ ] Server-side validation present (Zod schemas)
- [ ] SQL injection prevented
- [ ] File upload restrictions (if applicable)
- [ ] Rate limiting on API routes (if implemented)

---

## 📊 SEO Testing

### Meta Tags
- [ ] Unique title on each page
- [ ] Meta descriptions present
- [ ] Open Graph tags present (og:title, og:description, og:image)
- [ ] Twitter card tags (if applicable)
- [ ] Canonical URLs set

### Content
- [ ] Semantic HTML (header, nav, main, article, footer)
- [ ] Heading hierarchy correct
- [ ] Internal linking present
- [ ] Alt text on images
- [ ] Descriptive link text (not "click here")

### Technical SEO
- [ ] robots.txt present
- [ ] sitemap.xml present
- [ ] 404 page customized
- [ ] Page load speed < 3s
- [ ] Mobile-friendly (Google Mobile-Friendly Test)
- [ ] HTTPS enabled (production)

---

## 🔍 Known Issues & Placeholders

### Content Placeholders to Replace
Document all `[PLACEHOLDER: ...]` instances found:

**Page:** _____________
**Location:** _____________
**Placeholder Text:** _____________
**Replacement Needed:** Yes / No

(Repeat for each placeholder found)

### Mock Data
- [ ] All mock data clearly marked
- [ ] Mock data represents realistic scenarios
- [ ] Mock data doesn't contain real user info

### Future Enhancements
- [ ] Feature requests documented
- [ ] Bug list maintained
- [ ] Performance optimization notes
- [ ] UX improvement suggestions

---

## 📸 Screenshot Testing

### Pages to Screenshot
For documentation and comparison:

- [ ] Homepage (desktop)
- [ ] Homepage (mobile)
- [ ] Dashboard (logged in)
- [ ] Dashboard (dark mode, if applicable)
- [ ] Login page
- [ ] Each dashboard sub-page
- [ ] Error pages (404, 500)
- [ ] Forms (empty state)
- [ ] Forms (validation errors)
- [ ] Forms (success state)

---

## 🚀 Deployment Readiness

### Pre-Deployment Checks
- [ ] All placeholders replaced
- [ ] Environment variables configured (.env.production)
- [ ] Database migrations run
- [ ] Prisma generate executed
- [ ] Production build successful
- [ ] Build output reviewed for warnings
- [ ] Asset optimization completed
- [ ] CDN configured (if applicable)

### Post-Deployment Checks
- [ ] Production URL accessible
- [ ] SSL certificate valid
- [ ] All routes accessible
- [ ] Database connection works
- [ ] Email sending works (if applicable)
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Analytics tracking (if applicable)
- [ ] Monitoring dashboard setup

---

## 🐛 Bug Reporting Template

When bugs are found, report using this format:

**Bug ID:** ___________
**Severity:** Critical / High / Medium / Low
**Page/Component:** ___________
**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:** ___________
**Actual Behavior:** ___________
**Screenshot:** (attach if applicable)
**Console Errors:** (paste if applicable)
**Environment:**
- Browser: ___________
- OS: ___________
- Screen Size: ___________
**Status:** Open / In Progress / Fixed / Won't Fix

---

## ✅ Sign-Off

### QA Tester Information
**Name:** _____________________________
**Date:** _____________________________
**Testing Environment:** Production / Staging / Local
**Build Version:** _____________________________

### Test Results Summary
- **Total Tests:** _____ / _____
- **Passed:** _____
- **Failed:** _____
- **Blocked:** _____
- **Not Tested:** _____

### Critical Issues Found
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

### Recommendations
________________________________________________
________________________________________________
________________________________________________

### Approval Status
- [ ] **Approved for Production** - All critical tests passed
- [ ] **Approved with Minor Issues** - Non-critical issues documented
- [ ] **Not Approved** - Critical issues must be fixed first

**Signature:** _____________________________
**Date:** _____________________________

---

## 📝 Notes

### Testing Tips
1. Clear browser cache before starting
2. Test in private/incognito mode
3. Use browser DevTools for console errors
4. Test with slow network (Chrome DevTools throttling)
5. Test with JavaScript disabled (progressive enhancement)
6. Use Lighthouse for automated audits
7. Use axe DevTools for accessibility testing
8. Document all issues with screenshots

### Resources
- **Project README:** README.md
- **Build Success Report:** BUILD-SUCCESS-REPORT.md
- **Deployment Checklist:** PRE-LAUNCH-CHECKLIST.md
- **API Documentation:** (if exists)
- **Design System:** (if exists)

---

**Document Version:** 1.0
**Last Updated:** October 26, 2025
**Total Line Items:** 300+
**Estimated Testing Time:** 8-12 hours (full audit)

---

**End of QA Audit Checklist**
