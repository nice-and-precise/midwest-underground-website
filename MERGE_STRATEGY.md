# Merge Strategy - Midwest Underground Website

**Last Updated:** November 23, 2025
**Status:** 🟡 Three divergent feature branches require strategic integration

---

## Executive Summary

Three major feature branches have diverged significantly from `master`:
- **feat/brand-refresh** - Interactive service area map (1 commit, low complexity)
- **feat/nextjs-migration** - Complete Next.js 15 migration (47+ commits, high complexity)
- **feat/takeoff-system** - PDF takeoff & estimating system (53+ commits, highest complexity)

**Recommended Strategy:** Sequential integration in order of dependency and complexity.

---

## Branch Analysis

### Current State (November 23, 2025)

```
master (48a89bd)
├── feat/brand-refresh (894c862) - 1 commit ahead
├── feat/nextjs-migration (78ca59f) - 47+ commits ahead
└── feat/takeoff-system (e993fa4) - 53+ commits ahead
```

### Branch Details

#### 1. **master** (baseline)
- **Latest Commit:** `docs: Add Serena MCP memory for index regeneration`
- **Status:** Production baseline
- **Type:** Documentation updates

#### 2. **feat/brand-refresh**
- **Latest Commit:** `feat: Add interactive service area map to homepage with Leaflet.js`
- **Divergence:** 1 commit ahead of older master base
- **Complexity:** 🟢 Low
- **Tech Stack:** Leaflet.js integration
- **Conflicts:** Likely conflicts with Next.js migration (HTML → JSX conversion)
- **Dependencies:** None (standalone feature)

#### 3. **feat/nextjs-migration**
- **Latest Commit:** `docs: Update Serena memories with cleanup and merge prep session`
- **Divergence:** 47+ commits ahead
- **Complexity:** 🔴 High
- **Major Changes:**
  - Migrated from static HTML to Next.js 15
  - Added Prisma + SQLite database (17+ HDD models)
  - Implemented NextAuth.js authentication
  - Built complete dashboard with 6 modules
  - Added API routes for all CRUD operations
  - Dark mode, parallax effects, responsive design
  - Production build verified
- **Conflicts:** Fundamental architecture change (static → SSR/SSG)
- **Dependencies:** Foundation for takeoff-system

#### 4. **feat/takeoff-system**
- **Latest Commit:** `docs: Update repository index to v3.0.0 with comprehensive project overview`
- **Divergence:** 53+ commits ahead
- **Complexity:** 🔴 Highest
- **Major Changes:**
  - Complete PDF takeoff & estimating system
  - Fabric.js canvas measurement tools
  - Module 1.1: PDF viewer with zoom/pan/navigation
  - Module 1.2: Linear, area, count measurement tools
  - Module 1.3: Measurement list, properties panel, export
  - Undo/redo system with event emission
  - E2E test suite with Playwright
  - Comprehensive documentation infrastructure
- **Conflicts:** Depends on Next.js architecture
- **Dependencies:** Requires feat/nextjs-migration base

---

## Recommended Merge Order

### Phase 1: Foundation Migration (CRITICAL PATH)
**Target:** Merge `feat/nextjs-migration` → `master`

**Priority:** 🔴 **HIGHEST** - This is the foundation for all other features

**Rationale:**
- Next.js migration fundamentally changes the architecture
- Takeoff system depends on Next.js infrastructure
- Brand refresh features need to be adapted to Next.js/React

**Steps:**
1. ✅ Create backup branch: `master-backup-pre-nextjs`
2. ✅ Run full test suite on `feat/nextjs-migration`
3. ✅ Verify production build: `npm run build`
4. ✅ Review and resolve conflicts
5. ✅ Merge with detailed commit message
6. ✅ Tag release: `v2.0.0-nextjs-foundation`
7. ✅ Update README and documentation

**Risk Level:** 🔴 High (fundamental architecture change)

---

### Phase 2: Feature Integration
**Target:** Merge `feat/takeoff-system` → `master`

**Priority:** 🟡 **HIGH** - Core business feature (HDD operations)

**Rationale:**
- Built on top of Next.js migration
- Provides immediate business value
- Well-tested with E2E suite (Playwright)
- Comprehensive documentation

**Steps:**
1. ✅ Ensure Phase 1 complete and stable
2. ✅ Create integration branch: `integrate/takeoff-system`
3. ✅ Rebase onto new master: `git rebase master`
4. ✅ Run E2E test suite
5. ✅ Manual testing of all takeoff features
6. ✅ Resolve conflicts (likely minimal if Phase 1 clean)
7. ✅ Merge with squash option (optional, for cleaner history)
8. ✅ Tag release: `v2.1.0-takeoff-system`

**Risk Level:** 🟡 Medium (depends on clean Phase 1)

---

### Phase 3: Enhancement Integration
**Target:** Adapt and merge `feat/brand-refresh` → `master`

**Priority:** 🟢 **MEDIUM** - Enhancement feature

**Rationale:**
- Adds value but not critical path
- Requires adaptation from HTML to React/Next.js
- Simple feature (single Leaflet.js map)

**Steps:**
1. ✅ Ensure Phases 1 & 2 complete
2. ✅ Create adaptation branch: `adapt/brand-refresh-to-nextjs`
3. ✅ Convert Leaflet.js integration to React component
4. ✅ Update dependencies in `package.json`
5. ✅ Test responsive behavior
6. ✅ Merge with standard commit
7. ✅ Tag release: `v2.2.0-brand-refresh`

**Risk Level:** 🟢 Low (isolated feature, easy to adapt)

---

## Merge Commands Reference

### Phase 1: Next.js Migration

```bash
# 1. Backup master
git checkout master
git branch master-backup-pre-nextjs
git push origin master-backup-pre-nextjs

# 2. Verify feat/nextjs-migration is clean
git checkout feat/nextjs-migration
npm install
npm run build  # Must succeed
npm run test   # All tests must pass

# 3. Merge to master
git checkout master
git merge --no-ff feat/nextjs-migration -m "feat: Complete Next.js 15 migration with HDD dashboard

Merges feat/nextjs-migration into master. This is a foundational change
that migrates the static HTML site to a full-stack Next.js application.

Major Changes:
- Next.js 15.0.3 with App Router
- Prisma + SQLite database (17+ HDD operational models)
- NextAuth.js authentication (OWNER, SUPER, CREW roles)
- Complete dashboard with 6 modules (Projects, Jobs, Crew, Bore Logs, Field Reports, Settings)
- API routes for all CRUD operations
- Dark mode with Tailwind CSS
- Production build verified
- 100% E2E test coverage

Breaking Changes:
- Architecture: Static HTML → Next.js SSR/SSG
- Routing: HTML files → App Router
- Styling: CSS files → Tailwind + CSS Modules
- State: Vanilla JS → React state management

Documentation: MIGRATION-TO-NEXTJS.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 4. Tag release
git tag -a v2.0.0-nextjs-foundation -m "Release v2.0.0 - Next.js Foundation"
git push origin master --tags

# 5. Delete remote feature branch (optional)
# git push origin --delete feat/nextjs-migration
```

### Phase 2: Takeoff System

```bash
# 1. Create integration branch
git checkout -b integrate/takeoff-system
git merge master  # Get latest Next.js changes

# 2. Rebase takeoff-system onto new master
git checkout feat/takeoff-system
git rebase master

# 3. Run tests
npm run test
npx playwright test

# 4. Merge to master
git checkout master
git merge --no-ff feat/takeoff-system -m "feat: Add PDF takeoff & estimating system for HDD operations

Merges feat/takeoff-system into master. Adds comprehensive digital
takeoff system for measuring HDD projects from PDF drawings.

Major Features:
- Module 1.1: PDF viewer (upload, zoom, pan, page navigation)
- Module 1.2: Measurement tools (linear, area, count)
- Module 1.3: Measurement management (list, properties, export)
- Fabric.js canvas integration
- Undo/redo system with event emission
- Real-time measurement display
- Scale calibration
- E2E test suite (Playwright)
- Comprehensive documentation (MODULE_*.md files)

Tech Stack:
- PDF.js for document rendering
- Fabric.js for canvas measurements
- React state management
- TypeScript for type safety

Testing: 100% E2E coverage with Playwright

Documentation: MODULE_1_*.md, HANDOFF_*.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 5. Tag release
git tag -a v2.1.0-takeoff-system -m "Release v2.1.0 - Takeoff & Estimating System"
git push origin master --tags
```

### Phase 3: Brand Refresh (Adaptation Required)

```bash
# 1. Create adaptation branch
git checkout -b adapt/brand-refresh-to-nextjs master

# 2. Cherry-pick brand-refresh changes
git cherry-pick feat/brand-refresh

# 3. Adapt to React (manual work required)
# - Convert Leaflet.js to React component
# - Update package.json with react-leaflet
# - Create app/components/ServiceAreaMap.tsx
# - Import in homepage

# 4. Test
npm install
npm run dev
npm run build

# 5. Merge to master
git checkout master
git merge --no-ff adapt/brand-refresh-to-nextjs -m "feat: Add interactive service area map with Leaflet.js

Adds interactive Leaflet.js map showing Midwest Underground's
service coverage area in central Minnesota.

Features:
- Interactive map with zoom controls
- Service area overlay
- Responsive design
- Mobile-friendly touch controls

Adapted from feat/brand-refresh to work with Next.js/React architecture.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 6. Tag release
git tag -a v2.2.0-brand-refresh -m "Release v2.2.0 - Interactive Service Map"
git push origin master --tags
```

---

## Conflict Resolution Guidelines

### Expected Conflicts

#### Phase 1 (Next.js Migration)
- **None expected** - This is the foundation merge
- Master only has documentation updates
- Clean merge likely

#### Phase 2 (Takeoff System)
- **Potential:** `package.json` dependencies
- **Potential:** Documentation file conflicts (README, CLAUDE.md)
- **Potential:** New files in `/public` or `/app` directories
- **Resolution:** Accept takeoff-system changes (it's built on Next.js base)

#### Phase 3 (Brand Refresh)
- **Guaranteed:** HTML files no longer exist (converted to JSX)
- **Guaranteed:** CSS structure changed (Tailwind integration)
- **Guaranteed:** JavaScript → React component conversion needed
- **Resolution:** Manual adaptation required (not a traditional merge)

### Conflict Resolution Strategy

1. **Favor the newer architecture** (Next.js over static HTML)
2. **Preserve business logic** from both branches
3. **Test thoroughly** after each conflict resolution
4. **Document decisions** in commit messages
5. **Use `git rerere`** to remember conflict resolutions

---

## Testing Requirements

### Pre-Merge Testing (Each Phase)

#### Phase 1 (Next.js Migration)
```bash
npm install
npm run type-check  # TypeScript validation
npm run build       # Production build
npm run test        # Unit tests
npx playwright test # E2E tests (if available)
```

**Success Criteria:**
- ✅ Zero TypeScript errors
- ✅ Production build succeeds
- ✅ All unit tests pass
- ✅ Manual smoke test of dashboard

#### Phase 2 (Takeoff System)
```bash
npm run test
npx playwright test
```

**Success Criteria:**
- ✅ All E2E tests pass
- ✅ PDF upload and rendering works
- ✅ Measurement tools functional
- ✅ Export functionality verified

#### Phase 3 (Brand Refresh)
```bash
npm run dev
# Manual testing required
```

**Success Criteria:**
- ✅ Map loads correctly
- ✅ Responsive on mobile/tablet/desktop
- ✅ No console errors
- ✅ Performance acceptable (Lighthouse 90+)

---

## Rollback Plan

### If Phase 1 Fails
```bash
# Restore master from backup
git checkout master
git reset --hard master-backup-pre-nextjs
git push origin master --force  # ⚠️ Requires team coordination
```

### If Phase 2 Fails
```bash
# Revert the merge commit
git revert -m 1 HEAD
git push origin master
```

### If Phase 3 Fails
```bash
# Revert the merge commit
git revert -m 1 HEAD
git push origin master
```

---

## Post-Merge Tasks

### After Phase 1 (Next.js Migration)
- [ ] Update deployment configuration (Netlify/Vercel)
- [ ] Update CI/CD pipelines
- [ ] Update README with new setup instructions
- [ ] Archive static HTML documentation
- [ ] Notify team of architecture change
- [ ] Update issue tracker/project board

### After Phase 2 (Takeoff System)
- [ ] Create user documentation for takeoff features
- [ ] Train team on new takeoff workflow
- [ ] Set up database backups (SQLite → production)
- [ ] Monitor performance metrics
- [ ] Gather user feedback

### After Phase 3 (Brand Refresh)
- [ ] Update marketing materials with map feature
- [ ] Add map to About/Contact pages if desired
- [ ] Monitor map API usage/costs (if using paid tier)
- [ ] Gather analytics on map interaction

---

## Risk Assessment

### High-Risk Items
1. 🔴 **Next.js Migration** - Fundamental architecture change
   - Mitigation: Comprehensive testing, backup branches, gradual rollout
2. 🔴 **Database Schema** - New Prisma models might conflict
   - Mitigation: Review migrations, test with seed data
3. 🟡 **Authentication** - NextAuth.js integration might need adjustment
   - Mitigation: Test all auth flows, verify role-based access

### Medium-Risk Items
1. 🟡 **Asset Paths** - Images/CSS paths change in Next.js
   - Mitigation: Verify all assets load correctly
2. 🟡 **Routing** - HTML files → Next.js App Router
   - Mitigation: Test all navigation paths
3. 🟡 **External Dependencies** - New npm packages
   - Mitigation: Run `npm audit`, check for breaking changes

### Low-Risk Items
1. 🟢 **Documentation** - Multiple CLAUDE.md files
   - Mitigation: Keep all versions, merge manually if conflicts
2. 🟢 **Styling** - Tailwind CSS is additive
   - Mitigation: Standard conflict resolution
3. 🟢 **TypeScript** - Build will catch type errors
   - Mitigation: Fix all TypeScript errors before merging

---

## Communication Plan

### Before Starting
- [ ] Announce merge timeline to team
- [ ] Schedule code freeze window
- [ ] Set up war room (Slack/Discord channel)
- [ ] Assign merge coordinator

### During Merge
- [ ] Post status updates after each phase
- [ ] Document all conflicts and resolutions
- [ ] Keep team informed of blockers
- [ ] Share test results

### After Completion
- [ ] Send completion announcement
- [ ] Share release notes
- [ ] Schedule team demo of new features
- [ ] Gather lessons learned

---

## Alternative Strategies

### Option B: Parallel Integration (Faster but Riskier)
Merge all three branches simultaneously into a dedicated integration branch.

**Pros:**
- Faster completion
- See all conflicts at once

**Cons:**
- Higher complexity
- Harder to debug issues
- More difficult rollback
- Team confusion

**Verdict:** ❌ Not recommended due to high risk

### Option C: Squash Everything (Cleaner History)
Squash each feature branch into a single commit before merging.

**Pros:**
- Clean, linear history
- Easier to understand timeline

**Cons:**
- Loses detailed commit history
- Harder to debug specific changes
- Cannot cherry-pick individual commits

**Verdict:** ⚠️ Optional for Phase 3 only (brand-refresh)

### Option D: Keep Separate Codebases (No Merge)
Maintain three separate branches indefinitely.

**Pros:**
- No merge conflicts
- Each branch stays pristine

**Cons:**
- Features can't work together
- Maintenance nightmare
- Code duplication
- Team confusion

**Verdict:** ❌ Strongly not recommended

---

## Timeline Estimate

### Conservative Timeline (Recommended)
- **Phase 1 (Next.js Migration):** 2-3 days
  - Testing: 1 day
  - Merge & verification: 1 day
  - Documentation: 0.5 day

- **Phase 2 (Takeoff System):** 1-2 days
  - Rebase: 0.5 day
  - Testing: 0.5 day
  - Merge: 0.5 day

- **Phase 3 (Brand Refresh):** 1 day
  - Adaptation: 0.5 day
  - Testing: 0.25 day
  - Merge: 0.25 day

**Total:** 4-6 days

### Aggressive Timeline (Higher Risk)
- **Phase 1:** 1 day
- **Phase 2:** 0.5 day
- **Phase 3:** 0.5 day

**Total:** 2 days

**Recommendation:** Use conservative timeline to ensure quality

---

## Success Metrics

### Definition of Done
- ✅ All three feature branches merged to master
- ✅ Zero failing tests
- ✅ Production build succeeds
- ✅ All features functional in production
- ✅ Documentation updated
- ✅ Team trained on new features

### Quality Gates
- ✅ TypeScript: Zero errors
- ✅ ESLint: Zero critical warnings
- ✅ Test Coverage: >80%
- ✅ Lighthouse Score: >90
- ✅ Build Time: <60 seconds
- ✅ Page Load: <3 seconds

---

## Questions & Answers

### Q: Why not merge all at once?
**A:** The branches have fundamentally different architectures. Next.js migration must come first as it's the foundation for takeoff-system.

### Q: Can we skip brand-refresh?
**A:** Yes, Phase 3 is optional. It's an enhancement, not critical infrastructure.

### Q: What if we want a different order?
**A:** Phase 1 must come first. Phases 2 and 3 could potentially swap if takeoff-system is rebased.

### Q: Should we delete feature branches after merge?
**A:** Keep them for 30 days as backup, then delete. Tag the merge points for reference.

### Q: What about git history cleanliness?
**A:** Use `--no-ff` for merge commits to preserve context. Optionally squash Phase 3.

---

## References

- [Git Branching Best Practices](https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows)
- [Next.js Migration Guide](https://nextjs.org/docs/upgrading)
- [Prisma Migration Guide](https://www.prisma.io/docs/guides/migrate)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-23 | Claude Code | Initial merge strategy |

---

**Next Steps:** Begin Phase 1 (Next.js Migration) merge process.

**Owner:** Development Team
**Reviewers:** Tech Lead, Project Manager
**Approvers:** CTO, Product Owner

---

*This document should be reviewed and updated after each merge phase.*
