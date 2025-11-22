/**
 * PDF Plan Viewer - Module 1.1
 * Takeoff & Estimating System
 * Midwest Underground of Minnesota Inc.
 */

// ==========================================================================
// PDF.js Configuration
// ==========================================================================

// Configure PDF.js worker
if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// ==========================================================================
// Module State
// ==========================================================================

const viewerState = {
  pdfDoc: null,              // PDF.js document object
  currentPage: 1,            // Current page number (1-indexed)
  totalPages: 0,             // Total page count
  zoom: 1.0,                 // Current zoom level (1.0 = 100%)
  fileName: '',              // Uploaded file name
  fileSize: 0,               // File size in bytes
  canvas: null,              // Canvas element reference
  ctx: null,                 // Canvas 2D context
  renderTask: null,          // Current render task (for cancellation)
  isPanning: false,          // Whether user is currently panning
  panStart: { x: 0, y: 0 },  // Pan gesture start coordinates
};

// ==========================================================================
// DOM Elements
// ==========================================================================

let elements = {};

// ==========================================================================
// Initialization
// ==========================================================================

/**
 * Initialize the PDF viewer when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM element references
  elements = {
    // Upload section
    uploadZone: document.getElementById('upload-zone'),
    dropZone: document.getElementById('drop-zone'),
    fileInput: document.getElementById('pdf-file-input'),

    // Viewer section
    viewerSection: document.getElementById('viewer-section'),
    canvas: document.getElementById('pdf-canvas'),

    // Document info
    fileName: document.getElementById('file-name'),
    fileSize: document.getElementById('file-size'),
    totalPages: document.getElementById('total-pages'),

    // Zoom controls
    zoomIn: document.getElementById('zoom-in'),
    zoomOut: document.getElementById('zoom-out'),
    fitWidth: document.getElementById('fit-width'),
    fitPage: document.getElementById('fit-page'),
    zoomLevel: document.getElementById('zoom-level'),

    // Page navigation
    prevPage: document.getElementById('prev-page'),
    nextPage: document.getElementById('next-page'),
    pageInput: document.getElementById('page-input'),
    pageCount: document.getElementById('page-count'),

    // Viewer container
    viewerContainer: document.getElementById('viewer-container'),
  };

  // Store canvas and context in state
  viewerState.canvas = elements.canvas;
  viewerState.ctx = elements.canvas.getContext('2d');

  // Attach event listeners
  attachEventListeners();

  console.log('PDF Viewer initialized');
});

/**
 * Attach all event listeners
 */
function attachEventListeners() {
  // File input change event
  elements.fileInput.addEventListener('change', handleFileSelect);

  // Drag and drop events
  elements.dropZone.addEventListener('dragover', handleDragOver);
  elements.dropZone.addEventListener('drop', handleDrop);
  elements.dropZone.addEventListener('dragleave', handleDragLeave);
  elements.dropZone.addEventListener('click', () => elements.fileInput.click());

  // Zoom controls
  elements.zoomIn.addEventListener('click', zoomIn);
  elements.zoomOut.addEventListener('click', zoomOut);
  elements.fitWidth.addEventListener('click', fitToWidth);
  elements.fitPage.addEventListener('click', fitToPage);

  // Page navigation
  elements.prevPage.addEventListener('click', previousPage);
  elements.nextPage.addEventListener('click', nextPage);
  elements.pageInput.addEventListener('change', handlePageInput);
  elements.pageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handlePageInput(e);
    }
  });

  // Pan events (will be implemented in Task 11)
  // elements.viewerContainer.addEventListener('mousedown', startPan);
  // elements.viewerContainer.addEventListener('mousemove', pan);
  // elements.viewerContainer.addEventListener('mouseup', endPan);
  // elements.viewerContainer.addEventListener('mouseleave', endPan);
}

// ==========================================================================
// File Upload Handling (Stub - will be implemented in Task 6)
// ==========================================================================

function handleFileSelect(event) {
  console.log('File selected:', event.target.files[0]);
  // Implementation in Task 6
}

function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  elements.dropZone.classList.add('dragover');
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  elements.dropZone.classList.remove('dragover');
  console.log('File dropped');
  // Implementation in Task 6
}

function handleDragLeave(event) {
  event.preventDefault();
  event.stopPropagation();
  elements.dropZone.classList.remove('dragover');
}

// ==========================================================================
// PDF Loading (Stub - will be implemented in Task 7)
// ==========================================================================

function loadPDF(arrayBuffer) {
  console.log('Loading PDF...');
  // Implementation in Task 7
}

// ==========================================================================
// Page Rendering (Stub - will be implemented in Task 8)
// ==========================================================================

function renderPage(pageNum) {
  console.log('Rendering page:', pageNum);
  // Implementation in Task 8
}

// ==========================================================================
// Zoom Controls (Stub - will be implemented in Task 9)
// ==========================================================================

function zoomIn() {
  console.log('Zoom in');
  // Implementation in Task 9
}

function zoomOut() {
  console.log('Zoom out');
  // Implementation in Task 9
}

function fitToWidth() {
  console.log('Fit to width');
  // Implementation in Task 9
}

function fitToPage() {
  console.log('Fit to page');
  // Implementation in Task 9
}

// ==========================================================================
// Page Navigation (Stub - will be implemented in Task 10)
// ==========================================================================

function previousPage() {
  console.log('Previous page');
  // Implementation in Task 10
}

function nextPage() {
  console.log('Next page');
  // Implementation in Task 10
}

function handlePageInput(event) {
  console.log('Jump to page:', event.target.value);
  // Implementation in Task 10
}

// ==========================================================================
// Pan Functionality (Stub - will be implemented in Task 11)
// ==========================================================================

// Pan functions will be implemented in Task 11

// ==========================================================================
// Loading Indicators & Error Handling (Stub - will be implemented in Task 12)
// ==========================================================================

// Loading and error functions will be implemented in Task 12
