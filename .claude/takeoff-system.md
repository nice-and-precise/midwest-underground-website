# Midwest Underground - Takeoff & Estimating System Architecture

**Branch:** `feat/takeoff-system`
**Base Directory:** `dashboard/`
**Tech Stack:** Static HTML/CSS/JavaScript (PDF.js, Fabric.js, jsPDF, Chart.js)
**Data Storage:** Client-side JSON files (`dashboard/api/data/*.json`)
**Coexists With:** Next.js HDD Operations App (`src/app/`)

---

## Project Overview

This is a **construction takeoff and estimating system** for Midwest Underground's HDD (Horizontal Directional Drilling) operations. It enables:

- Uploading PDF construction plans
- Measuring quantities (linear feet, areas, counts)
- Building cost estimates from measured quantities
- Generating professional proposals
- Managing historical project data
- Tracking change orders

The system is built as **static HTML pages** that integrate into the existing dashboard alongside the Next.js HDD operations app.

---

## System Architecture

### Three Coexisting Systems

```
midwest-underground-website/
├── src/app/              # System 1: Next.js HDD Operations (COMPLETE)
│   ├── api/              # 32 RESTful endpoints
│   ├── auth/             # NextAuth v5
│   └── dashboard/        # 21 React pages
│
├── dashboard/            # System 2: Legacy Static Dashboard (EXISTING)
│   ├── *.html            # Existing static pages
│   ├── js/               # Vanilla JavaScript
│   └── css/              # Dashboard styles
│
└── dashboard/            # System 3: Takeoff & Estimating (NEW - THIS PROJECT)
    ├── takeoff.html      # PDF viewer with measurement tools
    ├── estimates.html    # Estimate builder
    ├── cost-database.html # Cost item management
    ├── proposals.html    # Proposal generator
    ├── bore-visualizer.html   # 3D bore path visualization
    ├── historical.html   # Historical project database
    ├── change-orders.html # Change order management
    │
    ├── js/
    │   ├── pdf-viewer.js          # PDF.js integration
    │   ├── measurement-tools.js   # Fabric.js overlay tools
    │   ├── quantity-calculator.js # Quantity aggregation
    │   ├── takeoff-export.js      # Save/load/export
    │   ├── cost-database.js       # Cost item CRUD
    │   ├── estimate-builder.js    # Estimate calculations
    │   ├── proposal-generator.js  # jsPDF templates
    │   ├── bore-visualizer.js     # 3D visualization
    │   ├── historical.js          # Search/similarity
    │   └── change-orders.js       # CO workflow
    │
    ├── api/data/
    │   ├── takeoffs.json      # Saved takeoffs
    │   ├── cost-items.json    # Cost database
    │   ├── estimates.json     # Estimates
    │   ├── proposals.json     # Proposal data
    │   ├── bore-paths.json    # Bore profiles
    │   └── change-orders.json # Change orders
    │
    └── templates/
        └── proposal-template.js # PDF proposal layout
```

---

## Development Phases

### Phase 0: Scaffolding (3 modules)
- **P0.1** - Repository context and documentation skeleton
- **P0.2** - Serena memory wiring
- **P0.3** - Sandbox and test harness setup

### Phase 1: Takeoff Core (4 modules)
- **1.1** - PDF plan viewer (upload, zoom, navigate)
- **1.2** - Basic measurement tools (scale, linear, HDD, fiber)
- **1.3** - Quantity calculator (totals by category, live updates)
- **1.4** - Data export and persistence (JSON, CSV, PDF)

### Phase 2: Estimating Engine (4 modules)
- **2.1** - Cost database (CRUD for labor, equipment, materials, subs)
- **2.2** - Estimate builder (map quantities to costs, calculate totals)
- **2.3** - Proposal generator (branded PDF proposals)
- **2.4** - Dashboard integration (show takeoff/estimate status on existing pages)

### Phase 3: Advanced Features (4 modules)
- **3.1** - 3D bore path visualizer (depth, angle, collision detection)
- **3.2** - Historical project database (search, compare, suggest similar)
- **3.3** - Change order management (create, track, impact calculations)
- **3.4** - Client portal (login, view projects/proposals, upload files)

**Total Modules:** 15 (3 scaffolding + 12 features)

---

## Tech Stack Details

### Core Libraries

| Library | Purpose | CDN/Local |
|---------|---------|-----------|
| **PDF.js** | PDF rendering and navigation | CDN |
| **Fabric.js** | Canvas overlay for measurements | CDN |
| **jsPDF** | PDF generation for proposals | CDN |
| **Chart.js** | Charts and visualizations (already used) | CDN |
| **Three.js** | 3D bore path visualization (Phase 3) | CDN |

### Data Storage Strategy

**Client-Side JSON Files:**
- Simple, no backend required
- Works with existing static dashboard
- Easy to backup and export
- Files stored in `dashboard/api/data/`

**Format:**
```javascript
// dashboard/api/data/takeoffs.json
{
  "takeoffs": [
    {
      "id": "uuid",
      "projectId": "project-123",
      "name": "Main Street Fiber Install",
      "pdfUrl": "path/to/uploaded.pdf",
      "scale": { "pixels": 100, "realWorld": 50, "units": "feet" },
      "measurements": [
        {
          "type": "linear",
          "category": "HDD",
          "points": [[x1,y1], [x2,y2]],
          "length": 450.5,
          "units": "feet",
          "label": "Bore Path 1"
        }
      ],
      "quantities": {
        "HDD": 450.5,
        "fiber": 450.5,
        "trench": 125.0
      },
      "createdAt": "2025-11-22T10:00:00Z",
      "updatedAt": "2025-11-22T11:30:00Z"
    }
  ]
}
```

---

## Integration Points

### With Next.js HDD App

**Shared Data:**
- Projects (from Next.js API) can be linked to takeoffs
- User authentication (can use existing NextAuth session)
- Photos uploaded via Next.js can attach to takeoffs

**Separation:**
- Takeoff system is **read-only** for Next.js data
- Links via `projectId` references
- No direct database writes from static pages

### With Legacy Dashboard

**Shared:**
- Dashboard layout and styles (`dashboard/css/dashboard.css`)
- Chart.js library
- Navigation sidebar

**New:**
- Takeoff-specific pages
- New JavaScript modules
- New API data files

---

## Autonomous Development Strategy

### Multi-Agent Orchestration Model

Each module follows this workflow:

1. **Planner** - Reads spec, creates 5-10 atomic tasks in `.claude/plans/module-{ID}-plan.md`
2. **Implementer** - Executes tasks, updates code, runs sandbox tests
3. **Tester** - Adds Playwright tests, runs them, records results
4. **Doc** - Updates documentation, decisions, progress

### Memory & Context Model

**Three Knowledge Layers:**

1. **Live Context** (current Claude Code session)
   - CLAUDE.md (project root - covers ALL systems)
   - .claude/takeoff-system.md (this file)
   - Current module spec
   - Tail of docs/takeoff/PROGRESS.md

2. **Repository Files** (long-term memory)
   - docs/takeoff/modules/*/module-{ID}-context.md
   - docs/takeoff/PROGRESS.md
   - docs/takeoff/DECISIONS.md
   - docs/takeoff/BLOCKERS.md
   - docs/takeoff/TESTING.md

3. **Serena Entities** (structured state)
   - serena:/takeoff/system_context
   - serena:/takeoff/progress_tracker
   - serena:/takeoff/module_{ID}/state

### Token Budget Rules

**Per Session Context Limit:**
- CLAUDE.md (≈2KB)
- .claude/takeoff-system.md (≈8KB)
- Current module spec (≈2KB)
- Current plan (≈1KB)
- Tail of PROGRESS.md (last 40 lines ≈2KB)
- Serena state (≈1KB)
- **Total:** ≈16KB baseline + code files as needed

**Archiving Strategy:**
- When docs/takeoff/PROGRESS.md exceeds 500 lines:
  - Move older entries to docs/takeoff/archive/PROGRESS-{date}.md
  - Keep only last 100 lines current
- Create checkpoint files in `.claude/session-logs/` every 3 modules

---

## Quality Gates

### Before Module Marked Complete

1. **Tests Pass**
   - Playwright tests run successfully
   - No console errors in normal use
   - Documented test coverage in docs/takeoff/TESTING.md

2. **Code Quality** (Static Pages)
   - HTML validates
   - JavaScript has no syntax errors
   - CSS follows existing dashboard patterns

3. **Documentation Updated**
   - docs/takeoff/PROGRESS.md has new entries
   - Module spec has Implementation Notes
   - Serena module state marked "completed"

4. **Integration Verified**
   - Works with existing dashboard navigation
   - No conflicts with Next.js app
   - Data files follow schema

### Superpowers Integration

Use these skills at each phase:

- **Before Planning:** `superpowers:brainstorming` for design refinement
- **During Implementation:** `superpowers:test-driven-development` (write test first)
- **After Module:** `superpowers:requesting-code-review` for quality check
- **When Debugging:** `superpowers:systematic-debugging` (4-phase framework)
- **Before Completion:** `superpowers:verification-before-completion` (evidence first)

---

## File Boundaries Per Module

### Module 1.1 - PDF Viewer

**Allowed New Files:**
- `dashboard/takeoff.html`
- `dashboard/js/pdf-viewer.js`
- `dashboard/css/takeoff.css`

**Allowed Modifications:**
- None (self-contained)

### Module 1.2 - Measurement Tools

**Allowed New Files:**
- `dashboard/js/measurement-tools.js`

**Allowed Modifications:**
- `dashboard/js/pdf-viewer.js` (integration hooks)
- `dashboard/takeoff.html` (add tools UI)
- `dashboard/css/takeoff.css` (tool styles)

### Module 1.3 - Quantity Calculator

**Allowed New Files:**
- `dashboard/js/quantity-calculator.js`

**Allowed Modifications:**
- `dashboard/js/measurement-tools.js` (emit events)
- `dashboard/takeoff.html` (add quantities panel)
- `dashboard/css/takeoff.css` (panel styles)

### Module 1.4 - Export & Persistence

**Allowed New Files:**
- `dashboard/js/takeoff-export.js`
- `dashboard/api/data/takeoffs.json`

**Allowed Modifications:**
- `dashboard/takeoff.html` (save/load buttons)
- `dashboard/js/pdf-viewer.js` (load state)
- `dashboard/js/measurement-tools.js` (serialize)
- `dashboard/js/quantity-calculator.js` (serialize)

**Pattern:** Each module strictly defines what it can create and modify.

---

## Autopilot Loop

### Session Start

1. Read CLAUDE.md and .claude/takeoff-system.md
2. Query `serena:/takeoff/progress_tracker`
3. Find first module where `status != "completed"`
4. Check if module has plan in `.claude/plans/`

### Execution

**If no plan exists:**
- Run as **Planner**
- Create `.claude/plans/module-{ID}-plan.md`
- Update Serena progress_tracker

**If plan exists and status is "planned" or "in_progress":**
- Run as **Implementer**
- Execute 2-4 atomic tasks
- Update docs/takeoff/PROGRESS.md after each task
- Update Serena module state after each task

**When module implementation done:**
- Run as **Tester**
- Add/run tests
- Update docs/takeoff/TESTING.md
- Update Serena module state with test results

**When tests pass:**
- Run as **Doc**
- Polish module spec with Implementation Notes
- Record any Known Limitations
- Mark Serena module state as "completed"
- Update progress_tracker to next module

### Session End

Output summary:
- Modules completed this session
- Current module status
- Next module to start
- Any blockers or followups
- Files changed count
- Tests run / passing

---

## Definition of Done (Per Module)

A module is **completed** only when ALL of these are true:

1. ✅ All behaviors in spec are implemented
2. ✅ All allowed files created/modified per spec
3. ✅ No JavaScript console errors in normal use
4. ✅ Tests exist for critical paths
5. ✅ docs/takeoff/PROGRESS.md has entries for this module
6. ✅ docs/takeoff/modules/{phase}/module-{ID}-context.md has Implementation Notes
7. ✅ `serena:/takeoff/module_{ID}/state` has:
   - `status: "completed"`
   - `files_created` list
   - `files_modified` list
   - `testing` summary
   - `open_followups` (can be empty)

If ANY condition fails, status remains "in_progress" and remaining work is documented.

---

## Non-Goals

To keep scope tight:

1. **Do NOT** introduce new backend frameworks (stick to static HTML/JS)
2. **Do NOT** modify the Next.js app (`src/app/`) unless explicitly allowed
3. **Do NOT** add new build tools (no webpack, vite, etc.)
4. **Do NOT** upgrade library versions unless critical bug fix
5. **Do NOT** implement future modules early
6. **Do NOT** invent backend behavior (use JSON files only)
7. **Do NOT** redesign existing dashboard layout
8. **Do NOT** break existing Next.js or legacy dashboard functionality

---

## Quick Reference

### Key Files to Always Read

- `CLAUDE.md` - Project root overview
- `.claude/takeoff-system.md` - This architecture doc
- `docs/takeoff/modules/{phase}/module-{ID}-context.md` - Current module spec
- `.claude/plans/module-{ID}-plan.md` - Current plan (if exists)

### Key Commands

```bash
# Start development session (from project root)
claude --dangerously-skip-permissions "Continue takeoff system development"

# Run tests
cd /c/Users/Owner/Desktop/midwest-underground-website
npx playwright test tests/takeoff/

# Commit changes
git add .
git commit -m "feat(takeoff): [module ID] - [description]"
git push origin feat/takeoff-system
```

### Serena Queries

```javascript
// Check progress
serena:/takeoff/progress_tracker

// Check current module
serena:/takeoff/module_{ID}/state

// Check system context
serena:/takeoff/system_context
```

---

## Module Execution Order

**Phase 0 - Scaffolding:**
1. P0.1 → P0.2 → P0.3

**Phase 1 - Takeoff Core:**
1. Module 1.1 → 1.2 → 1.3 → 1.4 (sequential, dependencies)

**Phase 2 - Estimating:**
1. Module 2.1 (can start immediately after Phase 1)
2. Module 2.2 (depends on 2.1)
3. Module 2.3 (depends on 2.2)
4. Module 2.4 (depends on 2.3)

**Phase 3 - Advanced:**
1. Module 3.1 (independent, can parallel with 3.2)
2. Module 3.2 (independent, can parallel with 3.1)
3. Module 3.3 (depends on 2.2 for estimates)
4. Module 3.4 (can start after any Phase 1 module)

---

**Last Updated:** 2025-11-22
**Status:** Architecture Complete, Ready for P0.1 Execution
**Next:** Begin Phase 0 Module P0.1
