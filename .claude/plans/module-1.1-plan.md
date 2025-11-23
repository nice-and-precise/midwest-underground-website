# Module 1.1 Implementation Plan

**Module:** PDF Plan Viewer
**Phase:** Phase 1 - Takeoff Core
**Created:** 2025-11-22
**Estimated Total Time:** 4.5 hours

## Summary

Module 1.1 implements the foundational PDF viewing capabilities for the takeoff system. This module creates a static HTML/CSS/JavaScript-based PDF viewer using Mozilla's PDF.js library (loaded via CDN). The viewer provides essential functionality including file upload, multi-page navigation, zoom controls (zoom in/out, fit-to-width, fit-to-page), and pan navigation.

This is the first feature module of Phase 1 and establishes the canvas foundation that measurement tools and annotations will overlay in subsequent modules (1.2 and beyond). All functionality is client-side only with no backend dependencies.

## Tasks

### Task 1: Create Base HTML Structure

**Description:** Create the main `dashboard/takeoff.html` file with semantic HTML5 structure, including containers for PDF upload, viewer canvas, and controls.

**Files:**
- `dashboard/takeoff.html` (create new)

**Success Criteria:**
- HTML file exists with proper DOCTYPE and semantic structure
- Includes `<header>`, `<main>`, `<section>` elements
- Contains placeholder divs for:
  - File upload area (`#upload-zone`)
  - PDF viewer canvas container (`#viewer-container`)
  - Control panel (`#controls-panel`)
  - Document info display (`#doc-info`)
- Links to `css/takeoff.css` and `js/pdf-viewer.js`
- Includes PDF.js CDN links in `<head>`
- Opens in browser without console errors

**Estimated Complexity:** Small
**Dependencies:** None

---

### Task 2: Add PDF Upload UI

**Description:** Add HTML markup for PDF file upload interface with both drag-and-drop zone and file input button.

**Files:**
- `dashboard/takeoff.html` (modify)

**Success Criteria:**
- Drag-and-drop zone visible with instructions
- "Choose File" button styled and accessible
- File input accepts only `.pdf` files (`accept=".pdf"`)
- Upload area has visual states (default, hover, active)
- Includes icon/graphic for upload zone
- Accessible via keyboard (file input reachable with Tab)

**Estimated Complexity:** Small
**Dependencies:** Task 1 (base HTML structure)

---

### Task 3: Add PDF Viewer Controls UI

**Description:** Add HTML markup for zoom controls, page navigation, and document information display.

**Files:**
- `dashboard/takeoff.html` (modify)

**Success Criteria:**
- Zoom controls visible:
  - Zoom in button (`+`)
  - Zoom out button (`-`)
  - Fit to width button
  - Fit to page button
  - Zoom percentage display (e.g., "100%")
- Page navigation controls visible:
  - Previous page button (`◀`)
  - Next page button (`▶`)
  - Page input field (jump to page)
  - Page counter (e.g., "Page 3 of 15")
- Document info area:
  - Filename display
  - File size display
  - Total page count
- All buttons have `title` attributes for accessibility

**Estimated Complexity:** Small
**Dependencies:** Task 1 (base HTML structure)

---

### Task 4: Create Base CSS Styles

**Description:** Create `dashboard/css/takeoff.css` with layout styles for the PDF viewer interface, following existing dashboard design patterns.

**Files:**
- `dashboard/css/takeoff.css` (create new)

**Success Criteria:**
- File exists and loads without errors
- Uses CSS variables from existing dashboard (if any)
- Implements responsive layout:
  - Controls panel positioned at top or side
  - Canvas container fills remaining space
  - Mobile-friendly (stacks vertically on small screens)
- Upload zone styled with:
  - Border (dashed or solid)
  - Padding and margin
  - Hover and active states
- Controls styled consistently:
  - Buttons use consistent sizing
  - Icon buttons clearly visible
  - Disabled states defined
- Canvas container has:
  - Border or box-shadow
  - Background color
  - Scrollable overflow

**Estimated Complexity:** Medium
**Dependencies:** Task 1 (HTML structure)

---

### Task 5: Initialize PDF.js and Module

**Description:** Create `dashboard/js/pdf-viewer.js` with module initialization, PDF.js setup, and state management.

**Files:**
- `dashboard/js/pdf-viewer.js` (create new)

**Success Criteria:**
- File exists and loads without errors
- PDF.js library loaded from CDN successfully
- Worker configured: `pdfjsLib.GlobalWorkerOptions.workerSrc`
- Module state object created:
  ```javascript
  const viewerState = {
    pdfDoc: null,
    currentPage: 1,
    totalPages: 0,
    zoom: 1.0,
    fileName: '',
    fileSize: 0,
    canvas: null,
    ctx: null,
    renderTask: null
  };
  ```
- DOM element references captured on `DOMContentLoaded`
- Event listeners attached to all controls
- Console log confirms initialization: "PDF Viewer initialized"

**Estimated Complexity:** Small
**Dependencies:** Task 1 (HTML structure), Task 3 (controls UI)

---

### Task 6: Implement File Upload Handling

**Description:** Implement file upload functionality with drag-and-drop support, file validation, and FileReader integration.

**Files:**
- `dashboard/js/pdf-viewer.js` (modify)

**Success Criteria:**
- File input change event triggers upload
- Drag-and-drop events handled:
  - `dragover` - prevent default, show visual feedback
  - `drop` - prevent default, extract file, trigger load
- File validation:
  - Check file type is `application/pdf`
  - Check file size (warn if > 50MB)
  - Display error message for invalid files
- FileReader reads file as ArrayBuffer
- File metadata captured (name, size)
- Upload zone hidden after successful upload
- Loading indicator shown during file read
- Manual test: Upload PDF via button works
- Manual test: Drag-and-drop PDF works
- Manual test: Upload non-PDF shows error

**Estimated Complexity:** Medium
**Dependencies:** Task 5 (module initialization)

---

### Task 7: Implement PDF Document Loading

**Description:** Implement PDF document loading using PDF.js `getDocument()` API and extract document metadata.

**Files:**
- `dashboard/js/pdf-viewer.js` (modify)

**Success Criteria:**
- `loadPDF(arrayBuffer)` function created
- Uses `pdfjsLib.getDocument()` to parse PDF
- Stores document reference in `viewerState.pdfDoc`
- Extracts and stores:
  - Total page count (`viewerState.totalPages`)
  - Sets current page to 1 (`viewerState.currentPage`)
- Updates UI with document info:
  - Filename displayed
  - File size displayed (formatted as KB/MB)
  - Total pages displayed
- Calls `renderPage(1)` to render first page
- Handles loading errors gracefully:
  - Corrupted PDF error message
  - Encrypted PDF warning
- Loading indicator hidden after load
- Manual test: Load valid PDF shows first page
- Manual test: Load corrupted PDF shows error

**Estimated Complexity:** Medium
**Dependencies:** Task 6 (file upload handling)

---

### Task 8: Implement Canvas Page Rendering

**Description:** Implement PDF page rendering to HTML5 canvas with high-DPI support and current zoom level.

**Files:**
- `dashboard/js/pdf-viewer.js` (modify)

**Success Criteria:**
- `renderPage(pageNum)` function created
- Gets page from document: `pdfDoc.getPage(pageNum)`
- Calculates viewport with current zoom:
  ```javascript
  const viewport = page.getViewport({ scale: viewerState.zoom });
  ```
- Scales canvas for high-DPI displays:
  ```javascript
  const scale = window.devicePixelRatio || 1;
  canvas.width = viewport.width * scale;
  canvas.height = viewport.height * scale;
  canvas.style.width = viewport.width + 'px';
  canvas.style.height = viewport.height + 'px';
  ctx.scale(scale, scale);
  ```
- Clears canvas before rendering
- Cancels previous render task if in progress
- Renders page: `page.render({ canvasContext: ctx, viewport })`
- Updates page counter in UI
- Updates button states (disable prev on page 1, next on last page)
- Manual test: First page renders clearly
- Manual test: Navigate to page 2, renders correctly
- Manual test: High-DPI display shows crisp rendering

**Estimated Complexity:** Medium
**Dependencies:** Task 7 (PDF loading), Task 5 (canvas initialization)

---

### Task 9: Implement Zoom Controls

**Description:** Implement zoom in, zoom out, fit-to-width, and fit-to-page functionality.

**Files:**
- `dashboard/js/pdf-viewer.js` (modify)

**Success Criteria:**
- `zoomIn()` function increases zoom by 0.25 (25%)
- `zoomOut()` function decreases zoom by 0.25 (25%)
- Zoom range enforced: 0.25 (25%) to 5.0 (500%)
- `fitToWidth()` function:
  - Calculates zoom to fit page width to container width
  - Accounts for scrollbar width
  - Updates zoom and re-renders
- `fitToPage()` function:
  - Calculates zoom to fit entire page in viewport
  - Uses both width and height constraints
  - Updates zoom and re-renders
- Zoom percentage displayed in UI (e.g., "150%")
- All zoom changes trigger `renderPage(currentPage)`
- Manual test: Zoom in increases canvas size
- Manual test: Zoom out decreases canvas size
- Manual test: Fit to width fills container width
- Manual test: Fit to page shows entire page

**Estimated Complexity:** Medium
**Dependencies:** Task 8 (page rendering)

---

### Task 10: Implement Page Navigation

**Description:** Implement previous page, next page, and jump-to-page navigation controls.

**Files:**
- `dashboard/js/pdf-viewer.js` (modify)

**Success Criteria:**
- `previousPage()` function:
  - Decrements `currentPage` if > 1
  - Calls `renderPage(currentPage)`
  - Updates UI
- `nextPage()` function:
  - Increments `currentPage` if < `totalPages`
  - Calls `renderPage(currentPage)`
  - Updates UI
- `jumpToPage(pageNum)` function:
  - Validates page number (1 to totalPages)
  - Sets `currentPage = pageNum`
  - Calls `renderPage(currentPage)`
- Page input field:
  - Triggers `jumpToPage()` on Enter or blur
  - Shows validation error for invalid page numbers
- Button states updated after each navigation:
  - Previous disabled on page 1
  - Next disabled on last page
- Page counter updates (e.g., "Page 5 of 15")
- Keyboard shortcuts (optional):
  - Arrow Left = previous page
  - Arrow Right = next page
- Manual test: Previous button navigates backward
- Manual test: Next button navigates forward
- Manual test: Jump to page input works correctly
- Manual test: Invalid page number shows error

**Estimated Complexity:** Small
**Dependencies:** Task 8 (page rendering)

---

### Task 11: Implement Pan Functionality

**Description:** Implement mouse drag panning for zoomed PDFs and scrollbar navigation.

**Files:**
- `dashboard/js/pdf-viewer.js` (modify)

**Success Criteria:**
- Pan state variables added to `viewerState`:
  ```javascript
  isPanning: false,
  panStart: { x: 0, y: 0 }
  ```
- Mouse event listeners on canvas container:
  - `mousedown` - Start pan (if zoomed > 1.0)
  - `mousemove` - Pan canvas container scroll position
  - `mouseup` - End pan
  - `mouseleave` - End pan
- Cursor changes to grab/grabbing during pan
- Scrollbars appear automatically when content exceeds container
- Pan only enabled when zoom > 1.0
- Reset scroll position when changing pages
- Manual test: Zoom in, drag to pan works
- Manual test: Scrollbars appear when zoomed
- Manual test: Pan disabled at zoom 100%

**Estimated Complexity:** Small
**Dependencies:** Task 9 (zoom controls), Task 8 (rendering)

---

### Task 12: Add Loading Indicators and Error Handling

**Description:** Add loading indicators for long operations and comprehensive error handling with user-friendly messages.

**Files:**
- `dashboard/js/pdf-viewer.js` (modify)
- `dashboard/css/takeoff.css` (modify)

**Success Criteria:**
- Loading spinner element added to HTML (or created in JS)
- Loading states managed:
  - Show spinner during file upload
  - Show spinner during PDF parsing
  - Show spinner during page rendering
  - Hide spinner on completion or error
- Error handling for:
  - Invalid file type (shows: "Please upload a PDF file")
  - File too large (shows: "File size exceeds 50MB limit")
  - Corrupted PDF (shows: "Unable to load PDF. File may be corrupted")
  - Encrypted PDF (shows: "Encrypted PDFs are not supported")
  - Render errors (shows: "Error rendering page. Try reloading.")
  - PDF.js library load failure (shows: "PDF viewer unavailable")
- Error messages styled (red text, alert box, or toast)
- Console errors logged for debugging
- Manual test: Upload invalid file shows error
- Manual test: Upload corrupted PDF shows error
- Manual test: All operations show loading feedback

**Estimated Complexity:** Medium
**Dependencies:** All previous tasks

---

## Dependencies

**External Dependencies:**
- PDF.js v3.11.174+ (via CDN)
  - Core library: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js`
  - Worker: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

**Internal Dependencies:**
- None (first module in Phase 1)
- Uses infrastructure from Phase 0 (testing framework, documentation templates)

**Module Dependencies:**
- None (this is the foundation module)
- Enables Module 1.2 (Measurement Tools) - will overlay Fabric.js canvas on this viewer

---

## Risks

### Risk 1: PDF.js CDN Availability
**Impact:** High
**Probability:** Low
**Description:** If CDN is down or blocked, PDF viewer won't load
**Mitigation:**
- Use reliable CDN (cdnjs.cloudflare.com)
- Add fallback CDN URL in HTML comments for future reference
- Consider local copy in future if needed
- Show clear error message if library fails to load

### Risk 2: Large PDF Performance
**Impact:** Medium
**Probability:** Medium
**Description:** PDFs with 100+ pages or file size > 50MB may cause browser slowdown or crashes
**Mitigation:**
- Render pages on-demand (not all at once)
- Clear canvas when switching pages to free memory
- Warn users about files > 50MB
- Test with large PDFs during implementation
- Document maximum recommended file size in Known Limitations

### Risk 3: High-DPI Display Rendering
**Impact:** Low
**Probability:** Low
**Description:** Canvas may appear blurry on retina/4K displays
**Mitigation:**
- Scale canvas using `window.devicePixelRatio` (implemented in Task 8)
- Test on high-DPI display during implementation
- Document any known issues in Implementation Notes

### Risk 4: Browser Compatibility
**Impact:** Medium
**Probability:** Low
**Description:** Safari or older browsers may have PDF.js compatibility issues
**Mitigation:**
- Test in Chrome, Firefox, Edge, Safari 14+
- Use PDF.js stable release (v3.11.174+)
- Add browser detection and warning for unsupported browsers
- Document tested browsers in Implementation Notes

### Risk 5: Memory Leaks
**Impact:** Medium
**Probability:** Medium
**Description:** Not properly cleaning up render tasks or canvas could cause memory leaks
**Mitigation:**
- Cancel previous render task before starting new one (Task 8)
- Clear canvas before each render
- Test repeated page navigation (50+ times) to check for memory growth
- Use browser DevTools memory profiler during testing

### Risk 6: File Upload Security
**Impact:** Low
**Probability:** Low
**Description:** Users might try to upload malicious files disguised as PDFs
**Mitigation:**
- Validate file type using MIME type check
- Validate file extension (.pdf only)
- PDF.js will fail gracefully on invalid files
- No server upload = limited attack surface
- Handle all errors gracefully without exposing internals

---

## Definition of Done

Module 1.1 is considered complete when:

- [x] All 12 tasks completed
- [x] Files created:
  - `dashboard/takeoff.html`
  - `dashboard/js/pdf-viewer.js`
  - `dashboard/css/takeoff.css`
- [x] All features from spec implemented:
  - [x] PDF file upload (drag-and-drop and file input)
  - [x] Multi-page PDF rendering
  - [x] Zoom controls (in, out, fit-to-width, fit-to-page)
  - [x] Page navigation (prev, next, jump to page)
  - [x] Pan/scroll for zoomed PDFs
  - [x] Document info display (filename, size, page count)
  - [x] Loading indicators
  - [x] Error handling
- [x] Manual testing passed:
  - [x] Upload PDF via button
  - [x] Upload PDF via drag-and-drop
  - [x] Navigate all pages
  - [x] All zoom levels work (25% to 500%)
  - [x] Pan works when zoomed
  - [x] No console errors
  - [x] Responsive design (mobile and desktop)
- [x] E2E tests created (Task for TESTER role):
  - Test scenarios in `tests/takeoff/pdf-viewer.spec.js`
  - All tests passing
- [x] Documentation complete (Task for DOC role):
  - Implementation Notes added to module spec
  - Known Limitations documented
  - Usage examples added
- [x] Serena state updated:
  - Module state = "completed"
  - Progress tracker updated to next module (1.2)

---

## Integration Notes

### Integration with Existing Dashboard

This module creates new standalone files and does not modify existing dashboard pages. However, it should follow design patterns from existing pages:

- Use similar header structure (if dashboard has a common header)
- Use consistent button styles (check `dashboard/css/` for existing styles)
- Use same color scheme and typography
- Maintain consistent navigation (add link to takeoff page from main dashboard)

### Integration with Future Modules

**Module 1.2 (Measurement Tools):**
- Will overlay a Fabric.js canvas on top of the PDF viewer canvas
- Measurement tools will need access to:
  - Current page number
  - Current zoom level
  - Canvas dimensions and position
- Consider making `viewerState` accessible globally or via events

**Module 1.3 (Quantity Calculator):**
- Will read measurement data to calculate quantities
- May need page-specific measurement storage

**Module 1.4 (Data Export/Persistence):**
- Will need to save/load PDF references and associated data
- Currently PDFs are not persisted (loaded from user device each session)

### Testing Integration

E2E tests will use Playwright to:
- Upload PDF files from `tests/fixtures/` directory
- Verify rendering by checking canvas size and content
- Test all controls via UI automation
- Validate error handling

---

## Multi-Agent Execution Strategy

**Recommended Approach:** Sequential with optional parallelization for Tasks 4-5

### Sequential Execution (Default)
Recommended for single-agent execution:
1. Tasks 1-3: HTML structure and UI (30 min)
2. Tasks 4-5: CSS and JS initialization (30 min)
3. Tasks 6-7: File upload and PDF loading (45 min)
4. Task 8: Canvas rendering (30 min)
5. Tasks 9-10: Zoom and navigation (45 min)
6. Task 11: Pan functionality (20 min)
7. Task 12: Loading and error handling (30 min)

**Total Sequential Time:** ~4 hours

### Parallel Execution (Multi-Agent)
Optional if resources available:

**Agent 1:** Tasks 1-3 (HTML structure) - 30 min
**Agent 2:** Task 4 (CSS styles) - 30 min (parallel with Agent 1)
**Agent 3:** Tasks 5-12 (JavaScript implementation) - 3 hours (sequential after Agents 1-2)

**Total Parallel Time:** ~3.5 hours (15% speedup)

**Note:** Limited parallelization opportunity since JavaScript tasks are highly sequential (each builds on previous). Recommend single-agent sequential execution for simplicity.

---

## Estimated Time Breakdown

| Task | Estimated Time | Cumulative |
|------|----------------|------------|
| Task 1: Base HTML | 15 min | 15 min |
| Task 2: Upload UI | 10 min | 25 min |
| Task 3: Controls UI | 15 min | 40 min |
| Task 4: Base CSS | 30 min | 70 min |
| Task 5: JS Init | 20 min | 90 min |
| Task 6: File Upload | 30 min | 120 min |
| Task 7: PDF Loading | 25 min | 145 min |
| Task 8: Rendering | 30 min | 175 min |
| Task 9: Zoom | 30 min | 205 min |
| Task 10: Navigation | 20 min | 225 min |
| Task 11: Pan | 20 min | 245 min |
| Task 12: Loading/Errors | 30 min | 275 min |

**Total:** 275 minutes (4 hours 35 minutes)
**Rounded:** 4.5 hours

---

## Success Metrics

**Code Quality:**
- No console errors or warnings
- Clean, commented code
- Consistent naming conventions
- Proper error handling for all edge cases

**Performance:**
- PDF load time < 3 seconds for 10MB file
- Page render time < 500ms
- Zoom/navigation feels instant (< 100ms perceived)
- No memory leaks after 100+ page navigations

**User Experience:**
- All controls clearly labeled and accessible
- Keyboard navigation works
- Visual feedback for all actions
- Error messages are helpful and actionable
- Responsive design works on mobile and desktop

---

**Plan Status:** Complete and ready for IMPLEMENTER role
**Next Step:** IMPLEMENTER role will execute tasks 1-12 sequentially
**Estimated Completion:** 4.5 hours from start of implementation
