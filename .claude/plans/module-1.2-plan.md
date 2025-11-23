# Module 1.2 Implementation Plan

**Module:** Basic Measurement Tools
**Phase:** Phase 1 - Takeoff Core
**Created:** 2025-11-22
**Estimated Total Time:** 6.5 hours (390 minutes)

## Summary

Module 1.2 adds interactive measurement capabilities to the PDF viewer by overlaying a Fabric.js canvas on top of the PDF rendering canvas. Users can draw measurements directly on construction plans using tools for linear measurements (HDD bore paths, fiber runs, trenching), area measurements (excavation areas, paving), and count markers (entry/exit pits, splice locations, equipment).

This module implements scale calibration (critical for accurate measurements) and provides real-time feedback as users draw. All measurement data is structured to support quantity aggregation in Module 1.3.

This is the second feature module of Phase 1 and builds directly on Module 1.1's PDF viewer. It introduces Fabric.js for canvas manipulation, implements complex geometry calculations, and establishes the event-driven architecture that subsequent modules will consume.

## Integration Architecture

### Dependencies on Module 1.1

**Required Access:**
- `viewerState.zoom` - For scale calculations and coordinate mapping
- `viewerState.canvas` - For overlay positioning and dimension matching
- `viewerState.currentPage` - For per-page measurement storage
- `renderPage()` function - Hook into for canvas overlay sync
- `setZoom()` function - Hook into for measurement recalculation

**Event Integration:**
- Listen to custom events from pdf-viewer.js:
  - `page:changed` - Clear/save measurements, switch page context
  - `zoom:changed` - Recalculate all measurements with new scale
  - `pdf:loaded` - Initialize measurement system for new document

### Fabric.js Overlay Strategy

**Canvas Stacking:**
```
┌─────────────────────────┐
│   Fabric.js Canvas      │  (Top layer - transparent, interactive)
│   (measurement-canvas)  │  z-index: 2
├─────────────────────────┤
│   PDF.js Canvas         │  (Bottom layer - PDF rendering)
│   (pdf-canvas)          │  z-index: 1
└─────────────────────────┘
```

**Synchronization Points:**
1. **On PDF page render** → Reset Fabric canvas dimensions to match PDF canvas
2. **On zoom change** → Update Fabric viewport transform to match PDF zoom
3. **On pan** → Update Fabric viewport offset to match PDF pan (if implemented)
4. **On page change** → Save current measurements, load new page measurements

**Coordinate Mapping:**
- PDF canvas uses pixel coordinates
- Fabric canvas overlays exactly on PDF canvas (1:1 pixel mapping at zoom=1.0)
- Measurements stored in Fabric coordinates
- Scale calibration converts Fabric pixels → real-world units

## Data Flow

### Scale Calibration Flow
```
User clicks two points on plan
  ↓
Calculate pixel distance between points
  ↓
User inputs real-world distance + units
  ↓
Calculate ratio (pixels per unit)
  ↓
Store in viewerState.scaleData[pageNumber]
  ↓
Display scale in UI ("1 inch = 50 feet")
```

### Measurement Creation Flow
```
User selects tool (linear/area/count)
  ↓
User clicks on canvas to add points
  ↓
Fabric.js creates temporary preview object
  ↓
Real-time calculation (length/area) using current scale
  ↓
Display running total in UI
  ↓
User completes measurement (double-click/Enter)
  ↓
Convert Fabric object to measurement data structure
  ↓
Store in measurementState.measurements[pageNumber]
  ↓
Emit 'measurement:created' event
```

### Measurement Update Flow
```
User selects existing measurement
  ↓
Fabric.js shows selection handles
  ↓
User drags handles to resize/reshape
  ↓
Recalculate measurement value on each drag
  ↓
Update measurement object in state
  ↓
Emit 'measurement:updated' event
```

## Tasks

### Task 1: Add Fabric.js Library and Initialize

**Description:** Add Fabric.js CDN link to `takeoff.html` and create initialization code in new `measurement-tools.js` file.

**Files:**
- `public/dashboard/takeoff.html` (modify)
- `public/dashboard/js/measurement-tools.js` (create new)

**Success Criteria:**
- Fabric.js v5.3.0 loaded from CDN in `<head>` section
- `measurement-tools.js` created with module pattern
- Module state object created:
  ```javascript
  const measurementState = {
    fabricCanvas: null,
    activeTool: null,
    measurements: {},  // Keyed by page number
    scaleData: {},     // Keyed by page number
    tempObject: null,  // Preview object during drawing
    isDrawing: false
  };
  ```
- Initialization function checks for Fabric.js availability
- Console log confirms: "Measurement Tools initialized"
- No console errors

**Estimated Time:** 20 minutes
**Complexity:** Small
**Dependencies:** None (Module 1.1 already complete)

---

### Task 2: Create Fabric Canvas Overlay

**Description:** Create Fabric.js canvas as overlay on top of PDF canvas, ensuring exact positioning and dimension matching.

**Files:**
- `public/dashboard/js/measurement-tools.js` (modify)
- `public/dashboard/takeoff.html` (modify)

**Success Criteria:**
- New `<canvas id="measurement-canvas">` added to HTML (positioned over `#pdf-canvas`)
- Canvas positioned absolutely within canvas container
- Fabric canvas initialized: `new fabric.Canvas('measurement-canvas')`
- CSS ensures overlay canvas has:
  - `position: absolute`
  - `top: 0; left: 0`
  - `pointer-events: auto`
  - `z-index: 2` (above PDF canvas)
- Dimensions match PDF canvas exactly (width, height)
- Transparent background (no white blocking PDF)
- Fabric canvas renders without errors
- Can test by drawing a simple Fabric rect - should appear over PDF

**Estimated Time:** 25 minutes
**Complexity:** Small
**Dependencies:** Task 1

---

### Task 3: Implement Canvas Synchronization

**Description:** Create sync logic to keep Fabric canvas aligned with PDF canvas on zoom, pan, and page changes.

**Files:**
- `public/dashboard/js/measurement-tools.js` (modify)
- `public/dashboard/js/pdf-viewer.js` (modify)

**Success Criteria:**
- Hook into `renderPage()` in pdf-viewer.js:
  - Dispatch custom event `page:rendering` with page dimensions
- Hook into `setZoom()` in pdf-viewer.js:
  - Dispatch custom event `zoom:changed` with new zoom level
- In measurement-tools.js, listen for events:
  - `page:rendering` → Update Fabric canvas dimensions to match PDF canvas
  - `zoom:changed` → Update Fabric viewport scaling
  - `page:changed` → Save current page measurements, load new page
- Fabric canvas dimensions update correctly on zoom (test at 50%, 100%, 200%)
- Fabric objects stay aligned with PDF when zooming
- Test: Draw a line at zoom 100%, zoom to 200%, line should stay in correct position

**Estimated Time:** 45 minutes
**Complexity:** Medium
**Dependencies:** Task 2

**Risks:**
- Coordinate transform complexity (PDF vs Fabric)
- Zoom sync timing issues (render vs transform)
- High zoom levels may cause precision errors

---

### Task 4: Create Measurement Toolbar UI

**Description:** Add toolbar UI for measurement tool selection (scale, linear, area, count) and active tool indication.

**Files:**
- `public/dashboard/takeoff.html` (modify)
- `public/dashboard/css/takeoff.css` (modify)

**Success Criteria:**
- Toolbar section added to HTML (position: between controls and canvas)
- Toolbar contains buttons:
  - Set Scale (ruler icon)
  - Linear Measurement (line icon)
  - Area Measurement (polygon icon)
  - Count Marker (numbered circle icon)
- Active tool button highlighted (CSS class `.active`)
- Buttons styled consistently with existing controls
- Tooltips on buttons explain tool purpose
- Responsive: toolbar adapts to mobile (vertical stack or scrollable)
- Accessibility: buttons keyboard-accessible, ARIA labels present

**Estimated Time:** 30 minutes
**Complexity:** Small
**Dependencies:** Task 2 (UI positioning relative to canvas)

---

### Task 5: Implement Scale Calibration Tool

**Description:** Create scale calibration functionality allowing users to set real-world distance for accurate measurements.

**Files:**
- `public/dashboard/js/measurement-tools.js` (modify)
- `public/dashboard/takeoff.html` (modify - add scale input modal)
- `public/dashboard/css/takeoff.css` (modify - style modal)

**Success Criteria:**
- User clicks "Set Scale" button
- Cursor changes to crosshair
- User clicks two points on PDF (e.g., ends of scale bar)
- Temporary line drawn between points (Fabric line)
- Pixel distance calculated: `Math.sqrt(dx*dx + dy*dy)`
- Modal appears prompting for:
  - Real-world distance (number input)
  - Units (dropdown: feet, meters, inches)
- On submit:
  - Calculate ratio: `pixelDistance / realWorldDistance`
  - Store in `measurementState.scaleData[pageNumber]`
  - Display in UI: "Scale: 1 inch = 50 feet"
  - Remove temporary line
- Scale data persists for current page
- Can re-calibrate (overwrites existing scale)
- Validation: distance must be > 0, units required
- Cancel button available

**Estimated Time:** 50 minutes
**Complexity:** Medium
**Dependencies:** Task 3 (canvas sync), Task 4 (toolbar)

**Risks:**
- Scale accuracy critical (1% tolerance required)
- Floating-point precision errors
- User confusion on what to measure

---

### Task 6: Implement Linear Measurement Tool

**Description:** Create linear measurement tool for drawing polylines (bore paths, fiber runs, trenching).

**Files:**
- `public/dashboard/js/measurement-tools.js` (modify)

**Success Criteria:**
- User clicks "Linear Measurement" button → tool becomes active
- Cursor changes to crosshair over canvas
- Click-to-add-point interaction:
  - First click: start point
  - Subsequent clicks: add vertices
  - Double-click or Enter key: finish line
- Temporary preview line visible while drawing (follows mouse)
- Each click adds point to temporary Fabric polyline
- After finishing:
  - Calculate total length using scale ratio
  - Create measurement object (type: 'linear')
  - Add to `measurementState.measurements[pageNumber]`
  - Prompt for category (HDD, Fiber, Trench, Other) - simple select or inline input
  - Assign default label: "Linear #1", "Linear #2", etc.
- Display length on line (Fabric text object)
- Line styling:
  - Stroke color: category-dependent (HDD: orange, Fiber: blue, Trench: brown)
  - Stroke width: 2px
  - Selectable: true
- Snap to existing measurement endpoints (within 10px radius)
- Validation: Require scale calibration before using tool
- Escape key: cancel current drawing

**Estimated Time:** 60 minutes
**Complexity:** Large
**Dependencies:** Task 5 (scale calibration)

**Risks:**
- Polyline length calculation accuracy
- Click vs drag ambiguity
- Too many vertices causing performance issues

---

### Task 7: Implement Area Measurement Tool

**Description:** Create area measurement tool for drawing polygons (excavation areas, paving areas).

**Files:**
- `public/dashboard/js/measurement-tools.js` (modify)

**Success Criteria:**
- User clicks "Area Measurement" button → tool becomes active
- Cursor changes to crosshair over canvas
- Click-to-add-vertex interaction:
  - First click: start point
  - Subsequent clicks: add vertices
  - Close polygon: click first point OR press Enter
- Temporary preview polygon visible while drawing (follows mouse)
- After finishing:
  - Calculate area using shoelace formula:
    ```javascript
    area = Math.abs(vertices.reduce((sum, v, i, arr) => {
      const next = arr[(i + 1) % arr.length];
      return sum + (v.x * next.y - next.x * v.y);
    }, 0) / 2);
    ```
  - Convert to square feet/meters using scale
  - Create measurement object (type: 'area')
  - Add to state
  - Prompt for category (Excavation, Paving, Bore Zone, Other)
- Display area inside polygon (Fabric text object)
- Polygon styling:
  - Fill: semi-transparent category color (opacity: 0.3)
  - Stroke: category color
  - Stroke width: 2px
  - Selectable: true
- Calculate perimeter and display in properties
- Validation: Require scale calibration, minimum 3 vertices
- Escape key: cancel current drawing

**Estimated Time:** 55 minutes
**Complexity:** Large
**Dependencies:** Task 5 (scale calibration)

**Risks:**
- Shoelace formula accuracy for irregular polygons
- Self-intersecting polygons (undefined area)
- Complex polygons causing rendering slowdowns

---

### Task 8: Implement Count Marker Tool

**Description:** Create count marker tool for placing numbered markers (pits, splices, poles).

**Files:**
- `public/dashboard/js/measurement-tools.js` (modify)

**Success Criteria:**
- User clicks "Count Marker" button → tool becomes active
- Cursor changes to target/crosshair over canvas
- Click-to-place interaction:
  - Single click: place marker at click location
- Marker renders as Fabric group:
  - Circle background (radius: 15px, category color)
  - Number text (count within category, white, centered)
- Auto-increment count per category:
  - First "Pit" marker shows "1"
  - Second "Pit" marker shows "2"
  - First "Splice" marker shows "1" (independent counter)
- After placing:
  - Create measurement object (type: 'count')
  - Add to state
  - Prompt for category (Pits, Splices, Poles, Equipment, Other)
  - Assign label: "{Category} #{count}"
- Markers draggable after placement
- Double-click marker: edit properties (category, custom label, notes)
- Validation: Require scale calibration is NOT needed (count is dimensionless)
- Allow placing multiple markers in succession without re-clicking tool button

**Estimated Time:** 40 minutes
**Complexity:** Medium
**Dependencies:** Task 4 (toolbar)

---

### Task 9: Implement Measurement Selection and Editing

**Description:** Enable selection, modification, and deletion of existing measurements.

**Files:**
- `public/dashboard/js/measurement-tools.js` (modify)

**Success Criteria:**
- Click on measurement → Fabric object becomes selected (selection handles visible)
- Selected measurement highlighted:
  - Stroke width increases (or color brightens)
  - Selection box with corner/edge handles (Fabric default)
- Drag handles to resize/reshape:
  - Linear: drag vertex to move point, line recalculates length
  - Area: drag vertex to reshape polygon, area recalculates
  - Count: drag entire marker, position updates
- Drag entire measurement to move (maintain shape)
- Delete functionality:
  - Delete key pressed → remove selected measurement
  - OR trash button in toolbar
  - Confirm before delete: "Delete {label}?"
- On modification:
  - Recalculate measurement value (length/area)
  - Update measurement object in state
  - Emit `measurement:updated` event
- On deletion:
  - Remove from Fabric canvas
  - Remove from state
  - Emit `measurement:deleted` event
- Multiple selection: Ctrl+click to select multiple measurements
- Deselect: Click empty area of canvas

**Estimated Time:** 45 minutes
**Complexity:** Medium
**Dependencies:** Tasks 6, 7, 8 (measurement tools)

**Risks:**
- Fabric selection API complexity
- Recalculation performance on every drag event
- Accidental deletions (need confirmation)

---

### Task 10: Add Real-Time Measurement Display

**Description:** Display measurement values in real-time as user draws, and update labels on completed measurements.

**Files:**
- `public/dashboard/js/measurement-tools.js` (modify)
- `public/dashboard/css/takeoff.css` (modify - style labels)

**Success Criteria:**
- While drawing linear measurement:
  - Display running total length in tooltip following cursor
  - OR display in status bar: "Length: 45.3 ft"
- While drawing area measurement:
  - Display current perimeter and area in tooltip/status bar
- After measurement completion:
  - Fabric text object overlays measurement showing value
  - Linear: text at midpoint of line
  - Area: text at centroid of polygon
  - Count: number inside marker circle
- Text styling:
  - Font: 12px Arial or system font
  - Color: White with dark shadow (or category color contrast)
  - Background: Semi-transparent dark box for readability
- Text updates automatically when measurement edited
- Format numbers:
  - Length: 1 decimal place (e.g., "45.3 ft")
  - Area: 1 decimal place (e.g., "1250.5 sq ft")
  - Count: Integer (e.g., "3")

**Estimated Time:** 35 minutes
**Complexity:** Medium
**Dependencies:** Tasks 6, 7, 8 (measurement tools)

**Risks:**
- Text positioning on complex shapes
- Text overlap on dense measurements
- Text readability on varied PDF backgrounds

---

### Task 11: Implement Measurement Properties Panel

**Description:** Create properties panel that appears when user double-clicks a measurement, allowing editing of label, category, and notes.

**Files:**
- `public/dashboard/takeoff.html` (modify - add properties panel)
- `public/dashboard/css/takeoff.css` (modify - style panel)
- `public/dashboard/js/measurement-tools.js` (modify - panel logic)

**Success Criteria:**
- Double-click measurement → properties panel appears
- Panel positioned as sidebar OR modal overlay
- Panel displays:
  - Measurement type (Linear/Area/Count)
  - Calculated value (read-only)
  - Label input (editable text)
  - Category dropdown (editable)
  - Notes textarea (editable)
  - Color picker (change measurement color)
  - Created/modified timestamps (read-only)
- "Save" button updates measurement object in state
- "Cancel" button closes panel without changes
- "Delete" button removes measurement (with confirmation)
- Panel closes when:
  - User clicks "Save" or "Cancel"
  - User clicks outside panel (if modal)
  - Escape key pressed
- On save:
  - Update measurement object
  - Update Fabric object styling (color change)
  - Update label text on canvas
  - Emit `measurement:updated` event

**Estimated Time:** 50 minutes
**Complexity:** Medium
**Dependencies:** Task 9 (selection)

---

### Task 12: Implement Event Emission System

**Description:** Create event emission system for measurement CRUD operations, allowing Module 1.3 to listen for changes.

**Files:**
- `public/dashboard/js/measurement-tools.js` (modify)

**Success Criteria:**
- Custom events emitted on measurement operations:
  - `measurement:created` - After new measurement added
  - `measurement:updated` - After measurement modified
  - `measurement:deleted` - After measurement removed
- Event detail includes:
  ```javascript
  {
    action: 'created' | 'updated' | 'deleted',
    measurement: measurementObject,
    pageNumber: currentPage,
    timestamp: new Date().toISOString()
  }
  ```
- Events dispatched on `document` object (global bus)
- Add convenience method: `emitMeasurementEvent(action, measurement)`
- Test by adding console listener:
  ```javascript
  document.addEventListener('measurement:created', (e) => {
    console.log('Measurement created:', e.detail);
  });
  ```
- All measurement operations (create, edit, delete) trigger appropriate events
- Events can be consumed by other modules (Module 1.3 will aggregate)

**Estimated Time:** 20 minutes
**Complexity:** Small
**Dependencies:** Tasks 6, 7, 8, 9 (all measurement operations)

---

### Task 13: Add Undo/Redo Support

**Description:** Implement undo/redo functionality for measurement operations (create, edit, delete).

**Files:**
- `public/dashboard/js/measurement-tools.js` (modify)

**Success Criteria:**
- Maintain undo stack (array of state snapshots)
- Maintain redo stack (array of state snapshots)
- Keyboard shortcuts:
  - Ctrl+Z (Windows) / Cmd+Z (Mac): Undo
  - Ctrl+Shift+Z (Windows) / Cmd+Shift+Z (Mac): Redo
- State snapshot includes:
  - All measurements on current page
  - Fabric canvas state (serialized)
- On undo:
  - Pop from undo stack
  - Restore previous state
  - Push current state to redo stack
  - Re-render Fabric canvas
- On redo:
  - Pop from redo stack
  - Restore state
  - Push current state to undo stack
  - Re-render Fabric canvas
- Limit stack size (50 operations) to prevent memory issues
- Clear redo stack when new operation performed
- Undo/redo buttons in UI (optional, shortcuts sufficient)
- Test: Create measurement, undo, redo → measurement returns

**Estimated Time:** 40 minutes
**Complexity:** Medium
**Dependencies:** Task 12 (events - to track operations)

**Risks:**
- Memory usage with large undo stacks
- Complex state serialization/deserialization
- Race conditions on rapid undo/redo

---

### Task 14: Add Measurement Persistence (Per-Page)

**Description:** Save measurements per page and restore when switching pages.

**Files:**
- `public/dashboard/js/measurement-tools.js` (modify)

**Success Criteria:**
- On page change (listen to `page:changed` event):
  - Save current page's measurements to `measurementState.measurements[oldPageNumber]`
  - Serialize Fabric canvas: `fabricCanvas.toJSON()`
  - Clear Fabric canvas: `fabricCanvas.clear()`
  - Load new page's measurements from `measurementState.measurements[newPageNumber]`
  - Deserialize Fabric canvas: `fabricCanvas.loadFromJSON()`
- Measurements persist across page navigation
- Scale data also saved per page (already in Task 5 structure)
- Test:
  - Draw measurements on page 1
  - Navigate to page 2
  - Draw different measurements on page 2
  - Navigate back to page 1 → original measurements restored
- Confirm before clearing unsaved measurements (if user has drawn but not finalized)
- Store in memory only (Module 1.4 will add export/import)

**Estimated Time:** 35 minutes
**Complexity:** Medium
**Dependencies:** Task 3 (canvas sync), Task 12 (events)

---

### Task 15: Add Scale Indicator UI

**Description:** Display current scale information in UI, warning if no scale set.

**Files:**
- `public/dashboard/takeoff.html` (modify - add scale display area)
- `public/dashboard/css/takeoff.css` (modify - style scale indicator)
- `public/dashboard/js/measurement-tools.js` (modify - update scale display)

**Success Criteria:**
- Scale indicator area added to UI (near toolbar or status bar)
- Display shows:
  - When scale set: "Scale: 1 inch = 50 feet" (or equivalent)
  - When no scale: "⚠️ No scale set - measurements will be in pixels"
- Indicator updates when:
  - Scale calibrated (show new scale)
  - Page changed (show new page's scale or warning)
- Warning styling:
  - Yellow/orange background for "no scale" warning
  - Green/normal for scale set
- Click on scale indicator → opens scale calibration tool
- Tooltip explains importance of scale calibration
- Mobile-responsive (text wraps or abbreviates)

**Estimated Time:** 25 minutes
**Complexity:** Small
**Dependencies:** Task 5 (scale calibration)

---

## Execution Strategy

### Sequential vs Parallel

**Sequential Tasks:** (must be done in order)
- Tasks 1 → 2 → 3 (Foundation setup)
- Tasks 5 → 6 → 7 (Scale → Measurements)

**Parallel Opportunities:**
- After Task 3: Can work on Tasks 4 and 5 in parallel
  - Task 4: UI (independent)
  - Task 5: Scale logic (depends on Task 3)
- After Tasks 6, 7, 8 complete: Can work on Tasks 9, 10, 11 in parallel
  - All enhance existing measurements

**Recommended Execution:**
- **Phase 1:** Foundation (Tasks 1-3) - Sequential
- **Phase 2:** UI + Scale (Tasks 4-5) - Parallel possible
- **Phase 3:** Measurement Tools (Tasks 6-8) - Sequential (share code patterns)
- **Phase 4:** Enhancement (Tasks 9-11) - Parallel possible
- **Phase 5:** Finalization (Tasks 12-15) - Sequential

### Testing Checkpoints

**After Task 3:**
- Verify Fabric canvas overlays correctly on PDF
- Verify zoom/pan sync works

**After Task 5:**
- Verify scale calibration calculates correct ratio
- Test at multiple zoom levels

**After Task 6:**
- Verify linear measurement length accuracy (compare to known distance)

**After Task 7:**
- Verify area calculation accuracy (test with simple rectangle, known area)

**After Task 8:**
- Verify count auto-increment per category

**After Task 14:**
- Verify measurements persist across page changes

## Risk Assessment

### High-Risk Areas

1. **Coordinate Synchronization (Task 3)**
   - **Risk:** Fabric canvas not aligning with PDF canvas at different zoom levels
   - **Mitigation:** Test at multiple zoom levels (50%, 100%, 200%, 500%)
   - **Fallback:** Disable zoom if sync fails, fix in later iteration

2. **Scale Accuracy (Task 5)**
   - **Risk:** Calculation errors leading to incorrect measurements (violates 1% tolerance)
   - **Mitigation:** Use high-precision math, test against known distances
   - **Fallback:** Allow manual scale ratio input as backup

3. **Performance with Many Measurements (Tasks 6-8)**
   - **Risk:** Canvas slowdown with 100+ measurements
   - **Mitigation:** Use Fabric object caching, limit measurements per page
   - **Fallback:** Implement pagination or hide measurements when zoomed out

4. **Geometry Calculation Accuracy (Tasks 6-7)**
   - **Risk:** Polyline length or polygon area calculations inaccurate
   - **Mitigation:** Use well-tested formulas (Pythagorean, shoelace), unit tests
   - **Fallback:** Display warning if calculation seems off (e.g., negative area)

### Medium-Risk Areas

1. **Fabric.js Browser Compatibility**
   - **Risk:** Older browsers may not support Fabric.js v5.3.0
   - **Mitigation:** Test in Chrome, Firefox, Safari, Edge
   - **Fallback:** Display warning for unsupported browsers

2. **Touch Input Support (Mobile/Tablet)**
   - **Risk:** Click-to-draw interaction may not work on touch devices
   - **Mitigation:** Test on tablet, enable touch events in Fabric
   - **Fallback:** Defer mobile support to later iteration

3. **State Serialization (Task 14)**
   - **Risk:** Fabric canvas JSON serialization may lose data
   - **Mitigation:** Test round-trip (serialize → deserialize → verify)
   - **Fallback:** Store measurement data separately from Fabric objects

### Low-Risk Areas

1. **UI/CSS Styling (Tasks 4, 11, 15)**
   - Low risk, cosmetic issues only

2. **Event Emission (Task 12)**
   - Low risk, standard JavaScript CustomEvent API

## Dependencies

### External Libraries
- **Fabric.js v5.3.0** (CDN)
  - URL: `https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js`
  - Size: ~660 KB (minified)
  - License: MIT

### Internal Dependencies
- **Module 1.1 (PDF Viewer)** - COMPLETED ✅
  - Files: `public/dashboard/takeoff.html`, `public/dashboard/js/pdf-viewer.js`, `public/dashboard/css/takeoff.css`
  - Access needed: `viewerState`, `renderPage()`, `setZoom()`

## Testing Plan

### Unit Testing (Optional for this iteration)
- Geometry functions:
  - `calculateDistance(p1, p2)` → Pythagorean theorem
  - `calculatePolylineLength(points)` → Sum of segments
  - `calculatePolygonArea(vertices)` → Shoelace formula
- Scale conversion:
  - `pixelsToUnits(pixels, scale)` → Pixels * ratio
  - `unitsToPixels(units, scale)` → Units / ratio

### Integration Testing (Manual)
- **Test 1: Scale Calibration Accuracy**
  - Load PDF with known scale bar (e.g., "1 inch = 100 feet")
  - Calibrate using scale bar
  - Measure another known distance on plan
  - Verify measurement within 1% of expected value

- **Test 2: Linear Measurement**
  - Draw bore path with multiple segments
  - Verify total length calculation
  - Resize measurement, verify recalculation
  - Delete measurement, verify removal

- **Test 3: Area Measurement**
  - Draw excavation area (rectangle)
  - Verify area calculation (length × width)
  - Reshape polygon, verify recalculation
  - Delete measurement, verify removal

- **Test 4: Count Markers**
  - Place multiple pits (verify auto-increment)
  - Place splices (verify separate counter)
  - Drag marker, verify position updates
  - Delete marker, verify count adjusts

- **Test 5: Page Switching**
  - Create measurements on page 1
  - Switch to page 2, create different measurements
  - Switch back to page 1, verify measurements restored

- **Test 6: Zoom Synchronization**
  - Draw measurements at 100% zoom
  - Zoom to 200%, verify measurements stay aligned
  - Zoom to 50%, verify measurements stay aligned

- **Test 7: Undo/Redo**
  - Create measurement, undo, redo
  - Edit measurement, undo, verify restored
  - Delete measurement, undo, verify restored

### E2E Testing (Playwright - for TESTER role)
- Recommend 25+ tests:
  - Scale calibration (5 tests)
  - Linear measurements (6 tests)
  - Area measurements (6 tests)
  - Count markers (4 tests)
  - Selection/editing (4 tests)
  - Persistence (3 tests)
  - Undo/redo (2 tests)

## Time Estimates

| Task | Time | Complexity |
|------|------|------------|
| Task 1: Fabric.js Init | 20 min | Small |
| Task 2: Canvas Overlay | 25 min | Small |
| Task 3: Canvas Sync | 45 min | Medium |
| Task 4: Toolbar UI | 30 min | Small |
| Task 5: Scale Calibration | 50 min | Medium |
| Task 6: Linear Tool | 60 min | Large |
| Task 7: Area Tool | 55 min | Large |
| Task 8: Count Tool | 40 min | Medium |
| Task 9: Selection/Editing | 45 min | Medium |
| Task 10: Real-Time Display | 35 min | Medium |
| Task 11: Properties Panel | 50 min | Medium |
| Task 12: Event Emission | 20 min | Small |
| Task 13: Undo/Redo | 40 min | Medium |
| Task 14: Persistence | 35 min | Medium |
| Task 15: Scale Indicator | 25 min | Small |
| **Total** | **575 min** | **9.6 hours** |

**Adjusted Estimate (Buffer):** 6.5 hours (based on Module 1.1 efficiency gains)

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
- ✅ Confirmation before destructive actions (delete)

### Code Quality
- ✅ Module pattern (no global pollution)
- ✅ Event-driven architecture (decoupled from pdf-viewer.js)
- ✅ Consistent error handling
- ✅ Console logs for debugging (can be removed later)
- ✅ Comments on complex logic (geometry calculations)

## Next Steps After Completion

**IMPLEMENTER Role:**
- Execute tasks 1-15 sequentially (or with parallel optimization)
- Commit after each task or logical group of tasks
- Update this plan with implementation notes as you go

**TESTER Role:**
- Create E2E test suite (25+ tests recommended)
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on tablet (if available) for touch input
- Document any bugs or limitations discovered

**DOC Role:**
- Add implementation notes to module spec
- Document known limitations
- Create user guide for measurement tools
- Update progress tracker

**Handoff to Module 1.3:**
- Measurement event system ready for consumption
- Measurement data structure documented
- Example listener code provided
