/**
 * Measurement Tools Module
 * Module 1.2 - Basic Measurement Tools
 *
 * Provides interactive measurement capabilities using Fabric.js canvas overlay
 * over PDF.js viewer. Supports linear, area, and count measurements with
 * scale calibration for accurate real-world measurements.
 *
 * EVENT SYSTEM (Task 12):
 * -----------------------
 * This module emits CustomEvents for all measurement lifecycle operations:
 *
 * 1. measurement:created - Emitted when a new measurement is created
 *    - Linear measurement (Task 6)
 *    - Area measurement (Task 7)
 *    - Count marker (Task 8)
 *
 * 2. measurement:updated - Emitted when a measurement is modified
 *    - Property changes via properties panel (Task 11)
 *    - Visual edits (move, reshape) (Task 9)
 *
 * 3. measurement:deleted - Emitted when a measurement is deleted (Task 9)
 *
 * 4. measurement:selected - Emitted when a measurement is selected (Task 12)
 *
 * 5. measurement:deselected - Emitted when selection is cleared (Task 12)
 *
 * Event Detail Structure:
 * {
 *     type: 'linear|area|count',
 *     id: 'unique-id',
 *     label: 'Measurement Label',
 *     category: 'Category Name',
 *     color: '#HEX',
 *     value: number (for linear/area),
 *     unit: 'ft|ft²' (for linear/area),
 *     points: [...] (coordinates),
 *     timestamp: 'ISO-8601',
 *     page: number
 * }
 *
 * Usage Example (Module 1.3 - Measurement List):
 * document.addEventListener('measurement:created', (e) => {
 *     console.log('New measurement:', e.detail);
 *     // Update measurement list UI
 * });
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
    activeCountCategory: null,   // Currently selected category for count tool
    undoStack: [],               // Stack for undo operations (per page)
    redoStack: [],               // Stack for redo operations (per page)
    lastClickTime: 0,            // Track last click time for double-click detection
    tempPreviewLine: null        // Temporary preview line for linear tool
};

/**
 * Status bar elements for real-time measurement display
 */
const statusBar = {
    container: null,
    tool: null,
    points: null,
    current: null,
    scale: null
};

/**
 * Initialize status bar elements
 */
function initStatusBar() {
    statusBar.container = document.getElementById('measurement-status');
    statusBar.tool = document.getElementById('status-tool');
    statusBar.points = document.getElementById('status-points');
    statusBar.current = document.getElementById('status-current');
    statusBar.scale = document.getElementById('status-scale');

    console.log('[Measurement Tools] Status bar initialized');
}

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

    // Initialize status bar
    initStatusBar();

    // Task 14: Add persistence buttons to toolbar
    addPersistenceButtons();

    // Task 14: Load measurements from localStorage
    loadMeasurementsFromStorage();

    // Task 15: Initialize scale indicator
    updateScaleIndicator();

    // Task 16: Initialize measurement list UI
    initMeasurementList();

    // Task 17: Attach export listeners
    attachExportListeners();

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

    // Task 15: Update scale indicator for new page
    onPageChangeUpdateScale();
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
            // Count tool doesn't require scale calibration
            activateTool('count');
        });
    }

    // Attach Fabric canvas event listeners for drawing
    if (measurementState.fabricCanvas) {
        measurementState.fabricCanvas.on('mouse:down', handleCanvasMouseDown);
        measurementState.fabricCanvas.on('mouse:move', handleCanvasMouseMove);
        measurementState.fabricCanvas.on('mouse:up', handleCanvasMouseUp);
        
        // Task 9: Attach event listeners for selection and editing
        measurementState.fabricCanvas.on('object:modified', handleObjectModified);
        measurementState.fabricCanvas.on('selection:created', handleSelectionCreated);
        measurementState.fabricCanvas.on('selection:cleared', handleSelectionCleared);
        measurementState.fabricCanvas.on('object:moving', handleObjectMoving);
        
        console.log('[Measurement Tools] Task 9: Selection and editing event listeners attached');

        // Task 11: Attach double-click event listener for properties panel
        measurementState.fabricCanvas.on('mouse:dblclick', handleMeasurementDoubleClick);
        
        console.log('[Measurement Tools] Task 11: Double-click event listener attached for properties panel');
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
 * Update status bar scale display
 * @param {Object} scaleData - Scale calibration data
 */
function updateScaleStatus(scaleData) {
    if (!statusBar.scale) return;

    if (scaleData && scaleData.ratio) {
        statusBar.scale.textContent = `1:${scaleData.ratio.toFixed(2)} (${scaleData.units})`;
    } else {
        statusBar.scale.textContent = 'Not Set';
    }
}

/**
 * Update status bar display
 * @param {string} toolName - Active tool name
 */
function updateStatusBar(toolName) {
    if (!statusBar.container) return;

    const currentPage = viewerState?.currentPage || 1;
    const scaleData = measurementState.scaleData[currentPage];

    if (toolName) {
        // Show status bar
        statusBar.container.style.display = 'flex';

        // Update tool name
        const toolNames = {
            'scale': 'Scale Calibration',
            'linear': 'Linear Measurement',
            'area': 'Area Measurement',
            'count': 'Count Marker'
        };
        statusBar.tool.textContent = toolNames[toolName] || 'None';

        // Reset points and current values
        statusBar.points.textContent = '0';
        statusBar.current.textContent = '-';
        statusBar.current.classList.remove('highlight');

        // Update scale status
        updateScaleStatus(scaleData);
    } else {
        // Hide status bar when no tool is active
        statusBar.container.style.display = 'none';
    }
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

    // Update status bar
    updateStatusBar(toolName);

    // If count tool activated, prompt for category
    if (toolName === 'count') {
        const category = promptForCountCategory();
        if (!category) {
            console.log('[Measurement Tools] Count tool cancelled - no category selected');
            activateTool(null);
            return;
        }
        measurementState.activeCountCategory = category;
        console.log('[Measurement Tools] Count tool active - category:', category);
    }

    // If scale tool activated, show instructions
    if (toolName === 'scale') {
        console.log('[Measurement Tools] Scale tool active - click two points to set scale');
    }

    // Clear count category when deactivating count tool
    if (toolName !== 'count') {
        measurementState.activeCountCategory = null;
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
            handleLinearClick(pointer);
            break;
        case 'area':
            handleAreaClick(pointer);
            break;
        case 'count':
            handleCountClick(pointer);
            break;
    }
}

/**
 * Handle canvas mouse move event
 * Updates temporary preview objects during drawing
 */
function handleCanvasMouseMove(event) {
    const pointer = measurementState.fabricCanvas.getPointer(event.e);

    // Handle linear tool preview even when not isDrawing
    if (measurementState.activeTool === 'linear' && measurementState.currentPoints.length > 0) {
        updateLinearPreview(pointer);
        return;
    }

    // Handle area tool preview even when not isDrawing
    if (measurementState.activeTool === 'area' && measurementState.currentPoints.length > 0) {
        updateAreaPreview(pointer);
        return;
    }

    if (!measurementState.activeTool || !measurementState.isDrawing) {
        return;
    }

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

        // Update status bar
        if (statusBar.points) {
            statusBar.points.textContent = '1';
        }

        // Create temporary point marker
        const circle = new fabric.Circle({
            left: pointer.x - 3,
            top: pointer.y - 3,
            radius: 3,
            fill: '#FF5A1F',
            stroke: '#23272A',
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

        // Update status bar
        if (statusBar.points) {
            statusBar.points.textContent = '2';
        }
        if (statusBar.current) {
            statusBar.current.textContent = `${pixelDistance.toFixed(2)} px`;
            statusBar.current.classList.add('highlight');
        }

        // Create final line
        if (measurementState.tempObject) {
            measurementState.fabricCanvas.remove(measurementState.tempObject);
        }

        const line = new fabric.Line([point1.x, point1.y, point2.x, point2.y], {
            stroke: '#FF5A1F',
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
        stroke: '#FF5A1F',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        objectType: 'scale-temp'
    });

    measurementState.tempObject = line;
    measurementState.fabricCanvas.add(line);
    measurementState.fabricCanvas.renderAll();

    // Update status bar with preview pixel distance
    if (statusBar.current) {
        const dx = pointer.x - point1.x;
        const dy = pointer.y - point1.y;
        const pixelDistance = Math.sqrt(dx * dx + dy * dy);
        statusBar.current.textContent = `${pixelDistance.toFixed(2)} px`;
        statusBar.current.classList.add('highlight');
    }
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

        // Update scale status in status bar
        updateScaleStatus(measurementState.scaleData[pageNumber]);

        // Task 15: Update scale indicator
        updateScaleIndicator();

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
 * Handle linear measurement click
 * Collects points for polyline measurement
 * First click starts the line, subsequent clicks add vertices
 * Double-click or Enter key finishes the line
 */
function handleLinearClick(pointer) {
    const currentPage = viewerState?.currentPage || 1;
    const currentTime = Date.now();

    // Check for double-click (within 300ms of last click)
    const isDoubleClick = (currentTime - measurementState.lastClickTime) < 300;
    measurementState.lastClickTime = currentTime;

    // If double-click and we have at least 2 points, finish the measurement
    if (isDoubleClick && measurementState.currentPoints.length >= 2) {
        console.log('[Measurement Tools] Double-click detected - finishing linear measurement');
        finishLinearMeasurement();
        return;
    }

    // Check for snap to existing endpoints
    const snappedPoint = findSnapPoint(pointer);
    const pointToAdd = snappedPoint || pointer;

    // Add point to current points array
    measurementState.currentPoints.push({ x: pointToAdd.x, y: pointToAdd.y });

    console.log('[Measurement Tools] Linear point added:', pointToAdd,
        `(Total points: ${measurementState.currentPoints.length})`);

    // Update status bar with point count
    if (statusBar.points) {
        statusBar.points.textContent = measurementState.currentPoints.length;
    }

    // Update real-time measurement display
    if (measurementState.currentPoints.length >= 2) {
        updateLinearStatusDisplay();
    }

    // First click - create first point marker
    if (measurementState.currentPoints.length === 1) {
        measurementState.isDrawing = true;

        // Create point marker
        const circle = new fabric.Circle({
            left: pointToAdd.x - 4,
            top: pointToAdd.y - 4,
            radius: 4,
            fill: '#FF5A1F',
            stroke: '#23272A',
            strokeWidth: 2,
            selectable: false,
            evented: false,
            objectType: 'linear-temp'
        });

        measurementState.fabricCanvas.add(circle);
        measurementState.fabricCanvas.renderAll();
    } else {
        // Subsequent clicks - update the polyline
        updateLinearPolyline();

        // Add point marker
        const circle = new fabric.Circle({
            left: pointToAdd.x - 4,
            top: pointToAdd.y - 4,
            radius: 4,
            fill: '#FF5A1F',
            stroke: '#23272A',
            strokeWidth: 2,
            selectable: false,
            evented: false,
            objectType: 'linear-temp'
        });

        measurementState.fabricCanvas.add(circle);
        measurementState.fabricCanvas.renderAll();
    }
}

/**
 * Find snap point near existing endpoints
 * Returns snapped point if within 10px radius, null otherwise
 */
function findSnapPoint(pointer) {
    const snapRadius = 10;
    const objects = measurementState.fabricCanvas.getObjects();

    // Find all existing polylines (linear measurements)
    const polylines = objects.filter(obj => obj.objectType === 'linear-measurement');

    for (const polyline of polylines) {
        if (!polyline.points) continue;

        // Check first and last points
        const points = polyline.points;
        const endpoints = [
            { x: points[0].x + polyline.left, y: points[0].y + polyline.top },
            { x: points[points.length - 1].x + polyline.left, y: points[points.length - 1].y + polyline.top }
        ];

        for (const endpoint of endpoints) {
            const dx = pointer.x - endpoint.x;
            const dy = pointer.y - endpoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= snapRadius) {
                console.log('[Measurement Tools] Snapped to endpoint:', endpoint);
                return endpoint;
            }
        }
    }

    return null;
}

/**
 * Update linear polyline during drawing
 * Creates/updates temporary polyline with all current points
 */
function updateLinearPolyline() {
    // Remove existing temporary polyline
    if (measurementState.tempObject) {
        measurementState.fabricCanvas.remove(measurementState.tempObject);
    }

    // Create points array for Fabric polyline (relative to 0,0)
    const points = measurementState.currentPoints.map(p => ({ x: p.x, y: p.y }));

    // Create new polyline
    const polyline = new fabric.Polyline(points, {
        stroke: '#FF5A1F',
        strokeWidth: 2,
        fill: null,
        selectable: false,
        evented: false,
        objectType: 'linear-temp',
        objectCaching: false
    });

    measurementState.tempObject = polyline;
    measurementState.fabricCanvas.add(polyline);
    measurementState.fabricCanvas.renderAll();
}

/**
 * Update linear measurement status display
 * Shows real-time length calculation in status bar
 */
function updateLinearStatusDisplay() {
    const currentPage = viewerState?.currentPage || 1;
    const scaleData = measurementState.scaleData[currentPage];

    if (!statusBar.current || !scaleData) return;

    const points = measurementState.currentPoints;
    if (points.length < 2) return;

    // Calculate total pixel length
    let totalPixelLength = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const dx = points[i + 1].x - points[i].x;
        const dy = points[i + 1].y - points[i].y;
        totalPixelLength += Math.sqrt(dx * dx + dy * dy);
    }

    // Convert to real-world units
    const realLength = (totalPixelLength / scaleData.ratio).toFixed(2);

    // Update status bar
    statusBar.current.textContent = `${realLength} ${scaleData.units}`;
    statusBar.current.classList.add('highlight');
}

/**
 * Update linear preview line
 * Shows preview line from last point to current mouse position
 */
function updateLinearPreview(pointer) {
    if (measurementState.currentPoints.length === 0) {
        return;
    }

    // Remove existing preview line
    if (measurementState.tempPreviewLine) {
        measurementState.fabricCanvas.remove(measurementState.tempPreviewLine);
    }

    // Check for snap point
    const snappedPoint = findSnapPoint(pointer);
    const targetPoint = snappedPoint || pointer;

    // Create preview points including all current points plus preview point
    const previewPoints = [
        ...measurementState.currentPoints.map(p => ({ x: p.x, y: p.y })),
        { x: targetPoint.x, y: targetPoint.y }
    ];

    // Create preview polyline
    const previewLine = new fabric.Polyline(previewPoints, {
        stroke: '#FF5A1F',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        fill: null,
        selectable: false,
        evented: false,
        objectType: 'linear-temp',
        objectCaching: false
    });

    measurementState.tempPreviewLine = previewLine;
    measurementState.fabricCanvas.add(previewLine);
    measurementState.fabricCanvas.renderAll();

    // Update status bar with preview length
    const currentPage = viewerState?.currentPage || 1;
    const scaleData = measurementState.scaleData[currentPage];

    if (statusBar.current && scaleData && previewPoints.length >= 2) {
        let totalPixelLength = 0;
        for (let i = 0; i < previewPoints.length - 1; i++) {
            const dx = previewPoints[i + 1].x - previewPoints[i].x;
            const dy = previewPoints[i + 1].y - previewPoints[i].y;
            totalPixelLength += Math.sqrt(dx * dx + dy * dy);
        }
        const realLength = (totalPixelLength / scaleData.ratio).toFixed(2);
        statusBar.current.textContent = `${realLength} ${scaleData.units}`;
        statusBar.current.classList.add('highlight');
    }

    // If snapped, show visual feedback
    if (snappedPoint) {
        // Create temporary highlight circle
        const snapCircle = new fabric.Circle({
            left: snappedPoint.x - 6,
            top: snappedPoint.y - 6,
            radius: 6,
            fill: 'transparent',
            stroke: '#00FF00',
            strokeWidth: 2,
            selectable: false,
            evented: false,
            objectType: 'linear-temp'
        });

        measurementState.fabricCanvas.add(snapCircle);
        measurementState.fabricCanvas.renderAll();
    }
}

/**
 * Finish linear measurement
 * Calculates total length, prompts for category, creates final objects
 */
function finishLinearMeasurement() {
    try {
        const currentPage = viewerState?.currentPage || 1;
        const scaleData = measurementState.scaleData[currentPage];

        if (!scaleData) {
            showError('Scale not set for this page. Please set scale first.');
            cleanupCurrentMeasurement();
            return;
        }

        if (measurementState.currentPoints.length < 2) {
            showError('At least 2 points required for linear measurement.');
            cleanupCurrentMeasurement();
            return;
        }

        console.log('[Measurement Tools] Finishing linear measurement with',
            measurementState.currentPoints.length, 'points');

        // Calculate total length in pixels
        let totalPixelLength = 0;
        const points = measurementState.currentPoints;

        for (let i = 0; i < points.length - 1; i++) {
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;
            const segmentLength = Math.sqrt(dx * dx + dy * dy);
            totalPixelLength += segmentLength;
        }

        // Convert to real-world units using scale ratio
        const realLength = totalPixelLength / scaleData.ratio;

        console.log('[Measurement Tools] Calculated length:', {
            pixelLength: totalPixelLength.toFixed(2),
            realLength: realLength.toFixed(2),
            units: scaleData.units
        });

        // Prompt for category
        const category = promptForCategory();
        if (!category) {
            console.log('[Measurement Tools] Linear measurement cancelled - no category selected');
            cleanupCurrentMeasurement();
            return;
        }

        // Get category color
        const categoryColor = getCategoryColor(category);

        // Create final polyline - Task 9: Enable selection and editing
        const fabricPoints = points.map(p => ({ x: p.x, y: p.y }));
        const polyline = new fabric.Polyline(fabricPoints, {
            stroke: categoryColor,
            strokeWidth: 3,
            fill: null,
            selectable: true,         // Enable selection (Task 9)
            evented: true,
            objectType: 'linear-measurement',
            objectCaching: false,
            hasControls: true,        // Enable vertex control points (Task 9)
            hasBorders: true,
            lockMovementX: false,     // Allow movement (Task 9)
            lockMovementY: false,     // Allow movement (Task 9)
            cornerStyle: 'circle',    // Visual style for control points
            cornerSize: 6,
            transparentCorners: false,
            cornerColor: '#00ff00'
        });

        // Calculate midpoint for text label
        const midpoint = calculatePolylineMidpoint(points);

        // Create text label - Task 9: Make text moveable with measurement
        const labelText = `${realLength.toFixed(1)} ${scaleData.units}`;
        const text = new fabric.Text(labelText, {
            left: midpoint.x,
            top: midpoint.y - 20,
            fontSize: 14,
            fontFamily: 'Arial',
            fill: '#FFFFFF',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 4,
            selectable: false,        // Text not independently selectable (Task 9)
            evented: false,
            objectType: 'linear-text',
            hasControls: false,
            hasBorders: false
        });

        // Clean up temporary objects
        cleanupCurrentMeasurement();

        // Add final objects to canvas
        measurementState.fabricCanvas.add(polyline);
        measurementState.fabricCanvas.add(text);
        measurementState.fabricCanvas.renderAll();

        // Create measurement data object
        const measurementId = generateMeasurementId();
        const measurementData = {
            type: 'linear',
            id: measurementId,
            label: `Linear #${measurementId}`,
            category: category,
            points: points,
            pixelLength: totalPixelLength,
            realLength: realLength,
            units: scaleData.units,
            created: new Date().toISOString(),
            fabricObjects: [polyline.id, text.id]
        };

        // Store measurement data
        if (!measurementState.measurements[currentPage]) {
            measurementState.measurements[currentPage] = { objects: [], data: [] };
        }
        if (!measurementState.measurements[currentPage].data) {
            measurementState.measurements[currentPage].data = [];
        }
        measurementState.measurements[currentPage].data.push(measurementData);

        console.log('[Measurement Tools] Linear measurement created:', measurementData);

        // Task 12: Emit standardized creation event
        emitMeasurementEvent('measurement:created', measurementData);

        // Task 13: Push to undo stack
        pushToUndoStack('create', measurementData);

        // Task 14: Auto-save to localStorage
        saveMeasurementsToStorage();

        // Keep linear tool active for next measurement
        // User can press ESC or click another tool to deactivate
        console.log('[Measurement Tools] Linear measurement complete. Tool remains active.');

    } catch (error) {
        console.error('[Measurement Tools] Error finishing linear measurement:', error);
        showError('Failed to create linear measurement. Please try again.');
        cleanupCurrentMeasurement();
    }
}

/**
 * Prompt user for measurement category
 * Returns category string or null if cancelled
 */
function promptForCategory() {
    const categories = ['HDD', 'Fiber', 'Trench', 'Other'];
    let categoryMessage = 'Select measurement category:\n\n';
    categories.forEach((cat, idx) => {
        categoryMessage += `${idx + 1}. ${cat}\n`;
    });
    categoryMessage += '\nEnter number (1-4):';

    const input = prompt(categoryMessage);

    if (!input) {
        return null;
    }

    const categoryIndex = parseInt(input) - 1;

    if (categoryIndex >= 0 && categoryIndex < categories.length) {
        return categories[categoryIndex];
    }

    // If invalid input, default to 'Other'
    return 'Other';
}

/**
 * Get color for measurement category
 * @param {string} category - Category name
 * @returns {string} Hex color code
 */
function getCategoryColor(category) {
    const colors = {
        'HDD': '#FF5A1F',      // Orange
        'Fiber': '#0066CC',    // Blue
        'Trench': '#8B4513',   // Brown
        'Other': '#666666'     // Gray
    };

    return colors[category] || colors['Other'];
}

/**
 * Calculate midpoint of polyline for text label placement
 * @param {Array} points - Array of {x, y} points
 * @returns {Object} Midpoint {x, y}
 */
function calculatePolylineMidpoint(points) {
    if (points.length === 0) {
        return { x: 0, y: 0 };
    }

    // Calculate center point along the polyline path
    // Find the point at approximately 50% of total length
    let totalLength = 0;
    const segments = [];

    for (let i = 0; i < points.length - 1; i++) {
        const dx = points[i + 1].x - points[i].x;
        const dy = points[i + 1].y - points[i].y;
        const length = Math.sqrt(dx * dx + dy * dy);
        segments.push({ start: points[i], end: points[i + 1], length: length });
        totalLength += length;
    }

    const halfLength = totalLength / 2;
    let accumulatedLength = 0;

    for (const segment of segments) {
        if (accumulatedLength + segment.length >= halfLength) {
            // This segment contains the midpoint
            const ratio = (halfLength - accumulatedLength) / segment.length;
            return {
                x: segment.start.x + (segment.end.x - segment.start.x) * ratio,
                y: segment.start.y + (segment.end.y - segment.start.y) * ratio
            };
        }
        accumulatedLength += segment.length;
    }

    // Fallback to geometric center
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    return {
        x: sumX / points.length,
        y: sumY / points.length
    };
}

/**
 * Generate unique measurement ID
 * Simple incrementing counter for now
 */
let measurementIdCounter = 1;
function generateMeasurementId() {
    return measurementIdCounter++;
}

/**
 * Handle area measurement click
 * Collects vertices for polygon measurement
 * First click starts the polygon, subsequent clicks add vertices
 * Click near first point or press Enter to close polygon
 */
function handleAreaClick(pointer) {
    const currentPage = viewerState?.currentPage || 1;
    const closePolygonRadius = 10; // 10px radius for closing polygon

    // Check if clicking near first point to close polygon (if we have at least 3 points)
    if (measurementState.currentPoints.length >= 3) {
        const firstPoint = measurementState.currentPoints[0];
        const dx = pointer.x - firstPoint.x;
        const dy = pointer.y - firstPoint.y;
        const distanceToFirst = Math.sqrt(dx * dx + dy * dy);

        if (distanceToFirst <= closePolygonRadius) {
            console.log('[Measurement Tools] Clicking first point - closing polygon');
            finishAreaMeasurement();
            return;
        }
    }

    // Add vertex to current points array
    measurementState.currentPoints.push({ x: pointer.x, y: pointer.y });

    console.log('[Measurement Tools] Area vertex added:', pointer,
        `(Total vertices: ${measurementState.currentPoints.length})`);

    // Update status bar with vertex count
    if (statusBar.points) {
        statusBar.points.textContent = measurementState.currentPoints.length;
    }

    // Update real-time area display (if we have at least 3 points)
    if (measurementState.currentPoints.length >= 3) {
        updateAreaStatusDisplay();
    }

    // First click - create first vertex marker
    if (measurementState.currentPoints.length === 1) {
        measurementState.isDrawing = true;

        // Create vertex marker
        const circle = new fabric.Circle({
            left: pointer.x - 5,
            top: pointer.y - 5,
            radius: 5,
            fill: '#FF5A1F',
            stroke: '#23272A',
            strokeWidth: 2,
            selectable: false,
            evented: false,
            objectType: 'area-temp'
        });

        measurementState.fabricCanvas.add(circle);
        measurementState.fabricCanvas.renderAll();
    } else {
        // Subsequent clicks - add vertex marker
        const circle = new fabric.Circle({
            left: pointer.x - 5,
            top: pointer.y - 5,
            radius: 5,
            fill: '#FF5A1F',
            stroke: '#23272A',
            strokeWidth: 2,
            selectable: false,
            evented: false,
            objectType: 'area-temp'
        });

        measurementState.fabricCanvas.add(circle);
        measurementState.fabricCanvas.renderAll();
    }
}

/**
 * Update area measurement status display
 * Shows real-time area calculation in status bar
 */
function updateAreaStatusDisplay() {
    const currentPage = viewerState?.currentPage || 1;
    const scaleData = measurementState.scaleData[currentPage];

    if (!statusBar.current || !scaleData) return;

    const vertices = measurementState.currentPoints;
    if (vertices.length < 3) return;

    // Calculate area using shoelace formula
    const shoelaceArea = Math.abs(
        vertices.reduce((sum, v, i, arr) => {
            const next = arr[(i + 1) % arr.length];
            return sum + (v.x * next.y - next.x * v.y);
        }, 0) / 2
    );

    // Convert to real-world units
    const realArea = (shoelaceArea / (scaleData.ratio * scaleData.ratio)).toFixed(2);

    // Update status bar
    statusBar.current.textContent = `${realArea} sq ${scaleData.units}`;
    statusBar.current.classList.add('highlight');
}

/**
 * Update area preview polygon
 * Shows preview polygon edge from last vertex to cursor
 * Shows semi-transparent polygon fill with all current vertices + cursor point
 */
function updateAreaPreview(pointer) {
    if (measurementState.currentPoints.length === 0) {
        return;
    }

    // Remove existing temporary preview objects
    const objects = measurementState.fabricCanvas.getObjects();
    const tempPreviewObjects = objects.filter(obj => obj.objectType === 'area-preview');
    tempPreviewObjects.forEach(obj => {
        measurementState.fabricCanvas.remove(obj);
    });

    // Create preview points including all current vertices + cursor point
    const previewPoints = [
        ...measurementState.currentPoints.map(p => ({ x: p.x, y: p.y })),
        { x: pointer.x, y: pointer.y }
    ];

    // If we have at least 3 points (including cursor), show preview polygon fill
    if (previewPoints.length >= 3) {
        const previewPolygon = new fabric.Polygon(previewPoints, {
            fill: 'rgba(255, 107, 53, 0.15)', // Very light orange
            stroke: '#FF5A1F',
            strokeWidth: 2,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
            objectType: 'area-preview',
            objectCaching: false
        });

        measurementState.fabricCanvas.add(previewPolygon);

        // Update status bar with preview area
        const currentPage = viewerState?.currentPage || 1;
        const scaleData = measurementState.scaleData[currentPage];

        if (statusBar.current && scaleData) {
            const shoelaceArea = Math.abs(
                previewPoints.reduce((sum, v, i, arr) => {
                    const next = arr[(i + 1) % arr.length];
                    return sum + (v.x * next.y - next.x * v.y);
                }, 0) / 2
            );
            const realArea = (shoelaceArea / (scaleData.ratio * scaleData.ratio)).toFixed(2);
            statusBar.current.textContent = `${realArea} sq ${scaleData.units}`;
            statusBar.current.classList.add('highlight');
        }
    } else if (previewPoints.length === 2) {
        // If only 2 points, show dashed line
        const previewLine = new fabric.Line([
            previewPoints[0].x, previewPoints[0].y,
            previewPoints[1].x, previewPoints[1].y
        ], {
            stroke: '#FF5A1F',
            strokeWidth: 2,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
            objectType: 'area-preview'
        });

        measurementState.fabricCanvas.add(previewLine);
    }

    // Highlight first point when hovering near it (if we have at least 3 vertices)
    if (measurementState.currentPoints.length >= 3) {
        const firstPoint = measurementState.currentPoints[0];
        const dx = pointer.x - firstPoint.x;
        const dy = pointer.y - firstPoint.y;
        const distanceToFirst = Math.sqrt(dx * dx + dy * dy);

        if (distanceToFirst <= 10) {
            // Create highlight circle around first point
            const highlightCircle = new fabric.Circle({
                left: firstPoint.x - 8,
                top: firstPoint.y - 8,
                radius: 8,
                fill: 'transparent',
                stroke: '#00FF00',
                strokeWidth: 3,
                selectable: false,
                evented: false,
                objectType: 'area-preview'
            });

            measurementState.fabricCanvas.add(highlightCircle);
        }
    }

    measurementState.fabricCanvas.renderAll();
}

/**
 * Finish area measurement
 * Calculates area using shoelace formula, converts to real-world units
 * Prompts for category, creates final polygon with fill and text label
 */
function finishAreaMeasurement() {
    try {
        const currentPage = viewerState?.currentPage || 1;
        const scaleData = measurementState.scaleData[currentPage];

        if (!scaleData) {
            showError('Scale not set for this page. Please set scale first.');
            cleanupCurrentMeasurement();
            return;
        }

        if (measurementState.currentPoints.length < 3) {
            showError('At least 3 vertices required for area measurement.');
            cleanupCurrentMeasurement();
            return;
        }

        console.log('[Measurement Tools] Finishing area measurement with',
            measurementState.currentPoints.length, 'vertices');

        const vertices = measurementState.currentPoints;

        // Calculate area using shoelace formula
        const shoelaceArea = Math.abs(
            vertices.reduce((sum, v, i, arr) => {
                const next = arr[(i + 1) % arr.length];
                return sum + (v.x * next.y - next.x * v.y);
            }, 0) / 2
        );

        console.log('[Measurement Tools] Pixel area (shoelace):', shoelaceArea.toFixed(2));

        // Convert pixel² to real units² using scale ratio squared
        // Formula: realArea = pixelArea / (ratio * ratio)
        const pixelArea = shoelaceArea;
        const realArea = pixelArea / (scaleData.ratio * scaleData.ratio);

        console.log('[Measurement Tools] Calculated area:', {
            pixelArea: pixelArea.toFixed(2),
            realArea: realArea.toFixed(2),
            units: `square ${scaleData.units}`
        });

        // Calculate perimeter (sum of edge lengths)
        let perimeter = 0;
        for (let i = 0; i < vertices.length; i++) {
            const next = vertices[(i + 1) % vertices.length];
            const dx = next.x - vertices[i].x;
            const dy = next.y - vertices[i].y;
            perimeter += Math.sqrt(dx * dx + dy * dy);
        }
        const realPerimeter = perimeter / scaleData.ratio;

        console.log('[Measurement Tools] Perimeter:', {
            pixelPerimeter: perimeter.toFixed(2),
            realPerimeter: realPerimeter.toFixed(2),
            units: scaleData.units
        });

        // Prompt for category
        const category = promptForAreaCategory();
        if (!category) {
            console.log('[Measurement Tools] Area measurement cancelled - no category selected');
            cleanupCurrentMeasurement();
            return;
        }

        // Get category colors
        const categoryColors = getAreaCategoryColors(category);

        // Create final polygon - Task 9: Enable selection and editing
        const fabricPoints = vertices.map(p => ({ x: p.x, y: p.y }));
        const polygon = new fabric.Polygon(fabricPoints, {
            fill: categoryColors.fill,
            stroke: categoryColors.stroke,
            strokeWidth: 3,
            selectable: true,         // Enable selection (Task 9)
            evented: true,
            objectType: 'area-measurement',
            objectCaching: false,
            hasControls: true,        // Enable vertex control points (Task 9)
            hasBorders: true,
            lockMovementX: false,     // Allow movement (Task 9)
            lockMovementY: false,     // Allow movement (Task 9)
            cornerStyle: 'circle',    // Visual style for control points
            cornerSize: 6,
            transparentCorners: false,
            cornerColor: '#00ff00'
        });

        // Calculate centroid for text label
        const centroid = calculatePolygonCentroid(vertices);

        // Format area with comma separators for readability
        const formattedArea = realArea.toLocaleString('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });

        // Create text label - Task 9: Make text moveable with measurement
        const labelText = `${formattedArea} sq ${scaleData.units}`;
        const text = new fabric.Text(labelText, {
            left: centroid.x,
            top: centroid.y,
            fontSize: 14,
            fontFamily: 'Arial',
            fill: '#FFFFFF',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 4,
            originX: 'center',
            originY: 'center',
            selectable: false,        // Text not independently selectable (Task 9)
            evented: false,
            objectType: 'area-text',
            hasControls: false,
            hasBorders: false
        });

        // Clean up temporary objects
        cleanupCurrentMeasurement();

        // Add final objects to canvas
        measurementState.fabricCanvas.add(polygon);
        measurementState.fabricCanvas.add(text);
        measurementState.fabricCanvas.renderAll();

        // Create measurement data object
        const measurementId = generateMeasurementId();
        const measurementData = {
            type: 'area',
            id: measurementId,
            label: `Area #${measurementId}`,
            category: category,
            vertices: vertices,
            pixelArea: pixelArea,
            realArea: realArea,
            perimeter: realPerimeter,
            units: scaleData.units,
            created: new Date().toISOString(),
            fabricObjects: [polygon.id, text.id]
        };

        // Store measurement data
        if (!measurementState.measurements[currentPage]) {
            measurementState.measurements[currentPage] = { objects: [], data: [] };
        }
        if (!measurementState.measurements[currentPage].data) {
            measurementState.measurements[currentPage].data = [];
        }
        measurementState.measurements[currentPage].data.push(measurementData);

        console.log('[Measurement Tools] Area measurement created:', measurementData);

        // Log warning if area seems unusual (self-intersecting polygon check)
        if (pixelArea < 100) {
            console.warn('[Measurement Tools] Warning: Very small area detected. Polygon may be self-intersecting or very small.');
        }

        // Task 12: Emit standardized creation event
        emitMeasurementEvent('measurement:created', measurementData);

        // Task 13: Push to undo stack
        pushToUndoStack('create', measurementData);

        // Task 14: Auto-save to localStorage
        saveMeasurementsToStorage();

        // Keep area tool active for next measurement
        console.log('[Measurement Tools] Area measurement complete. Tool remains active.');

    } catch (error) {
        console.error('[Measurement Tools] Error finishing area measurement:', error);
        showError('Failed to create area measurement. Please try again.');
        cleanupCurrentMeasurement();
    }
}

/**
 * Prompt user for area measurement category
 * Returns category string or null if cancelled
 */
function promptForAreaCategory() {
    const categories = ['Excavation', 'Paving', 'Bore Zone', 'Other'];
    let categoryMessage = 'Select area category:\n\n';
    categories.forEach((cat, idx) => {
        categoryMessage += `${idx + 1}. ${cat}\n`;
    });
    categoryMessage += '\nEnter number (1-4):';

    const input = prompt(categoryMessage);

    if (!input) {
        return null;
    }

    const categoryIndex = parseInt(input) - 1;

    if (categoryIndex >= 0 && categoryIndex < categories.length) {
        return categories[categoryIndex];
    }

    // If invalid input, default to 'Other'
    return 'Other';
}

/**
 * Get colors for area measurement category
 * Returns object with fill (semi-transparent) and stroke colors
 * @param {string} category - Category name
 * @returns {Object} {fill: string, stroke: string}
 */
function getAreaCategoryColors(category) {
    const colors = {
        'Excavation': {
            fill: 'rgba(139, 69, 19, 0.3)',  // Brown with transparency
            stroke: '#8B4513'                 // Brown
        },
        'Paving': {
            fill: 'rgba(128, 128, 128, 0.3)', // Gray with transparency
            stroke: '#808080'                  // Gray
        },
        'Bore Zone': {
            fill: 'rgba(255, 107, 53, 0.3)',  // Orange with transparency
            stroke: '#FF5A1F'                  // Orange
        },
        'Other': {
            fill: 'rgba(102, 102, 102, 0.3)', // Gray with transparency
            stroke: '#666666'                  // Gray
        }
    };

    return colors[category] || colors['Other'];
}

/**
 * Calculate centroid of polygon for text label placement
 * Uses average of all x and y coordinates
 * @param {Array} vertices - Array of {x, y} vertices
 * @returns {Object} Centroid {x, y}
 */
function calculatePolygonCentroid(vertices) {
    if (vertices.length === 0) {
        return { x: 0, y: 0 };
    }

    const sumX = vertices.reduce((sum, v) => sum + v.x, 0);
    const sumY = vertices.reduce((sum, v) => sum + v.y, 0);

    return {
        x: sumX / vertices.length,
        y: sumY / vertices.length
    };
}

/**
 * Handle count marker click
 * Single click to place a numbered marker
 * Auto-increments counter for category and page
 */
function handleCountClick(pointer) {
    try {
        const currentPage = viewerState?.currentPage || 1;
        const category = measurementState.activeCountCategory;

        if (!category) {
            console.error('[Measurement Tools] No category selected for count tool');
            showError('Please select a category first.');
            activateTool(null);
            return;
        }

        console.log('[Measurement Tools] Count click at:', pointer, 'Category:', category);

        // Initialize counters for page if needed
        if (!measurementState.counters[currentPage]) {
            measurementState.counters[currentPage] = {};
        }

        // Initialize counter for category if needed
        if (!measurementState.counters[currentPage][category]) {
            measurementState.counters[currentPage][category] = 0;
        }

        // Increment counter
        measurementState.counters[currentPage][category]++;
        const count = measurementState.counters[currentPage][category];

        // Update status bar
        if (statusBar.current) {
            statusBar.current.textContent = `#${count}`;
            statusBar.current.classList.add('highlight');
        }

        console.log('[Measurement Tools] Count marker:', {
            page: currentPage,
            category: category,
            count: count
        });

        // Get category color
        const categoryColor = getCountCategoryColor(category);

        // Create circle background
        const circle = new fabric.Circle({
            radius: 15,
            fill: categoryColor,
            stroke: '#23272A',
            strokeWidth: 2,
            originX: 'center',
            originY: 'center'
        });

        // Create number text
        const text = new fabric.Text(count.toString(), {
            fontSize: 16,
            fill: '#FFFFFF',
            fontWeight: 'bold',
            fontFamily: 'Arial',
            originX: 'center',
            originY: 'center'
        });

        // Create group (circle + text) - Task 9: Enable selection and movement
        const group = new fabric.Group([circle, text], {
            left: pointer.x,
            top: pointer.y,
            selectable: true,     // Can be selected and moved (Task 9)
            hasControls: false,   // No resize handles
            hasBorders: true,     // Show border when selected (Task 9)
            lockRotation: true,   // Can't rotate
            objectType: 'count-marker',
            countCategory: category,
            countNumber: count
        });

        // Add group to canvas
        measurementState.fabricCanvas.add(group);
        measurementState.fabricCanvas.renderAll();

        // Create measurement data object
        const measurementId = generateMeasurementId();
        const measurementData = {
            type: 'count',
            id: measurementId,
            label: `${category} #${count}`,
            category: category,
            position: { x: pointer.x, y: pointer.y },
            count: count,
            created: new Date().toISOString(),
            fabricObjects: [group.id]
        };

        // Store measurement data
        if (!measurementState.measurements[currentPage]) {
            measurementState.measurements[currentPage] = { objects: [], data: [] };
        }
        if (!measurementState.measurements[currentPage].data) {
            measurementState.measurements[currentPage].data = [];
        }
        measurementState.measurements[currentPage].data.push(measurementData);

        console.log('[Measurement Tools] Count marker created:', measurementData);

        // Task 12: Emit standardized creation event
        emitMeasurementEvent('measurement:created', measurementData);

        // Task 13: Push to undo stack
        pushToUndoStack('create', measurementData);

        // Task 14: Auto-save to localStorage
        saveMeasurementsToStorage();

        // Add double-click handler for editing (placeholder for Task 11)
        group.on('mousedblclick', () => {
            console.log('[Measurement Tools] Count marker double-clicked - edit placeholder (Task 11)');
            console.log('Marker data:', measurementData);
            // TODO: Task 11 - Show edit modal
        });

        // Tool remains active for next marker placement
        console.log('[Measurement Tools] Count marker placed. Tool remains active.');

    } catch (error) {
        console.error('[Measurement Tools] Error placing count marker:', error);
        showError('Failed to place count marker. Please try again.');
    }
}

/**
 * Prompt user for count marker category
 * Returns category string or null if cancelled
 */
function promptForCountCategory() {
    const categories = ['Pits', 'Splices', 'Poles', 'Equipment', 'Other'];
    let categoryMessage = 'Select count marker category:\n\n';
    categories.forEach((cat, idx) => {
        categoryMessage += `${idx + 1}. ${cat}\n`;
    });
    categoryMessage += '\nEnter number (1-5):';

    const input = prompt(categoryMessage);

    if (!input) {
        return null;
    }

    const categoryIndex = parseInt(input) - 1;

    if (categoryIndex >= 0 && categoryIndex < categories.length) {
        return categories[categoryIndex];
    }

    // If invalid input, default to 'Other'
    return 'Other';
}

/**
 * Get color for count marker category
 * @param {string} category - Category name
 * @returns {string} Hex color code
 */
function getCountCategoryColor(category) {
    const colors = {
        'Pits': '#FF5A1F',        // Safety Orange
        'Splices': '#0066CC',     // Blue
        'Poles': '#8B4513',       // Brown
        'Equipment': '#666666',   // Gray
        'Other': '#999999'        // Light Gray
    };

    return colors[category] || colors['Other'];
}

/**
 * Handle keyboard events
 * ESC key cancels current measurement
 * Enter key finishes linear measurement
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

    // Enter key - finish linear measurement
    if (event.key === 'Enter' && measurementState.activeTool === 'linear') {
        if (measurementState.currentPoints.length >= 2) {
            console.log('[Measurement Tools] Enter key pressed - finishing linear measurement');
            finishLinearMeasurement();
        }
    }

    // Enter key - finish area measurement (close polygon)
    if (event.key === 'Enter' && measurementState.activeTool === 'area') {
        if (measurementState.currentPoints.length >= 3) {
            console.log('[Measurement Tools] Enter key pressed - finishing area measurement');
            finishAreaMeasurement();
        }
    }

    // Task 9: Delete or Backspace key - delete selected measurement(s)
    if (event.key === 'Delete' || event.key === 'Backspace') {
        // Only delete if no tool is active (not in drawing mode)
        if (!measurementState.activeTool || measurementState.activeTool === null) {
            const activeObject = measurementState.fabricCanvas?.getActiveObject();

            if (activeObject) {
                // Prevent default backspace behavior (navigation)
                event.preventDefault();

                // Only delete measurement objects
                const isMeasurement = activeObject.objectType && (
                    activeObject.objectType.includes('measurement') ||
                    activeObject.objectType === 'count-marker'
                );

                // For multiple selection
                const isMultipleSelection = activeObject.type === 'activeSelection';
                const hasMeasurements = isMultipleSelection &&
                    activeObject.getObjects().some(obj =>
                        obj.objectType && (
                            obj.objectType.includes('measurement') ||
                            obj.objectType === 'count-marker'
                        )
                    );

                if (isMeasurement || hasMeasurements) {
                    // Show confirmation dialog
                    const confirmMessage = isMultipleSelection
                        ? 'Delete selected measurements?'
                        : 'Delete this measurement?';

                    if (confirm(confirmMessage)) {
                        console.log('[Measurement Tools] Task 9: Deleting selected measurement(s)');
                        handleDeleteMeasurement(activeObject);
                    }
                }
            }
        }
    }

    // Task 13: Ctrl+Z - Undo last operation
    if (event.ctrlKey && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        console.log('[Undo/Redo] Ctrl+Z pressed - undo');
        undoLastOperation();
        return;
    }

    // Task 13: Ctrl+Y or Ctrl+Shift+Z - Redo last undone operation
    if (event.ctrlKey && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
        event.preventDefault();
        console.log('[Undo/Redo] Ctrl+Y pressed - redo');
        redoLastOperation();
        return;
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

    // Remove all temporary objects (scale-temp, linear-temp, area-temp, area-preview)
    const objects = measurementState.fabricCanvas.getObjects();
    const tempObjects = objects.filter(obj =>
        obj.objectType === 'scale-temp' ||
        obj.objectType === 'linear-temp' ||
        obj.objectType === 'area-temp' ||
        obj.objectType === 'area-preview'
    );

    tempObjects.forEach(obj => {
        measurementState.fabricCanvas.remove(obj);
    });

    // Clear temporary state
    measurementState.tempObject = null;
    measurementState.tempPreviewLine = null;
    measurementState.isDrawing = false;
    measurementState.currentPoints = [];

    measurementState.fabricCanvas.renderAll();

    console.log('[Measurement Tools] Cleanup complete');
}


// ============================================================================
// Task 9: Selection and Editing Event Handlers
// ============================================================================

/**
 * Handle object moving event - update text label position during drag
 * This provides real-time feedback as measurements are moved
 */
function handleObjectMoving(event) {
    const movedObject = event.target;
    
    // Only process measurement objects
    if (!movedObject.objectType || 
        (!movedObject.objectType.includes('measurement') && 
         movedObject.objectType !== 'count-marker')) {
        return;
    }

    // Update associated text label position in real-time
    const currentPage = viewerState?.currentPage || 1;
    const measurements = measurementState.measurements[currentPage]?.data || [];
    
    // Find the measurement data associated with this object
    for (const measurement of measurements) {
        if (measurement.fabricObjects.includes(movedObject.id)) {
            updateTextLabelPosition(measurement, movedObject);
            break;
        }
    }
}

/**
 * Handle object modified event - recalculate measurements after drag or reshape
 * Fires when user finishes dragging or reshaping a measurement
 */
function handleObjectModified(event) {
    try {
        const modifiedObject = event.target;
        
        console.log('[Measurement Tools] Task 9: Object modified:', {
            type: modifiedObject.objectType,
            id: modifiedObject.id
        });

        // Only process measurement objects
        if (!modifiedObject.objectType || 
            (!modifiedObject.objectType.includes('measurement') && 
             modifiedObject.objectType !== 'count-marker')) {
            return;
        }

        const currentPage = viewerState?.currentPage || 1;
        const scaleData = measurementState.scaleData[currentPage];
        const measurements = measurementState.measurements[currentPage]?.data || [];

        // Find the measurement data associated with this modified object
        let measurementData = null;
        for (const measurement of measurements) {
            if (measurement.fabricObjects.includes(modifiedObject.id)) {
                measurementData = measurement;
                break;
            }
        }

        if (!measurementData) {
            console.warn('[Measurement Tools] Could not find measurement data for modified object');
            return;
        }

        // Task 13: Capture previous state for undo
        const previousData = JSON.parse(JSON.stringify(measurementData));

        // Handle different measurement types
        switch (measurementData.type) {
            case 'linear':
                updateLinearMeasurement(measurementData, modifiedObject, scaleData);
                break;
            case 'area':
                updateAreaMeasurement(measurementData, modifiedObject, scaleData);
                break;
            case 'count':
                updateCountMeasurement(measurementData, modifiedObject);
                break;
        }

        // Task 12: Emit standardized update event
        emitMeasurementEvent('measurement:updated', measurementData);

        // Task 13: Push to undo stack
        pushToUndoStack('update', measurementData, previousData);

        // Task 14: Auto-save to localStorage
        saveMeasurementsToStorage();

        console.log('[Measurement Tools] Task 9: Measurement updated:', measurementData);

    } catch (error) {
        console.error('[Measurement Tools] Error handling object modification:', error);
    }
}

/**
 * Update linear measurement after modification
 */
function updateLinearMeasurement(measurementData, polyline, scaleData) {
    try {
        // Extract updated points from polyline
        const fabricPoints = polyline.points;
        const matrix = polyline.calcTransformMatrix();
        
        // Transform points to canvas coordinates
        const updatedPoints = fabricPoints.map(pt => {
            const point = fabric.util.transformPoint(
                { x: pt.x, y: pt.y },
                matrix
            );
            return { x: point.x, y: point.y };
        });

        // Recalculate length
        let totalPixelLength = 0;
        for (let i = 0; i < updatedPoints.length - 1; i++) {
            const dx = updatedPoints[i + 1].x - updatedPoints[i].x;
            const dy = updatedPoints[i + 1].y - updatedPoints[i].y;
            totalPixelLength += Math.sqrt(dx * dx + dy * dy);
        }

        const realLength = totalPixelLength / scaleData.ratio;

        // Update measurement data
        measurementData.points = updatedPoints;
        measurementData.pixelLength = totalPixelLength;
        measurementData.realLength = realLength;

        // Update text label
        const textObject = findTextObjectForMeasurement(measurementData);
        if (textObject) {
            const labelText = `${realLength.toFixed(1)} ${scaleData.units}`;
            textObject.set('text', labelText);
            
            // Reposition text at midpoint
            const midpoint = calculatePolylineMidpoint(updatedPoints);
            textObject.set({
                left: midpoint.x,
                top: midpoint.y - 20
            });
        }

        measurementState.fabricCanvas.renderAll();
        
        console.log('[Measurement Tools] Linear measurement updated:', {
            realLength: realLength.toFixed(2),
            units: scaleData.units
        });

    } catch (error) {
        console.error('[Measurement Tools] Error updating linear measurement:', error);
    }
}

/**
 * Update area measurement after modification
 */
function updateAreaMeasurement(measurementData, polygon, scaleData) {
    try {
        // Extract updated vertices from polygon
        const fabricPoints = polygon.points;
        const matrix = polygon.calcTransformMatrix();
        
        // Transform points to canvas coordinates
        const updatedVertices = fabricPoints.map(pt => {
            const point = fabric.util.transformPoint(
                { x: pt.x, y: pt.y },
                matrix
            );
            return { x: point.x, y: point.y };
        });

        // Recalculate area using shoelace formula
        const shoelaceArea = Math.abs(
            updatedVertices.reduce((sum, v, i, arr) => {
                const next = arr[(i + 1) % arr.length];
                return sum + (v.x * next.y - next.x * v.y);
            }, 0) / 2
        );

        const pixelArea = shoelaceArea;
        const realArea = pixelArea / (scaleData.ratio * scaleData.ratio);

        // Recalculate perimeter
        let perimeter = 0;
        for (let i = 0; i < updatedVertices.length; i++) {
            const next = updatedVertices[(i + 1) % updatedVertices.length];
            const dx = next.x - updatedVertices[i].x;
            const dy = next.y - updatedVertices[i].y;
            perimeter += Math.sqrt(dx * dx + dy * dy);
        }
        const realPerimeter = perimeter / scaleData.ratio;

        // Update measurement data
        measurementData.vertices = updatedVertices;
        measurementData.pixelArea = pixelArea;
        measurementData.realArea = realArea;
        measurementData.perimeter = realPerimeter;

        // Update text label
        const textObject = findTextObjectForMeasurement(measurementData);
        if (textObject) {
            const formattedArea = realArea.toLocaleString('en-US', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            });
            const labelText = `${formattedArea} sq ${scaleData.units}`;
            textObject.set('text', labelText);
            
            // Reposition text at centroid
            const centroid = calculatePolygonCentroid(updatedVertices);
            textObject.set({
                left: centroid.x,
                top: centroid.y
            });
        }

        measurementState.fabricCanvas.renderAll();
        
        console.log('[Measurement Tools] Area measurement updated:', {
            realArea: realArea.toFixed(2),
            units: `sq ${scaleData.units}`
        });

    } catch (error) {
        console.error('[Measurement Tools] Error updating area measurement:', error);
    }
}

/**
 * Update count measurement after modification (position only)
 */
function updateCountMeasurement(measurementData, group) {
    try {
        // Update position
        measurementData.position = {
            x: group.left,
            y: group.top
        };

        console.log('[Measurement Tools] Count marker position updated:', measurementData.position);

    } catch (error) {
        console.error('[Measurement Tools] Error updating count measurement:', error);
    }
}

/**
 * Find text label object associated with a measurement
 */
function findTextObjectForMeasurement(measurementData) {
    const textObjectId = measurementData.fabricObjects[1]; // Text is always second in array
    const objects = measurementState.fabricCanvas.getObjects();
    return objects.find(obj => obj.id === textObjectId);
}

/**
 * Update text label position during object movement
 */
function updateTextLabelPosition(measurementData, movedObject) {
    const textObject = findTextObjectForMeasurement(measurementData);
    if (!textObject) return;

    if (measurementData.type === 'linear') {
        // For linear, text follows polyline movement
        const fabricPoints = movedObject.points;
        const matrix = movedObject.calcTransformMatrix();
        const transformedPoints = fabricPoints.map(pt => {
            return fabric.util.transformPoint({ x: pt.x, y: pt.y }, matrix);
        });
        const midpoint = calculatePolylineMidpoint(transformedPoints);
        textObject.set({
            left: midpoint.x,
            top: midpoint.y - 20
        });
    } else if (measurementData.type === 'area') {
        // For area, text follows polygon movement
        const fabricPoints = movedObject.points;
        const matrix = movedObject.calcTransformMatrix();
        const transformedPoints = fabricPoints.map(pt => {
            return fabric.util.transformPoint({ x: pt.x, y: pt.y }, matrix);
        });
        const centroid = calculatePolygonCentroid(transformedPoints);
        textObject.set({
            left: centroid.x,
            top: centroid.y
        });
    }
    
    measurementState.fabricCanvas.renderAll();
}

/**
 * Handle selection created event
 */
function handleSelectionCreated(event) {
    const selectedObject = event.selected[0];

    console.log('[Measurement Tools] Task 9: Object selected:', {
        type: selectedObject?.objectType,
        id: selectedObject?.id
    });

    // Task 12: Emit measurement:selected event if this is a measurement object
    if (selectedObject && selectedObject.measurementData) {
        emitMeasurementSelected(selectedObject.measurementData);
    }
}

/**
 * Handle selection cleared event
 */
function handleSelectionCleared(event) {
    console.log('[Measurement Tools] Task 9: Selection cleared');

    // Task 12: Emit measurement:deselected event
    emitMeasurementDeselected();
}

/**
 * Delete selected measurement(s)
 * Called when Delete or Backspace key is pressed
 */
function handleDeleteMeasurement(fabricObject) {
    try {
        const currentPage = viewerState?.currentPage || 1;
        const measurements = measurementState.measurements[currentPage]?.data || [];

        // Handle multiple selection (ActiveSelection)
        if (fabricObject.type === 'activeSelection') {
            const objects = fabricObject.getObjects();
            console.log('[Measurement Tools] Task 9: Deleting multiple selections:', objects.length);
            
            // Delete each selected measurement
            for (const obj of objects) {
                deleteSingleMeasurement(obj, currentPage, measurements);
            }
        } else {
            // Single object deletion
            deleteSingleMeasurement(fabricObject, currentPage, measurements);
        }

        measurementState.fabricCanvas.discardActiveObject();
        measurementState.fabricCanvas.renderAll();

    } catch (error) {
        console.error('[Measurement Tools] Error deleting measurement:', error);
        showError('Failed to delete measurement. Please try again.');
    }
}

/**
 * Delete a single measurement object
 */
function deleteSingleMeasurement(fabricObject, currentPage, measurements) {
    // Only delete measurement objects
    if (!fabricObject.objectType || 
        (!fabricObject.objectType.includes('measurement') && 
         fabricObject.objectType !== 'count-marker')) {
        return;
    }

    // Find the measurement data
    const measurementIndex = measurements.findIndex(m => 
        m.fabricObjects.includes(fabricObject.id)
    );

    if (measurementIndex === -1) {
        console.warn('[Measurement Tools] Could not find measurement data for object');
        return;
    }

    const measurementData = measurements[measurementIndex];
    
    console.log('[Measurement Tools] Task 9: Deleting measurement:', {
        type: measurementData.type,
        id: measurementData.id,
        label: measurementData.label
    });

    // Remove all associated Fabric objects
    const allObjects = measurementState.fabricCanvas.getObjects();
    for (const objId of measurementData.fabricObjects) {
        const obj = allObjects.find(o => o.id === objId);
        if (obj) {
            measurementState.fabricCanvas.remove(obj);
        }
    }

    // Remove from measurements array
    measurements.splice(measurementIndex, 1);

    // Task 12: Emit standardized delete event
    emitMeasurementEvent('measurement:deleted', measurementData);

    // Task 13: Push to undo stack
    pushToUndoStack('delete', measurementData);

    // Task 14: Auto-save to localStorage
    saveMeasurementsToStorage();

    console.log('[Measurement Tools] Task 9: Measurement deleted successfully');
}


// ============================================
// TASK 12: EVENT EMISSION SYSTEM
// ============================================

/**
 * Event Emission System for Measurement Lifecycle
 *
 * This system provides a standardized way to emit events for all measurement
 * CRUD operations, enabling Module 1.3 (Measurement List) and other components
 * to react to measurement changes.
 *
 * Supported Events:
 * - measurement:created - When a new measurement is created
 * - measurement:updated - When a measurement is modified
 * - measurement:deleted - When a measurement is removed
 * - measurement:selected - When a measurement is selected
 * - measurement:deselected - When selection is cleared
 *
 * Event Detail Structure:
 * {
 *     type: 'linear|area|count',
 *     id: 'unique-id',
 *     label: 'Measurement Label',
 *     category: 'Category Name',
 *     color: '#HEX',
 *     value: number (for linear/area),
 *     unit: 'ft|ft²' (for linear/area),
 *     points: [...] (coordinates),
 *     timestamp: 'ISO-8601',
 *     page: number
 * }
 */

/**
 * Emit a measurement lifecycle event
 * @param {string} eventName - Name of event (measurement:created, etc.)
 * @param {Object} measurementData - Full measurement data object
 */
function emitMeasurementEvent(eventName, measurementData) {
    try {
        // Validate event name
        const validEvents = [
            'measurement:created',
            'measurement:updated',
            'measurement:deleted',
            'measurement:selected',
            'measurement:deselected'
        ];

        if (!validEvents.includes(eventName)) {
            console.warn(`[Event System] Invalid event name: ${eventName}`);
            return;
        }

        // Validate measurement data
        if (!measurementData || typeof measurementData !== 'object') {
            console.warn(`[Event System] Invalid measurement data for ${eventName}`);
            return;
        }

        // Create standardized event detail
        const eventDetail = {
            type: measurementData.type,
            id: measurementData.id,
            label: measurementData.label || '',
            category: measurementData.category || '',
            color: measurementData.color || '#23272A',
            timestamp: measurementData.modified || measurementData.created || new Date().toISOString(),
            page: measurementData.page || viewerState?.currentPage || 1
        };

        // Add type-specific fields
        switch (measurementData.type) {
            case 'linear':
                eventDetail.value = measurementData.length;
                eventDetail.unit = measurementData.unit;
                eventDetail.points = measurementData.points;
                break;
            case 'area':
                eventDetail.value = measurementData.area;
                eventDetail.unit = measurementData.unit;
                eventDetail.points = measurementData.points;
                break;
            case 'count':
                eventDetail.count = measurementData.count;
                eventDetail.x = measurementData.x;
                eventDetail.y = measurementData.y;
                break;
        }

        // Add notes if present
        if (measurementData.notes) {
            eventDetail.notes = measurementData.notes;
        }

        // Dispatch event
        const customEvent = new CustomEvent(eventName, {
            detail: eventDetail,
            bubbles: true,
            cancelable: false
        });

        document.dispatchEvent(customEvent);

        console.log(`[Event System] ${eventName} emitted:`, {
            type: eventDetail.type,
            id: eventDetail.id,
            label: eventDetail.label
        });

    } catch (error) {
        console.error(`[Event System] Error emitting ${eventName}:`, error);
    }
}

/**
 * Emit measurement selected event
 * @param {Object} measurementData - Measurement data object
 */
function emitMeasurementSelected(measurementData) {
    emitMeasurementEvent('measurement:selected', measurementData);
}

/**
 * Emit measurement deselected event
 */
function emitMeasurementDeselected() {
    // Create minimal event detail for deselection
    const eventDetail = {
        timestamp: new Date().toISOString()
    };

    document.dispatchEvent(new CustomEvent('measurement:deselected', {
        detail: eventDetail,
        bubbles: true,
        cancelable: false
    }));

    console.log('[Event System] measurement:deselected emitted');
}


// ============================================
// TASK 13: UNDO/REDO SUPPORT
// ============================================

/**
 * Undo/Redo System for Measurement Operations
 *
 * Tracks all measurement CRUD operations and allows users to undo/redo
 * changes using keyboard shortcuts (Ctrl+Z for undo, Ctrl+Y for redo).
 *
 * Stack Structure (per page):
 * {
 *     action: 'create|update|delete',
 *     measurementData: {...},  // Full measurement state
 *     previousData: {...},     // For updates only
 *     timestamp: 'ISO-8601',
 *     page: number
 * }
 *
 * Implementation Notes:
 * - Stacks are per-page (isolated by page number)
 * - Maximum 50 operations per page (oldest dropped when exceeded)
 * - Redo stack clears when new action is performed
 * - All data is deep cloned to prevent mutation issues
 * - Recursion prevention flag avoids infinite loops
 */

// Flag to prevent undo/redo operations from triggering new stack pushes
let isUndoRedoOperation = false;

// Maximum stack size per page
const MAX_UNDO_STACK_SIZE = 50;

/**
 * Push operation to undo stack
 * @param {string} action - Operation type ('create', 'update', 'delete')
 * @param {Object} measurementData - Current measurement state
 * @param {Object} previousData - Previous state (for updates only)
 */
function pushToUndoStack(action, measurementData, previousData = null) {
    // Skip if this is an undo/redo operation (prevent recursion)
    if (isUndoRedoOperation) {
        return;
    }

    try {
        const currentPage = viewerState?.currentPage || 1;

        // Ensure undo/redo stacks exist for current page
        if (!measurementState.undoStack[currentPage]) {
            measurementState.undoStack[currentPage] = [];
        }
        if (!measurementState.redoStack[currentPage]) {
            measurementState.redoStack[currentPage] = [];
        }

        // Deep clone data to prevent reference issues
        const stackEntry = {
            action: action,
            measurementData: JSON.parse(JSON.stringify(measurementData)),
            previousData: previousData ? JSON.parse(JSON.stringify(previousData)) : null,
            timestamp: new Date().toISOString(),
            page: currentPage
        };

        // Push to undo stack
        measurementState.undoStack[currentPage].push(stackEntry);

        // Enforce stack size limit (remove oldest if exceeded)
        if (measurementState.undoStack[currentPage].length > MAX_UNDO_STACK_SIZE) {
            measurementState.undoStack[currentPage].shift();
        }

        // Clear redo stack when new action is performed
        measurementState.redoStack[currentPage] = [];

        console.log(`[Undo/Redo] Pushed ${action} to undo stack (page ${currentPage}):`, {
            action: stackEntry.action,
            measurementId: measurementData.id,
            stackSize: measurementState.undoStack[currentPage].length
        });

    } catch (error) {
        console.error('[Undo/Redo] Error pushing to undo stack:', error);
    }
}

/**
 * Undo last operation (Ctrl+Z)
 */
function undoLastOperation() {
    const currentPage = viewerState?.currentPage || 1;

    // Check if undo stack exists and has entries
    if (!measurementState.undoStack[currentPage] ||
        measurementState.undoStack[currentPage].length === 0) {
        console.log('[Undo/Redo] Nothing to undo');
        return;
    }

    try {
        // Set flag to prevent recursion
        isUndoRedoOperation = true;

        // Pop from undo stack
        const entry = measurementState.undoStack[currentPage].pop();

        console.log(`[Undo/Redo] Undoing ${entry.action}:`, {
            measurementId: entry.measurementData.id,
            page: entry.page
        });

        // Perform reverse operation
        switch (entry.action) {
            case 'create':
                // Undo create = delete the measurement
                undoCreate(entry.measurementData);
                break;

            case 'update':
                // Undo update = restore previous data
                undoUpdate(entry.measurementData, entry.previousData);
                break;

            case 'delete':
                // Undo delete = recreate the measurement
                undoDelete(entry.measurementData);
                break;

            default:
                console.warn(`[Undo/Redo] Unknown action type: ${entry.action}`);
                return;
        }

        // Push to redo stack
        if (!measurementState.redoStack[currentPage]) {
            measurementState.redoStack[currentPage] = [];
        }
        measurementState.redoStack[currentPage].push(entry);

        console.log('[Undo/Redo] Undo operation completed');

    } catch (error) {
        console.error('[Undo/Redo] Error during undo operation:', error);
    } finally {
        // Reset flag
        isUndoRedoOperation = false;
    }
}

/**
 * Redo last undone operation (Ctrl+Y)
 */
function redoLastOperation() {
    const currentPage = viewerState?.currentPage || 1;

    // Check if redo stack exists and has entries
    if (!measurementState.redoStack[currentPage] ||
        measurementState.redoStack[currentPage].length === 0) {
        console.log('[Undo/Redo] Nothing to redo');
        return;
    }

    try {
        // Set flag to prevent recursion
        isUndoRedoOperation = true;

        // Pop from redo stack
        const entry = measurementState.redoStack[currentPage].pop();

        console.log(`[Undo/Redo] Redoing ${entry.action}:`, {
            measurementId: entry.measurementData.id,
            page: entry.page
        });

        // Perform original operation
        switch (entry.action) {
            case 'create':
                // Redo create = recreate the measurement
                undoDelete(entry.measurementData);
                break;

            case 'update':
                // Redo update = restore new data
                undoUpdate(entry.previousData, entry.measurementData);
                break;

            case 'delete':
                // Redo delete = delete the measurement again
                undoCreate(entry.measurementData);
                break;

            default:
                console.warn(`[Undo/Redo] Unknown action type: ${entry.action}`);
                return;
        }

        // Push back to undo stack
        if (!measurementState.undoStack[currentPage]) {
            measurementState.undoStack[currentPage] = [];
        }
        measurementState.undoStack[currentPage].push(entry);

        console.log('[Undo/Redo] Redo operation completed');

    } catch (error) {
        console.error('[Undo/Redo] Error during redo operation:', error);
    } finally {
        // Reset flag
        isUndoRedoOperation = false;
    }
}

/**
 * Undo a create operation (remove the measurement)
 * @param {Object} measurementData - Measurement to remove
 */
function undoCreate(measurementData) {
    const currentPage = viewerState?.currentPage || 1;
    const measurements = measurementState.measurements[currentPage]?.data || [];

    // Find and remove the measurement
    const index = measurements.findIndex(m => m.id === measurementData.id);
    if (index !== -1) {
        // Remove Fabric objects from canvas
        const allObjects = measurementState.fabricCanvas.getObjects();
        for (const objId of measurementData.fabricObjects || []) {
            const obj = allObjects.find(o => o.id === objId);
            if (obj) {
                measurementState.fabricCanvas.remove(obj);
            }
        }

        // Remove from measurements array
        measurements.splice(index, 1);
        measurementState.fabricCanvas.renderAll();

        console.log('[Undo/Redo] Removed measurement (undo create):', measurementData.id);
    }
}

/**
 * Undo a delete operation (restore the measurement)
 * @param {Object} measurementData - Measurement to restore
 */
function undoDelete(measurementData) {
    const currentPage = viewerState?.currentPage || 1;
    const measurements = measurementState.measurements[currentPage]?.data || [];

    // Recreate Fabric objects and add back to canvas
    try {
        let fabricObjects = [];

        switch (measurementData.type) {
            case 'linear':
                fabricObjects = recreateLinearMeasurement(measurementData);
                break;
            case 'area':
                fabricObjects = recreateAreaMeasurement(measurementData);
                break;
            case 'count':
                fabricObjects = recreateCountMarker(measurementData);
                break;
        }

        // Update measurement with new Fabric object IDs
        measurementData.fabricObjects = fabricObjects;

        // Add back to measurements array
        measurements.push(measurementData);
        measurementState.fabricCanvas.renderAll();

        console.log('[Undo/Redo] Restored measurement (undo delete):', measurementData.id);

    } catch (error) {
        console.error('[Undo/Redo] Error restoring measurement:', error);
    }
}

/**
 * Undo an update operation (restore previous state)
 * @param {Object} currentData - Current measurement data
 * @param {Object} previousData - Previous measurement data
 */
function undoUpdate(currentData, previousData) {
    if (!previousData) {
        console.warn('[Undo/Redo] No previous data for update undo');
        return;
    }

    const currentPage = viewerState?.currentPage || 1;
    const measurements = measurementState.measurements[currentPage]?.data || [];

    // Find the measurement
    const index = measurements.findIndex(m => m.id === currentData.id);
    if (index === -1) {
        console.warn('[Undo/Redo] Measurement not found for update undo');
        return;
    }

    // Store current Fabric object IDs
    const fabricObjectIds = measurements[index].fabricObjects;

    // Restore previous data
    measurements[index] = JSON.parse(JSON.stringify(previousData));
    measurements[index].fabricObjects = fabricObjectIds;

    // Update Fabric objects to reflect previous state
    updateFabricObjectsFromData(measurements[index]);

    console.log('[Undo/Redo] Restored previous state (undo update):', currentData.id);
}

/**
 * Recreate linear measurement Fabric objects
 * @param {Object} data - Measurement data
 * @returns {Array} Array of Fabric object IDs
 */
function recreateLinearMeasurement(data) {
    const fabricPoints = data.points.map(p => ({ x: p.x, y: p.y }));

    // Create polyline
    const polyline = new fabric.Polyline(fabricPoints, {
        stroke: data.color || '#23272A',
        strokeWidth: 3,
        fill: 'transparent',
        selectable: true,
        hasControls: true,
        objectCaching: false,
        objectType: 'measurement-linear',
        measurementData: data
    });
    polyline.id = `linear-${data.id}`;

    // Create text label
    const midpoint = calculatePolylineMidpoint(fabricPoints);
    const text = new fabric.Text(`${data.length.toFixed(2)} ${data.unit}`, {
        left: midpoint.x,
        top: midpoint.y - 15,
        fontSize: 14,
        fill: data.color || '#23272A',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        selectable: false,
        objectType: 'measurement-text'
    });
    text.id = `text-${data.id}`;

    measurementState.fabricCanvas.add(polyline, text);

    return [polyline.id, text.id];
}

/**
 * Recreate area measurement Fabric objects
 * @param {Object} data - Measurement data
 * @returns {Array} Array of Fabric object IDs
 */
function recreateAreaMeasurement(data) {
    const fabricPoints = data.points.map(p => ({ x: p.x, y: p.y }));

    // Create polygon
    const polygon = new fabric.Polygon(fabricPoints, {
        fill: `${data.color}33` || 'rgba(0, 59, 92, 0.2)',
        stroke: data.color || '#23272A',
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
        objectCaching: false,
        objectType: 'measurement-area',
        measurementData: data
    });
    polygon.id = `area-${data.id}`;

    // Create text label
    const centroid = calculatePolygonCentroid(fabricPoints);
    const text = new fabric.Text(`${data.area.toFixed(2)} ${data.unit}`, {
        left: centroid.x,
        top: centroid.y - 15,
        fontSize: 14,
        fill: data.color || '#23272A',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        selectable: false,
        objectType: 'measurement-text'
    });
    text.id = `text-${data.id}`;

    measurementState.fabricCanvas.add(polygon, text);

    return [polygon.id, text.id];
}

/**
 * Recreate count marker Fabric objects
 * @param {Object} data - Measurement data
 * @returns {Array} Array of Fabric object IDs
 */
function recreateCountMarker(data) {
    const color = data.color || '#23272A';

    // Create circle
    const circle = new fabric.Circle({
        left: data.x,
        top: data.y,
        radius: 15,
        fill: color,
        stroke: '#FFFFFF',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center'
    });

    // Create text
    const text = new fabric.Text(String(data.count), {
        left: data.x,
        top: data.y,
        fontSize: 14,
        fill: '#FFFFFF',
        fontWeight: 'bold',
        originX: 'center',
        originY: 'center'
    });

    // Group circle and text
    const group = new fabric.Group([circle, text], {
        left: data.x,
        top: data.y,
        selectable: true,
        hasControls: true,
        objectType: 'count-marker',
        measurementData: data
    });
    group.id = `count-${data.id}`;

    measurementState.fabricCanvas.add(group);

    return [group.id];
}

/**
 * Update Fabric objects to match measurement data
 * @param {Object} data - Measurement data
 */
function updateFabricObjectsFromData(data) {
    const allObjects = measurementState.fabricCanvas.getObjects();

    // Update each Fabric object
    for (const objId of data.fabricObjects || []) {
        const obj = allObjects.find(o => o.id === objId);
        if (!obj) continue;

        // Update common properties
        if (obj.set) {
            obj.set({
                stroke: data.color,
                fill: obj.objectType === 'measurement-area' ? `${data.color}33` : obj.fill
            });
        }

        // Update text if it's a text object
        if (obj.objectType === 'measurement-text') {
            let newText = '';
            switch (data.type) {
                case 'linear':
                    newText = `${data.length.toFixed(2)} ${data.unit}`;
                    break;
                case 'area':
                    newText = `${data.area.toFixed(2)} ${data.unit}`;
                    break;
            }
            if (newText && obj.set) {
                obj.set({ text: newText, fill: data.color });
            }
        }

        // Update measurement data reference
        if (obj.measurementData) {
            obj.measurementData = data;
        }
    }

    measurementState.fabricCanvas.renderAll();
}

/**
 * Clear undo/redo stacks for current page
 */
function clearUndoRedoStacks() {
    const currentPage = viewerState?.currentPage || 1;

    if (measurementState.undoStack[currentPage]) {
        measurementState.undoStack[currentPage] = [];
    }
    if (measurementState.redoStack[currentPage]) {
        measurementState.redoStack[currentPage] = [];
    }

    console.log(`[Undo/Redo] Cleared stacks for page ${currentPage}`);
}


// ============================================
// TASK 14: MEASUREMENT PERSISTENCE
// ============================================

/**
 * Measurement Persistence System
 *
 * Provides localStorage auto-save and export/import functionality for measurements.
 * All measurement data, scale data, and counters are persisted across sessions.
 *
 * Features:
 * - Auto-save to localStorage after every CRUD operation
 * - Load measurements on page load
 * - Export all measurements to JSON file
 * - Import measurements from JSON file
 * - Clear all measurements with confirmation
 *
 * Storage Key: 'takeoff-measurements'
 * Storage Format:
 * {
 *     measurements: { pageNum: { data: [...] } },
 *     scaleData: { pageNum: {...} },
 *     counters: { pageNum: { category: count } },
 *     timestamp: 'ISO-8601',
 *     version: '1.0'
 * }
 */

const STORAGE_KEY = 'takeoff-measurements';
const STORAGE_VERSION = '1.0';

/**
 * Save all measurements to localStorage
 * Called automatically after every CRUD operation
 */
function saveMeasurementsToStorage() {
    try {
        const data = {
            measurements: measurementState.measurements,
            scaleData: measurementState.scaleData,
            counters: measurementState.counters,
            timestamp: new Date().toISOString(),
            version: STORAGE_VERSION
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

        console.log('[Persistence] Measurements saved to localStorage:', {
            pages: Object.keys(data.measurements).length,
            totalMeasurements: Object.values(data.measurements).reduce(
                (sum, page) => sum + (page.data?.length || 0), 0
            )
        });

    } catch (error) {
        console.error('[Persistence] Error saving to localStorage:', error);
        // Handle quota exceeded error
        if (error.name === 'QuotaExceededError') {
            console.error('[Persistence] localStorage quota exceeded - consider clearing old data');
        }
    }
}

/**
 * Load measurements from localStorage
 * Called on initialization
 */
function loadMeasurementsFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            console.log('[Persistence] No stored measurements found');
            return;
        }

        const data = JSON.parse(stored);

        // Validate version
        if (data.version !== STORAGE_VERSION) {
            console.warn('[Persistence] Storage version mismatch - skipping load');
            return;
        }

        // Restore measurements data
        if (data.measurements) {
            measurementState.measurements = data.measurements;
        }

        // Restore scale data
        if (data.scaleData) {
            measurementState.scaleData = data.scaleData;
        }

        // Restore counters
        if (data.counters) {
            measurementState.counters = data.counters;
        }

        console.log('[Persistence] Measurements loaded from localStorage:', {
            pages: Object.keys(data.measurements || {}).length,
            totalMeasurements: Object.values(data.measurements || {}).reduce(
                (sum, page) => sum + (page.data?.length || 0), 0
            ),
            timestamp: data.timestamp
        });

        // Reload measurements for current page to display them
        const currentPage = viewerState?.currentPage || 1;
        loadMeasurementsForPage(currentPage);

    } catch (error) {
        console.error('[Persistence] Error loading from localStorage:', error);
    }
}

/**
 * Export all measurements to JSON file
 * Downloads a file with all measurement data
 */
function exportMeasurementsToJSON() {
    try {
        const data = {
            measurements: measurementState.measurements,
            scaleData: measurementState.scaleData,
            counters: measurementState.counters,
            timestamp: new Date().toISOString(),
            version: STORAGE_VERSION,
            exportedBy: 'Midwest Underground Takeoff System',
            pdfFile: viewerState?.pdfUrl || 'unknown'
        };

        // Create blob and download
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `takeoff-measurements-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('[Persistence] Measurements exported to JSON file');

        // Show success message
        alert('Measurements exported successfully!');

    } catch (error) {
        console.error('[Persistence] Error exporting measurements:', error);
        alert('Error exporting measurements. Check console for details.');
    }
}

/**
 * Import measurements from JSON file
 * @param {File} file - JSON file to import
 */
function importMeasurementsFromJSON(file) {
    if (!file) {
        console.error('[Persistence] No file provided for import');
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            // Validate version
            if (data.version !== STORAGE_VERSION) {
                alert(`Warning: File version (${data.version}) does not match current version (${STORAGE_VERSION}). Import may fail.`);
            }

            // Confirm import
            const totalMeasurements = Object.values(data.measurements || {}).reduce(
                (sum, page) => sum + (page.data?.length || 0), 0
            );

            const confirmMessage = `Import ${totalMeasurements} measurements from file?\n\nThis will replace all current measurements.\n\nFile: ${file.name}\nExported: ${data.timestamp || 'unknown'}`;

            if (!confirm(confirmMessage)) {
                console.log('[Persistence] Import cancelled by user');
                return;
            }

            // Clear current canvas
            measurementState.fabricCanvas?.clear();

            // Import data
            if (data.measurements) {
                measurementState.measurements = data.measurements;
            }
            if (data.scaleData) {
                measurementState.scaleData = data.scaleData;
            }
            if (data.counters) {
                measurementState.counters = data.counters;
            }

            // Save to localStorage
            saveMeasurementsToStorage();

            // Reload current page
            const currentPage = viewerState?.currentPage || 1;
            loadMeasurementsForPage(currentPage);

            console.log('[Persistence] Measurements imported successfully:', {
                pages: Object.keys(data.measurements || {}).length,
                totalMeasurements: totalMeasurements
            });

            alert(`Successfully imported ${totalMeasurements} measurements!`);

        } catch (error) {
            console.error('[Persistence] Error importing measurements:', error);
            alert('Error importing file. Please check that it is a valid measurement export file.');
        }
    };

    reader.onerror = () => {
        console.error('[Persistence] Error reading file');
        alert('Error reading file. Please try again.');
    };

    reader.readAsText(file);
}

/**
 * Clear all measurements with confirmation
 * Removes all measurements from all pages and clears localStorage
 */
function clearAllMeasurements() {
    const totalMeasurements = Object.values(measurementState.measurements).reduce(
        (sum, page) => sum + (page.data?.length || 0), 0
    );

    const confirmMessage = `Delete ALL ${totalMeasurements} measurements?\n\nThis action cannot be undone!\n\n(Scale calibration data will be preserved)`;

    if (!confirm(confirmMessage)) {
        console.log('[Persistence] Clear all cancelled by user');
        return;
    }

    try {
        // Clear measurements (preserve scale data and counters)
        measurementState.measurements = {};

        // Clear canvas
        measurementState.fabricCanvas?.clear();

        // Clear undo/redo stacks
        measurementState.undoStack = {};
        measurementState.redoStack = {};

        // Reset counters
        measurementState.counters = {};

        // Save to localStorage
        saveMeasurementsToStorage();

        console.log('[Persistence] All measurements cleared');
        alert('All measurements have been cleared.');

    } catch (error) {
        console.error('[Persistence] Error clearing measurements:', error);
        alert('Error clearing measurements. Check console for details.');
    }
}

/**
 * Add export/import/clear buttons to toolbar
 * Called during initialization
 */
function addPersistenceButtons() {
    const toolbar = document.querySelector('.measurement-toolbar');
    if (!toolbar) {
        console.warn('[Persistence] Toolbar not found - cannot add persistence buttons');
        return;
    }

    // Create persistence controls container
    const persistenceContainer = document.createElement('div');
    persistenceContainer.className = 'persistence-controls';
    persistenceContainer.style.cssText = 'margin-left: auto; display: flex; gap: 8px;';

    // Export button
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn-persistence';
    exportBtn.innerHTML = '📥 Export';
    exportBtn.title = 'Export measurements to JSON file';
    exportBtn.onclick = exportMeasurementsToJSON;

    // Import button (with hidden file input)
    const importBtn = document.createElement('button');
    importBtn.className = 'btn-persistence';
    importBtn.innerHTML = '📤 Import';
    importBtn.title = 'Import measurements from JSON file';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            importMeasurementsFromJSON(file);
            fileInput.value = ''; // Reset input
        }
    };

    importBtn.onclick = () => fileInput.click();

    // Clear all button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-persistence btn-danger';
    clearBtn.innerHTML = '🗑️ Clear All';
    clearBtn.title = 'Delete all measurements';
    clearBtn.onclick = clearAllMeasurements;

    // Add to container
    persistenceContainer.appendChild(exportBtn);
    persistenceContainer.appendChild(importBtn);
    persistenceContainer.appendChild(fileInput);
    persistenceContainer.appendChild(clearBtn);

    // Add to toolbar
    toolbar.appendChild(persistenceContainer);

    console.log('[Persistence] Persistence buttons added to toolbar');
}


// ============================================
// TASK 15: SCALE INDICATOR UI
// ============================================

/**
 * Scale Indicator UI System
 *
 * Displays current page scale information in the status bar and optionally
 * as a visual scale bar on the canvas.
 *
 * Features:
 * - Scale info in status bar (e.g., "Scale: 1:1.50" or "Scale: Not Set")
 * - Visual scale bar on canvas (top-right corner) showing reference distance
 * - Per-page scale display (updates on page change)
 * - Warning indicator when scale not set
 */

/**
 * Update scale indicator in status bar
 * Shows current page scale ratio or "Not Set" warning
 */
function updateScaleIndicator() {
    const currentPage = viewerState?.currentPage || 1;
    const scaleData = measurementState.scaleData[currentPage];

    // Find or create scale status element
    let scaleStatus = document.getElementById('scale-status');
    if (!scaleStatus) {
        // Create scale status element if it doesn't exist
        scaleStatus = document.createElement('span');
        scaleStatus.id = 'scale-status';
        scaleStatus.style.cssText = 'margin-left: 16px; font-weight: 500;';

        // Try to add to status bar
        const statusBar = document.querySelector('.measurement-status-bar');
        if (statusBar) {
            statusBar.appendChild(scaleStatus);
        } else {
            console.warn('[Scale Indicator] Status bar not found');
            return;
        }
    }

    if (scaleData && scaleData.ratio) {
        // Calculate scale ratio (e.g., 1:1.50 means 1 pixel = 1.50 units)
        const ratio = scaleData.ratio.toFixed(2);
        scaleStatus.textContent = `Scale: 1:${ratio} (${scaleData.units})`;
        scaleStatus.style.color = '#28a745'; // Green for set
        scaleStatus.title = `1 pixel = ${ratio} ${scaleData.units}`;
    } else {
        scaleStatus.textContent = 'Scale: Not Set ⚠️';
        scaleStatus.style.color = '#dc3545'; // Red for warning
        scaleStatus.title = 'Please calibrate scale using the Scale tool';
    }

    console.log('[Scale Indicator] Scale status updated for page', currentPage);
}

/**
 * Add visual scale bar to canvas (optional)
 * Shows a reference distance in the top-right corner
 */
function addScaleBarToCanvas() {
    if (!measurementState.fabricCanvas) {
        console.warn('[Scale Indicator] Fabric canvas not initialized');
        return;
    }

    const currentPage = viewerState?.currentPage || 1;
    const scaleData = measurementState.scaleData[currentPage];

    // Remove existing scale bar if present
    removeScaleBarFromCanvas();

    if (!scaleData || !scaleData.ratio) {
        console.log('[Scale Indicator] No scale data for page', currentPage);
        return;
    }

    try {
        // Calculate scale bar dimensions (show 100 units worth)
        const referenceUnits = 100;
        const lineLength = referenceUnits * scaleData.ratio; // pixels

        // Position in top-right corner with padding
        const padding = 20;
        const canvasWidth = measurementState.fabricCanvas.width;
        const startX = canvasWidth - lineLength - padding;
        const startY = padding;

        // Create scale bar line
        const scaleLine = new fabric.Line(
            [startX, startY, startX + lineLength, startY],
            {
                stroke: '#23272A',
                strokeWidth: 3,
                selectable: false,
                evented: false,
                objectType: 'scale-indicator-line',
                excludeFromExport: true
            }
        );
        scaleLine.id = 'scale-bar-line';

        // Create scale bar text
        const scaleText = new fabric.Text(
            `${referenceUnits} ${scaleData.units}`,
            {
                left: startX + (lineLength / 2),
                top: startY - 20,
                fontSize: 14,
                fill: '#23272A',
                fontWeight: 'bold',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: 4,
                originX: 'center',
                selectable: false,
                evented: false,
                objectType: 'scale-indicator-text',
                excludeFromExport: true
            }
        );
        scaleText.id = 'scale-bar-text';

        // Create tick marks at ends
        const tickHeight = 10;
        const startTick = new fabric.Line(
            [startX, startY - tickHeight/2, startX, startY + tickHeight/2],
            {
                stroke: '#23272A',
                strokeWidth: 2,
                selectable: false,
                evented: false,
                objectType: 'scale-indicator-tick',
                excludeFromExport: true
            }
        );
        startTick.id = 'scale-bar-tick-start';

        const endTick = new fabric.Line(
            [startX + lineLength, startY - tickHeight/2, startX + lineLength, startY + tickHeight/2],
            {
                stroke: '#23272A',
                strokeWidth: 2,
                selectable: false,
                evented: false,
                objectType: 'scale-indicator-tick',
                excludeFromExport: true
            }
        );
        endTick.id = 'scale-bar-tick-end';

        // Add to canvas
        measurementState.fabricCanvas.add(scaleLine, scaleText, startTick, endTick);

        // Ensure scale bar is on top
        measurementState.fabricCanvas.bringToFront(scaleLine);
        measurementState.fabricCanvas.bringToFront(scaleText);
        measurementState.fabricCanvas.bringToFront(startTick);
        measurementState.fabricCanvas.bringToFront(endTick);

        measurementState.fabricCanvas.renderAll();

        console.log('[Scale Indicator] Scale bar added to canvas');

    } catch (error) {
        console.error('[Scale Indicator] Error adding scale bar:', error);
    }
}

/**
 * Remove scale bar from canvas
 */
function removeScaleBarFromCanvas() {
    if (!measurementState.fabricCanvas) return;

    const objects = measurementState.fabricCanvas.getObjects();
    const scaleObjects = objects.filter(obj =>
        obj.objectType && obj.objectType.includes('scale-indicator')
    );

    scaleObjects.forEach(obj => {
        measurementState.fabricCanvas.remove(obj);
    });

    if (scaleObjects.length > 0) {
        measurementState.fabricCanvas.renderAll();
        console.log('[Scale Indicator] Scale bar removed from canvas');
    }
}

/**
 * Update scale indicator when page changes
 * Called by page change event handler
 */
function onPageChangeUpdateScale() {
    updateScaleIndicator();
    // Optional: Uncomment to show scale bar on canvas
    // addScaleBarToCanvas();
}


// ============================================
// TASK 11: MEASUREMENT PROPERTIES PANEL
// ============================================

/**
 * Properties panel state
 */
const propertiesPanelState = {
    isOpen: false,
    currentMeasurement: null,
    currentObject: null,
    overlay: null
};

/**
 * Handle double-click on measurement object
 * Opens properties panel for editing
 */
function handleMeasurementDoubleClick(event) {
    const target = event.target;

    // Ignore if target is not a measurement object
    if (!target || !target.measurementData) {
        return;
    }

    console.log('[Properties Panel] Double-click detected on measurement:', target.measurementData);

    // Open properties panel with measurement data
    openPropertiesPanel(target, target.measurementData);
}

/**
 * Open properties panel with measurement data
 * @param {fabric.Object} object - Fabric object that was clicked
 * @param {Object} measurementData - Measurement data associated with object
 */
function openPropertiesPanel(object, measurementData) {
    console.log('[Properties Panel] Opening panel for:', measurementData);

    const panel = document.getElementById('properties-panel');
    if (!panel) {
        console.error('[Properties Panel] Panel element not found!');
        return;
    }

    // Store current measurement and object references
    propertiesPanelState.currentMeasurement = measurementData;
    propertiesPanelState.currentObject = object;
    propertiesPanelState.isOpen = true;

    // Populate form fields
    populatePropertiesForm(measurementData);

    // Show panel with slide-in animation
    panel.classList.add('active');

    // Create and show overlay
    createPropertiesOverlay();

    // Focus on first input
    setTimeout(() => {
        const labelInput = document.getElementById('prop-label');
        if (labelInput) {
            labelInput.select();
        }
    }, 100);

    // Attach panel event listeners (if not already attached)
    attachPropertiesPanelListeners();
}

/**
 * Close properties panel
 * @param {boolean} saveChanges - Whether to save changes before closing
 */
function closePropertiesPanel(saveChanges = false) {
    console.log('[Properties Panel] Closing panel, save changes:', saveChanges);

    const panel = document.getElementById('properties-panel');
    if (!panel) return;

    // Remove active class to trigger slide-out animation
    panel.classList.remove('active');

    // Remove overlay
    if (propertiesPanelState.overlay) {
        propertiesPanelState.overlay.remove();
        propertiesPanelState.overlay = null;
    }

    // Reset state
    propertiesPanelState.isOpen = false;
    propertiesPanelState.currentMeasurement = null;
    propertiesPanelState.currentObject = null;

    // Clear form
    const form = document.getElementById('properties-form');
    if (form) {
        form.reset();
    }
}

/**
 * Populate properties form with measurement data
 * @param {Object} data - Measurement data
 */
function populatePropertiesForm(data) {
    // Type (read-only)
    const typeInput = document.getElementById('prop-type');
    if (typeInput) {
        const typeLabels = {
            'linear': 'Linear Measurement',
            'area': 'Area Measurement',
            'count': 'Count Marker'
        };
        typeInput.value = typeLabels[data.type] || data.type;
    }

    // Value (read-only) - Format based on type
    const valueInput = document.getElementById('prop-value');
    if (valueInput) {
        let valueText = '';
        if (data.type === 'linear') {
            valueText = data.realLength.toFixed(2) + ' ' + data.units;
        } else if (data.type === 'area') {
            valueText = data.realArea.toFixed(2) + ' ' + data.units + '² (Perimeter: ' + data.perimeter.toFixed(2) + ' ' + data.units + ')';
        } else if (data.type === 'count') {
            valueText = 'Count: ' + data.count;
        }
        valueInput.value = valueText;
    }

    // Label (editable)
    const labelInput = document.getElementById('prop-label');
    if (labelInput) {
        labelInput.value = data.label || '';
    }

    // Category (editable)
    const categoryInput = document.getElementById('prop-category');
    if (categoryInput) {
        categoryInput.value = data.category || '';
    }

    // Color (editable)
    const colorInput = document.getElementById('prop-color');
    const colorPreview = document.getElementById('prop-color-preview');
    if (colorInput) {
        const currentColor = data.color || '#FF5A1F';
        colorInput.value = currentColor;
        if (colorPreview) {
            colorPreview.textContent = currentColor;
        }
    }

    // Notes (editable)
    const notesInput = document.getElementById('prop-notes');
    if (notesInput) {
        notesInput.value = data.notes || '';
    }

    // Created timestamp (read-only)
    const createdInput = document.getElementById('prop-created');
    if (createdInput && data.created) {
        createdInput.value = formatTimestamp(data.created);
    }

    // Modified timestamp (read-only)
    const modifiedInput = document.getElementById('prop-modified');
    if (modifiedInput) {
        const modifiedTime = data.modified || data.created;
        if (modifiedTime) {
            modifiedInput.value = formatTimestamp(modifiedTime);
        }
    }
}

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted timestamp
 */
function formatTimestamp(timestamp) {
    try {
        const date = new Date(timestamp);
        return date.toLocaleString();
    } catch (error) {
        return timestamp;
    }
}

/**
 * Create overlay backdrop for properties panel
 */
function createPropertiesOverlay() {
    // Remove existing overlay if any
    if (propertiesPanelState.overlay) {
        propertiesPanelState.overlay.remove();
    }

    // Create new overlay
    const overlay = document.createElement('div');
    overlay.className = 'properties-panel-overlay active';
    overlay.addEventListener('click', () => {
        closePropertiesPanel(false);
    });

    document.body.appendChild(overlay);
    propertiesPanelState.overlay = overlay;
}

/**
 * Attach event listeners to properties panel elements
 * Only attaches once to avoid duplicates
 */
let propertiesPanelListenersAttached = false;

function attachPropertiesPanelListeners() {
    if (propertiesPanelListenersAttached) {
        return;
    }

    console.log('[Properties Panel] Attaching event listeners...');

    // Close button
    const closeBtn = document.getElementById('properties-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closePropertiesPanel(false);
        });
    }

    // Cancel button
    const cancelBtn = document.getElementById('prop-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            closePropertiesPanel(false);
        });
    }

    // Delete button
    const deleteBtn = document.getElementById('prop-delete');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handlePropertiesDelete);
    }

    // Form submission (Save)
    const form = document.getElementById('properties-form');
    if (form) {
        form.addEventListener('submit', handlePropertiesSave);
    }

    // Color input change (update preview)
    const colorInput = document.getElementById('prop-color');
    if (colorInput) {
        colorInput.addEventListener('input', (event) => {
            const colorPreview = document.getElementById('prop-color-preview');
            if (colorPreview) {
                colorPreview.textContent = event.target.value;
            }
        });
    }

    // Escape key to close
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && propertiesPanelState.isOpen) {
            closePropertiesPanel(false);
        }
    });

    propertiesPanelListenersAttached = true;
    console.log('[Properties Panel] Event listeners attached');
}

/**
 * Handle properties form save
 * @param {Event} event - Form submit event
 */
function handlePropertiesSave(event) {
    event.preventDefault();

    console.log('[Properties Panel] Saving changes...');

    if (!propertiesPanelState.currentMeasurement || !propertiesPanelState.currentObject) {
        console.error('[Properties Panel] No measurement data to save!');
        return;
    }

    const data = propertiesPanelState.currentMeasurement;
    const object = propertiesPanelState.currentObject;

    // Get form values
    const labelInput = document.getElementById('prop-label');
    const categoryInput = document.getElementById('prop-category');
    const colorInput = document.getElementById('prop-color');
    const notesInput = document.getElementById('prop-notes');

    // Task 13: Capture previous state for undo
    const previousData = JSON.parse(JSON.stringify(data));

    // Update measurement data
    const oldLabel = data.label;
    const oldColor = data.color;

    data.label = labelInput.value.trim();
    data.category = categoryInput.value.trim();
    data.color = colorInput.value;
    data.notes = notesInput.value.trim();
    data.modified = new Date().toISOString();

    // Update Fabric object styling if color changed
    if (oldColor !== data.color) {
        updateMeasurementColor(object, data, data.color);
    }

    // Update label text on canvas if label changed
    if (oldLabel !== data.label) {
        updateMeasurementLabel(object, data, data.label);
    }

    // Render canvas to show changes
    measurementState.fabricCanvas.renderAll();

    // Task 12: Emit standardized update event
    emitMeasurementEvent('measurement:updated', data);

    // Task 13: Push to undo stack
    pushToUndoStack('update', data, previousData);

    // Task 14: Auto-save to localStorage
    saveMeasurementsToStorage();

    console.log('[Properties Panel] Changes saved successfully');

    // Close panel
    closePropertiesPanel(true);
}

/**
 * Handle delete button click in properties panel
 */
function handlePropertiesDelete() {
    if (!propertiesPanelState.currentObject) {
        console.error('[Properties Panel] No object to delete!');
        return;
    }

    // Confirm deletion
    const data = propertiesPanelState.currentMeasurement;
    const confirmMessage = 'Are you sure you want to delete this ' + data.type + ' measurement?\n\nLabel: ' + data.label + '\nCategory: ' + data.category;

    if (!confirm(confirmMessage)) {
        console.log('[Properties Panel] Deletion cancelled');
        return;
    }

    console.log('[Properties Panel] Deleting measurement...');

    // Close panel first
    closePropertiesPanel(false);

    // Use existing delete function
    handleDeleteMeasurement(propertiesPanelState.currentObject);
}

/**
 * Update measurement object color
 * @param {fabric.Object} object - Fabric object to update
 * @param {Object} data - Measurement data
 * @param {string} newColor - New color hex value
 */
function updateMeasurementColor(object, data, newColor) {
    console.log('[Properties Panel] Updating color to:', newColor);

    if (data.type === 'linear') {
        // Update polyline stroke color
        object.set('stroke', newColor);
    } else if (data.type === 'area') {
        // Update polygon stroke color
        object.set('stroke', newColor);
    } else if (data.type === 'count') {
        // Count markers are groups - update circle fill
        const objects = object.getObjects();
        const circle = objects.find(obj => obj.type === 'circle');
        if (circle) {
            circle.set('fill', newColor);
        }
    }

    // Store new color in data
    data.color = newColor;
}

/**
 * Update measurement label text on canvas
 * @param {fabric.Object} object - Fabric object to update
 * @param {Object} data - Measurement data
 * @param {string} newLabel - New label text
 */
function updateMeasurementLabel(object, data, newLabel) {
    console.log('[Properties Panel] Updating label to:', newLabel);

    // Find associated text object
    const textObject = findTextObjectForMeasurement(data);

    if (textObject) {
        // Update text content based on measurement type
        let updatedText = '';

        if (data.type === 'linear') {
            updatedText = newLabel + '\n' + data.realLength.toFixed(2) + ' ' + data.units;
        } else if (data.type === 'area') {
            updatedText = newLabel + '\n' + data.realArea.toFixed(2) + ' ' + data.units + '²';
        } else if (data.type === 'count') {
            // For count markers, the text is inside the group
            const objects = object.getObjects();
            const text = objects.find(obj => obj.type === 'text');
            if (text) {
                // Count markers show number, not label, so just update data
                // Label is shown in properties/export only
                console.log('[Properties Panel] Count marker label updated in data only');
            }
        }

        if (updatedText && data.type !== 'count') {
            textObject.set('text', updatedText);
        }
    }

    // Store new label in data
    data.label = newLabel;
}

// ============================================
// TASK 16: MEASUREMENT LIST UI
// ============================================

/**
 * Measurement List Panel System
 *
 * Provides a collapsible panel to view, filter, search, and manage all measurements.
 * Features filtering by type/page, search, sorting, and measurement actions.
 */

/**
 * Initialize the measurement list panel
 * Sets up event listeners and initial render
 */
function initMeasurementList() {
    console.log('[Measurement List] Initializing measurement list panel...');

    // Attach control listeners
    attachListControlListeners();

    // Render initial list
    renderMeasurementList();

    // Listen for measurement changes
    window.addEventListener('measurement:created', handleMeasurementChange);
    window.addEventListener('measurement:updated', handleMeasurementChange);
    window.addEventListener('measurement:deleted', handleMeasurementChange);

    console.log('[Measurement List] Measurement list panel initialized');
}

/**
 * Get all measurements from all pages
 * @returns {Array} Array of measurement objects with page number
 */
function getAllMeasurements() {
    const allMeasurements = [];

    for (const [pageNum, pageData] of Object.entries(measurementState.measurements)) {
        const measurements = pageData.data || [];
        measurements.forEach(measurement => {
            allMeasurements.push({
                ...measurement,
                pageNumber: parseInt(pageNum)
            });
        });
    }

    return allMeasurements;
}

/**
 * Get current filter state from UI controls
 * @returns {Object} Filter settings
 */
function getFilterState() {
    const typeFilter = document.getElementById('filter-type')?.value || 'all';
    const pageFilter = document.getElementById('filter-page')?.value || 'all';
    const searchQuery = document.getElementById('search-measurements')?.value || '';
    const sortBy = document.getElementById('sort-measurements')?.value || 'name';

    return {
        type: typeFilter,
        page: pageFilter,
        search: searchQuery.toLowerCase().trim(),
        sortBy: sortBy
    };
}

/**
 * Filter measurements based on current filter settings
 * @param {Array} measurements - Array of measurement objects
 * @param {Object} filters - Filter settings
 * @returns {Array} Filtered measurements
 */
function filterMeasurements(measurements, filters) {
    let filtered = [...measurements];

    // Filter by type
    if (filters.type !== 'all') {
        filtered = filtered.filter(m => m.type === filters.type);
    }

    // Filter by page
    if (filters.page === 'current' && viewerState.currentPage) {
        filtered = filtered.filter(m => m.pageNumber === viewerState.currentPage);
    }

    // Filter by search query
    if (filters.search) {
        filtered = filtered.filter(m => {
            const label = (m.label || '').toLowerCase();
            const notes = (m.notes || '').toLowerCase();
            const category = (m.category || '').toLowerCase();
            return label.includes(filters.search) ||
                   notes.includes(filters.search) ||
                   category.includes(filters.search);
        });
    }

    return filtered;
}

/**
 * Sort measurements based on sort criteria
 * @param {Array} measurements - Array of measurement objects
 * @param {string} sortBy - Sort criteria (name/value/date/page)
 * @returns {Array} Sorted measurements
 */
function sortMeasurements(measurements, sortBy) {
    const sorted = [...measurements];

    switch (sortBy) {
        case 'name':
            sorted.sort((a, b) => {
                const aLabel = (a.label || 'Untitled').toLowerCase();
                const bLabel = (b.label || 'Untitled').toLowerCase();
                return aLabel.localeCompare(bLabel);
            });
            break;
        case 'value':
            sorted.sort((a, b) => (b.value || 0) - (a.value || 0));
            break;
        case 'date':
            sorted.sort((a, b) => {
                const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                return bTime - aTime; // Newest first
            });
            break;
        case 'page':
            sorted.sort((a, b) => a.pageNumber - b.pageNumber);
            break;
    }

    return sorted;
}

/**
 * Render the complete measurement list
 */
function renderMeasurementList() {
    console.log('[Measurement List] Rendering measurement list...');

    // Get all measurements
    const allMeasurements = getAllMeasurements();

    // Get filters
    const filters = getFilterState();

    // Apply filters
    let filteredMeasurements = filterMeasurements(allMeasurements, filters);

    // Apply sorting
    filteredMeasurements = sortMeasurements(filteredMeasurements, filters.sortBy);

    // Update summary stats
    updateSummaryStats(allMeasurements);

    // Render list items
    renderListItems(filteredMeasurements);

    console.log('[Measurement List] Rendered', filteredMeasurements.length, 'of', allMeasurements.length, 'measurements');
}

/**
 * Render measurement list items into container
 * @param {Array} measurements - Array of filtered/sorted measurements
 */
function renderListItems(measurements) {
    const container = document.getElementById('measurement-list-container');
    if (!container) {
        console.warn('[Measurement List] Container not found');
        return;
    }

    // Clear container
    container.innerHTML = '';

    if (measurements.length === 0) {
        container.innerHTML = `
            <div class="measurement-list-empty">
                <p>No measurements found</p>
            </div>
        `;
        return;
    }

    // Create measurement items
    measurements.forEach(measurement => {
        const itemElement = createMeasurementItemElement(measurement);
        container.appendChild(itemElement);
    });
}

/**
 * Create a measurement item DOM element
 * @param {Object} measurement - Measurement object with pageNumber
 * @returns {HTMLElement} Measurement item element
 */
function createMeasurementItemElement(measurement) {
    const div = document.createElement('div');
    div.className = 'measurement-item';
    div.dataset.measurementId = measurement.id;
    div.dataset.page = measurement.pageNumber;

    const typeClass = measurement.type.toLowerCase();
    const label = measurement.label || 'Untitled';
    const value = measurement.value?.toFixed(2) || '0.00';
    const units = measurement.units || '';
    const notes = measurement.notes || '';

    div.innerHTML = `
        <div class="measurement-item-header">
            <span class="measurement-type-badge ${typeClass}">${measurement.type}</span>
            <span class="measurement-page">Page ${measurement.pageNumber}</span>
        </div>
        <div class="measurement-item-body">
            <div class="measurement-label">${escapeHtml(label)}</div>
            <div class="measurement-value">${value} ${units}</div>
            ${notes ? `<div class="measurement-notes">${escapeHtml(notes)}</div>` : ''}
        </div>
        <div class="measurement-item-actions">
            <button class="btn-icon" title="Zoom to Measurement" data-action="zoom">
                <i class="fas fa-search-plus"></i>
            </button>
            <button class="btn-icon" title="Highlight" data-action="highlight">
                <i class="fas fa-lightbulb"></i>
            </button>
            <button class="btn-icon btn-danger" title="Delete" data-action="delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    // Attach action listeners
    div.querySelector('[data-action="zoom"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        zoomToMeasurement(measurement.id, measurement.pageNumber);
    });

    div.querySelector('[data-action="highlight"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        highlightMeasurement(measurement.id, measurement.pageNumber);
    });

    div.querySelector('[data-action="delete"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteMeasurementWithConfirm(measurement.id, measurement.pageNumber);
    });

    return div;
}

/**
 * Update summary statistics display
 * @param {Array} measurements - All measurements (unfiltered)
 */
function updateSummaryStats(measurements) {
    let linearCount = 0;
    let linearTotal = 0;
    let areaCount = 0;
    let areaTotal = 0;
    let countTotal = 0;

    measurements.forEach(m => {
        if (m.type === 'Linear') {
            linearCount++;
            linearTotal += m.value || 0;
        } else if (m.type === 'Area') {
            areaCount++;
            areaTotal += m.value || 0;
        } else if (m.type === 'Count') {
            countTotal += m.value || 0;
        }
    });

    // Update DOM
    const statLinearCount = document.getElementById('stat-linear-count');
    const statLinearTotal = document.getElementById('stat-linear-total');
    const statAreaCount = document.getElementById('stat-area-count');
    const statAreaTotal = document.getElementById('stat-area-total');
    const statCountTotal = document.getElementById('stat-count-total');

    if (statLinearCount) statLinearCount.textContent = linearCount;
    if (statLinearTotal) statLinearTotal.textContent = linearTotal.toFixed(2);
    if (statAreaCount) statAreaCount.textContent = areaCount;
    if (statAreaTotal) statAreaTotal.textContent = areaTotal.toFixed(2);
    if (statCountTotal) statCountTotal.textContent = countTotal;
}

/**
 * Toggle measurement list panel open/closed
 */
function toggleMeasurementListPanel() {
    const panel = document.getElementById('measurement-list-panel');
    if (!panel) return;

    panel.classList.toggle('collapsed');

    // Update icon
    const icon = document.querySelector('#toggle-list-panel i');
    if (icon) {
        if (panel.classList.contains('collapsed')) {
            icon.className = 'fas fa-chevron-left';
        } else {
            icon.className = 'fas fa-chevron-right';
        }
    }

    console.log('[Measurement List] Panel toggled:', panel.classList.contains('collapsed') ? 'collapsed' : 'expanded');
}

/**
 * Zoom canvas to center on a specific measurement
 * @param {string} id - Measurement ID
 * @param {number} pageNumber - Page number
 */
function zoomToMeasurement(id, pageNumber) {
    console.log('[Measurement List] Zooming to measurement:', id, 'on page', pageNumber);

    // Switch to correct page if needed
    if (viewerState.currentPage !== pageNumber) {
        console.log('[Measurement List] Switching to page', pageNumber);
        if (typeof loadPage === 'function') {
            loadPage(pageNumber);
        }
    }

    // Find canvas object
    setTimeout(() => {
        const canvasObj = measurementState.fabricCanvas?.getObjects().find(obj => obj.data?.id === id);
        if (!canvasObj) {
            console.warn('[Measurement List] Canvas object not found for measurement:', id);
            return;
        }

        // Get object bounds
        const bounds = canvasObj.getBoundingRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        // Get canvas viewport
        const canvas = measurementState.fabricCanvas;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Calculate pan to center object in viewport
        const viewportCenterX = canvasWidth / 2;
        const viewportCenterY = canvasHeight / 2;

        const deltaX = viewportCenterX - centerX;
        const deltaY = viewportCenterY - centerY;

        // Apply transform
        const currentTransform = canvas.viewportTransform.slice();
        currentTransform[4] += deltaX;
        currentTransform[5] += deltaY;

        canvas.setViewportTransform(currentTransform);
        canvas.requestRenderAll();

        console.log('[Measurement List] Zoomed to measurement at', centerX, centerY);
    }, 100);
}

/**
 * Highlight measurement with flash effect
 * @param {string} id - Measurement ID
 * @param {number} pageNumber - Page number
 */
function highlightMeasurement(id, pageNumber) {
    console.log('[Measurement List] Highlighting measurement:', id, 'on page', pageNumber);

    // Switch to correct page if needed
    if (viewerState.currentPage !== pageNumber) {
        if (typeof loadPage === 'function') {
            loadPage(pageNumber);
        }
    }

    // Find canvas object and flash it
    setTimeout(() => {
        const canvasObj = measurementState.fabricCanvas?.getObjects().find(obj => obj.data?.id === id);
        if (!canvasObj) {
            console.warn('[Measurement List] Canvas object not found for measurement:', id);
            return;
        }

        // Store original opacity and stroke
        const originalOpacity = canvasObj.opacity || 1;
        const originalStrokeWidth = canvasObj.strokeWidth || 2;

        // Flash effect (3 pulses over 2 seconds)
        let pulseCount = 0;
        const pulseInterval = setInterval(() => {
            if (pulseCount % 2 === 0) {
                // Highlight
                canvasObj.set({
                    opacity: 1,
                    strokeWidth: originalStrokeWidth * 2
                });
            } else {
                // Normal
                canvasObj.set({
                    opacity: originalOpacity,
                    strokeWidth: originalStrokeWidth
                });
            }
            measurementState.fabricCanvas.requestRenderAll();

            pulseCount++;
            if (pulseCount >= 6) {
                clearInterval(pulseInterval);
                // Restore original state
                canvasObj.set({
                    opacity: originalOpacity,
                    strokeWidth: originalStrokeWidth
                });
                measurementState.fabricCanvas.requestRenderAll();
            }
        }, 333); // 3 pulses in 2 seconds = 333ms per pulse

        console.log('[Measurement List] Highlighting measurement with flash effect');
    }, 100);
}

/**
 * Delete measurement with confirmation dialog
 * @param {string} id - Measurement ID
 * @param {number} pageNumber - Page number
 */
function deleteMeasurementWithConfirm(id, pageNumber) {
    console.log('[Measurement List] Delete requested for measurement:', id, 'on page', pageNumber);

    // Find measurement for confirmation message
    const pageData = measurementState.measurements[pageNumber];
    if (!pageData) return;

    const measurement = pageData.data?.find(m => m.id === id);
    if (!measurement) return;

    const label = measurement.label || 'Untitled';
    const confirmMsg = `Delete measurement "${label}"?\n\nType: ${measurement.type}\nValue: ${measurement.value?.toFixed(2)} ${measurement.units || ''}\n\nThis action cannot be undone.`;

    if (confirm(confirmMsg)) {
        // Use existing deleteMeasurement function
        if (typeof deleteMeasurement === 'function') {
            deleteMeasurement(id, pageNumber);
            console.log('[Measurement List] Measurement deleted:', id);
        } else {
            console.error('[Measurement List] deleteMeasurement function not found');
        }
    } else {
        console.log('[Measurement List] Delete cancelled by user');
    }
}

/**
 * Attach event listeners to list controls
 */
function attachListControlListeners() {
    console.log('[Measurement List] Attaching control listeners...');

    // Toggle panel button
    const toggleBtn = document.getElementById('toggle-list-panel');
    const panelHeader = document.querySelector('.measurement-list-panel .panel-header');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMeasurementListPanel();
        });
    }

    // Also toggle when clicking header
    if (panelHeader) {
        panelHeader.addEventListener('click', toggleMeasurementListPanel);
    }

    // Filter controls
    const filterType = document.getElementById('filter-type');
    const filterPage = document.getElementById('filter-page');
    const sortSelect = document.getElementById('sort-measurements');

    if (filterType) {
        filterType.addEventListener('change', renderMeasurementList);
    }

    if (filterPage) {
        filterPage.addEventListener('change', renderMeasurementList);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', renderMeasurementList);
    }

    // Search with debounce
    const searchInput = document.getElementById('search-measurements');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                renderMeasurementList();
            }, 300); // 300ms debounce
        });
    }

    console.log('[Measurement List] Control listeners attached');
}

/**
 * Handle measurement change events (auto-refresh list)
 * @param {Event} event - Measurement event
 */
function handleMeasurementChange(event) {
    console.log('[Measurement List] Measurement changed, refreshing list...');
    renderMeasurementList();
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// TASK 17: CSV EXPORT
// ============================================

/**
 * CSV Export System
 *
 * Provides CSV export functionality for all measurements across all pages.
 * Generates a downloadable CSV file with comprehensive measurement data.
 *
 * Features:
 * - Exports all measurements from all pages
 * - Proper CSV escaping for special characters
 * - Summary totals at bottom
 * - Timestamp in filename
 * - Opens correctly in Excel/Google Sheets
 *
 * CSV Format:
 * Page,Type,Label,Category,Value,Unit,Points/Position,Created,Notes
 */

/**
 * Escape CSV field to handle commas, quotes, and newlines
 * @param {string} field - Field value to escape
 * @returns {string} - Escaped field value
 */
function escapeCsvField(field) {
    if (field == null) {
        return '';
    }

    // Convert to string
    const str = String(field);

    // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }

    return str;
}

/**
 * Export all measurements to CSV file
 * Generates CSV with all measurement data and downloads it automatically
 */
function exportMeasurementsToCSV() {
    console.log('[CSV Export] Starting export process...');

    // Check if there are any measurements
    const hasData = Object.keys(measurementState.measurements).some(
        page => measurementState.measurements[page]?.data?.length > 0
    );

    if (!hasData) {
        console.warn('[CSV Export] No measurements to export');
        alert('No measurements to export. Please add some measurements first.');
        return;
    }

    console.log('[CSV Export] Measurements found:', measurementState.measurements);

    // CSV header
    const headers = ['Page', 'Type', 'Label', 'Category', 'Value', 'Unit', 'Points/Position', 'Created', 'Notes'];
    let csvContent = headers.join(',') + '\n';

    // Track totals for summary
    let totalLinear = 0;
    let totalArea = 0;
    let totalCount = 0;
    let linearUnit = '';
    let areaUnit = '';

    // Iterate through all pages
    const pageNumbers = Object.keys(measurementState.measurements).sort((a, b) => parseInt(a) - parseInt(b));

    console.log('[CSV Export] Processing pages:', pageNumbers);

    for (const pageNum of pageNumbers) {
        const pageData = measurementState.measurements[pageNum];

        if (!pageData || !pageData.data || pageData.data.length === 0) {
            continue;
        }

        console.log(`[CSV Export] Processing page ${pageNum}, measurements:`, pageData.data.length);

        // Process each measurement on this page
        for (const measurement of pageData.data) {
            const row = [];

            // Page number
            row.push(pageNum);

            // Type
            row.push(escapeCsvField(measurement.type));

            // Label
            row.push(escapeCsvField(measurement.label || ''));

            // Category
            row.push(escapeCsvField(measurement.category || ''));

            // Value and Unit
            if (measurement.type === 'linear') {
                const value = measurement.realLength?.toFixed(2) || '0.00';
                row.push(value);
                row.push(escapeCsvField(measurement.units || ''));
                totalLinear += parseFloat(value);
                if (!linearUnit && measurement.units) {
                    linearUnit = measurement.units;
                }
            } else if (measurement.type === 'area') {
                const value = measurement.realArea?.toFixed(2) || '0.00';
                row.push(value);
                row.push(escapeCsvField(measurement.units + '²' || ''));
                totalArea += parseFloat(value);
                if (!areaUnit && measurement.units) {
                    areaUnit = measurement.units + '²';
                }
            } else if (measurement.type === 'count') {
                row.push(measurement.count || 1);
                row.push('count');
                totalCount += measurement.count || 1;
            } else {
                row.push('');
                row.push('');
            }

            // Points/Position
            if (measurement.type === 'linear') {
                const pointsStr = measurement.points?.length
                    ? `${measurement.points.length} points`
                    : '';
                row.push(escapeCsvField(pointsStr));
            } else if (measurement.type === 'area') {
                const verticesStr = measurement.vertices?.length
                    ? `${measurement.vertices.length} vertices`
                    : '';
                row.push(escapeCsvField(verticesStr));
            } else if (measurement.type === 'count') {
                const posStr = measurement.position
                    ? `(${measurement.position.x.toFixed(0)}, ${measurement.position.y.toFixed(0)})`
                    : '';
                row.push(escapeCsvField(posStr));
            } else {
                row.push('');
            }

            // Created timestamp
            const createdDate = measurement.created
                ? new Date(measurement.created).toLocaleString()
                : '';
            row.push(escapeCsvField(createdDate));

            // Notes
            row.push(escapeCsvField(measurement.notes || ''));

            csvContent += row.join(',') + '\n';
        }
    }

    // Add summary totals
    csvContent += '\n';
    csvContent += 'SUMMARY TOTALS\n';

    if (totalLinear > 0) {
        csvContent += `Total Linear,,,${totalLinear.toFixed(2)},${linearUnit}\n`;
    }

    if (totalArea > 0) {
        csvContent += `Total Area,,,${totalArea.toFixed(2)},${areaUnit}\n`;
    }

    if (totalCount > 0) {
        csvContent += `Total Count,,,${totalCount},markers\n`;
    }

    console.log('[CSV Export] CSV content generated, length:', csvContent.length);
    console.log('[CSV Export] Summary - Linear:', totalLinear, 'Area:', totalArea, 'Count:', totalCount);

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `takeoff-measurements-${timestamp}.csv`;

    console.log('[CSV Export] Creating download with filename:', filename);

    // Create download link
    if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up object URL
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
    }

    console.log('[CSV Export] Export completed successfully');

    // Show success message
    const message = `CSV exported successfully!\n\nFile: ${filename}\n\nTotal Measurements:\n` +
        (totalLinear > 0 ? `- Linear: ${totalLinear.toFixed(2)} ${linearUnit}\n` : '') +
        (totalArea > 0 ? `- Area: ${totalArea.toFixed(2)} ${areaUnit}\n` : '') +
        (totalCount > 0 ? `- Count: ${totalCount} markers\n` : '');

    alert(message);
}

/**
 * Attach event listeners for export functionality
 * Called once during initialization
 */
let exportListenersAttached = false;

function attachExportListeners() {
    if (exportListenersAttached) {
        console.log('[CSV Export] Event listeners already attached');
        return;
    }

    console.log('[CSV Export] Attaching event listeners...');

    const exportCsvBtn = document.getElementById('export-csv');

    if (!exportCsvBtn) {
        console.error('[CSV Export] Export CSV button not found in DOM');
        return;
    }

    // CSV Export button click
    exportCsvBtn.addEventListener('click', () => {
        console.log('[CSV Export] Export CSV button clicked');
        exportMeasurementsToCSV();
    });

    // Excel Export button click
    const exportExcelBtn = document.getElementById('export-excel');
    if (!exportExcelBtn) {
        console.error('[Excel Export] Export Excel button not found in DOM');
    } else {
        exportExcelBtn.addEventListener('click', () => {
            console.log('[Excel Export] Export Excel button clicked');
            exportMeasurementsToExcel();
        });
    }

    exportListenersAttached = true;
    console.log('[Export] Event listeners attached successfully (CSV + Excel)');
}

/* ============================================
   TASK 18: EXCEL EXPORT
   ============================================ */

/**
 * Export measurements to Excel (.xlsx) file using SheetJS
 * Creates multi-sheet workbook with Summary and All Measurements
 */
function exportMeasurementsToExcel() {
    try {
        console.log('[Excel Export] Starting Excel export...');

        // Verify SheetJS library is loaded
        if (typeof XLSX === 'undefined') {
            throw new Error('SheetJS library not loaded. Please refresh the page.');
        }

        // Check if there are any measurements to export
        const totalMeasurements = getTotalMeasurementCount();
        if (totalMeasurements === 0) {
            alert('No measurements to export. Please create some measurements first.');
            console.warn('[Excel Export] No measurements found');
            return;
        }

        console.log(`[Excel Export] Exporting ${totalMeasurements} measurements...`);

        // Create new workbook
        const workbook = XLSX.utils.book_new();

        // === SUMMARY SHEET ===
        const summaryData = createSummarySheetData();
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

        // Style summary sheet with column widths
        summarySheet['!cols'] = [
            { wch: 25 },
            { wch: 15 },
            { wch: 15 },
            { wch: 10 }
        ];

        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
        console.log('[Excel Export] Summary sheet created');

        // === ALL MEASUREMENTS SHEET ===
        const allMeasurementsData = createAllMeasurementsSheetData();
        const allMeasurementsSheet = XLSX.utils.aoa_to_sheet(allMeasurementsData);

        // Auto-width columns
        allMeasurementsSheet['!cols'] = [
            { wch: 8 },  // Page
            { wch: 12 }, // Type
            { wch: 25 }, // Label
            { wch: 12 }, // Value
            { wch: 8 },  // Units
            { wch: 30 }, // Notes
            { wch: 20 }  // Timestamp
        ];

        // Freeze header row
        allMeasurementsSheet['!freeze'] = { xSplit: 0, ySplit: 1 };

        XLSX.utils.book_append_sheet(workbook, allMeasurementsSheet, 'All Measurements');
        console.log('[Excel Export] All Measurements sheet created');

        // === PER-PAGE SHEETS (only if < 10 pages) ===
        const pageCount = Object.keys(measurementState.measurements).length;
        if (pageCount > 0 && pageCount < 10) {
            createPerPageSheets(workbook);
            console.log(`[Excel Export] Created ${pageCount} per-page sheets`);
        } else {
            console.log(`[Excel Export] Skipped per-page sheets (${pageCount} pages)`);
        }

        // === EXPORT FILE ===
        const timestamp = Date.now();
        const filename = `takeoff-measurements-${timestamp}.xlsx`;

        XLSX.writeFile(workbook, filename);

        console.log(`[Excel Export] Excel file exported successfully: ${filename}`);
        alert('Excel file exported successfully!');

    } catch (error) {
        console.error('[Excel Export] Error:', error);
        alert(`Error exporting Excel file: ${error.message}\n\nCheck console for details.`);
    }
}

/**
 * Create Summary sheet data array
 * @returns {Array} 2D array for Summary sheet
 */
function createSummarySheetData() {
    const stats = calculateMeasurementStatistics();
    const pdfFileName = viewerState?.pdfUrl?.split('/').pop() || 'Unknown';

    return [
        ['Midwest Underground Takeoff System'],
        ['Export Date', new Date().toLocaleString()],
        ['PDF File', pdfFileName],
        [],
        ['Summary Statistics'],
        ['Measurement Type', 'Count', 'Total Value', 'Units'],
        ['Linear Measurements', stats.linearCount, stats.totalLinear.toFixed(2), 'feet'],
        ['Area Measurements', stats.areaCount, stats.totalArea.toFixed(2), 'sqft'],
        ['Count Markers', stats.countCount, stats.totalCount, 'count'],
        [],
        ['Total Measurements', stats.totalMeasurements],
        ['Pages with Measurements', stats.pageCount]
    ];
}

/**
 * Create All Measurements sheet data array
 * @returns {Array} 2D array for All Measurements sheet
 */
function createAllMeasurementsSheetData() {
    const data = [
        ['Page', 'Type', 'Label', 'Value', 'Units', 'Notes', 'Timestamp']
    ];

    // Sort pages numerically
    const pageNumbers = Object.keys(measurementState.measurements)
        .map(p => parseInt(p))
        .sort((a, b) => a - b);

    for (const pageNum of pageNumbers) {
        const pageData = measurementState.measurements[pageNum];
        const measurements = pageData.data || [];

        for (const m of measurements) {
            data.push([
                pageNum,
                m.type || 'Unknown',
                m.label || 'Untitled',
                parseFloat((m.value || 0).toFixed(2)),
                m.units || '',
                m.notes || '',
                m.timestamp ? new Date(m.timestamp).toLocaleString() : ''
            ]);
        }
    }

    return data;
}

/**
 * Create per-page sheets (only if < 10 pages)
 * @param {Object} workbook - SheetJS workbook object
 */
function createPerPageSheets(workbook) {
    // Sort pages numerically
    const pageNumbers = Object.keys(measurementState.measurements)
        .map(p => parseInt(p))
        .sort((a, b) => a - b);

    for (const pageNum of pageNumbers) {
        const pageData = measurementState.measurements[pageNum];
        const measurements = pageData.data || [];

        if (measurements.length === 0) {
            continue; // Skip empty pages
        }

        const sheetData = [
            [`Page ${pageNum} Measurements`],
            [],
            ['Type', 'Label', 'Value', 'Units', 'Notes', 'Timestamp']
        ];

        for (const m of measurements) {
            sheetData.push([
                m.type || 'Unknown',
                m.label || 'Untitled',
                parseFloat((m.value || 0).toFixed(2)),
                m.units || '',
                m.notes || '',
                m.timestamp ? new Date(m.timestamp).toLocaleString() : ''
            ]);
        }

        // Add summary for this page
        const linearTotal = measurements
            .filter(m => m.type === 'Linear')
            .reduce((sum, m) => sum + (m.value || 0), 0);
        const areaTotal = measurements
            .filter(m => m.type === 'Area')
            .reduce((sum, m) => sum + (m.value || 0), 0);
        const countTotal = measurements
            .filter(m => m.type === 'Count')
            .reduce((sum, m) => sum + (m.value || 0), 0);

        sheetData.push([]);
        sheetData.push(['Page Totals:']);
        sheetData.push(['Linear:', '', linearTotal.toFixed(2), 'feet']);
        sheetData.push(['Area:', '', areaTotal.toFixed(2), 'sqft']);
        sheetData.push(['Count:', '', countTotal, 'count']);

        const pageSheet = XLSX.utils.aoa_to_sheet(sheetData);

        // Column widths
        pageSheet['!cols'] = [
            { wch: 12 },
            { wch: 25 },
            { wch: 12 },
            { wch: 8 },
            { wch: 30 },
            { wch: 20 }
        ];

        // Freeze header row
        pageSheet['!freeze'] = { xSplit: 0, ySplit: 3 };

        XLSX.utils.book_append_sheet(workbook, pageSheet, `Page ${pageNum}`);
    }
}

/**
 * Calculate measurement statistics
 * @returns {Object} Statistics object
 */
function calculateMeasurementStatistics() {
    let linearCount = 0;
    let areaCount = 0;
    let countCount = 0;
    let totalLinear = 0;
    let totalArea = 0;
    let totalCount = 0;
    let totalMeasurements = 0;

    for (const pageData of Object.values(measurementState.measurements)) {
        const measurements = pageData.data || [];
        totalMeasurements += measurements.length;

        for (const m of measurements) {
            if (m.type === 'Linear') {
                linearCount++;
                totalLinear += (m.value || 0);
            } else if (m.type === 'Area') {
                areaCount++;
                totalArea += (m.value || 0);
            } else if (m.type === 'Count') {
                countCount++;
                totalCount += (m.value || 0);
            }
        }
    }

    return {
        linearCount,
        areaCount,
        countCount,
        totalLinear,
        totalArea,
        totalCount,
        totalMeasurements,
        pageCount: Object.keys(measurementState.measurements).length
    };
}

/**
 * Get total measurement count across all pages
 * @returns {number} Total count
 */
function getTotalMeasurementCount() {
    let total = 0;
    for (const pageData of Object.values(measurementState.measurements)) {
        total += (pageData.data || []).length;
    }
    return total;
}

// Export for global access
if (typeof window !== 'undefined') {
    window.measurementState = measurementState;
    window.initMeasurementTools = initMeasurementTools;
    window.syncCanvasDimensions = syncCanvasDimensions; // For debugging
    window.exportMeasurementsToCSV = exportMeasurementsToCSV; // For debugging/testing
    window.exportMeasurementsToExcel = exportMeasurementsToExcel; // For debugging/testing
    window.zoomToMeasurement = zoomToMeasurement; // For debugging/testing
    window.highlightMeasurement = highlightMeasurement; // For debugging/testing
    window.renderMeasurementList = renderMeasurementList; // For debugging/testing
}

console.log('[Measurement Tools] Module script loaded');
