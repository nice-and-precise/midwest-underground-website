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

    // Loading and error
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingText: document.getElementById('loading-text'),
    errorMessage: document.getElementById('error-message'),
    errorText: document.getElementById('error-text'),
    errorClose: document.getElementById('error-close'),
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

  // Pan events
  elements.viewerContainer.addEventListener('mousedown', startPan);
  elements.viewerContainer.addEventListener('mousemove', pan);
  elements.viewerContainer.addEventListener('mouseup', endPan);
  elements.viewerContainer.addEventListener('mouseleave', endPan);

  // Error close button
  elements.errorClose.addEventListener('click', hideError);
}

// ==========================================================================
// File Upload Handling
// ==========================================================================

/**
 * Handle file selection from file input
 */
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    processFile(file);
  }
}

/**
 * Handle drag over event
 */
function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  elements.dropZone.classList.add('dragover');
}

/**
 * Handle file drop event
 */
function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  elements.dropZone.classList.remove('dragover');

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

/**
 * Handle drag leave event
 */
function handleDragLeave(event) {
  event.preventDefault();
  event.stopPropagation();
  elements.dropZone.classList.remove('dragover');
}

/**
 * Process uploaded file
 * @param {File} file - The uploaded PDF file
 */
function processFile(file) {
  // Validate file type
  if (!file.type || file.type !== 'application/pdf') {
    showError('Please upload a PDF file');
    return;
  }

  // Validate file size (50MB limit)
  const maxSize = 50 * 1024 * 1024; // 50MB in bytes
  if (file.size > maxSize) {
    showError('File size exceeds 50MB limit. Please upload a smaller file.');
    return;
  }

  // Store file metadata
  viewerState.fileName = file.name;
  viewerState.fileSize = file.size;

  // Show loading indicator
  showLoading('Loading PDF...');

  // Read file as ArrayBuffer
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    const arrayBuffer = e.target.result;
    loadPDF(arrayBuffer);
  };

  fileReader.onerror = function () {
    hideLoading();
    showError('Error reading file. Please try again.');
  };

  fileReader.readAsArrayBuffer(file);
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  elements.errorText.textContent = message;
  elements.errorMessage.classList.add('show');
  console.error(message);

  // Auto-hide after 5 seconds
  setTimeout(hideError, 5000);
}

/**
 * Hide error message
 */
function hideError() {
  elements.errorMessage.classList.remove('show');
}

/**
 * Show loading indicator
 * @param {string} message - Loading message
 */
function showLoading(message = 'Loading...') {
  elements.loadingText.textContent = message;
  elements.loadingOverlay.style.display = 'flex';
}

/**
 * Hide loading indicator
 */
function hideLoading() {
  elements.loadingOverlay.style.display = 'none';
}

// ==========================================================================
// PDF Document Loading
// ==========================================================================

/**
 * Load PDF document from ArrayBuffer
 * @param {ArrayBuffer} arrayBuffer - PDF file data
 */
async function loadPDF(arrayBuffer) {
  try {
    // Load PDF document using PDF.js
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

    const pdfDoc = await loadingTask.promise;

    // Store document reference
    viewerState.pdfDoc = pdfDoc;
    viewerState.totalPages = pdfDoc.numPages;
    viewerState.currentPage = 1;

    // Update UI with document info
    updateDocumentInfo();

    // Hide upload zone, show viewer section
    elements.uploadZone.style.display = 'none';
    elements.viewerSection.style.display = 'flex';

    // Render first page
    await renderPage(1);

    // Hide loading indicator
    hideLoading();

    console.log('PDF loaded successfully:', {
      fileName: viewerState.fileName,
      pages: viewerState.totalPages,
      size: formatFileSize(viewerState.fileSize),
    });
  } catch (error) {
    hideLoading();
    console.error('Error loading PDF:', error);

    // Handle specific PDF.js errors
    if (error.name === 'PasswordException') {
      showError('This PDF is encrypted. Encrypted PDFs are not supported.');
    } else if (error.name === 'InvalidPDFException') {
      showError('Unable to load PDF. The file may be corrupted or invalid.');
    } else {
      showError('Error loading PDF. Please try a different file.');
    }
  }
}

/**
 * Update document information in UI
 */
function updateDocumentInfo() {
  elements.fileName.textContent = viewerState.fileName;
  elements.fileSize.textContent = formatFileSize(viewerState.fileSize);
  elements.totalPages.textContent = viewerState.totalPages;
  elements.pageCount.textContent = viewerState.totalPages;
  elements.pageInput.max = viewerState.totalPages;
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "2.5 MB")
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// ==========================================================================
// Page Rendering
// ==========================================================================

/**
 * Render a specific page to the canvas
 * @param {number} pageNum - Page number to render (1-indexed)
 */
async function renderPage(pageNum) {
  if (!viewerState.pdfDoc) {
    console.error('No PDF document loaded');
    return;
  }

  // Validate page number
  if (pageNum < 1 || pageNum > viewerState.totalPages) {
    console.error('Invalid page number:', pageNum);
    return;
  }

  try {
    // Cancel previous render task if exists
    if (viewerState.renderTask) {
      viewerState.renderTask.cancel();
    }

    // Get the page
    const page = await viewerState.pdfDoc.getPage(pageNum);

    // Calculate viewport with current zoom
    const viewport = page.getViewport({ scale: viewerState.zoom });

    // Get canvas and context
    const canvas = viewerState.canvas;
    const ctx = viewerState.ctx;

    // Scale for high-DPI displays
    const outputScale = window.devicePixelRatio || 1;

    // Set canvas dimensions
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = Math.floor(viewport.width) + 'px';
    canvas.style.height = Math.floor(viewport.height) + 'px';

    // Scale context for high-DPI
    ctx.scale(outputScale, outputScale);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render the page
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    viewerState.renderTask = page.render(renderContext);

    await viewerState.renderTask.promise;

    // Update current page state
    viewerState.currentPage = pageNum;

    // Update UI
    updatePageControls();

    console.log(`Rendered page ${pageNum} of ${viewerState.totalPages}`);
  } catch (error) {
    if (error.name === 'RenderingCancelledException') {
      console.log('Rendering cancelled (new page requested)');
    } else {
      console.error('Error rendering page:', error);
      showError('Error rendering page. Please try reloading the PDF.');
    }
  }
}

/**
 * Update page navigation controls
 */
function updatePageControls() {
  // Update page input value
  elements.pageInput.value = viewerState.currentPage;

  // Update previous button state
  elements.prevPage.disabled = viewerState.currentPage === 1;

  // Update next button state
  elements.nextPage.disabled = viewerState.currentPage === viewerState.totalPages;

  console.log(
    `Page controls updated: ${viewerState.currentPage} of ${viewerState.totalPages}`
  );
}

// ==========================================================================
// Zoom Controls
// ==========================================================================

/**
 * Zoom in (increase zoom by 25%)
 */
function zoomIn() {
  const newZoom = viewerState.zoom + 0.25;
  setZoom(newZoom);
}

/**
 * Zoom out (decrease zoom by 25%)
 */
function zoomOut() {
  const newZoom = viewerState.zoom - 0.25;
  setZoom(newZoom);
}

/**
 * Fit page to container width
 */
async function fitToWidth() {
  if (!viewerState.pdfDoc) return;

  try {
    // Get first page to calculate dimensions
    const page = await viewerState.pdfDoc.getPage(viewerState.currentPage);

    // Get page viewport at scale 1.0
    const viewport = page.getViewport({ scale: 1.0 });

    // Calculate container width (accounting for padding)
    const containerWidth = elements.viewerContainer.clientWidth - 64; // 2rem padding on each side

    // Calculate zoom to fit width
    const zoom = containerWidth / viewport.width;

    setZoom(zoom);
  } catch (error) {
    console.error('Error calculating fit to width:', error);
  }
}

/**
 * Fit entire page to container
 */
async function fitToPage() {
  if (!viewerState.pdfDoc) return;

  try {
    // Get current page to calculate dimensions
    const page = await viewerState.pdfDoc.getPage(viewerState.currentPage);

    // Get page viewport at scale 1.0
    const viewport = page.getViewport({ scale: 1.0 });

    // Calculate container dimensions (accounting for padding)
    const containerWidth = elements.viewerContainer.clientWidth - 64;
    const containerHeight = elements.viewerContainer.clientHeight - 64;

    // Calculate zoom to fit both width and height
    const zoomWidth = containerWidth / viewport.width;
    const zoomHeight = containerHeight / viewport.height;

    // Use the smaller zoom to ensure entire page fits
    const zoom = Math.min(zoomWidth, zoomHeight);

    setZoom(zoom);
  } catch (error) {
    console.error('Error calculating fit to page:', error);
  }
}

/**
 * Set zoom level and re-render page
 * @param {number} zoom - Zoom level (0.25 to 5.0)
 */
function setZoom(zoom) {
  // Enforce zoom limits (25% to 500%)
  const MIN_ZOOM = 0.25;
  const MAX_ZOOM = 5.0;

  const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));

  // Update state
  viewerState.zoom = clampedZoom;

  // Update zoom display
  updateZoomDisplay();

  // Update pan cursor
  updatePanCursor();

  // Re-render current page with new zoom
  renderPage(viewerState.currentPage);

  console.log(`Zoom set to ${Math.round(clampedZoom * 100)}%`);
}

/**
 * Update zoom level display
 */
function updateZoomDisplay() {
  const percentage = Math.round(viewerState.zoom * 100);
  elements.zoomLevel.textContent = `${percentage}%`;
}

// ==========================================================================
// Page Navigation
// ==========================================================================

/**
 * Navigate to previous page
 */
function previousPage() {
  if (viewerState.currentPage > 1) {
    renderPage(viewerState.currentPage - 1);
  }
}

/**
 * Navigate to next page
 */
function nextPage() {
  if (viewerState.currentPage < viewerState.totalPages) {
    renderPage(viewerState.currentPage + 1);
  }
}

/**
 * Handle page input (jump to specific page)
 * @param {Event} event - Input change event
 */
function handlePageInput(event) {
  const pageNum = parseInt(event.target.value, 10);

  // Validate page number
  if (isNaN(pageNum)) {
    // Reset to current page if invalid
    elements.pageInput.value = viewerState.currentPage;
    return;
  }

  // Clamp to valid range
  const clampedPage = Math.max(1, Math.min(viewerState.totalPages, pageNum));

  // Update input if clamped
  if (clampedPage !== pageNum) {
    elements.pageInput.value = clampedPage;
  }

  // Render page if different from current
  if (clampedPage !== viewerState.currentPage) {
    renderPage(clampedPage);
  }
}

// ==========================================================================
// Pan Functionality
// ==========================================================================

/**
 * Start panning on mousedown
 * @param {MouseEvent} event - Mouse event
 */
function startPan(event) {
  // Only enable pan when zoomed in
  if (viewerState.zoom <= 1.0) return;

  // Prevent text selection during pan
  event.preventDefault();

  viewerState.isPanning = true;
  viewerState.panStart = {
    x: event.clientX - elements.viewerContainer.scrollLeft,
    y: event.clientY - elements.viewerContainer.scrollTop,
  };

  elements.viewerContainer.classList.add('panning');
}

/**
 * Pan the viewer on mousemove
 * @param {MouseEvent} event - Mouse event
 */
function pan(event) {
  if (!viewerState.isPanning) return;

  event.preventDefault();

  const x = event.clientX - viewerState.panStart.x;
  const y = event.clientY - viewerState.panStart.y;

  elements.viewerContainer.scrollLeft = -x;
  elements.viewerContainer.scrollTop = -y;
}

/**
 * End panning on mouseup or mouseleave
 */
function endPan() {
  if (viewerState.isPanning) {
    viewerState.isPanning = false;
    elements.viewerContainer.classList.remove('panning');
  }
}

/**
 * Update pan cursor based on zoom level
 */
function updatePanCursor() {
  if (viewerState.zoom > 1.0) {
    elements.viewerContainer.classList.add('pannable');
  } else {
    elements.viewerContainer.classList.remove('pannable');
  }
}

// ==========================================================================
// Loading Indicators & Error Handling (Stub - will be implemented in Task 12)
// ==========================================================================

// Loading and error functions will be implemented in Task 12
