<!-- TOC -->

## Table of Contents

  - [Executive Summary](#executive-summary)
  - [Branch Inventory](#branch-inventory)
    - [Production Branches](#production-branches)
      - [master (Default Branch)](#master-default-branch)
      - [master-backup-pre-nextjs](#master-backup-pre-nextjs)
    - [Feature Branches](#feature-branches)
      - [✅ feat/nextjs-migration (MERGED)](#featnextjs-migration-merged)
      - [✅ feat/takeoff-system (MERGED)](#feattakeoff-system-merged)
      - [⏸️ feat/brand-refresh (PENDING)](#featbrand-refresh-pending)
      - [integrate/takeoff-system](#integratetakeoff-system)
  - [Branch Purposes & Intent](#branch-purposes-intent)
    - [Current Production (master)](#current-production-master)
    - [Future Direction](#future-direction)
  - [Merge History & Timeline](#merge-history-timeline)
    - [Phase 0: Legacy Era (Pre-2025-11-20)](#phase-0-legacy-era-pre-2025-11-20)
    - [Phase 1: Next.js Migration (2025-11-20 to 2025-11-22)](#phase-1-nextjs-migration-2025-11-20-to-2025-11-22)
    - [Phase 2: Takeoff System (2025-11-22 to 2025-11-23)](#phase-2-takeoff-system-2025-11-22-to-2025-11-23)
    - [Phase 3: Brand Refresh (Future)](#phase-3-brand-refresh-future)
  - [Merge Methodology Used](#merge-methodology-used)
    - [Sequential Integration (Chosen Approach)](#sequential-integration-chosen-approach)
  - [Documentation Focus Decision](#documentation-focus-decision)
    - [Primary Documentation Target: Current Production (master)](#primary-documentation-target-current-production-master)
    - [Documentation Categories](#documentation-categories)
      - [Current State (master)](#current-state-master)
      - [Historical Context](#historical-context)
      - [Future Planning](#future-planning)
  - [Canonical Brand & Design Standards](#canonical-brand-design-standards)
    - [Current Brand Colors (Next.js Version)](#current-brand-colors-nextjs-version)
    - [Legacy Brand Colors (Static HTML - Deprecated)](#legacy-brand-colors-static-html-deprecated)
  - [Handling Legacy Static Site Documentation](#handling-legacy-static-site-documentation)
    - [Approach: Hybrid Strategy](#approach-hybrid-strategy)
      - [Keep as Legacy Reference](#keep-as-legacy-reference)
      - [Fully Replaced](#fully-replaced)
      - [Clear Labeling](#clear-labeling)
  - [Recommended Merge Order for Future Features](#recommended-merge-order-for-future-features)
    - [Priority Framework](#priority-framework)
    - [Current Pending Work](#current-pending-work)
      - [Immediate (Next 7 Days)](#immediate-next-7-days)
      - [Short-Term (Next 30 Days)](#short-term-next-30-days)
      - [Medium-Term (Next 90 Days)](#medium-term-next-90-days)
  - [Branch Management Best Practices](#branch-management-best-practices)
    - [Creating Feature Branches](#creating-feature-branches)
- [Always branch from latest master](#always-branch-from-latest-master)
- [Use descriptive names](#use-descriptive-names)
    - [Before Merging](#before-merging)
    - [Merge Commits](#merge-commits)
    - [Post-Merge](#post-merge)
  - [Conflict Resolution Guidelines](#conflict-resolution-guidelines)
    - [Likely Conflict Areas](#likely-conflict-areas)
      - [High Probability](#high-probability)
      - [Medium Probability](#medium-probability)
      - [Low Probability](#low-probability)
    - [Resolution Strategy](#resolution-strategy)
  - [Rollback Procedures](#rollback-procedures)
    - [If a Merge Goes Wrong](#if-a-merge-goes-wrong)
      - [Immediate Rollback (Last Commit)](#immediate-rollback-last-commit)
- [Undo the merge commit (preserves branch)](#undo-the-merge-commit-preserves-branch)
      - [Reset to Previous State (Nuclear Option)](#reset-to-previous-state-nuclear-option)
- [DANGER: Rewrites history](#danger-rewrites-history)
- [Requires team coordination!](#requires-team-coordination)
      - [Restore from Backup Branch](#restore-from-backup-branch)
- [If you created a backup branch](#if-you-created-a-backup-branch)
  - [Communication Protocol](#communication-protocol)
    - [Before Major Merges](#before-major-merges)
    - [During Merge](#during-merge)
    - [After Merge](#after-merge)
  - [Lessons Learned from Recent Merges](#lessons-learned-from-recent-merges)
    - [What Worked Well ✅](#what-worked-well)
    - [What Could Be Improved ⚠️](#what-could-be-improved)
    - [Recommendations for Future Merges](#recommendations-for-future-merges)
  - [Branch Cleanup Schedule](#branch-cleanup-schedule)
    - [Immediate Cleanup (Today)](#immediate-cleanup-today)
    - [Keep Active](#keep-active)
    - [Future Cleanup (After brand-refresh merge)](#future-cleanup-after-brand-refresh-merge)
  - [Documentation Restructure Context](#documentation-restructure-context)
  - [Version History](#version-history)
  - [Contact & Ownership](#contact-ownership)

<!-- /TOC -->

# Branch Merge Strategy

**Created:** 2025-11-23
**Status:** Post-Integration Documentation
**Purpose:** Historical record of merge strategy and current branch management approach

---

## Executive Summary

This document describes the branch management and merge strategy for the Midwest Underground website repository. As of November 23, 2025, **two major feature branches have been successfully merged into master**, with one remaining branch pending adaptation.

**Current Production State:** Next.js 15 application with integrated takeoff system
**Active Branches:** 3 feature branches (2 merged, 1 pending)
**Default Branch:** `master`

---

## Branch Inventory

### Production Branches

#### master (Default Branch)
- **Purpose:** Production-ready code, canonical source of truth
- **Current State:** Next.js 15 + TypeScript + Prisma + Takeoff System
- **Represents:** Current production architecture and features
- **Merge Policy:** Only merge after comprehensive testing
- **Protection:** Should be protected (require reviews, status checks)

#### master-backup-pre-nextjs
- **Purpose:** Safety snapshot of static HTML site before Next.js migration
- **Current State:** Frozen/archived
- **Represents:** Legacy static HTML architecture
- **Merge Policy:** Never merge (read-only historical reference)
- **Recommendation:** Keep indefinitely for historical reference

---

### Feature Branches

#### ✅ feat/nextjs-migration (MERGED)
- **Purpose:** Migrate static HTML site to Next.js 15 with App Router
- **Status:** ✅ **MERGED INTO MASTER** (implicitly, before takeoff system)
- **Merge Date:** ~2025-11-22
- **Complexity:** 🔴 High (47+ commits, fundamental architecture change)
- **Branch State:** Can be archived/deleted
- **Recommendation:** Archive branch, mark as historical

**What It Delivered:**
- Complete Next.js 15 migration from static HTML
- Prisma + SQLite database with 17+ models
- NextAuth.js authentication system (OWNER, SUPER, CREW roles)
- 6-module business dashboard (Projects, Jobs, Crew, Bore Logs, Field Reports, Settings)
- API routes for CRUD operations
- Dark mode with Tailwind CSS
- Responsive design (375px to 1920px+)
- Production build verification

**Current Relevance:** Work is fully integrated, branch can be archived

---

#### ✅ feat/takeoff-system (MERGED)
- **Purpose:** Build PDF takeoff & estimating system for HDD operations
- **Status:** ✅ **MERGED INTO MASTER** via commit `ca2bf9b`
- **Merge Date:** 2025-11-23
- **Tag:** `v2.1.0-takeoff-system`
- **Complexity:** 🔴 Highest (53+ commits, sophisticated feature set)
- **Branch State:** Can be archived/deleted
- **Recommendation:** Archive branch, keep tag for reference

**What It Delivered:**
- **Module 1.1:** PDF viewer with upload, zoom, pan, page navigation
- **Module 1.2:** Measurement tools (linear, area, count) using Fabric.js
- **Module 1.3:** Measurement list, properties panel, export (CSV/JSON)
- Scale calibration system
- Undo/redo with event emission
- Real-time measurement display
- Comprehensive E2E test suite (Playwright)
- Full documentation in `docs/takeoff/`

**Current Relevance:** Work is fully integrated and tagged, branch can be archived

---

#### ⏸️ feat/brand-refresh (PENDING)
- **Purpose:** Add interactive Leaflet.js service area map to homepage
- **Status:** ⏸️ **NOT MERGED** - Awaiting adaptation to Next.js/React
- **Original Commit:** `894c862`
- **Complexity:** 🟢 Low (1 commit, isolated feature)
- **Branch State:** Active but requires rework
- **Recommendation:** Create adaptation branch when ready to integrate

**What It Delivers:**
- Interactive Leaflet.js map showing service coverage area
- Zoom controls and map interaction
- Responsive design for mobile/tablet/desktop
- Touch-friendly controls

**Why Not Merged:**
- Developed against static HTML architecture
- Needs conversion to React component (`react-leaflet`)
- Requires adaptation to Next.js App Router structure

**Integration Plan:**
1. Create adaptation branch: `adapt/brand-refresh-to-nextjs`
2. Convert Leaflet.js to React component
3. Add `react-leaflet` dependency
4. Create `app/components/ServiceAreaMap.tsx`
5. Integrate into homepage (`app/page.tsx`)
6. Test and merge

**Priority:** 🟡 Medium - Enhancement feature, not critical path

---

#### integrate/takeoff-system
- **Purpose:** Temporary integration branch for testing takeoff merge
- **Status:** 🟢 Work complete
- **Recommendation:** Delete this branch (served its purpose)

---

## Branch Purposes & Intent

### Current Production (master)
- **Purpose:** Canonical production code
- **Technology:** Next.js 15 + TypeScript + Prisma + SQLite
- **Features:** Full business dashboard + PDF takeoff system
- **Deployment Target:** Vercel/Netlify with PostgreSQL (when deployed)

### Future Direction
**Near-term (Next 30 days):**
- Production deployment with PostgreSQL
- Brand refresh integration (Leaflet.js map)
- Content migration (replace placeholders)

**Mid-term (Next 90 days):**
- Takeoff Module 2.x: Cost database and estimate builder
- Advanced dashboard features based on user feedback
- SEO optimization and marketing integration

**Long-term (Next 6-12 months):**
- Takeoff Module 3.x: Bore visualizer, historical database, client portal
- Mobile app consideration
- Advanced HDD operations features

---

## Merge History & Timeline

### Phase 0: Legacy Era (Pre-2025-11-20)
```
master (static HTML)
  └── v1.0.0 tag
```
- Static HTML5/CSS3/Vanilla JavaScript site
- No backend, no database
- Deployed as static files

### Phase 1: Next.js Migration (2025-11-20 to 2025-11-22)
```
master-backup-pre-nextjs ← snapshot created
  │
  ├── feat/nextjs-migration (47+ commits)
  │     └── MERGED INTO master (implicit)
  │
master (Next.js 15)
  └── v2.0.0 (implicit)
```
- **Branch Created:** ~2025-11-20
- **Branch Merged:** ~2025-11-22
- **Result:** Complete architectural transformation
- **Tag:** v2.0.0 (implicit, no explicit tag found)

### Phase 2: Takeoff System (2025-11-22 to 2025-11-23)
```
master (with Next.js)
  │
  ├── feat/takeoff-system (53+ commits)
  │     └── MERGED via commit ca2bf9b
  │
master (with takeoff)
  └── v2.1.0-takeoff-system tag
```
- **Branch Created:** Built on Next.js foundation
- **Branch Merged:** 2025-11-23 (commit `ca2bf9b`)
- **Result:** Complete takeoff system (Modules 1.1-1.3)
- **Tag:** v2.1.0-takeoff-system ✅

### Phase 3: Brand Refresh (Future)
```
master (current)
  │
  ├── adapt/brand-refresh-to-nextjs (to be created)
  │     ├── Cherry-pick from feat/brand-refresh
  │     └── Convert to React/Next.js
  │
master (with map)
  └── v2.2.0-brand-refresh (future tag)
```
- **Branch Status:** Awaiting adaptation
- **Estimated Timeline:** 1-2 days when prioritized
- **Complexity:** Low (single feature conversion)

---

## Merge Methodology Used

### Sequential Integration (Chosen Approach)
**Why:** Dependencies and complexity required staged approach
- ✅ **Phase 1:** Foundation first (Next.js migration)
- ✅ **Phase 2:** Features that depend on foundation (takeoff system)
- ⏸️ **Phase 3:** Enhancements that need adaptation (brand refresh)

**Benefits:**
- Reduced complexity per merge
- Clear testing boundaries
- Easier to debug issues
- Manageable rollback points

**Results:**
- ✅ Both major merges successful
- ✅ No critical issues post-merge
- ✅ Production build verified at each step

---

## Documentation Focus Decision

### Primary Documentation Target: **Current Production (master)**

**Rationale:**
1. **master is production-ready** with complete feature set
2. **Near-future deployable** (just needs PostgreSQL + env config)
3. **Merged branches are historical** context, not active development

**Documentation Philosophy:**
- All docs should reflect **what exists on master today**
- Legacy information should be moved to `docs/archive/`
- Feature branches get documented **after** merge, not before
- Clear distinction between "current state" and "planned future"

### Documentation Categories

#### Current State (master)
- **docs/architecture/CURRENT-STATE.md** - What exists now
- **docs/DEPLOYMENT.md** - How to deploy current system
- **README.md** - Getting started with current codebase
- **docs/features/** - Features that exist and work today

#### Historical Context
- **docs/archive/** - Past session summaries, migration docs
- **MERGE_STRATEGY.md** - This document (historical record)
- **master-backup-pre-nextjs** - Legacy codebase reference

#### Future Planning
- **docs/takeoff/modules/phase-2/** - Planned modules (not implemented)
- **docs/takeoff/modules/phase-3/** - Future vision
- **.claude/plans/** - Implementation plans for future work

---

## Canonical Brand & Design Standards

### Current Brand Colors (Next.js Version)
These are the **canonical** colors as implemented on master:

**Primary Palette:**
- Deep Blue: `#003B5C` - Primary brand color
- Safety Orange: `#FF6B35` - Secondary/accent color (CTA buttons)
- Dark mode variants defined in `app/globals.css`

**Dashboard Orange:**
- Brand Orange: `#FF8800` - Dashboard accents and highlights
- Used consistently across dashboard modules

**Neutrals:**
- Dark: `#333333` - Text and UI elements
- Medium: `#666666` - Secondary text
- Light: `#F5F5F5` - Backgrounds
- White: `#FFFFFF` - Cards and surfaces

**Dark Mode:**
- Backgrounds: Dark grays and blues
- Text: Light grays and white
- Accents: Adjusted orange and blue values
- Full palette in `tailwind.config.ts`

### Legacy Brand Colors (Static HTML - Deprecated)
The static HTML site used slightly different color values. These are **deprecated** and exist only in:
- `about.html`
- Other `.html` files in root (if any remain)
- `master-backup-pre-nextjs` branch

**Do not reference legacy colors for new work.**

---

## Handling Legacy Static Site Documentation

### Approach: Hybrid Strategy

#### Keep as Legacy Reference
- **master-backup-pre-nextjs branch:** Preserved indefinitely
- **docs/archive/SESSION-SUMMARY*.md:** Historical session docs
- **Root-level .html files:** May still exist, marked as legacy

#### Fully Replaced
- Architecture documentation (now docs/ARCHITECTURE.md)
- Deployment guides (now docs/DEPLOYMENT.md)
- Feature documentation (moved to docs/features/)
- Development setup (now in README.md)

#### Clear Labeling
All legacy documentation should be:
1. Moved to `docs/archive/` if still relevant
2. Marked with "⚠️ LEGACY" or "📦 ARCHIVED" headers
3. Include note: "This applies to the pre-Next.js static HTML site"
4. Reference `master-backup-pre-nextjs` branch for context

---

## Recommended Merge Order for Future Features

### Priority Framework
1. 🔴 **Critical Path:** Features that block other features (foundations)
2. 🟡 **High Value:** Features with immediate business impact
3. 🟢 **Enhancements:** Nice-to-have improvements
4. 🔵 **Experimental:** Proof-of-concept or research

### Current Pending Work

#### Immediate (Next 7 Days)
1. ⏸️ **feat/brand-refresh adaptation** - Requires React conversion
   - Priority: 🟡 Medium
   - Effort: 1-2 days
   - Blocker: None

#### Short-Term (Next 30 Days)
1. **Production deployment** - PostgreSQL migration + env setup
   - Priority: 🔴 High
   - Effort: 2-3 days
   - Blocker: None (master is ready)

2. **Content migration** - Replace placeholders with real content
   - Priority: 🟡 Medium-High
   - Effort: Ongoing
   - Blocker: None

#### Medium-Term (Next 90 Days)
1. **Takeoff Module 2.x** - Cost database and estimate builder
   - Priority: 🟡 High (business value)
   - Effort: 2-3 weeks
   - Blocker: Module 1.x complete ✅

2. **Advanced dashboard features** - Based on user feedback
   - Priority: 🟢 Medium
   - Effort: Variable
   - Blocker: Production deployment + user testing

---

## Branch Management Best Practices

### Creating Feature Branches
```bash
# Always branch from latest master
git checkout master
git pull origin master
git checkout -b feat/feature-name

# Use descriptive names
feat/     - New features
fix/      - Bug fixes
docs/     - Documentation only
refactor/ - Code refactoring
test/     - Test additions
adapt/    - Adaptations of existing features
```

### Before Merging
- [ ] All tests pass (unit + E2E)
- [ ] Production build succeeds (`npm run build`)
- [ ] TypeScript compiles without errors
- [ ] Code reviewed (if team workflow)
- [ ] Documentation updated
- [ ] CHANGELOG updated (if maintained)

### Merge Commits
Use descriptive merge commits with full context:
```bash
git merge --no-ff feat/feature-name -m "feat: Brief description

Detailed explanation of what this merge brings:
- Major change 1
- Major change 2
- Breaking changes (if any)

Testing: How it was tested
Documentation: Where to find docs

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Post-Merge
1. Tag significant releases: `git tag -a v2.x.x -m "Release notes"`
2. Push tags: `git push origin --tags`
3. Archive merged branch (keep for 30 days, then delete)
4. Update documentation to reflect new state
5. Announce to team/stakeholders

---

## Conflict Resolution Guidelines

### Likely Conflict Areas

#### High Probability
- `package.json` - Dependency version conflicts
- `README.md` - Documentation updates from multiple branches
- Root-level .md files - Documentation conflicts
- `.gitignore` - Different ignore patterns

#### Medium Probability
- `app/globals.css` - Styling conflicts
- `tailwind.config.ts` - Configuration changes
- Database schema - Model additions/changes
- API routes - New endpoints

#### Low Probability
- Component files - Usually isolated
- Test files - Different test scopes
- Public assets - Additive, rarely conflicting

### Resolution Strategy
1. **Favor the newer architecture** - Next.js over static HTML
2. **Preserve all features** - Don't lose functionality from either branch
3. **Test after resolution** - Run full test suite
4. **Document decisions** - Note why you chose one version over another
5. **Ask for help** - If unsure, consult team or create issue

---

## Rollback Procedures

### If a Merge Goes Wrong

#### Immediate Rollback (Last Commit)
```bash
# Undo the merge commit (preserves branch)
git revert -m 1 HEAD
git push origin master
```

#### Reset to Previous State (Nuclear Option)
```bash
# DANGER: Rewrites history
git reset --hard <commit-before-merge>
git push origin master --force

# Requires team coordination!
```

#### Restore from Backup Branch
```bash
# If you created a backup branch
git checkout master
git reset --hard master-backup-branch-name
git push origin master --force
```

**Best Practice:** Always create backup branches before major merges
- Naming: `master-backup-YYYY-MM-DD-description`
- Keep for 30 days minimum
- Tag for easy reference

---

## Communication Protocol

### Before Major Merges
1. **Announce intent** in team channel (if applicable)
2. **Schedule time window** for merge work
3. **Notify stakeholders** of potential downtime
4. **Create backup branch** with descriptive name

### During Merge
1. **Status updates** at key milestones
2. **Document conflicts** as they're resolved
3. **Keep team informed** of blockers
4. **Share test results** before finalizing

### After Merge
1. **Completion announcement** with release notes
2. **Tag the release** with version number
3. **Update documentation** to reflect changes
4. **Demo new features** to stakeholders
5. **Gather feedback** for improvements

---

## Lessons Learned from Recent Merges

### What Worked Well ✅
1. **Sequential approach** - Reduced complexity dramatically
2. **Comprehensive testing** - Playwright E2E tests caught issues early
3. **Detailed documentation** - Plans and handoffs made resuming work easy
4. **Backup branches** - master-backup-pre-nextjs was invaluable reference
5. **Clear tagging** - v2.1.0-takeoff-system makes tracking easy

### What Could Be Improved ⚠️
1. **Earlier tagging** - v2.0.0 for Next.js migration should have been explicit
2. **Merge commit messages** - Could be more detailed (using template above)
3. **Branch cleanup** - Archive merged branches faster
4. **Conflict prevention** - More frequent rebasing during development
5. **Documentation timing** - Update docs immediately after merge, not later

### Recommendations for Future Merges
1. **Use merge templates** - Standardize commit message format
2. **Create checklists** - Pre-merge, during-merge, post-merge tasks
3. **Automate testing** - CI/CD pipeline to run tests on merge
4. **Staging environment** - Test merges in staging before production
5. **Version planning** - Decide version numbers before merge

---

## Branch Cleanup Schedule

### Immediate Cleanup (Today)
- [ ] Archive `feat/nextjs-migration` (merged, work complete)
- [ ] Archive `feat/takeoff-system` (merged, work complete)
- [ ] Delete `integrate/takeoff-system` (temporary, served its purpose)

### Keep Active
- [x] `master` - Production branch
- [x] `master-backup-pre-nextjs` - Historical reference
- [x] `feat/brand-refresh` - Pending adaptation

### Future Cleanup (After brand-refresh merge)
- [ ] Archive `feat/brand-refresh` once adapted and merged
- [ ] Delete `adapt/brand-refresh-to-nextjs` after merge

---

## Documentation Restructure Context

**This document created:** 2025-11-23 (Phase 0 of Documentation Restructure)

**Purpose:**
- Historical record of merge decisions
- Current branch management strategy
- Guide for future feature integration

**Related Documents:**
- `docs/architecture/CURRENT-STATE.md` - What exists now
- `docs/archive/PRE-RESTRUCTURE-INVENTORY.md` - All markdown files
- `MERGE_STRATEGY.md` (root) - Original detailed merge plan

**Status:**
This documents **what has already happened** (2 successful merges) and **what remains** (brand refresh pending).

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-23 | Claude Code | Initial documentation of merge history and strategy |

---

## Contact & Ownership

**Document Owner:** Development Team
**Maintained By:** Tech Lead / Senior Developer
**Review Frequency:** After each major merge or quarterly
**Last Review:** 2025-11-23

---

*This document should be updated after each feature branch merge to reflect the current state of the repository and inform future merge decisions.*
