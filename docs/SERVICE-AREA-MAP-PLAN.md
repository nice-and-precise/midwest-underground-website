# Service Area Map Implementation Plan

## Overview
Create an interactive service area map showing Midwest Underground's coverage region in central Minnesota, with admin dashboard controls for editing the map boundaries.

---

## Phase 1: Public-Facing Map (Homepage/Services Page)

### Technology Choice: Leaflet.js
**Why Leaflet:**
- Lightweight (40KB) and fast
- Mobile-friendly touch interactions
- Easy to customize with brand colors
- Works offline with static tiles
- Free and open-source

**Alternative Considered:**
- Google Maps API (requires API key, $200/month credit limit)
- Mapbox (free tier: 50K loads/month)

**Recommendation:** Start with Leaflet + OpenStreetMap (free, no limits)

### Map Features - Public View

**1. Service Area Boundary**
- Polygon overlay showing coverage area
- Fill: Brand orange (#FF8800) at 20% opacity
- Border: Solid brand orange 3px width
- Primary: Kandiyohi County
- Secondary: Surrounding counties (lighter shade)

**2. Office Location Marker**
- Custom marker icon with company logo
- Address: 4320 County Rd 8 SE, Willmar, MN 56201
- Click to show popup with:
  - Office address
  - Phone: (320) 382-6636
  - Directions link

**3. Interactive Controls**
- Zoom in/out buttons
- Pan by dragging
- Reset view button
- Current location button (if user allows)

**4. Service Area Highlights**
- Major cities labeled: Willmar, Hutchinson, Litchfield
- County names visible
- Highway markers (US-12, US-71, etc.)

### HTML Structure

```html
<!-- Service Area Section (index.html or services.html) -->
<section class="section">
  <div class="container">
    <h2>Our Service Area</h2>
    <p>Proudly serving Kandiyohi County and surrounding Central Minnesota regions</p>

    <div id="service-area-map" style="height: 500px; border-radius: 12px; overflow: hidden;">
      <!-- Leaflet map will be inserted here -->
    </div>

    <div class="service-area-details">
      <h3>Coverage Includes:</h3>
      <ul>
        <li>Kandiyohi County (Primary)</li>
        <li>Meeker County</li>
        <li>Renville County</li>
        <li>Swift County</li>
        <li>Chippewa County</li>
        <li>McLeod County</li>
      </ul>
      <p><strong>Emergency Service Available 24/7 Throughout Service Area</strong></p>
    </div>
  </div>
</section>
```

### CSS Styling

```css
#service-area-map {
  height: 500px;
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  margin: var(--space-2xl) 0;
}

.service-area-details {
  margin-top: var(--space-xl);
  text-align: center;
}

.service-area-details ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
  list-style: none;
  padding: 0;
  margin: var(--space-lg) 0;
}

.service-area-details li {
  background: var(--bg-accent);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--brand-accent);
}

/* Leaflet overrides for brand consistency */
.leaflet-popup-content-wrapper {
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: var(--radius-md);
}

.leaflet-popup-tip {
  background: var(--bg-primary);
}

[data-theme="dark"] .leaflet-tile {
  filter: invert(1) hue-rotate(180deg) brightness(0.9);
}
```

### JavaScript Implementation

```javascript
// js/service-area-map.js (new file)

let serviceAreaMap = null;
let serviceAreaPolygon = null;

async function initServiceAreaMap() {
  // Load service area data
  const serviceAreaData = await fetchServiceAreaData();

  // Initialize map centered on Willmar, MN
  serviceAreaMap = L.map('service-area-map', {
    center: [45.1219, -95.0436], // Willmar coordinates
    zoom: 10,
    zoomControl: true,
    scrollWheelZoom: false // Prevent accidental zoom while scrolling page
  });

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(serviceAreaMap);

  // Add office location marker
  const officeMarker = L.marker([45.1219, -95.0436], {
    icon: L.icon({
      iconUrl: 'images/mu_icon_official.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    })
  }).addTo(serviceAreaMap);

  officeMarker.bindPopup(`
    <div style="text-align: center;">
      <strong>Midwest Underground of Minnesota</strong><br>
      4320 County Rd 8 SE<br>
      Willmar, MN 56201<br>
      <a href="tel:3203826636">(320) 382-6636</a><br>
      <a href="https://maps.google.com/?q=4320+County+Rd+8+SE,+Willmar,+MN+56201" target="_blank">Get Directions</a>
    </div>
  `);

  // Draw service area polygon
  drawServiceArea(serviceAreaData.coordinates);
}

function drawServiceArea(coordinates) {
  if (serviceAreaPolygon) {
    serviceAreaMap.removeLayer(serviceAreaPolygon);
  }

  serviceAreaPolygon = L.polygon(coordinates, {
    color: '#FF8800', // Brand orange
    fillColor: '#FF8800',
    fillOpacity: 0.2,
    weight: 3
  }).addTo(serviceAreaMap);

  // Fit map to show entire service area
  serviceAreaMap.fitBounds(serviceAreaPolygon.getBounds(), {
    padding: [50, 50]
  });
}

async function fetchServiceAreaData() {
  try {
    const response = await fetch('/api/data/service-area.json');
    return await response.json();
  } catch (error) {
    console.error('Error loading service area:', error);
    // Return default Kandiyohi County boundaries
    return getDefaultServiceArea();
  }
}

function getDefaultServiceArea() {
  // Approximate Kandiyohi County boundaries
  return {
    name: "Kandiyohi County + Surrounding Areas",
    coordinates: [
      [45.3, -95.3],
      [45.3, -94.7],
      [44.9, -94.7],
      [44.9, -95.3],
      [45.3, -95.3]
    ]
  };
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('service-area-map')) {
    initServiceAreaMap();
  }
});
```

---

## Phase 2: Data Storage (JSON File)

### Service Area Data File

**Location:** `api/data/service-area.json`

```json
{
  "name": "Midwest Underground Service Area",
  "primary_area": "Kandiyohi County",
  "office_location": {
    "lat": 45.1219,
    "lon": -95.0436,
    "address": "4320 County Rd 8 SE, Willmar, MN 56201",
    "phone": "(320) 382-6636"
  },
  "service_area_coordinates": [
    [45.3500, -95.3500],
    [45.3500, -94.6500],
    [44.8500, -94.6500],
    [44.8500, -95.3500],
    [45.3500, -95.3500]
  ],
  "counties_served": [
    {"name": "Kandiyohi County", "primary": true},
    {"name": "Meeker County", "primary": false},
    {"name": "Renville County", "primary": false},
    {"name": "Swift County", "primary": false},
    {"name": "Chippewa County", "primary": false},
    {"name": "McLeod County", "primary": false}
  ],
  "last_updated": "2025-10-25",
  "updated_by": "admin"
}
```

---

## Phase 3: Dashboard Admin Controls

### Dashboard Page: Service Area Editor

**New page:** `dashboard/service-area.html`

**Features:**
1. **Visual Map Editor**
   - Interactive Leaflet map
   - Click to add polygon points
   - Drag points to adjust boundaries
   - Delete points with right-click
   - Undo/redo changes

2. **County Checkboxes**
   - List of all MN counties
   - Check/uncheck to add/remove from service area
   - Automatically draws county boundaries

3. **Office Location Editor**
   - Input fields for lat/lon
   - Or: Click map to set location
   - Update address, phone

4. **Save/Publish Controls**
   - "Save Draft" - Saves to draft file
   - "Preview" - Shows public view
   - "Publish" - Updates live service-area.json
   - Confirmation dialog before publish

### Dashboard HTML Structure

```html
<!-- dashboard/service-area.html -->
<div class="page-header">
  <h1>Service Area Map Editor</h1>
  <p class="page-subtitle">Define and update your service coverage area</p>
</div>

<div class="editor-grid">
  <!-- Left Panel: Map Editor -->
  <div class="map-editor-panel">
    <div class="panel-header">
      <h3>Map Editor</h3>
      <div class="editor-controls">
        <button class="btn btn-secondary" id="edit-mode-toggle">
          <span>✏️</span> Edit Mode
        </button>
        <button class="btn btn-secondary" id="undo-btn">
          <span>↶</span> Undo
        </button>
        <button class="btn btn-secondary" id="reset-btn">
          <span>↻</span> Reset
        </button>
      </div>
    </div>

    <div id="admin-map" style="height: 600px;">
      <!-- Editable Leaflet map -->
    </div>

    <div class="map-instructions">
      <h4>How to Edit:</h4>
      <ul>
        <li><strong>Add Point:</strong> Click map in edit mode</li>
        <li><strong>Move Point:</strong> Drag existing point</li>
        <li><strong>Delete Point:</strong> Right-click point</li>
        <li><strong>Pan Map:</strong> Drag with left mouse</li>
      </ul>
    </div>
  </div>

  <!-- Right Panel: Settings -->
  <div class="settings-panel">
    <!-- Office Location -->
    <div class="settings-section">
      <h3>Office Location</h3>
      <div class="form-group">
        <label>Latitude</label>
        <input type="number" step="0.0001" id="office-lat" value="45.1219">
      </div>
      <div class="form-group">
        <label>Longitude</label>
        <input type="number" step="0.0001" id="office-lon" value="-95.0436">
      </div>
      <div class="form-group">
        <label>Address</label>
        <input type="text" id="office-address" value="4320 County Rd 8 SE, Willmar, MN 56201">
      </div>
      <div class="form-group">
        <label>Phone</label>
        <input type="tel" id="office-phone" value="(320) 382-6636">
      </div>
    </div>

    <!-- Counties Served -->
    <div class="settings-section">
      <h3>Counties Served</h3>
      <div class="county-list">
        <label class="checkbox-label">
          <input type="checkbox" checked> Kandiyohi County (Primary)
        </label>
        <label class="checkbox-label">
          <input type="checkbox" checked> Meeker County
        </label>
        <label class="checkbox-label">
          <input type="checkbox" checked> Renville County
        </label>
        <!-- ... more counties -->
      </div>
    </div>

    <!-- Save Controls -->
    <div class="settings-section">
      <div class="save-controls">
        <button class="btn btn-secondary btn-lg">
          <span>💾</span> Save Draft
        </button>
        <button class="btn btn-secondary btn-lg">
          <span>👁️</span> Preview
        </button>
        <button class="btn btn-primary btn-lg">
          <span>📤</span> Publish Changes
        </button>
      </div>

      <div class="last-updated">
        Last updated: October 25, 2025 by admin
      </div>
    </div>
  </div>
</div>
```

### Dashboard JavaScript

```javascript
// dashboard/js/service-area-editor.js (new file)

let adminMap = null;
let editablePolygon = null;
let isEditMode = false;
let changeHistory = [];

async function initServiceAreaEditor() {
  // Load current service area data
  const data = await fetchServiceAreaData();

  // Initialize editable map
  adminMap = L.map('admin-map', {
    center: [45.1219, -95.0436],
    zoom: 10
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(adminMap);

  // Create editable polygon
  editablePolygon = L.polygon(data.service_area_coordinates, {
    color: '#FF8800',
    fillColor: '#FF8800',
    fillOpacity: 0.2,
    weight: 3,
    editable: true
  }).addTo(adminMap);

  // Enable Leaflet.Editable
  adminMap.addLayer(editablePolygon);
  editablePolygon.enableEdit();

  setupEventListeners();
}

function setupEventListeners() {
  // Edit mode toggle
  document.getElementById('edit-mode-toggle').addEventListener('click', toggleEditMode);

  // Undo button
  document.getElementById('undo-btn').addEventListener('click', undoLastChange);

  // Save draft
  document.getElementById('save-draft-btn').addEventListener('click', saveDraft);

  // Publish changes
  document.getElementById('publish-btn').addEventListener('click', publishChanges);

  // Track polygon changes
  editablePolygon.on('edit', function() {
    saveToHistory();
  });
}

function toggleEditMode() {
  isEditMode = !isEditMode;

  if (isEditMode) {
    editablePolygon.enableEdit();
    document.getElementById('edit-mode-toggle').classList.add('active');
  } else {
    editablePolygon.disableEdit();
    document.getElementById('edit-mode-toggle').classList.remove('active');
  }
}

async function publishChanges() {
  if (!confirm('Publish changes to live website? This will update the service area map for all visitors.')) {
    return;
  }

  const coordinates = editablePolygon.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);

  const data = {
    name: "Midwest Underground Service Area",
    service_area_coordinates: coordinates,
    office_location: {
      lat: parseFloat(document.getElementById('office-lat').value),
      lon: parseFloat(document.getElementById('office-lon').value),
      address: document.getElementById('office-address').value,
      phone: document.getElementById('office-phone').value
    },
    last_updated: new Date().toISOString(),
    updated_by: getCurrentUsername()
  };

  try {
    await saveServiceAreaData(data);
    showNotification('Service area map published successfully!', 'success');
  } catch (error) {
    showNotification('Error publishing changes', 'error');
    console.error(error);
  }
}

async function saveServiceAreaData(data) {
  // In production, this would be an API call
  // For now, save to localStorage and update JSON file
  localStorage.setItem('service-area-data', JSON.stringify(data));

  // TODO: Backend endpoint to write to service-area.json
  // await fetch('/api/service-area/update', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
}
```

---

## Phase 4: Implementation Steps

### Step 1: Add Leaflet Library (Week 1)
1. Add Leaflet CSS and JS to `<head>`
2. Create `js/service-area-map.js`
3. Create `api/data/service-area.json`
4. Test basic map display

### Step 2: Public Map Integration (Week 1-2)
1. Add map section to homepage or services page
2. Style map with brand colors
3. Add office marker
4. Draw default service area polygon
5. Test responsive behavior

### Step 3: Dashboard Page (Week 2-3)
1. Create `dashboard/service-area.html`
2. Create `dashboard/js/service-area-editor.js`
3. Add Leaflet.Editable plugin
4. Implement drag-to-edit functionality
5. Add save/publish controls

### Step 4: Backend Integration (Week 3-4)
1. Create API endpoint: POST /api/service-area/update
2. Add authentication/authorization
3. File write permissions for service-area.json
4. Version control for map changes
5. Audit log of who changed what

### Step 5: Testing & Polish (Week 4)
1. Test map on all devices
2. Test edit/publish workflow
3. Add error handling
4. Performance optimization
5. User documentation

---

## Required Libraries

### Leaflet.js (Map Display)
```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

<!-- JavaScript -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

### Leaflet.Editable (Dashboard Only)
```html
<script src="https://unpkg.com/leaflet-editable@1.2.0/src/Leaflet.Editable.js"></script>
```

---

## Future Enhancements

**Phase 5+ (Optional):**
1. **Heat Map Layer** - Show project density by region
2. **Custom Service Tiers** - Different colors for standard/premium areas
3. **Draw Multiple Polygons** - Separate areas for different services
4. **Export Map Image** - Download PNG for marketing materials
5. **Service Area Analytics** - Track which areas generate most quotes
6. **Address Lookup** - "Check if we serve your address" search box

---

## Estimated Timeline

- **Phase 1 (Public Map):** 1-2 weeks
- **Phase 2 (Data Storage):** 1 day
- **Phase 3 (Dashboard Editor):** 2-3 weeks
- **Phase 4 (Backend Integration):** 1-2 weeks (if adding Node.js backend)

**Total:** 4-6 weeks for complete implementation

---

## Next Steps

1. ✅ Document this plan
2. ⏸️ Gather precise county boundary coordinates
3. ⏸️ Decide: Use Leaflet or Google Maps?
4. ⏸️ Create basic map prototype on homepage
5. ⏸️ Add Leaflet libraries to project
6. ⏸️ Build dashboard editor interface

**Ready to start Phase 1 when you approve this plan!**
