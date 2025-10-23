/**
 * Equipment Management JavaScript
 * Handles equipment tracking, utilization, and maintenance
 */

let allEquipment = [];
let filteredEquipment = [];
let utilizationChart = null;
let revenueChart = null;

document.addEventListener('DOMContentLoaded', async function() {
  console.log('[Equipment] Initializing equipment page...');

  // Load equipment data
  await loadEquipmentData();

  // Setup event listeners
  setupFilters();
  setupExportButtons();

  // Initialize charts
  initializeCharts();

  // Initial render
  renderEquipment();

  console.log('[Equipment] Equipment page initialized');
});

/**
 * Load equipment data from API/JSON
 */
async function loadEquipmentData() {
  try {
    const response = await fetch('api/data/equipment.json');
    const data = await response.json();
    allEquipment = data.equipment;
    filteredEquipment = [...allEquipment];

    console.log(`[Equipment] Loaded ${allEquipment.length} equipment items`);
    updateSummaryCards();
  } catch (error) {
    console.error('[Equipment] Error loading equipment:', error);
    showNotification('Error loading equipment data', 'error');
  }
}

/**
 * Update summary KPI cards
 */
function updateSummaryCards() {
  const totalEquipment = allEquipment.length;
  const avgUtilization = allEquipment.reduce((sum, e) => sum + e.utilization_rate, 0) / totalEquipment;
  const totalRevenue = allEquipment.reduce((sum, e) => sum + e.revenue_generated_ytd, 0);
  const maintenanceDue = allEquipment.filter(e => e.maintenance_status === 'Maintenance Due').length;
  const totalHours = allEquipment.reduce((sum, e) => sum + e.hours_this_month, 0);

  document.getElementById('total-equipment').textContent = totalEquipment;
  document.getElementById('avg-utilization').textContent = avgUtilization.toFixed(1) + '%';
  document.getElementById('equipment-revenue').textContent = '$' + (totalRevenue / 1000000).toFixed(1) + 'M';
  document.getElementById('maintenance-due').textContent = maintenanceDue;
  document.getElementById('hours-month').textContent = totalHours.toLocaleString();
}

/**
 * Setup filter event listeners
 */
function setupFilters() {
  const typeFilter = document.getElementById('filter-type');
  const statusFilter = document.getElementById('filter-status');
  const searchFilter = document.getElementById('filter-search');
  const sortBy = document.getElementById('sort-by');
  const clearFilters = document.getElementById('clear-filters');

  // Apply filters on change
  [typeFilter, statusFilter, sortBy].forEach(el => {
    if (el) el.addEventListener('change', applyFilters);
  });

  // Search with debounce
  if (searchFilter) {
    let searchTimeout;
    searchFilter.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(applyFilters, 300);
    });
  }

  // Clear all filters
  if (clearFilters) {
    clearFilters.addEventListener('click', function() {
      document.getElementById('filter-type').value = '';
      document.getElementById('filter-status').value = '';
      document.getElementById('filter-search').value = '';
      document.getElementById('sort-by').value = 'utilization-desc';
      applyFilters();
    });
  }

  // Add equipment button
  const addBtn = document.getElementById('add-equipment-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      showNotification('Add equipment feature coming soon!', 'info');
    });
  }
}

/**
 * Apply all filters and sorting
 */
function applyFilters() {
  const type = document.getElementById('filter-type').value;
  const status = document.getElementById('filter-status').value;
  const search = document.getElementById('filter-search').value.toLowerCase();
  const sortBy = document.getElementById('sort-by').value;

  // Filter equipment
  filteredEquipment = allEquipment.filter(equipment => {
    // Type filter
    if (type && equipment.type !== type) return false;

    // Status filter
    if (status && equipment.maintenance_status !== status) return false;

    // Search filter
    if (search) {
      const searchableText = `
        ${equipment.id}
        ${equipment.name}
        ${equipment.type}
        ${equipment.current_crew}
      `.toLowerCase();

      if (!searchableText.includes(search)) return false;
    }

    return true;
  });

  // Apply sorting
  filteredEquipment.sort((a, b) => {
    switch (sortBy) {
      case 'utilization-desc':
        return b.utilization_rate - a.utilization_rate;
      case 'utilization-asc':
        return a.utilization_rate - b.utilization_rate;
      case 'revenue-desc':
        return b.revenue_generated_ytd - a.revenue_generated_ytd;
      case 'revenue-asc':
        return a.revenue_generated_ytd - b.revenue_generated_ytd;
      case 'hours-desc':
        return b.hours_this_month - a.hours_this_month;
      case 'hours-asc':
        return a.hours_this_month - b.hours_this_month;
      default:
        return 0;
    }
  });

  // Update results count
  document.getElementById('results-count').textContent = filteredEquipment.length;
  document.getElementById('total-count').textContent = allEquipment.length;

  // Render filtered equipment
  renderEquipment();
}

/**
 * Render equipment table
 */
function renderEquipment() {
  const tbody = document.getElementById('equipment-table-body');
  if (!tbody) return;

  if (filteredEquipment.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
          No equipment found matching your filters
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredEquipment.map(equipment => `
    <tr>
      <td><strong>${equipment.id}</strong></td>
      <td>
        <div style="max-width: 200px;">
          <strong>${equipment.name}</strong>
        </div>
      </td>
      <td><span class="badge ${getTypeBadgeClass(equipment.type)}">${equipment.type}</span></td>
      <td style="text-align: center;">
        <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
          <div style="flex: 1; max-width: 60px;">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${equipment.utilization_rate}%; background: ${getUtilizationColor(equipment.utilization_rate)};"></div>
            </div>
          </div>
          <strong>${equipment.utilization_rate}%</strong>
        </div>
      </td>
      <td style="text-align: right;"><strong>${equipment.hours_this_month}</strong></td>
      <td style="text-align: right;"><strong>$${(equipment.revenue_generated_ytd / 1000).toFixed(0)}K</strong></td>
      <td>${equipment.current_crew || '<span style="color: var(--text-secondary);">Unassigned</span>'}</td>
      <td><span class="badge ${getMaintenanceBadgeClass(equipment.maintenance_status)}">${equipment.maintenance_status}</span></td>
      <td>${equipment.next_service_date ? formatDate(equipment.next_service_date) : '<span style="color: var(--text-secondary);">—</span>'}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon" title="View Details" onclick="viewEquipment('${equipment.id}')">👁️</button>
          <button class="btn-icon" title="Edit" onclick="editEquipment('${equipment.id}')">✏️</button>
          <button class="btn-icon" title="Service History" onclick="viewServiceHistory('${equipment.id}')">📋</button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * Initialize Chart.js charts
 */
function initializeCharts() {
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

  const colors = {
    primary: isDarkMode ? '#3a7ca5' : '#003B5C',
    accent: isDarkMode ? '#5fb3d6' : '#2EA3F2',
    success: isDarkMode ? '#81c3a3' : '#28A745',
    warning: isDarkMode ? '#f4c542' : '#FFC107',
    text: isDarkMode ? '#e5e5e5' : '#333333',
    grid: isDarkMode ? '#404040' : '#E0E0E0'
  };

  // Utilization Chart (Bar)
  const utilizationCtx = document.getElementById('utilization-chart').getContext('2d');

  const sortedByUtilization = [...allEquipment].sort((a, b) => b.utilization_rate - a.utilization_rate);
  const equipmentNames = sortedByUtilization.map(e => e.name.length > 20 ? e.name.substring(0, 20) + '...' : e.name);
  const utilizationData = sortedByUtilization.map(e => e.utilization_rate);

  utilizationChart = new Chart(utilizationCtx, {
    type: 'bar',
    data: {
      labels: equipmentNames,
      datasets: [{
        label: 'Utilization %',
        data: utilizationData,
        backgroundColor: utilizationData.map(val => {
          if (val >= 80) return colors.success;
          if (val >= 60) return colors.accent;
          return colors.warning;
        }),
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Utilization: ' + context.parsed.x + '%';
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: colors.text,
            callback: function(value) {
              return value + '%';
            }
          },
          grid: { color: colors.grid }
        },
        y: {
          ticks: { color: colors.text },
          grid: { display: false }
        }
      }
    }
  });

  // Revenue Chart (Horizontal Bar)
  const revenueCtx = document.getElementById('revenue-chart').getContext('2d');

  const sortedByRevenue = [...allEquipment].sort((a, b) => b.revenue_generated_ytd - a.revenue_generated_ytd);
  const revenueNames = sortedByRevenue.map(e => e.name.length > 20 ? e.name.substring(0, 20) + '...' : e.name);
  const revenueData = sortedByRevenue.map(e => e.revenue_generated_ytd / 1000);

  revenueChart = new Chart(revenueCtx, {
    type: 'bar',
    data: {
      labels: revenueNames,
      datasets: [{
        label: 'Revenue ($K)',
        data: revenueData,
        backgroundColor: colors.primary,
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return '$' + context.parsed.x.toFixed(0) + 'K';
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: colors.text,
            callback: function(value) {
              return '$' + (value / 1000).toFixed(0) + 'M';
            }
          },
          grid: { color: colors.grid }
        },
        y: {
          ticks: { color: colors.text },
          grid: { display: false }
        }
      }
    }
  });
}

/**
 * Setup export buttons
 */
function setupExportButtons() {
  const exportCSV = document.getElementById('export-csv-btn');

  if (exportCSV) {
    exportCSV.addEventListener('click', function() {
      exportToCSV();
      showNotification('Equipment data exported to CSV!', 'success');
    });
  }
}

/**
 * Export equipment to CSV
 */
function exportToCSV() {
  const headers = ['ID', 'Name', 'Type', 'Utilization %', 'Hours (Month)', 'Revenue (YTD)', 'Crew', 'Status', 'Next Service'];

  const rows = filteredEquipment.map(e => [
    e.id,
    `"${e.name}"`,
    e.type,
    e.utilization_rate,
    e.hours_this_month,
    e.revenue_generated_ytd,
    e.current_crew || 'Unassigned',
    e.maintenance_status,
    e.next_service_date || 'N/A'
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `equipment-export-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Helper functions
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getTypeBadgeClass(type) {
  const classes = {
    'Drill Rig': 'badge-blue',
    'Excavator': 'badge-orange',
    'Utility Truck': 'badge-green',
    'Vacuum Truck': 'badge-yellow'
  };
  return classes[type] || 'badge-blue';
}

function getMaintenanceBadgeClass(status) {
  const classes = {
    'Operational': 'badge-green',
    'Maintenance Due': 'badge-yellow',
    'In Service': 'badge-red'
  };
  return classes[status] || 'badge-blue';
}

function getUtilizationColor(rate) {
  if (rate >= 80) return 'var(--success)';
  if (rate >= 60) return 'var(--color-accent)';
  return 'var(--warning)';
}

function viewEquipment(id) {
  console.log('[Equipment] View equipment:', id);
  showNotification(`Viewing equipment ${id}`, 'info');
}

function editEquipment(id) {
  console.log('[Equipment] Edit equipment:', id);
  showNotification(`Edit mode for equipment ${id}`, 'info');
}

function viewServiceHistory(id) {
  console.log('[Equipment] View service history:', id);
  showNotification(`Service history for equipment ${id}`, 'info');
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 16px 24px;
    background-color: ${type === 'success' ? '#28A745' : type === 'error' ? '#DC3545' : '#2EA3F2'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(function() {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(function() {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}
