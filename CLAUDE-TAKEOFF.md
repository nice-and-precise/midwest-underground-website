# 🚀 Takeoff System - Autonomous Session Entry Point

**⚠️ START HERE for all takeoff system work**

**Project:** Midwest Underground - Takeoff & Estimating System
**Branch:** `feat/takeoff-system`
**Status:** In Development
**Last Updated:** 2025-11-22

---

## 🎯 Quick Start for Autonomous Execution

**If you're a new Claude Code session, follow these steps:**

### 1. Read Architecture (< 2 minutes)
```
Read: .claude/takeoff-system.md (architecture and constraints)
```

### 2. Query Serena for Current State (< 1 minute)
```
serena:/takeoff-system-context (high-level system state)
serena:/takeoff-progress-tracker (find current module)
```

### 3. Determine Current Module and Role
The progress tracker will tell you:
- **Current Module ID** (e.g., "P0.1")
- **Module Status** (not_started, planned, implemented, tested, completed)
- **Next Role** (planner, implementer, tester, doc)

### 4. Load Role Instructions
```
Read: .claude/roles/{ROLE}.md (PLANNER, IMPLEMENTER, TESTER, or DOC)
```

### 5. Execute Your Role
Follow the role's instructions autonomously.

### 6. Update and Continue
After completing your role:
- Update Serena module state
- Update docs/takeoff/PROGRESS.md
- Move to next role or next module

---

## 📚 Essential Documents (Load These First)

**Always Load (< 5K tokens):**
1. `.claude/takeoff-system.md` - Architecture, constraints, execution framework
2. `serena:/takeoff-system-context` - Current system state
3. `serena:/takeoff-progress-tracker` - Current module and next steps
4. This file (CLAUDE-TAKEOFF.md) - Entry point guide

**Load for Current Module Only:**
5. `serena:/takeoff-module-{ID}/state` - Detailed module state
6. `docs/takeoff/modules/phase-{N}/{module}.md` - Module specification
7. `.claude/roles/{ROLE}.md` - Current role instructions

**Load on Demand (< 15K tokens):**
- `.claude/plans/{module}-plan.md` - If you're IMPLEMENTER or later
- `docs/takeoff/PROGRESS.md` (last 50 lines) - Recent progress
- Existing code files (targeted reads only, use Serena navigation)

**NEVER Load:**
- Entire codebase
- All module specs
- Full progress history
- All documentation at once

---

## 🔄 Autonomous Execution Cycle

```
┌─────────────────────────────────────────┐
│  1. Read Architecture & Query Serena    │
│     (Understand current state)          │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│  2. Determine Module & Role             │
│     (What needs to be done?)            │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│  3. Execute Role Responsibilities       │
│     PLANNER    → Create plan            │
│     IMPLEMENTER→ Write code             │
│     TESTER     → Write & run tests      │
│     DOC        → Document implementation│
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│  4. Update Serena & Progress Log        │
│     (Record what was accomplished)      │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│  5. Move to Next Role or Module         │
│     (Continue autonomously)             │
└───────────────┬─────────────────────────┘
                │
                └──► Repeat until all 15 modules complete
```

---

## 🧠 Serena Memory Structure

**Source of Truth:** All state lives in Serena MCP

### Primary Memories

1. **`serena:/takeoff-system-context`**
   - High-level system state
   - Current phase, completed modules
   - Integration notes

2. **`serena:/takeoff-progress-tracker`**
   - Current module ID
   - Next module ID
   - Per-module status map
   - Blockers list

3. **`serena:/takeoff-module-{ID}/state`**
   - Per-module detailed state
   - Plan path, files created/modified
   - Tasks completed, commits made
   - Testing results

**Update After:** Every atomic task completion, role transition, module completion

---

## 📋 The 15 Modules

### Phase 0: Platform Scaffolding (3 modules)
- **P0.1** - Repo context and docs skeleton
- **P0.2** - Serena memory wiring
- **P0.3** - Sandbox and test harness wiring

### Phase 1: Takeoff Core (4 modules)
- **1.1** - PDF plan viewer
- **1.2** - Basic measurement tools
- **1.3** - Quantity calculator
- **1.4** - Data export and persistence

### Phase 2: Estimating Engine (4 modules)
- **2.1** - Cost database
- **2.2** - Estimate builder
- **2.3** - Proposal generator
- **2.4** - Dashboard integration

### Phase 3: Advanced Features (4 modules)
- **3.1** - 3D bore path visualizer
- **3.2** - Historical project database
- **3.3** - Change order management
- **3.4** - Client portal

**Total:** 15 modules

---

## 🛠️ MCP Tools Available

**Serena MCP:** ✅ Connected
- Memory: `write_memory`, `read_memory`, `list_memories`
- Navigation: `find_symbol`, `find_file`, `search_for_pattern`
- Editing: `replace_symbol_body`, `insert_after_symbol`

**Docker MCP:** ✅ Connected (102 tools)
- **Playwright:** `browser_*` tools for E2E testing
- **Git:** `git_*` tools for version control
- **Memory:** Knowledge graph operations
- **Redis:** Caching and performance
- **Sequential Thinking:** Planning support
- **Code Execution:** Sandbox testing

**Use Them Liberally:** The tools are there to help you work autonomously!

---

## 🎨 Development Environment

**Web Dashboard:** http://localhost:3000
- Access existing Next.js HDD app
- Test takeoff system pages as they're built

**Development Server:**
- Running in background (started by setup)
- Auto-reloads on file changes
- Use for manual testing during implementation

**Code Location:**
```
dashboard/               # Takeoff system files (static HTML/JS)
├── takeoff.html        # Module 1.1
├── cost-database.html  # Module 2.1
├── estimates.html      # Module 2.2
└── js/                 # JavaScript modules
    ├── pdf-viewer.js
    ├── measurement-tools.js
    └── ...
```

---

## ✅ Current Status

**Infrastructure:** ✅ Complete
- Architecture documented
- Role prompts created (4 roles)
- Serena memories initialized (3 core + 1 module state)
- Docs skeleton created
- Development server running

**Next Action:** Begin Module P0.1
**Next Role:** PLANNER
**Blocker Status:** None

---

## 🚫 Critical Constraints

**MUST:**
- ✅ Use only static HTML/CSS/JavaScript (no build tools)
- ✅ Store data in JSON files (`dashboard/api/data/`)
- ✅ Update Serena after every atomic task
- ✅ Create micro-commits (one per task)
- ✅ Write E2E tests for all modules (except docs modules)
- ✅ Follow existing dashboard patterns

**MUST NOT:**
- ❌ Modify Next.js app (`src/app/`)
- ❌ Add build tools or bundlers
- ❌ Create backend APIs
- ❌ Break existing dashboard functionality
- ❌ Load entire codebase (use targeted reads)
- ❌ Skip Serena updates
- ❌ Skip testing or documentation

---

## 💡 Best Practices for Autonomous Sessions

### Token Management
- **Budget:** < 150K tokens per session
- **Always Load:** 5K (architecture + Serena)
- **On Demand:** 15K (current module context)
- **Never:** Full codebase, all history

### Work Style
- **Small commits:** After each atomic task
- **Update frequently:** Serena + Progress after every task
- **Test incrementally:** Validate in sandbox before committing
- **Stay focused:** One module at a time
- **Document blockers:** If stuck, record in Serena and ask user

### Role Transitions
- **PLANNER → IMPLEMENTER:** After plan created
- **IMPLEMENTER → TESTER:** After all tasks complete
- **TESTER → DOC:** After tests pass (or documented failures)
- **DOC → COMPLETE:** After documentation added
- **COMPLETE → NEXT MODULE:** Update progress tracker

---

## 🆘 If You Get Stuck

### Blocker Protocol

1. **Document in Serena:**
```javascript
serena:/takeoff-module-{ID}/state
{
  ...existing,
  blockers: [{
    task: {number},
    issue: "{description}",
    attempted: ["{what_you_tried}"],
    needs: "{what's_needed_to_unblock}"
  }]
}
```

2. **Update Progress Log:**
```markdown
---
## {TIMESTAMP} - Blocker Encountered

**Module:** {ID}
**Task:** {N}
**Issue:** {description}
**Status:** Awaiting user input / Investigating
---
```

3. **Ask User:** If truly blocked after trying alternatives

---

## 📊 Success Metrics

**By Phase 0 Complete:**
- 3 modules documented
- Serena memory wiring validated
- Test harness operational

**By Phase 1 Complete:**
- PDF viewer functional
- Measurements working
- Quantities calculating
- 10+ E2E tests passing

**By All Phases Complete:**
- 15 modules marked complete in Serena
- 100+ E2E tests passing
- Build passing (0 console errors)
- Production-ready

---

## 🎬 Ready to Begin?

**Your next steps:**

1. ✅ You've read this file
2. ⏭️ Read `.claude/takeoff-system.md` (architecture)
3. ⏭️ Query `serena:/takeoff-progress-tracker`
4. ⏭️ Read `.claude/roles/PLANNER.md`
5. ⏭️ Begin planning Module P0.1

**Let's build this system autonomously! 🚀**

---

**Questions?**
- Architecture: See `.claude/takeoff-system.md`
- Current state: Query Serena
- Role details: See `.claude/roles/{ROLE}.md`
- User: Ask if truly blocked

---

**Last Updated:** 2025-11-22
**Status:** ✅ Ready for autonomous execution
**Next:** Module P0.1 - PLANNER role
