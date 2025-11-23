<!-- TOC -->

## Table of Contents

  - [📋 Quick Start (< 2 minutes)](#quick-start-2-minutes)
- [Should show: On branch feat/takeoff-system](#should-show-on-branch-feattakeoff-system)
  - [✅ What's Complete (Session Summary)](#whats-complete-session-summary)
    - [Phase 0: Platform Scaffolding (100% Complete)](#phase-0-platform-scaffolding-100-complete)
  - [🎯 Module 1.1 - PDF Plan Viewer (NEXT)](#module-11-pdf-plan-viewer-next)
    - [Overview](#overview)
    - [Key Components to Build](#key-components-to-build)
    - [Technical Requirements](#technical-requirements)
    - [Dependencies](#dependencies)
    - [Enables](#enables)
  - [🧠 Serena MCP State](#serena-mcp-state)
  - [📚 Essential Documents (Load Order)](#essential-documents-load-order)
  - [🔄 Autonomous Execution Workflow](#autonomous-execution-workflow)
    - [Role: PLANNER (15-20 min)](#role-planner-15-20-min)
    - [Role: IMPLEMENTER (60-90 min)](#role-implementer-60-90-min)
    - [Role: TESTER (30-45 min)](#role-tester-30-45-min)
    - [Role: DOC (15-20 min)](#role-doc-15-20-min)
  - [🛠️ Development Environment](#development-environment)
- [Opens http://localhost:3000](#opens-httplocalhost3000)
- [Run all takeoff tests](#run-all-takeoff-tests)
- [Run specific test](#run-specific-test)
- [Debug mode](#debug-mode)
  - [⚠️ Critical Constraints](#critical-constraints)
  - [📊 Success Metrics](#success-metrics)
  - [🚀 Multi-Agent Best Practices](#multi-agent-best-practices)
  - [💡 Tips for Next Session](#tips-for-next-session)
  - [🎬 Ready to Begin!](#ready-to-begin)
  - [📞 Contact Info](#contact-info)

<!-- /TOC -->

# 🚀 Next Session - Module 1.1 PDF Plan Viewer

**Last Updated:** 2025-11-22
**Session Type:** Module 1.1 - First feature implementation
**Phase:** Phase 1 - Takeoff Core (0/4 complete)

---

## 📋 Quick Start (< 2 minutes)

**1. Navigate to project:**
```bash
cd C:\Users\Owner\Desktop\midwest-underground-website
```

**2. Verify branch:**
```bash
git status
# Should show: On branch feat/takeoff-system
```

**3. Start autonomous execution:**
```bash
claude --dangerously-skip-permissions "Continue with Module 1.1"
```

The system will automatically:
- Read CLAUDE-TAKEOFF.md (entry point)
- Query Serena progress tracker (identifies Module 1.1)
- Load Module 1.1 spec
- Execute PLANNER role
- Launch multi-agent IMPLEMENTER team
- Complete TESTER and DOC roles

---

## ✅ What's Complete (Session Summary)

### Phase 0: Platform Scaffolding (100% Complete)

**Module P0.1 - Repo Context and Docs Skeleton** ✅
- 27 files created (250 KB documentation)
- 15 module specifications
- Architecture, memory, and testing docs
- Multi-agent execution: 10x speedup

**Module P0.2 - Serena Memory Wiring** ✅
- 9 Serena memories created
- Memory persistence validated
- State tracking operational
- Integration tests passing

**Module P0.3 - Sandbox and Test Harness** ✅
- Playwright v1.56.1 installed
- 3 sample tests created
- 1,077 lines of testing conventions
- 7 test execution scripts
- Multi-agent execution: 1.8x speedup

**Total Phase 0 Deliverables:**
- Files Created: 30+
- Documentation: ~8,000 lines
- Serena Memories: 9
- Tests: 3 E2E samples
- Commits: 1 major (ed27720)
- Multi-Agent Deployments: 9 agents

---

## 🎯 Module 1.1 - PDF Plan Viewer (NEXT)

### Overview
First feature module - implements PDF viewing with zoom, pan, and navigation.

**Spec Location:** `docs/takeoff/modules/phase-1/1.1-pdf-viewer.md`

### Key Components to Build

**1. HTML Page:** `dashboard/takeoff.html`
- PDF upload section
- Canvas container for rendering
- Zoom controls (+/- buttons, fit-to-width)
- Page navigation (prev/next, jump to page)
- Loading indicators

**2. JavaScript Module:** `dashboard/js/pdf-viewer.js`
- PDF.js library integration (CDN)
- File upload handling
- PDF document loading
- Canvas rendering
- Zoom functionality (25% - 400%)
- Pan/scroll controls
- Page navigation

**3. CSS Styles:** `dashboard/css/takeoff.css`
- Layout for PDF viewer
- Controls styling
- Responsive design
- Loading states

### Technical Requirements

**Libraries:**
- PDF.js v3.11+ (CDN)
- No build tools (vanilla JavaScript)

**Browser Support:**
- Chrome 120+
- Firefox 120+
- Edge 120+

**Features:**
- Upload PDF from local file
- Render all pages
- Zoom: 25%, 50%, 75%, 100%, 150%, 200%, 400%
- Fit to width button
- Page navigation (first/prev/next/last)
- Current page indicator
- Total page count display

### Dependencies
- None (first module in Phase 1)
- Uses infrastructure from Phase 0

### Enables
- Module 1.2 (Measurement Tools) - needs canvas overlay
- Module 1.3 (Quantity Calculator) - needs measurement data
- Module 1.4 (Export/Persistence) - needs data to save

---

## 🧠 Serena MCP State

**Primary Memories:**
1. `takeoff-system-context` - High-level system state
2. `takeoff-progress-tracker` - Shows Module 1.1 next
3. `takeoff-module-P0.1-state` - Complete
4. `takeoff-module-P0.2-state` - Complete
5. `takeoff-module-P0.3-state` - Complete

**Query at Session Start:**
```javascript
// Check what's next
serena:/takeoff/progress_tracker
// Should show: Module 1.1, Status: not_started, Role: planner

// Load module state
serena:/takeoff/module_1.1/state
// Will be created during planning
```

---

## 📚 Essential Documents (Load Order)

**Must Read (< 10K tokens):**
1. `CLAUDE-TAKEOFF.md` - Entry point, autonomous execution guide
2. `.claude/takeoff-system.md` - Architecture and constraints
3. `docs/takeoff/modules/phase-1/1.1-pdf-viewer.md` - Module spec
4. `serena:/takeoff/progress_tracker` - Current status

**Reference (On Demand):**
5. `docs/takeoff/TESTING-CONVENTIONS.md` - Testing standards
6. `docs/takeoff/ARCHITECTURE.md` - System architecture
7. `.claude/roles/PLANNER.md` - PLANNER role instructions

**Never Load:**
- Entire codebase
- All module specs at once
- Full progress history
- Unrelated Next.js app code

---

## 🔄 Autonomous Execution Workflow

### Role: PLANNER (15-20 min)

**Actions:**
1. Read Module 1.1 spec
2. Break into 8-12 atomic tasks
3. Identify risks and dependencies
4. Create `.claude/plans/module-1.1-plan.md`
5. Update Serena module state (status: "planned")
6. Update progress tracker

**Deliverable:** Detailed implementation plan

---

### Role: IMPLEMENTER (60-90 min)

**Multi-Agent Strategy:**
- Agent 1: Create dashboard/takeoff.html (20 min)
- Agent 2: Implement dashboard/js/pdf-viewer.js (40 min)
- Agent 3: Style with dashboard/css/takeoff.css (20 min)
- Agent 4: Integration and testing (30 min)

**Total:** ~60 min parallel (vs 110 min sequential - 1.8x speedup)

**Actions per Task:**
1. Execute task from plan
2. Commit micro-commit
3. Update Serena module state
4. Update progress log
5. Move to next task

**Deliverable:** Working PDF viewer

---

### Role: TESTER (30-45 min)

**Actions:**
1. Create `tests/takeoff/pdf-viewer.spec.js`
2. Test scenarios:
   - Upload PDF successfully
   - Render all pages
   - Zoom in/out
   - Navigate between pages
   - Fit to width
3. Run tests: `npm run test:e2e:takeoff`
4. Update `docs/takeoff/TESTING.md`
5. Update Serena module state

**Deliverable:** Passing E2E tests

---

### Role: DOC (15-20 min)

**Actions:**
1. Add Implementation Notes to module spec
2. Document Known Limitations
3. Add Usage Examples
4. Update `docs/takeoff/PROGRESS.md`
5. Mark Serena module state as "completed"
6. Update progress tracker to Module 1.2

**Deliverable:** Complete documentation

---

## 🛠️ Development Environment

**Prerequisites:**
- Node.js 18+ ✅ (installed)
- npm ✅ (installed)
- Playwright ✅ (configured)
- Git ✅ (on feat/takeoff-system branch)

**Development Server:**
```bash
npm run dev
# Opens http://localhost:3000
```

**Testing:**
```bash
# Run all takeoff tests
npm run test:e2e:takeoff

# Run specific test
npx playwright test tests/takeoff/pdf-viewer.spec.js

# Debug mode
npm run test:e2e:debug
```

**File Locations:**
```
dashboard/
├── takeoff.html          # New file (Module 1.1)
├── js/
│   └── pdf-viewer.js     # New file (Module 1.1)
└── css/
    └── takeoff.css       # New file (Module 1.1)

tests/takeoff/
└── pdf-viewer.spec.js    # New file (Module 1.1)
```

---

## ⚠️ Critical Constraints

**MUST:**
- Use only static HTML/CSS/JavaScript (no build tools)
- Integrate PDF.js via CDN (no npm install)
- Follow existing dashboard patterns
- Update Serena after every task
- Create micro-commits (one per task)
- Write E2E tests

**MUST NOT:**
- Modify Next.js app (`src/app/`)
- Add build tools or bundlers
- Create backend APIs
- Break existing functionality
- Skip testing or documentation

---

## 📊 Success Metrics

**Module 1.1 Complete When:**
- [ ] dashboard/takeoff.html created with PDF viewer UI
- [ ] dashboard/js/pdf-viewer.js implemented with all features
- [ ] dashboard/css/takeoff.css styled responsively
- [ ] PDF.js integrated via CDN
- [ ] All zoom levels working (25% - 400%)
- [ ] Page navigation functional
- [ ] File upload working
- [ ] E2E tests passing (5+ test cases)
- [ ] No console errors
- [ ] Documentation complete
- [ ] Serena module state = "completed"

---

## 🚀 Multi-Agent Best Practices

**From Phase 0 Learnings:**

1. **Clear Task Boundaries** - Each agent owns distinct files
2. **Serena Coordination** - Share state via Serena MCP
3. **Parallel Execution** - Launch 3-4 agents for independent tasks
4. **Micro-Commits** - Commit after each atomic task
5. **Progress Updates** - Update Serena + PROGRESS.md frequently

**Expected Speedup:**
- Planning: 1x (sequential, single agent)
- Implementation: 1.5-2x (3-4 parallel agents)
- Testing: 1x (sequential, single agent)
- Documentation: 1x (sequential, single agent)
- **Overall: 1.3-1.5x** for full module

---

## 💡 Tips for Next Session

**Token Management:**
- Budget: 200K tokens total
- Module 1.1 estimate: 85-125K tokens
- Leaves 75-115K tokens buffer
- Expect to complete Module 1.1 fully

**If You Get Stuck:**
1. Check Serena module state for context
2. Read module spec again
3. Review Phase 0 patterns (docs skeleton, testing conventions)
4. Ask user if truly blocked

**Quality Gates:**
- All features from spec implemented ✅
- Tests passing ✅
- No console errors ✅
- Documentation updated ✅
- Serena state = "completed" ✅

---

## 🎬 Ready to Begin!

**Start Command:**
```bash
cd C:\Users\Owner\Desktop\midwest-underground-website
claude --dangerously-skip-permissions "Continue with Module 1.1"
```

**The system will handle the rest autonomously!**

---

## 📞 Contact Info

**Questions About:**
- Architecture: See `.claude/takeoff-system.md`
- Current state: Query `serena:/takeoff/progress_tracker`
- Role details: See `.claude/roles/{ROLE}.md`
- Testing: See `docs/takeoff/TESTING-CONVENTIONS.md`

---

**Last Session Commit:** ed27720
**Branch:** feat/takeoff-system
**Status:** Clean working tree, ready for Module 1.1
**Phase 0:** 100% complete ✅
**Phase 1:** Ready to start

**Good luck! 🚀**
