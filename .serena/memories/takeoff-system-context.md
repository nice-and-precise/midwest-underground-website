# Takeoff & Estimating System - System Context

**Created:** 2025-11-22
**Project:** Takeoff & Estimating System for Midwest Underground
**Architecture:** Static HTML/CSS/JavaScript integrating with existing dashboard
**Status:** Phase 0 - Platform Scaffolding

---

## Project Overview

Building a comprehensive construction takeoff and estimating system that integrates with the existing HDD operations platform. The system enables:

- PDF plan viewing with measurement tools
- Quantity calculations for HDD, fiber, trenching
- Cost estimation with labor, equipment, materials, subs
- Professional proposal generation
- 3D bore path visualization
- Historical project analysis
- Change order management
- Client portal for approvals and file sharing

---

## Architecture

### Tech Stack
- **Frontend:** Static HTML, CSS, JavaScript (no build tools)
- **Libraries:** PDF.js, Fabric.js, jsPDF, Chart.js, Three.js
- **Data:** Client-side JSON files (`dashboard/api/data/*.json`)
- **Testing:** Puppeteer (Playwright) E2E tests
- **Integration:** Coexists with Next.js HDD app (`src/app/`)

### File Structure
```
dashboard/
├── takeoff.html              # Module 1.1 - PDF viewer
├── cost-database.html        # Module 2.1 - Cost item CRUD
├── estimates.html            # Module 2.2 - Estimate builder
├── proposals.html            # Module 2.3 - Proposal generator
├── bore-visualizer.html      # Module 3.1 - 3D visualization
├── historical.html           # Module 3.2 - Historical database
├── change-orders.html        # Module 3.3 - Change order workflow
├── js/
│   ├── pdf-viewer.js
│   ├── measurement-tools.js
│   ├── quantity-calculator.js
│   ├── estimate-builder.js
│   └── ...
├── css/
│   ├── takeoff.css
│   └── ...
└── api/data/
    ├── takeoffs.json
    ├── cost-items.json
    ├── estimates.json
    └── ...
```

---

## Execution Framework

### Multi-Agent Orchestration

**Four Roles Per Module:**
1. **PLANNER** - Breaks module into 5-15 atomic tasks, identifies risks
2. **IMPLEMENTER** - Executes tasks, commits frequently, validates in sandbox
3. **TESTER** - Writes E2E tests, runs regression, documents results
4. **DOC** - Documents implementation, limitations, usage examples

**Cycle:** PLANNER → IMPLEMENTER → TESTER → DOC → COMPLETE

### Serena Memory Structure

**Primary Memories:**
- `takeoff-system-context` (this file) - High-level system state
- `takeoff-progress-tracker` - Current module and progress
- `takeoff-module-[ID]-state` - Per-module detailed state

**Update Frequency:** After every atomic task completion

---

## Current State

**Phase:** Phase 0 - Platform & Multi-Agent Scaffolding
**Current Module:** P0.1 - Repo context and docs skeleton
**Next Module:** P0.2 - Serena memory wiring
**Total Modules:** 15 (3 in P0, 4 in P1, 4 in P2, 4 in P3)
**Completed Modules:** 0

**Infrastructure Status:**
- ✅ Architecture documented (`.claude/takeoff-system.md`)
- ✅ Role prompts created (`.claude/roles/PLANNER|IMPLEMENTER|TESTER|DOC.md`)
- ✅ Serena MCP connected
- ✅ Docker MCP connected (102 tools available)
- ⏳ Serena memory entities (creating now)
- ⏳ Docs skeleton (pending)
- ⏳ Module specifications (pending)
- ⏳ Autonomous entry point (pending)

---

## MCP Servers Available

**Serena MCP:** ✅ Connected
- Memory management (write_memory, read_memory, list_memories)
- Code navigation (find_symbol, find_file, search_for_pattern)
- Symbol editing (replace_symbol_body, insert_after_symbol)

**Docker MCP:** ✅ Connected (102 tools)
- **Playwright:** browser_* tools for E2E testing
- **Git:** git_* tools for version control
- **Memory:** Knowledge graph for complex state
- **Redis:** Caching and performance
- **Sequential Thinking:** Planning support
- **Code Execution:** Sandbox for validation
- **Docker CLI:** Container management

---

## Integration Points

### Existing Platform
- **Next.js App** (`src/app/`) - HDD operations, DO NOT MODIFY
- **Dashboard** (`dashboard/*.html`) - Legacy static pages, COEXIST
- **Navigation:** Add takeoff links to existing nav structure
- **Styles:** Reuse dashboard CSS variables and classes
- **Data:** Keep takeoff data separate in `api/data/`

### Dependencies
- No backend required (static HTML/JS)
- No build tools needed (vanilla JavaScript)
- CDN libraries (PDF.js, Fabric.js, etc.)
- Browser-native APIs (FileReader, Canvas, etc.)

---

## Key Constraints

**MUST:**
- Use only static HTML/CSS/JavaScript
- Store data in JSON files (no database)
- Follow existing dashboard patterns
- Write E2E tests for all modules
- Update Serena after every task
- Create micro-commits

**MUST NOT:**
- Modify Next.js app (`src/app/`)
- Add build tools or bundlers
- Create backend APIs
- Break existing dashboard functionality
- Load entire codebase (use targeted reads)
- Skip testing or documentation

---

## Success Metrics

**By Phase 0 Complete (3 modules):**
- Serena memory structure established
- 15 module specs written
- Test harness validated
- Autonomous execution verified

**By Phase 1 Complete (4 modules):**
- PDF viewing with zoom/pan/navigate
- Measurement tools (linear, area, count) functional
- Quantities calculating correctly
- Export to CSV/JSON working
- 10+ E2E tests passing

**By Phase 2 Complete (4 modules):**
- Cost database CRUD operational
- Estimates generating with production rates
- PDF proposals with branding
- Dashboard integration complete

**By Phase 3 Complete (4 modules):**
- 3D bore visualization working
- Historical project search functional
- Change order workflow operational
- Client portal authenticated

**Overall (15 modules):**
- All modules marked completed in Serena
- 100+ E2E tests passing
- Build passing (0 errors)
- Production-ready for deployment

---

## Session Entry Protocol

**For Autonomous Execution:**

1. Read `.claude/takeoff-system.md` (architecture)
2. Read `serena:/takeoff-system-context` (this file)
3. Read `serena:/takeoff-progress-tracker` (find current module)
4. Load current module spec from `docs/takeoff/modules/{phase}/{module}.md`
5. Determine role based on module status
6. Execute role responsibilities
7. Update Serena and progress log
8. Move to next task or module

**Token Budget:** < 150K tokens per session
- Always load: 5K tokens (system docs)
- On demand: 15K tokens (implementation context)
- Never: Full codebase, all history

---

**Last Updated:** 2025-11-22
**Next Update:** When module P0.1 begins planning
