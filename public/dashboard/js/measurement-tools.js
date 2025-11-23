/**
 * Measurement Tools Module
 * Module 1.2 - Basic Measurement Tools
 *
 * Provides interactive measurement capabilities using Fabric.js canvas overlay
 * over PDF.js viewer. Supports linear, area, and count measurements with
 * scale calibration for accurate real-world measurements.
 */

// Module state
const measurementState = {
    fabricCanvas: null,          // Fabric.js canvas instance
    activeTool: null,            // Current active tool ('scale', 'linear', 'area', 'count', null)
    measurements: {},            // Measurements keyed by page number
    scaleData: {},               // Scale calibration data keyed by page number
    tempObject: null,            // Preview object during drawing
    isDrawing: false,            // Flag indicating if user is currently drawing
    isPanning: false,            // Flag indicating if user is panning
    currentPoints: [],           // Points for current measurement being drawn
    counters: {},                // Auto-increment counters for count markers by category and page
    undoStack: [],               // Stack for undo operations (per page)
    redoStack: []                // Stack for redo operations (per page)
};

/**
 * Initialize measurement tools module
 * Called after DOM is loaded and PDF viewer is ready
 */
function initMeasurementTools() {
    console.log('[Measurement Tools] Initializing module...');

    // Check if Fabric.js is available
    if (typeof fabric === 'undefined') {
        console.error('[Measurement Tools] Fabric.js not loaded! Cannot initialize measurement tools.');
        showError('Measurement tools failed to load. Please refresh the page.');
        return false;
    }

    console.log('[Measurement Tools] Fabric.js version:', fabric.version);

    // Verify PDF viewer state is available
    if (typeof viewerState === 'undefined') {
        console.error('[Measurement Tools] PDF viewer state not found! Ensure pdf-viewer.js is loaded first.');
        return false;
    }

    // Initialize Fabric canvas overlay
    const success = createFabricCanvasOverlay();
    if (!success) {
        console.error('[Measurement Tools] Failed to create Fabric canvas overlay');
        return false;
    }

    // Attach event listeners for PDF viewer integration
    attachPDFViewerListeners();

    console.log('[Measurement Tools] Module initialized successfully');
    return true;
}

/**
 * Create Fabric.js canvas overlay on top of PDF canvas
 * Returns true if successful, false otherwise
 */
function createFabricCanvasOverlay() {
    console.log('[Measurement Tools] Creating Fabric canvas overlay...');

    const measurementCanvasEl = document.getElementById('measurement-canvas');
    if (!measurementCanvasEl) {
        console.error('[Measurement Tools] Measurement canvas element not found!');
        return false;
    }

    try {
        // Initialize Fabric canvas
        measurementState.fabricCanvas = new fabric.Canvas('measurement-canvas', {
            selection: true,              // Allow object selection
            preserveObjectStacking: true, // Maintain z-order
            renderOnAddRemove: true,      // Auto-render on add/remove
            enableRetinaScaling: true,    // Support high-DPI displays
            isDrawingMode: false          // Not in freehand drawing mode
        });

        console.log('[Measurement Tools] Fabric canvas created successfully');

        // Initially match PDF canvas dimensions (if PDF is loaded)
        syncCanvasDimensions();

        return true;
    } catch (error) {
        console.error('[Measurement Tools] Error creating Fabric canvas:', error);
        return false;
    }
}

/**
 * Synchronize Fabric canvas dimensions with PDF canvas
 * Called on PDF page render and window resize
 */
function syncCanvasDimensions() {
    if (!measurementState.fabricCanvas || !viewerState.canvas) {
        return;
    }

    const pdfCanvas = viewerState.canvas;

    // Set Fabric canvas dimensions to match PDF canvas
    measurementState.fabricCanvas.setDimensions({
        width: pdfCanvas.width,
        height: pdfCanvas.height
    });

    // Set CSS dimensions to match rendered size
    const measurementCanvasEl = measurementState.fabricCanvas.getElement();
    measurementCanvasEl.style.width = pdfCanvas.style.width;
    measurementCanvasEl.style.height = pdfCanvas.style.height;

    console.log('[Measurement Tools] Canvas dimensions synced:', {
        width: pdfCanvas.width,
        height: pdfCanvas.height
    });

    // Re-render Fabric canvas
    measurementState.fabricCanvas.renderAll();
}

/**
 * Utility: Show error message to user
 */
function showError(message) {
    // Use existing error display from pdf-viewer.js if available
    const errorEl = document.getElementById('error-message');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 5000);
    } else {
        console.error('[Measurement Tools]', message);
        alert(message);
    }
}

/**
 * Attach event listeners for PDF viewer integration
 * Listens for page render, zoom, and page change events
 */
function attachPDFViewerListeners() {
    console.log('[Measurement Tools] Attaching PDF viewer event listeners...');

    // Listen for page rendered event
    document.addEventListener('page:rendered', (event) => {
        console.log('[Measurement Tools] Page rendered event:', event.detail);
        syncCanvasDimensions();
    });

    // Listen for zoom changed event
    document.addEventListener('zoom:changed', (event) => {
        console.log('[Measurement Tools] Zoom changed event:', event.detail);
        handleZoomChange(event.detail);
    });

    // Listen for page changed event
    document.addEventListener('page:changed', (event) => {
        console.log('[Measurement Tools] Page changed event:', event.detail);
        handlePageChange(event.detail);
    });

    console.log('[Measurement Tools] Event listeners attached successfully');
}

/**
 * Handle zoom change event
 * Updates Fabric canvas viewport scaling to match PDF zoom
 */
function handleZoomChange(detail) {
    if (!measurementState.fabricCanvas) {
        return;
    }

    const { oldZoom, newZoom } = detail;
    const zoomRatio = newZoom / oldZoom;

    console.log('[Measurement Tools] Handling zoom change:', {
        oldZoom,
        newZoom,
        zoomRatio
    });

    // Fabric canvas dimensions will be updated by page:rendered event
    // which fires after zoom change via renderPage()
    // No additional scaling needed here - let syncCanvasDimensions handle it
}

/**
 * Handle page change event
 * Saves current page measurements and loads new page measurements
 */
function handlePageChange(detail) {
    if (!measurementState.fabricCanvas) {
        return;
    }

    const { oldPage, newPage } = detail;

    console.log('[Measurement Tools] Handling page change:', {
        oldPage,
        newPage
    });

    // Save current page measurements (if any)
    if (oldPage && oldPage > 0) {
        saveMeasurementsForPage(oldPage);
    }

    // Load new page measurements (if any)
    loadMeasurementsForPage(newPage);
}

/**
 * Save measurements for a specific page
 * Serializes Fabric canvas to JSON and stores in measurementState
 */
function saveMeasurementsForPage(pageNumber) {
    if (!measurementState.fabricCanvas) {
        return;
    }

    try {
        // Serialize Fabric canvas to JSON
        const canvasJSON = measurementState.fabricCanvas.toJSON();

        // Store in measurements state
        measurementState.measurements[pageNumber] = canvasJSON;

        console.log(`[Measurement Tools] Saved measurements for page ${pageNumber}:`, canvasJSON);
    } catch (error) {
        console.error(`[Measurement Tools] Error saving measurements for page ${pageNumber}:`, error);
    }
}

/**
 * Load measurements for a specific page
 * Deserializes Fabric canvas from JSON stored in measurementState
 */
function loadMeasurementsForPage(pageNumber) {
    if (!measurementState.fabricCanvas) {
        return;
    }

    try {
        // Clear current canvas
        measurementState.fabricCanvas.clear();

        // Check if measurements exist for this page
        const canvasJSON = measurementState.measurements[pageNumber];

        if (canvasJSON) {
            // Deserialize Fabric canvas from JSON
            measurementState.fabricCanvas.loadFromJSON(canvasJSON, () => {
                measurementState.fabricCanvas.renderAll();
                console.log(`[Measurement Tools] Loaded measurements for page ${pageNumber}`);
            });
        } else {
            console.log(`[Measurement Tools] No measurements found for page ${pageNumber}`);
        }
    } catch (error) {
        console.error(`[Measurement Tools] Error loading measurements for page ${pageNumber}:`, error);
    }
}

// Export for global access
if (typeof window !== 'undefined') {
    window.measurementState = measurementState;
    window.initMeasurementTools = initMeasurementTools;
    window.syncCanvasDimensions = syncCanvasDimensions; // For debugging
}

console.log('[Measurement Tools] Module script loaded');
