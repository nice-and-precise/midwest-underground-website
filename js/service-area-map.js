/**
 * Service Area Map - Interactive Leaflet Map
 * Shows Midwest Underground's coverage area in central Minnesota
 */

let serviceAreaMap = null;
let serviceAreaPolygon = null;
let officeMarker = null;

/**
 * Initialize the service area map
 */
async function initServiceAreaMap() {
  const mapContainer = document.getElementById('service-area-map');

  if (!mapContainer) {
    console.log('[Service Area Map] Map container not found on this page');
    return;
  }

  try {
    // Load service area data
    const serviceAreaData = await fetchServiceAreaData();

    // Initialize map centered on Willmar, MN
    serviceAreaMap = L.map('service-area-map', {
      center: [serviceAreaData.office_location.lat, serviceAreaData.office_location.lon],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: false // Prevent accidental zoom while scrolling page
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      minZoom: 8
    }).addTo(serviceAreaMap);

    // Add custom office marker
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="
          width: 50px;
          height: 50px;
          background: var(--brand-accent);
          border: 4px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            transform: rotate(45deg);
            font-size: 24px;
            color: white;
          ">🏢</span>
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50]
    });

    officeMarker = L.marker(
      [serviceAreaData.office_location.lat, serviceAreaData.office_location.lon],
      { icon: customIcon }
    ).addTo(serviceAreaMap);

    // Create popup content
    const popupContent = `
      <div style="text-align: center; font-family: var(--font-body); padding: 8px;">
        <strong style="font-size: 16px; color: var(--brand-slate-dark); display: block; margin-bottom: 8px;">
          Midwest Underground of Minnesota
        </strong>
        <div style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
          ${serviceAreaData.office_location.address}<br>
          <a href="tel:${serviceAreaData.office_location.phone.replace(/\D/g, '')}"
             style="color: var(--brand-accent); text-decoration: none; font-weight: 600;">
            ${serviceAreaData.office_location.phone}
          </a><br>
          <a href="https://maps.google.com/?q=${encodeURIComponent(serviceAreaData.office_location.address)}"
             target="_blank"
             style="color: var(--brand-accent); text-decoration: none; font-size: 13px;">
            📍 Get Directions
          </a>
        </div>
      </div>
    `;

    officeMarker.bindPopup(popupContent, {
      className: 'custom-map-popup',
      maxWidth: 300
    });

    // Draw service area polygon
    drawServiceArea(serviceAreaData.service_area_coordinates);

    // Add legend
    addMapLegend(serviceAreaData);

    console.log('[Service Area Map] Map initialized successfully');

  } catch (error) {
    console.error('[Service Area Map] Error initializing map:', error);
    // Show error message to user
    mapContainer.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background: var(--bg-secondary);
        color: var(--text-secondary);
        font-size: 16px;
        border-radius: var(--radius-lg);
      ">
        <div style="text-align: center;">
          <span style="font-size: 48px; display: block; margin-bottom: 16px;">🗺️</span>
          <strong>Service Area Map Unavailable</strong><br>
          <span style="font-size: 14px;">Serving Kandiyohi County & Surrounding Central Minnesota</span>
        </div>
      </div>
    `;
  }
}

/**
 * Draw service area polygon on map
 */
function drawServiceArea(coordinates) {
  if (serviceAreaPolygon) {
    serviceAreaMap.removeLayer(serviceAreaPolygon);
  }

  serviceAreaPolygon = L.polygon(coordinates, {
    color: '#FF8800', // Brand orange
    fillColor: '#FF8800',
    fillOpacity: 0.15,
    weight: 3,
    dashArray: '10, 5'
  }).addTo(serviceAreaMap);

  // Add tooltip on hover
  serviceAreaPolygon.bindTooltip('Primary Service Area', {
    permanent: false,
    direction: 'center',
    className: 'service-area-tooltip'
  });

  // Fit map to show entire service area with padding
  serviceAreaMap.fitBounds(serviceAreaPolygon.getBounds(), {
    padding: [50, 50]
  });
}

/**
 * Add legend to map
 */
function addMapLegend(data) {
  const legend = L.control({ position: 'bottomright' });

  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = `
      <div style="
        background: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        font-family: var(--font-body);
        font-size: 13px;
        line-height: 1.8;
      ">
        <div style="font-weight: 600; margin-bottom: 8px; color: var(--brand-slate-dark);">Service Area</div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span style="width: 20px; height: 3px; background: #FF8800; display: inline-block;"></span>
          <span style="color: var(--text-secondary);">Coverage Boundary</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">🏢</span>
          <span style="color: var(--text-secondary);">Office Location</span>
        </div>
        <div style="
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #E2E8F0;
          font-size: 12px;
          color: var(--text-muted);
        ">
          ${data.service_radius_miles}-mile service radius
        </div>
      </div>
    `;
    return div;
  };

  legend.addTo(serviceAreaMap);
}

/**
 * Fetch service area data from JSON file
 */
async function fetchServiceAreaData() {
  try {
    const response = await fetch('/api/data/service-area.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[Service Area Map] Error loading service area data:', error);
    // Return default data as fallback
    return getDefaultServiceArea();
  }
}

/**
 * Get default service area data (fallback)
 */
function getDefaultServiceArea() {
  return {
    name: "Midwest Underground Service Area",
    primary_area: "Kandiyohi County, Minnesota",
    office_location: {
      lat: 45.1219,
      lon: -95.0436,
      address: "4320 County Rd 8 SE, Willmar, MN 56201",
      phone: "(320) 382-6636"
    },
    service_area_coordinates: [
      [45.35, -95.35],
      [45.35, -94.65],
      [44.85, -94.65],
      [44.85, -95.35],
      [45.35, -95.35]
    ],
    service_radius_miles: 50
  };
}

// Initialize map when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initServiceAreaMap();
});

// Re-initialize map if window is resized (fixes layout issues)
let resizeTimeout;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function() {
    if (serviceAreaMap) {
      serviceAreaMap.invalidateSize();
    }
  }, 250);
});
