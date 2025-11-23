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
            fill: '#FF6B35',
            stroke: '#003B5C',
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
            fill: '#FF6B35',
            stroke: '#003B5C',
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
        stroke: '#FF6B35',
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
        stroke: '#FF6B35',
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

        // Emit event for future integration (Task 12 - placeholder)
        document.dispatchEvent(new CustomEvent('measurement:created', {
            detail: measurementData
        }));

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
        'HDD': '#FF6B35',      // Orange
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
            fill: '#FF6B35',
            stroke: '#003B5C',
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
            fill: '#FF6B35',
            stroke: '#003B5C',
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
            stroke: '#FF6B35',
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
            stroke: '#FF6B35',
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

        // Emit event for future integration (Task 12 - placeholder)
        document.dispatchEvent(new CustomEvent('measurement:created', {
            detail: measurementData
        }));

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
            stroke: '#FF6B35'                  // Orange
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
            stroke: '#003B5C',
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

        // Emit event for future integration (Task 12 - placeholder)
        document.dispatchEvent(new CustomEvent('measurement:created', {
            detail: measurementData
        }));

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
        'Pits': '#FF6B35',        // Safety Orange
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

        // Emit event for future integration
        document.dispatchEvent(new CustomEvent('measurement:updated', {
            detail: measurementData
        }));

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

    // Optional: Add visual feedback or show properties panel
    // This is a placeholder for future enhancements
}

/**
 * Handle selection cleared event
 */
function handleSelectionCleared(event) {
    console.log('[Measurement Tools] Task 9: Selection cleared');

    // Optional: Hide properties panel or remove visual feedback
    // This is a placeholder for future enhancements
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

    // Emit event for future integration
    document.dispatchEvent(new CustomEvent('measurement:deleted', {
        detail: measurementData
    }));

    console.log('[Measurement Tools] Task 9: Measurement deleted successfully');
}

// Export for global access
if (typeof window !== 'undefined') {
    window.measurementState = measurementState;
    window.initMeasurementTools = initMeasurementTools;
    window.syncCanvasDimensions = syncCanvasDimensions; // For debugging
}

console.log('[Measurement Tools] Module script loaded');
