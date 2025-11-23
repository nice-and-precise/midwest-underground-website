# Area Measurement Tool - Usage Guide

## Quick Start

### How to Use the Area Tool

1. **Set Scale First**
   - Click "Scale" button
   - Click two points on a known distance
   - Enter the real-world distance and units

2. **Activate Area Tool**
   - Click "Area" button (requires scale to be set)
   - Cursor changes to crosshair

3. **Draw Polygon**
   - Click to place first vertex
   - Click to add more vertices (minimum 3 required)
   - Preview polygon shows as you move cursor

4. **Close Polygon** (two methods)
   - **Method 1**: Click near first point (within 10px)
     - First point highlights green when you're close enough
   - **Method 2**: Press Enter key
     - Closes polygon immediately with current vertices

5. **Select Category**
   - Choose from: Excavation, Paving, Bore Zone, Other
   - Enter number 1-4
   - Press Cancel to abort measurement

6. **Result**
   - Polygon appears with semi-transparent fill
   - Area displayed at center
   - Tool stays active for next measurement

### Keyboard Shortcuts

- **Enter** - Close polygon and finish measurement (min 3 vertices)
- **ESC** - Cancel current drawing and deactivate tool

## Visual Feedback Guide

### While Drawing

```
First Click:     Orange circle (5px)
Second Click:    Orange line (dashed preview)
Third+ Click:    Orange polygon (semi-transparent preview)
Hovering Near:   Green circle around first point
```

### After Completion

```
Excavation:      Brown fill (30% opacity) + brown stroke
Paving:          Gray fill (30% opacity) + gray stroke
Bore Zone:       Orange fill (30% opacity) + orange stroke
Other:           Gray fill (30% opacity) + gray stroke
```

## Category Colors Reference

| Category    | Fill Color                    | Stroke Color | Use Case                    |
|-------------|-------------------------------|--------------|----------------------------|
| Excavation  | rgba(139, 69, 19, 0.3) Brown  | #8B4513      | Dig zones, trenches        |
| Paving      | rgba(128, 128, 128, 0.3) Gray | #808080      | Asphalt, concrete areas    |
| Bore Zone   | rgba(255, 107, 53, 0.3) Orange| #FF6B35      | HDD bore paths, buffer zones|
| Other       | rgba(102, 102, 102, 0.3) Gray | #666666      | General purpose            |

## Tips & Best Practices

### For Accurate Measurements

1. **Set Scale on Same Page**
   - Each PDF page needs its own scale
   - Scale should match the drawing's scale bar
   - Use a known horizontal or vertical dimension

2. **Zoom In for Precision**
   - Zoom in before placing vertices
   - More precise vertex placement
   - Easier to see small details

3. **Vertex Placement Order**
   - Can be clockwise or counter-clockwise
   - Shoelace formula handles both
   - Try to avoid crossing edges

4. **Complex Shapes**
   - Break into multiple simple polygons
   - Easier to measure and verify
   - Can add areas together later

### Common Scenarios

**Rectangular Excavation:**
```
1. Click top-left corner
2. Click top-right corner
3. Click bottom-right corner
4. Click bottom-left corner
5. Click near first point OR press Enter
```

**Irregular Bore Zone:**
```
1. Click starting point
2. Click along boundary (as many points as needed)
3. Return to start point and click OR press Enter
```

**Self-Intersecting Polygon:**
```
WARNING: Area will still be calculated but may not be meaningful
Check console for warning message
Consider redrawing with simpler shape
```

## Measurement Data

### What Gets Stored

```javascript
{
    type: 'area',                    // Measurement type
    id: 1,                           // Unique ID
    label: 'Area #1',                // Display label
    category: 'Excavation',          // Selected category
    vertices: [{x, y}, ...],         // All polygon vertices
    pixelArea: 22500,                // Area in pixels²
    realArea: 10000,                 // Area in real units²
    perimeter: 400,                  // Perimeter in real units
    units: 'feet',                   // Scale units
    created: '2025-11-22T...',       // ISO timestamp
    fabricObjects: ['id1', 'id2']    // Polygon and text IDs
}
```

### Accessing Measurement Data

```javascript
// Get current page
const page = viewerState.currentPage;

// Get all measurements for current page
const measurements = measurementState.measurements[page];

// Get just area measurements
const areaMeasurements = measurements.data.filter(m => m.type === 'area');

// Calculate total area
const totalArea = areaMeasurements.reduce((sum, m) => sum + m.realArea, 0);
```

## Area Calculation Details

### Shoelace Formula

The tool uses the shoelace formula (also called surveyor's formula):

```javascript
Area = |Σ(xi × yi+1 - xi+1 × yi)| / 2

Where:
- xi, yi are coordinates of vertex i
- Sum goes from i=0 to n-1
- Last vertex connects back to first vertex (cyclic)
- Absolute value handles clockwise/counter-clockwise
```

### Unit Conversion

```javascript
// Pixel area to real area
realArea = pixelArea / (ratio × ratio)

Where:
- ratio = pixels per unit (from scale calibration)
- ratio² converts square pixels to square units
```

**Example:**
```
Scale: 100 pixels = 10 feet
Ratio: 100/10 = 10 pixels/foot

Polygon: 2500 pixels²
Area: 2500 / (10 × 10) = 25 square feet
```

## Troubleshooting

### Tool Button Disabled
**Problem:** Area button is grayed out
**Solution:** Set scale first using Scale tool

### Can't Close Polygon
**Problem:** Clicking doesn't close polygon
**Solution:**
- Must have at least 3 vertices
- Click within 10px of first point
- Or press Enter key

### Preview Not Showing
**Problem:** No polygon preview visible
**Solution:**
- Need at least 3 points for polygon preview
- Only shows line preview with 2 points
- Check that tool is active (button highlighted)

### Area Seems Wrong
**Problem:** Calculated area doesn't match expected
**Solution:**
- Verify scale is set correctly
- Check that units match (feet vs meters)
- Ensure polygon doesn't self-intersect
- Try redrawing with fewer vertices

### Very Small Area Warning
**Problem:** Console shows warning about small area
**Solution:**
- Polygon may be too small (< 100 pixels²)
- Check for self-intersecting edges
- Verify vertices are in correct positions
- May be legitimate if measuring tiny area

## Console Debug Messages

The tool logs extensive debug information:

```
[Measurement Tools] Area vertex added: {x, y} (Total vertices: N)
[Measurement Tools] Clicking first point - closing polygon
[Measurement Tools] Enter key pressed - finishing area measurement
[Measurement Tools] Finishing area measurement with N vertices
[Measurement Tools] Pixel area (shoelace): XXXX.XX
[Measurement Tools] Calculated area: {pixelArea, realArea, units}
[Measurement Tools] Perimeter: {pixelPerimeter, realPerimeter, units}
[Measurement Tools] Area measurement created: {...}
[Measurement Tools] Area measurement complete. Tool remains active.
```

### Warning Messages

```
Warning: Very small area detected. Polygon may be self-intersecting or very small.
```

## Developer Notes

### Extending the Tool

**Add New Category:**
```javascript
// In promptForAreaCategory()
const categories = ['Excavation', 'Paving', 'Bore Zone', 'Other', 'NewCategory'];

// In getAreaCategoryColors()
'NewCategory': {
    fill: 'rgba(R, G, B, 0.3)',
    stroke: '#RRGGBB'
}
```

**Custom Validation:**
```javascript
// In finishAreaMeasurement(), after area calculation
if (realArea > maxAllowedArea) {
    showError('Area exceeds maximum allowed size');
    cleanupCurrentMeasurement();
    return;
}
```

**Export Measurements:**
```javascript
function exportAreaMeasurements() {
    const page = viewerState.currentPage;
    const areas = measurementState.measurements[page].data
        .filter(m => m.type === 'area');

    const csv = areas.map(m =>
        `${m.label},${m.category},${m.realArea},${m.units}`
    ).join('\n');

    // Download CSV or send to server
}
```

## Related Documentation

- Linear Measurement Tool: See measurement-tools.js lines 784-1117
- Scale Calibration: See measurement-tools.js lines 530-776
- Module Overview: See measurement-tools.js lines 1-65
