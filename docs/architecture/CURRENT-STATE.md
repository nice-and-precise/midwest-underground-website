<!-- TOC -->

## Table of Contents

- [Default Branch: master](#default-branch-master)
  - [Current State Summary](#current-state-summary)
- [Branch Analysis](#branch-analysis)
  - [Branch: master (Default - Production)](#branch-master-default-production)
  - [Branch: feat/nextjs-migration](#branch-featnextjs-migration)
  - [Branch: feat/takeoff-system](#branch-feattakeoff-system)
  - [Branch: feat/brand-refresh](#branch-featbrand-refresh)
  - [Branch: integrate/takeoff-system](#branch-integratetakeoff-system)
  - [Branch: master-backup-pre-nextjs](#branch-master-backup-pre-nextjs)
- [Canonical Tech Stack (Source of Truth)](#canonical-tech-stack-source-of-truth)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
  - [Specialized Features](#specialized-features)
  - [Testing](#testing)
  - [Deployment Target](#deployment-target)
  - [Development Tools](#development-tools)
- [Architecture Evolution Timeline](#architecture-evolution-timeline)
  - [Phase 0: Legacy (Pre-2025-11-20)](#phase-0-legacy-pre-2025-11-20)
  - [Phase 1: Next.js Migration (2025-11-20 to 2025-11-22)](#phase-1-nextjs-migration-2025-11-20-to-2025-11-22)
  - [Phase 2: Takeoff System (2025-11-22 to 2025-11-23)](#phase-2-takeoff-system-2025-11-22-to-2025-11-23)
  - [Phase 3: Brand Refresh (Pending)](#phase-3-brand-refresh-pending)
- [Current Production Capabilities](#current-production-capabilities)
  - [Public Website](#public-website)
  - [Authenticated Dashboard](#authenticated-dashboard)
  - [Takeoff & Estimating System](#takeoff-estimating-system)
- [Known Technical Debt](#known-technical-debt)
  - [High Priority](#high-priority)
  - [Medium Priority](#medium-priority)
  - [Low Priority](#low-priority)
- [Development Workflow](#development-workflow)
  - [Current Branch Strategy](#current-branch-strategy)
  - [Merge Strategy](#merge-strategy)
  - [Testing Requirements](#testing-requirements)
- [Deployment Readiness](#deployment-readiness)
  - [✅ Ready for Deployment](#ready-for-deployment)
  - [⚠️ Pre-Deployment Tasks](#pre-deployment-tasks)
  - [📋 Post-Deployment Tasks](#post-deployment-tasks)
- [Documentation Locations](#documentation-locations)
  - [Primary Documentation](#primary-documentation)
  - [Feature Documentation](#feature-documentation)
  - [Development Documentation](#development-documentation)
  - [Legacy Documentation](#legacy-documentation)
- [Recommendations](#recommendations)
  - [Immediate Actions (Next 7 Days)](#immediate-actions-next-7-days)
  - [Short-Term (Next 30 Days)](#short-term-next-30-days)
  - [Long-Term (Next 90 Days)](#long-term-next-90-days)
- [Version History](#version-history)
- [Contact & Ownership](#contact-ownership)

<!-- /TOC -->

# System Architecture - Current State

<!-- Last Updated: 2025-11-23 -->

## Default Branch: master

- **Stack:** Next.js 15 + TypeScript + Prisma + SQLite
- **Status:** Production-ready (Post-migration with Takeoff System integrated)
- **Latest Commit:** `7509b24 - docs: Add comprehensive merge strategy and completion documentation`
- **Last Updated:** 2025-11-23
- **Tags:** v1.0.0, v2.1.0-takeoff-system

### Current State Summary

The master branch represents a **fully migrated Next.js application** with integrated takeoff system capabilities. The static HTML site has been completely replaced with a modern full-stack application.

**Key Characteristics:**
- ✅ Next.js 15 with App Router architecture
- ✅ Complete HDD Business Dashboard (6 modules)
- ✅ PDF Takeoff & Estimating System (Module 1.1-1.3 complete)
- ✅ Authentication system with role-based access
- ✅ SQLite database with 17+ HDD operational models
- ✅ Production build verified and tagged

---

## Branch Analysis

### Branch: master (Default - Production)

**Commit:** `7509b24 - docs: Add comprehensive merge strategy and completion documentation`
**Date:** 2025-11-23
**Status:** 🟢 Active Production Branch

**Major Merges Completed:**
1. ✅ **Next.js Migration** - Architecture foundation established
2. ✅ **Takeoff System** - Merged via commit `ca2bf9b` (tagged v2.1.0-takeoff-system)

**What Lives Here:**
- Complete Next.js 15 application structure
- Prisma database schema with seeded data
- NextAuth.js v5 authentication
- Dashboard modules: Projects, Jobs, Crew, Bore Logs, Field Reports, Settings
- PDF Takeoff System: PDF viewer, measurement tools, export functionality
- E2E test suites (Playwright) for takeoff features
- Comprehensive documentation infrastructure

---

### Branch: feat/nextjs-migration

**Latest Commit:** `78ca59f - docs: Update Serena memories with cleanup and merge prep session`
**Based On:** Diverged from `48a89bd` (master-backup-pre-nextjs)
**Divergence:** 47+ commits ahead of original base
**Stack:** Next.js 15 + TypeScript + Prisma
**Status:** ⚠️ **MERGED INTO MASTER** - Branch can be archived

**Notes:**
This branch represented the foundational migration from static HTML to Next.js 15. It has been successfully merged into master (though the merge commit is not explicitly tagged). The branch contains:
- Initial Next.js setup and configuration
- Dashboard infrastructure with authentication
- Database models and API routes
- Dark mode implementation
- Responsive design with Tailwind CSS

**Merge Status:** ✅ Complete (integrated into master before takeoff system)
**Recommendation:** Archive this branch - its work is fully integrated

---

### Branch: feat/takeoff-system

**Latest Commit:** `e993fa4 - docs: Update repository index to v3.0.0 with comprehensive project overview`
**Based On:** Built on top of Next.js migration foundation
**Divergence:** 53+ commits ahead of pre-nextjs base
**Stack:** Next.js 15 + Fabric.js + PDF.js + Playwright
**Status:** ✅ **MERGED INTO MASTER** - Tagged as v2.1.0-takeoff-system

**Notes:**
This branch delivered a complete PDF takeoff and estimating system for HDD operations. Successfully merged into master on 2025-11-23 via commit `ca2bf9b`.

**Features Implemented:**
- **Module 1.1:** PDF viewer with zoom, pan, page navigation
- **Module 1.2:** Measurement tools (linear, area, count) with Fabric.js
- **Module 1.3:** Measurement list, properties panel, export functionality
- **Testing:** Comprehensive E2E test suite with Playwright
- **Documentation:** Full documentation infrastructure in `docs/takeoff/`

**Merge Status:** ✅ Complete (commit `ca2bf9b`, tagged v2.1.0-takeoff-system)
**Recommendation:** Archive this branch - work is fully integrated and tagged

---

### Branch: feat/brand-refresh

**Latest Commit:** `894c862 - feat: Add interactive service area map to homepage with Leaflet.js`
**Based On:** Diverged from older master base (pre-Next.js)
**Divergence:** 1 commit ahead of original base
**Scope:** Leaflet.js map integration for service area visualization
**Stack:** Leaflet.js (HTML/JavaScript implementation)
**Status:** 🔴 **NOT MERGED** - Requires adaptation for Next.js/React

**Notes:**
This branch adds an interactive service area map to the homepage using Leaflet.js. However, it was developed against the **static HTML version** of the site and needs to be adapted to work with the current Next.js/React architecture.

**Work Required:**
- Convert Leaflet.js integration to React component
- Update dependencies: add `react-leaflet` to package.json
- Create `app/components/ServiceAreaMap.tsx`
- Integrate into Next.js homepage (`app/page.tsx`)
- Test responsive behavior and touch controls

**Merge Status:** ⏸️ **PENDING ADAPTATION**
**Recommendation:** Create adaptation branch `adapt/brand-refresh-to-nextjs` when ready to integrate

---

### Branch: integrate/takeoff-system

**Status:** 🟢 Integration branch (used for merging feat/takeoff-system)
**Purpose:** Temporary integration branch for testing takeoff system merge
**Current State:** Work complete, can be deleted

**Recommendation:** Delete this branch - it served its purpose

---

### Branch: master-backup-pre-nextjs

**Commit:** `48a89bd - docs: Add Serena MCP memory for index regeneration`
**Purpose:** Safety backup before Next.js migration
**Status:** 🔵 **ARCHIVED** - Static HTML site preservation

**Notes:**
This branch preserves the original static HTML site before the Next.js migration. It represents the "legacy" state and should be kept for reference but not actively developed.

**Recommendation:** Keep for historical reference, mark as archived/legacy

---

## Canonical Tech Stack (Source of Truth)

This reflects what is **actually running on master today** (2025-11-23).

### Frontend
- **Framework:** Next.js 15.0.3 (App Router)
- **Language:** TypeScript 5.x
- **UI Library:** React 18.3.1
- **Styling:** Tailwind CSS 3.4.1 + CSS Modules
- **Component Library:** Radix UI (dialogs, dropdowns, select, tabs, toast)
- **Icons:** Lucide React 0.460.0
- **Charts:** Chart.js 4.4.7 + react-chartjs-2
- **Maps:** Leaflet 1.9.4 (planned integration from feat/brand-refresh)

### Backend
- **API Routes:** Next.js API routes (App Router /api)
- **Runtime:** Node.js (via Next.js)
- **Authentication:** NextAuth.js v5.0.0-beta.29
- **Session Management:** JWT tokens + secure cookies

### Database
- **ORM:** Prisma 6.0.1
- **Database:** SQLite (development) - ready for PostgreSQL (production)
- **Schema:** 17+ HDD operational models (Equipment, Projects, Jobs, Crew, etc.)
- **Seeding:** Automated seed data via `prisma/seed.ts`

### Specialized Features
- **PDF Rendering:** PDF.js (via takeoff system)
- **Canvas Manipulation:** Fabric.js (measurement tools)
- **Form Validation:** Zod 3.25.76
- **Password Hashing:** bcryptjs 2.4.3

### Testing
- **Unit/Integration:** Vitest 4.0.13 + @testing-library/react
- **E2E Testing:** Playwright 1.56.1
- **Coverage:** @vitest/coverage-v8
- **Test Environment:** JSDOM + MSW (mock service worker)

### Deployment Target
- **Platform:** Vercel / Netlify (static/serverless)
- **Build Output:** Static Site Generation (SSG) + Server-Side Rendering (SSR)
- **Environment:** Node.js runtime
- **Database:** Will require migration from SQLite to PostgreSQL for production

### Development Tools
- **Package Manager:** npm
- **Code Quality:** ESLint 9 + eslint-config-next
- **Type Checking:** TypeScript compiler
- **Image Optimization:** sharp 0.34.4
- **Dev Server:** Next.js dev server (hot reload)

---

## Architecture Evolution Timeline

### Phase 0: Legacy (Pre-2025-11-20)
- Static HTML5/CSS3/Vanilla JavaScript
- No backend, no database
- Deployed as static files

### Phase 1: Next.js Migration (2025-11-20 to 2025-11-22)
- Branch: `feat/nextjs-migration`
- Migrated to Next.js 15 with App Router
- Added Prisma + SQLite database
- Implemented authentication with NextAuth.js
- Built 6-module dashboard
- Status: ✅ **MERGED INTO MASTER**

### Phase 2: Takeoff System (2025-11-22 to 2025-11-23)
- Branch: `feat/takeoff-system`
- Built PDF takeoff & estimating system
- Implemented Modules 1.1, 1.2, 1.3
- Added Fabric.js canvas tools
- Created E2E test suite
- Status: ✅ **MERGED INTO MASTER** (v2.1.0-takeoff-system)

### Phase 3: Brand Refresh (Pending)
- Branch: `feat/brand-refresh`
- Interactive Leaflet.js service area map
- Status: ⏸️ **AWAITING ADAPTATION** to Next.js/React

---

## Current Production Capabilities

### Public Website
- ✅ Homepage with hero section and service overview
- ✅ Services page with detailed descriptions
- ✅ About page with company history
- ✅ Contact page with form and map
- ✅ Projects/portfolio page (with placeholders)
- ✅ Responsive design (375px to 1920px+)
- ✅ Dark mode support
- ✅ SEO optimized (meta tags, Open Graph)

### Authenticated Dashboard
- ✅ Role-based access control (OWNER, SUPER, CREW)
- ✅ Projects management module
- ✅ Jobs/job sites tracking
- ✅ Crew management with assignments
- ✅ Bore logs data entry
- ✅ Field reports submission
- ✅ Settings and configuration

### Takeoff & Estimating System
- ✅ PDF upload and viewer (Module 1.1)
- ✅ Zoom, pan, page navigation
- ✅ Scale calibration
- ✅ Linear measurement tool (Module 1.2)
- ✅ Area measurement tool (Module 1.2)
- ✅ Count measurement tool (Module 1.2)
- ✅ Measurement list with properties (Module 1.3)
- ✅ Undo/redo system
- ✅ Export functionality (CSV/JSON)

---

## Known Technical Debt

### High Priority
1. **Database Migration:** SQLite → PostgreSQL for production deployment
2. **Environment Configuration:** Separate dev/staging/prod configs
3. **Error Monitoring:** Add Sentry or similar APM
4. **Performance Monitoring:** Implement analytics and metrics

### Medium Priority
1. **Brand Refresh Integration:** Adapt Leaflet.js map for Next.js
2. **Image Optimization:** Optimize existing images in public/images/
3. **API Rate Limiting:** Add rate limiting to API routes
4. **Email Integration:** Implement contact form email delivery

### Low Priority
1. **Test Coverage:** Increase unit test coverage (currently focused on E2E)
2. **Documentation:** Convert root-level .md files to docs/ structure
3. **Legacy Cleanup:** Remove unused static HTML files if any remain
4. **Branch Cleanup:** Archive/delete merged feature branches

---

## Development Workflow

### Current Branch Strategy
- **master:** Production-ready code, default branch
- **Feature branches:** Short-lived, merged via merge commits
- **Integration branches:** Used for testing complex merges
- **Backup branches:** Safety snapshots before major changes

### Merge Strategy
- Sequential integration (foundation → features → enhancements)
- Comprehensive testing before merge
- Use `--no-ff` for merge commits to preserve context
- Tag releases for tracking (v2.x.x)

### Testing Requirements
- All E2E tests must pass (Playwright)
- Production build must succeed
- TypeScript must compile without errors
- Manual smoke testing of critical paths

---

## Deployment Readiness

### ✅ Ready for Deployment
- Next.js production build verified
- All tests passing
- Authentication system functional
- Dashboard modules operational
- Takeoff system complete (Module 1.1-1.3)

### ⚠️ Pre-Deployment Tasks
- [ ] Migrate to PostgreSQL database
- [ ] Configure production environment variables
- [ ] Set up domain and SSL certificates
- [ ] Configure email service (Resend/SendGrid)
- [ ] Set up monitoring and logging
- [ ] Create deployment pipeline
- [ ] Test production build on staging

### 📋 Post-Deployment Tasks
- [ ] Monitor performance metrics
- [ ] Gather user feedback on takeoff system
- [ ] Plan Module 2.x features (cost database, estimating)
- [ ] Integrate brand refresh (service area map)
- [ ] Plan content migration for placeholders

---

## Documentation Locations

### Primary Documentation
- **Root README.md:** Project overview and quick start
- **CLAUDE.md:** Claude AI context (company profile, requirements)
- **docs/ARCHITECTURE.md:** High-level architecture decisions
- **docs/DEPLOYMENT.md:** Deployment procedures

### Feature Documentation
- **docs/takeoff/:** Complete takeoff system documentation
  - Architecture, modules, testing, progress tracking
- **docs/features/:** Individual feature documentation
  - Business dashboard, dark mode, invoice payment, service requests

### Development Documentation
- **.claude/:** AI agent coordination and workflows
- **.serena/:** Serena MCP memory and session tracking
- **tests/:** Test documentation and reports

### Legacy Documentation
- **docs/archive/:** Historical session summaries
- **MERGE_STRATEGY.md:** Branch merge documentation (root level)
- Various root-level completion reports and handoff docs

---

## Recommendations

### Immediate Actions (Next 7 Days)
1. **Archive Merged Branches:** Mark feat/nextjs-migration and feat/takeoff-system as archived
2. **Database Planning:** Decide on PostgreSQL hosting (Vercel, Railway, Supabase)
3. **Brand Refresh Adaptation:** Create plan to integrate Leaflet.js map
4. **Documentation Cleanup:** Execute documentation restructure (this Phase 0 work)

### Short-Term (Next 30 Days)
1. **Production Deployment:** Deploy to Vercel/Netlify with PostgreSQL
2. **User Testing:** Gather feedback on takeoff system from actual HDD operations
3. **Content Strategy:** Replace placeholder content with real company information
4. **Monitoring Setup:** Implement Vercel Analytics or similar

### Long-Term (Next 90 Days)
1. **Module 2.x Development:** Cost database and estimate builder (takeoff Phase 2)
2. **Advanced Features:** Change orders, client portal (takeoff Phase 3)
3. **Marketing Integration:** SEO optimization, Google My Business
4. **Feature Expansion:** Additional dashboard modules based on user needs

---

## Version History

| Version | Date | Branch | Description |
|---------|------|--------|-------------|
| v1.0.0 | 2025-10-25 | master | Initial static HTML site |
| v2.0.0 (implicit) | 2025-11-22 | master | Next.js migration merged |
| v2.1.0-takeoff-system | 2025-11-23 | master | Takeoff system merged (Modules 1.1-1.3) |

---

## Contact & Ownership

**Repository Owner:** Midwest Underground of Minnesota Inc
**Primary Developer:** AI-assisted development (Claude + Serena MCP)
**Tech Stack Steward:** Development team
**Last Audit:** 2025-11-23 (Phase 0 Documentation Restructure)

---

*This document represents the actual current state as of November 23, 2025, based on git history analysis, package.json inspection, and directory structure verification. It should be updated after each major merge or architectural change.*
