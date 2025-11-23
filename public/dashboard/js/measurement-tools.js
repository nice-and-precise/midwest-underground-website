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

    // Attach event listeners for measurement tool buttons
    attachToolListeners();

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

    // Update tool button states for new page
    updateToolButtonStates();

    // Deactivate any active tool when switching pages
    if (measurementState.activeTool) {
        cleanupCurrentMeasurement();
        activateTool(null);
    }
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

/**
 * Attach event listeners for measurement tool buttons
 * Handles scale, linear, area, and count tool activation
 */
function attachToolListeners() {
    console.log('[Measurement Tools] Attaching tool button listeners...');

    // Get tool buttons
    const scaleBtn = document.getElementById('tool-scale');
    const linearBtn = document.getElementById('tool-linear');
    const areaBtn = document.getElementById('tool-area');
    const countBtn = document.getElementById('tool-count');

    // Tool button click handlers
    if (scaleBtn) {
        scaleBtn.addEventListener('click', () => {
            console.log('[Measurement Tools] Scale tool button clicked');
            activateTool('scale');
        });
    }

    if (linearBtn) {
        linearBtn.addEventListener('click', () => {
            console.log('[Measurement Tools] Linear tool button clicked');
            const currentPage = viewerState?.currentPage || 1;
            if (!measurementState.scaleData[currentPage]) {
                showError('Please set a scale first before making measurements.');
                return;
            }
            activateTool('linear');
        });
    }

    if (areaBtn) {
        areaBtn.addEventListener('click', () => {
            console.log('[Measurement Tools] Area tool button clicked');
            const currentPage = viewerState?.currentPage || 1;
            if (!measurementState.scaleData[currentPage]) {
                showError('Please set a scale first before making measurements.');
                return;
            }
            activateTool('area');
        });
    }

    if (countBtn) {
        countBtn.addEventListener('click', () => {
            console.log('[Measurement Tools] Count tool button clicked');
            activateTool('count');
        });
    }

    // Attach Fabric canvas event listeners for drawing
    if (measurementState.fabricCanvas) {
        measurementState.fabricCanvas.on('mouse:down', handleCanvasMouseDown);
        measurementState.fabricCanvas.on('mouse:move', handleCanvasMouseMove);
        measurementState.fabricCanvas.on('mouse:up', handleCanvasMouseUp);
    }

    // Attach keyboard event listeners
    document.addEventListener('keydown', handleKeyDown);

    // Attach modal event listeners
    attachModalListeners();

    // Update tool button states on page load
    updateToolButtonStates();

    console.log('[Measurement Tools] Tool button listeners attached successfully');
}

/**
 * Activate a measurement tool
 * @param {string} toolName - Name of tool to activate ('scale', 'linear', 'area', 'count', or null)
 */
function activateTool(toolName) {
    console.log(`[Measurement Tools] Activating tool: ${toolName}`);

    // Deactivate current tool
    if (measurementState.activeTool) {
        cleanupCurrentMeasurement();
    }

    // Update active tool state
    measurementState.activeTool = toolName;

    // Update button active classes
    updateToolButtonActiveState(toolName);

    // Update cursor
    updateCursor(toolName);

    // Update tool button states (enable/disable based on scale)
    updateToolButtonStates();

    // If scale tool activated, show instructions
    if (toolName === 'scale') {
        console.log('[Measurement Tools] Scale tool active - click two points to set scale');
    }
}

/**
 * Update tool button active state
 * @param {string} activeToolName - Name of currently active tool
 */
function updateToolButtonActiveState(activeToolName) {
    const toolButtons = document.querySelectorAll('[id^="tool-"]');
    toolButtons.forEach(btn => {
        const toolName = btn.id.replace('tool-', '');
        if (toolName === activeToolName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Update cursor based on active tool
 * @param {string} toolName - Name of active tool
 */
function updateCursor(toolName) {
    const canvasEl = measurementState.fabricCanvas?.getElement();
    if (!canvasEl) return;

    if (toolName && toolName !== 'count') {
        // Crosshair cursor for measurement tools
        canvasEl.style.cursor = 'crosshair';
    } else if (toolName === 'count') {
        // Pointer cursor for count tool
        canvasEl.style.cursor = 'pointer';
    } else {
        // Default cursor when no tool active
        canvasEl.style.cursor = 'default';
    }
}

/**
 * Update tool button states (enabled/disabled)
 * Enable linear and area tools only if scale is set for current page
 */
function updateToolButtonStates() {
    const currentPage = viewerState?.currentPage || 1;
    const hasScale = !!measurementState.scaleData[currentPage];

    const linearBtn = document.getElementById('tool-linear');
    const areaBtn = document.getElementById('tool-area');

    if (linearBtn) {
        if (hasScale) {
            linearBtn.disabled = false;
            linearBtn.classList.remove('disabled');
            linearBtn.title = 'Linear Measurement';
        } else {
            linearBtn.disabled = true;
            linearBtn.classList.add('disabled');
            linearBtn.title = 'Set scale first to enable linear measurements';
        }
    }

    if (areaBtn) {
        if (hasScale) {
            areaBtn.disabled = false;
            areaBtn.classList.remove('disabled');
            areaBtn.title = 'Area Measurement';
        } else {
            areaBtn.disabled = true;
            areaBtn.classList.add('disabled');
            areaBtn.title = 'Set scale first to enable area measurements';
        }
    }
}

/**
 * Handle canvas mouse down event
 * Initiates measurement drawing based on active tool
 */
function handleCanvasMouseDown(event) {
    if (!measurementState.activeTool) {
        return;
    }

    // Get pointer coordinates
    const pointer = measurementState.fabricCanvas.getPointer(event.e);
    console.log('[Measurement Tools] Mouse down at:', pointer);

    // Handle based on active tool
    switch (measurementState.activeTool) {
        case 'scale':
            handleScaleClick(pointer);
            break;
        case 'linear':
            // To be implemented in future tasks
            console.log('[Measurement Tools] Linear tool - to be implemented');
            break;
        case 'area':
            // To be implemented in future tasks
            console.log('[Measurement Tools] Area tool - to be implemented');
            break;
        case 'count':
            // To be implemented in future tasks
            console.log('[Measurement Tools] Count tool - to be implemented');
            break;
    }
}

/**
 * Handle canvas mouse move event
 * Updates temporary preview objects during drawing
 */
function handleCanvasMouseMove(event) {
    if (!measurementState.activeTool || !measurementState.isDrawing) {
        return;
    }

    const pointer = measurementState.fabricCanvas.getPointer(event.e);

    // Handle based on active tool
    switch (measurementState.activeTool) {
        case 'scale':
            updateScalePreview(pointer);
            break;
        // Other tools to be implemented in future tasks
    }
}

/**
 * Handle canvas mouse up event
 * Finalizes measurement objects
 */
function handleCanvasMouseUp(event) {
    // To be implemented for drag-based tools in future tasks
}

/**
 * Handle scale calibration click
 * Collects two points to calculate pixel distance for scale
 */
function handleScaleClick(pointer) {
    const currentPage = viewerState?.currentPage || 1;

    // First click - store first point
    if (measurementState.currentPoints.length === 0) {
        measurementState.currentPoints.push(pointer);
        measurementState.isDrawing = true;

        console.log('[Measurement Tools] Scale point 1 set:', pointer);

        // Create temporary point marker
        const circle = new fabric.Circle({
            left: pointer.x - 3,
            top: pointer.y - 3,
            radius: 3,
            fill: '#FF6B35',
            stroke: '#003B5C',
            strokeWidth: 1,
            selectable: false,
            evented: false,
            objectType: 'scale-temp'
        });

        measurementState.fabricCanvas.add(circle);
        measurementState.fabricCanvas.renderAll();

    } else if (measurementState.currentPoints.length === 1) {
        // Second click - calculate distance and show modal
        measurementState.currentPoints.push(pointer);
        measurementState.isDrawing = false;

        console.log('[Measurement Tools] Scale point 2 set:', pointer);

        const point1 = measurementState.currentPoints[0];
        const point2 = measurementState.currentPoints[1];

        // Calculate pixel distance
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        const pixelDistance = Math.sqrt(dx * dx + dy * dy);

        console.log('[Measurement Tools] Scale pixel distance:', pixelDistance);

        // Create final line
        if (measurementState.tempObject) {
            measurementState.fabricCanvas.remove(measurementState.tempObject);
        }

        const line = new fabric.Line([point1.x, point1.y, point2.x, point2.y], {
            stroke: '#FF6B35',
            strokeWidth: 2,
            selectable: false,
            evented: false,
            objectType: 'scale-temp'
        });

        measurementState.tempObject = line;
        measurementState.fabricCanvas.add(line);
        measurementState.fabricCanvas.renderAll();

        // Show scale modal
        showScaleModal(pixelDistance, currentPage);
    }
}

/**
 * Update scale preview line during drawing
 * Shows temporary line from first point to current mouse position
 */
function updateScalePreview(pointer) {
    if (measurementState.currentPoints.length !== 1) {
        return;
    }

    const point1 = measurementState.currentPoints[0];

    // Remove existing preview line
    if (measurementState.tempObject) {
        measurementState.fabricCanvas.remove(measurementState.tempObject);
    }

    // Create new preview line
    const line = new fabric.Line([point1.x, point1.y, pointer.x, pointer.y], {
        stroke: '#FF6B35',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        objectType: 'scale-temp'
    });

    measurementState.tempObject = line;
    measurementState.fabricCanvas.add(line);
    measurementState.fabricCanvas.renderAll();
}

/**
 * Show scale calibration modal
 * @param {number} pixelDistance - Distance in pixels between two scale points
 * @param {number} pageNumber - Current page number
 */
function showScaleModal(pixelDistance, pageNumber) {
    const modal = document.getElementById('scale-modal');
    if (!modal) {
        console.error('[Measurement Tools] Scale modal not found!');
        return;
    }

    // Store pixel distance for form submission
    modal.dataset.pixelDistance = pixelDistance;
    modal.dataset.pageNumber = pageNumber;

    // Clear form
    const form = document.getElementById('scale-form');
    if (form) {
        form.reset();
    }

    // Show modal
    modal.style.display = 'flex';
    console.log('[Measurement Tools] Scale modal shown');

    // Focus on distance input
    const distanceInput = document.getElementById('scale-distance');
    if (distanceInput) {
        setTimeout(() => distanceInput.focus(), 100);
    }
}

/**
 * Hide scale calibration modal
 */
function hideScaleModal() {
    const modal = document.getElementById('scale-modal');
    if (modal) {
        modal.style.display = 'none';
        console.log('[Measurement Tools] Scale modal hidden');
    }
}

/**
 * Attach modal event listeners
 * Handles scale modal form submission and cancellation
 */
function attachModalListeners() {
    console.log('[Measurement Tools] Attaching modal listeners...');

    const scaleForm = document.getElementById('scale-form');
    const scaleCancelBtn = document.getElementById('scale-cancel');
    const scaleModal = document.getElementById('scale-modal');

    // Scale form submission
    if (scaleForm) {
        scaleForm.addEventListener('submit', (event) => {
            event.preventDefault();
            handleScaleFormSubmit();
        });
    }

    // Scale cancel button
    if (scaleCancelBtn) {
        scaleCancelBtn.addEventListener('click', () => {
            console.log('[Measurement Tools] Scale cancelled');
            hideScaleModal();
            cleanupCurrentMeasurement();
            activateTool(null);
        });
    }

    // Close modal on background click
    if (scaleModal) {
        scaleModal.addEventListener('click', (event) => {
            if (event.target === scaleModal) {
                console.log('[Measurement Tools] Scale cancelled (background click)');
                hideScaleModal();
                cleanupCurrentMeasurement();
                activateTool(null);
            }
        });
    }

    console.log('[Measurement Tools] Modal listeners attached');
}

/**
 * Handle scale form submission
 * Calculates and stores scale ratio
 */
function handleScaleFormSubmit() {
    console.log('[Measurement Tools] Processing scale form submission...');

    try {
        const modal = document.getElementById('scale-modal');
        const pixelDistance = parseFloat(modal.dataset.pixelDistance);
        const pageNumber = parseInt(modal.dataset.pageNumber);

        // Get form values
        const distanceInput = document.getElementById('scale-distance');
        const unitsSelect = document.getElementById('scale-units');

        const realDistance = parseFloat(distanceInput.value);
        const units = unitsSelect.value;

        // Validate inputs
        if (!realDistance || realDistance <= 0) {
            showError('Please enter a valid distance greater than 0.');
            return;
        }

        // Calculate scale ratio (pixels per unit)
        const ratio = pixelDistance / realDistance;

        // Store scale data
        measurementState.scaleData[pageNumber] = {
            pixelDistance,
            realDistance,
            units,
            ratio
        };

        console.log('[Measurement Tools] Scale set for page', pageNumber, ':', {
            pixelDistance,
            realDistance,
            units,
            ratio
        });

        // Hide modal
        hideScaleModal();

        // Clean up temporary objects
        cleanupCurrentMeasurement();

        // Deactivate scale tool
        activateTool(null);

        // Update tool button states (enable linear/area tools)
        updateToolButtonStates();

        // Show success message (optional)
        console.log(`[Measurement Tools] Scale calibrated: 1 ${units} = ${ratio.toFixed(2)} pixels`);

    } catch (error) {
        console.error('[Measurement Tools] Error processing scale form:', error);
        showError('Failed to set scale. Please try again.');
    }
}

/**
 * Handle keyboard events
 * ESC key cancels current measurement
 */
function handleKeyDown(event) {
    // ESC key - cancel current measurement
    if (event.key === 'Escape') {
        console.log('[Measurement Tools] ESC key pressed - canceling measurement');

        // Hide any open modals
        hideScaleModal();

        // Clean up current measurement
        cleanupCurrentMeasurement();

        // Deactivate tool
        activateTool(null);
    }
}

/**
 * Clean up current measurement in progress
 * Removes temporary objects and resets state
 */
function cleanupCurrentMeasurement() {
    console.log('[Measurement Tools] Cleaning up current measurement...');

    if (!measurementState.fabricCanvas) {
        return;
    }

    // Remove all temporary objects
    const objects = measurementState.fabricCanvas.getObjects();
    const tempObjects = objects.filter(obj => obj.objectType === 'scale-temp');

    tempObjects.forEach(obj => {
        measurementState.fabricCanvas.remove(obj);
    });

    // Clear temporary state
    measurementState.tempObject = null;
    measurementState.isDrawing = false;
    measurementState.currentPoints = [];

    measurementState.fabricCanvas.renderAll();

    console.log('[Measurement Tools] Cleanup complete');
}

// Export for global access
if (typeof window !== 'undefined') {
    window.measurementState = measurementState;
    window.initMeasurementTools = initMeasurementTools;
    window.syncCanvasDimensions = syncCanvasDimensions; // For debugging
}

console.log('[Measurement Tools] Module script loaded');
