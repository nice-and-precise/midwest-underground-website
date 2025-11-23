# Module 1.2 State - Basic Measurement Tools

**Module:** 1.2 - Basic measurement tools
**Phase:** Phase 1 - Takeoff Core
**Status:** planned
**Current Role:** null
**Next Role:** IMPLEMENTER

---

## Quick Status

**Created:** 2025-11-22
**Last Updated:** 2025-11-22
**Plan Location:** `.claude/plans/module-1.2-plan.md`
**Estimated Time:** 6.5 hours (390 minutes)

**Progress:** 0/15 tasks complete (0%)

---

## Module Overview

Adds interactive measurement capabilities to the PDF viewer by overlaying a Fabric.js canvas on top of the PDF rendering canvas. Users can draw measurements directly on construction plans using tools for:
- Linear measurements (HDD bore paths, fiber runs, trenching)
- Area measurements (excavation areas, paving)
- Count markers (entry/exit pits, splice locations, equipment)

Implements scale calibration (critical for accurate measurements) and provides real-time feedback as users draw. All measurement data is structured to support quantity aggregation in Module 1.3.

---

## Implementation Plan Summary

**Total Tasks:** 15
**Estimated Time:** 6.5 hours (390 minutes)

**Task Breakdown:**
1. Add Fabric.js Library and Initialize (20 min) - Small
2. Create Fabric Canvas Overlay (25 min) - Small
3. Implement Canvas Synchronization (45 min) - Medium
4. Create Measurement Toolbar UI (30 min) - Small
5. Implement Scale Calibration Tool (50 min) - Medium
6. Implement Linear Measurement Tool (60 min) - Large
7. Implement Area Measurement Tool (55 min) - Large
8. Implement Count Marker Tool (40 min) - Medium
9. Implement Measurement Selection and Editing (45 min) - Medium
10. Add Real-Time Measurement Display (35 min) - Medium
11. Implement Measurement Properties Panel (50 min) - Medium
12. Implement Event Emission System (20 min) - Small
13. Add Undo/Redo Support (40 min) - Medium
14. Add Measurement Persistence (Per-Page) (35 min) - Medium
15. Add Scale Indicator UI (25 min) - Small

**Execution Strategy:**
- Phase 1: Foundation (Tasks 1-3) - Sequential
- Phase 2: UI + Scale (Tasks 4-5) - Parallel possible
- Phase 3: Measurement Tools (Tasks 6-8) - Sequential
- Phase 4: Enhancement (Tasks 9-11) - Parallel possible
- Phase 5: Finalization (Tasks 12-15) - Sequential

---

## Dependencies

### External Libraries
- Fabric.js v5.3.0 (CDN)
  - URL: `https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js`
  - Size: ~660 KB (minified)
  - License: MIT

### Internal Dependencies
- **Module 1.1 (PDF Viewer)** - ✅ COMPLETED
  - Files: `public/dashboard/takeoff.html`, `public/dashboard/js/pdf-viewer.js`, `public/dashboard/css/takeoff.css`
  - Access needed: `viewerState`, `renderPage()`, `setZoom()`

---

## Risk Assessment

### High-Risk Areas
1. **Coordinate Synchronization** - Fabric canvas not aligning with PDF at different zoom levels
2. **Scale Accuracy** - Calculation errors (must be within 1% tolerance)
3. **Performance** - Canvas slowdown with 100+ measurements
4. **Geometry Calculations** - Polyline length or polygon area inaccuracies

### Medium-Risk Areas
1. **Browser Compatibility** - Older browsers may not support Fabric.js v5.3.0
2. **Touch Input** - Click-to-draw may not work on touch devices
3. **State Serialization** - Fabric canvas JSON may lose data

---

## Files to Create/Modify

### Create:
- `public/dashboard/js/measurement-tools.js` - Fabric.js integration and measurement logic

### Modify:
- `public/dashboard/js/pdf-viewer.js` - Add integration hooks for Fabric overlay sync
- `public/dashboard/takeoff.html` - Add measurement tool UI (toolbar, properties panel)
- `public/dashboard/css/takeoff.css` - Add styles for measurement tools and overlays

---

## Success Criteria

### Functional Requirements
- ✅ Scale calibration works accurately (within 1% tolerance)
- ✅ Linear measurements calculate correct length
- ✅ Area measurements calculate correct area
- ✅ Count markers auto-increment per category
- ✅ Measurements editable (move, resize, delete)
- ✅ Measurements persist across page changes
- ✅ Real-time feedback during drawing
- ✅ Undo/redo works for all operations
- ✅ Events emitted for Module 1.3 consumption

### Performance Requirements
- ✅ Supports 100+ measurements per page without lag
- ✅ Zoom/pan sync happens within 100ms
- ✅ Fabric canvas render time < 50ms

### UX Requirements
- ✅ Tool selection obvious (highlighted active tool)
- ✅ Visual feedback during drawing (preview objects)
- ✅ Measurement values visible on canvas
- ✅ Properties panel easy to use
- ✅ Confirmation before destructive actions

---

## Current State

**Status:** planned
**Current Role:** null
**Next Role:** IMPLEMENTER
**Blockers:** None

**Next Steps:**
1. IMPLEMENTER role begins execution
2. Execute tasks 1-15 (sequential with some parallel opportunities)
3. Commit after each task or logical group
4. Move to TESTER role when implementation complete

---

## Notes

**Integration Architecture:**
- Fabric.js canvas overlays PDF.js canvas (z-index: 2)
- 1:1 pixel mapping at zoom=1.0
- Synchronization points: page render, zoom change, pan, page change
- Event-driven communication with pdf-viewer.js

**Data Structures:**
- `measurementState.measurements` - Keyed by page number
- `measurementState.scaleData` - Keyed by page number
- Measurement types: linear, area, count
- Categories: HDD, Fiber, Trench, Excavation, Paving, Pits, Splices, etc.

**Key Algorithms:**
- Scale calibration: ratio = pixelDistance / realWorldDistance
- Linear length: Pythagorean theorem, sum of segments
- Polygon area: Shoelace formula
- Coordinate mapping: Fabric pixels → real-world units

**Testing Plan:**
- Manual testing: 7 integration tests
- E2E testing (TESTER role): 25+ Playwright tests
- Focus areas: scale accuracy, geometry calculations, zoom sync, persistence

---

**Last Updated:** 2025-11-22
**Next Update:** When IMPLEMENTER role begins
