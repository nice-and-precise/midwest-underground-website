# Next Session: Module 1.2 - Basic Measurement Tools

**Module:** 1.2 - Basic Measurement Tools
**Status:** not_started
**Next Role:** PLANNER
**Previous Module:** 1.1 - PDF Plan Viewer (completed ✅)

---

## Context Loading (ALWAYS START HERE)

**IMPORTANT:** Load context using Serena MCP before starting work:

```bash
# Activate project
mcp__serena__activate_project midwest-underground-website

# Load checkpoint memory (quick recovery)
mcp__serena__read_memory session-checkpoint-2025-11-22-module-1.1

# Load module state
mcp__serena__read_memory takeoff-module-1.1-state

# Load progress tracker
mcp__serena__read_memory takeoff-progress-tracker

# List all available memories if needed
mcp__serena__list_memories
```

---

## Quick Start for Next Session

```
work in C:\Users\Owner\Desktop\midwest-underground-website\

Execute Module 1.1 Completion:
1. Apply permanent deployment fix (git mv files to public/)
2. Run 21 E2E tests and verify all pass
3. Complete documentation (DOC role)
4. Mark module as "completed"

Then Begin Module 1.2:
- Role: PLANNER
- Task: Create implementation plan for measurement tools
- Integration: Overlay on Module 1.1 PDF viewer
```

---

## Module 1.1 Completion Tasks

### Task 1: Apply Permanent Deployment Fix (5 min)

```bash
cd /c/Users/Owner/Desktop/midwest-underground-website

# Move files to public directory (permanent fix)
git mv dashboard/takeoff.html public/dashboard/
git mv dashboard/css/takeoff.css public/dashboard/css/
git mv dashboard/js/pdf-viewer.js public/dashboard/js/

# Verify files moved
ls -la public/dashboard/takeoff.html
ls -la public/dashboard/css/takeoff.css
ls -la public/dashboard/js/pdf-viewer.js

# Commit the fix
git commit -m "fix(takeoff): Move PDF viewer files to public directory for Next.js serving

Resolves deployment issue where Next.js couldn't serve files from dashboard/ directory.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push origin feat/takeoff-system
```

### Task 2: Run E2E Tests (10-15 min)

```bash
# Run all 21 PDF viewer tests
npm run test:e2e -- tests/takeoff/pdf-viewer.spec.js --project=chromium --reporter=list

# Expected: 21/21 tests passing (45-90 seconds)

# Generate HTML report
npm run test:e2e:report
```

### Task 3: Complete Documentation (15-20 min)

Update Serena memories to mark module complete:

```bash
# Update module state
mcp__serena__edit_memory takeoff-module-1.1-state
# Change: Status: tested → completed
# Change: Current Role: doc → null

# Update progress tracker
mcp__serena__edit_memory takeoff-progress-tracker
# Change: Module 1.1 status to "completed ✅"
# Change: Phase 1 progress to "1/4 complete (25%)"
```

---

## Module 1.2 Planning

Once Module 1.1 is complete, begin PLANNER role for Module 1.2:

**Objective:** Create implementation plan for basic measurement tools

**Key Requirements:**
- Overlay Fabric.js canvas on PDF viewer (Module 1.1)
- Implement measurement tools (line, area, count)
- Calculate quantities based on scale
- Display measurement data
- Save/load measurements per page

**Estimated Tasks:** 10-15 tasks
**Estimated Time:** 3-4 hours

**Plan Output:** `.claude/plans/module-1.2-plan.md`

---

## Success Checklist

Module 1.1 Complete:
- [ ] Files moved to public/dashboard/ with git mv
- [ ] Deployment fix committed and pushed
- [ ] 21/21 E2E tests passing
- [ ] Module spec updated with implementation notes
- [ ] Serena memories updated (status = "completed")
- [ ] Ready for Module 1.2

Module 1.2 Planning:
- [ ] Read module spec: `docs/takeoff/modules/phase-1/1.2-measurement-tools.md`
- [ ] Analyze integration with Module 1.1
- [ ] Create implementation plan
- [ ] Document risks and dependencies
- [ ] Update Serena state to "planned"

---

**Current Commit:** `f55ba38`
**Branch:** `feat/takeoff-system`
**Next Module:** 1.2 - Basic Measurement Tools
**Timeline:** 35-45 minutes to complete Module 1.1, then begin Module 1.2 planning
