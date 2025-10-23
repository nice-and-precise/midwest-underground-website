/**
 * Projects Management JavaScript
 * Handles filtering, sorting, and data display for projects page
 */

let allProjects = [];
let filteredProjects = [];

document.addEventListener('DOMContentLoaded', async function() {
  console.log('[Projects] Initializing projects page...');

  // Load projects data
  await loadProjectsData();

  // Setup event listeners
  setupFilters();
  setupExportButtons();

  // Initial render
  renderProjects();

  console.log('[Projects] Projects page initialized');
});

/**
 * Load projects data from API/JSON
 */
async function loadProjectsData() {
  try {
    const response = await fetch('api/data/projects.json');
    const data = await response.json();
    allProjects = data.projects;
    filteredProjects = [...allProjects];

    console.log(`[Projects] Loaded ${allProjects.length} projects`);
    updateSummaryCards();
  } catch (error) {
    console.error('[Projects] Error loading projects:', error);
    showNotification('Error loading projects data', 'error');
  }
}

/**
 * Setup filter event listeners
 */
function setupFilters() {
  const statusFilter = document.getElementById('filter-status');
  const serviceFilter = document.getElementById('filter-service');
  const customerTypeFilter = document.getElementById('filter-customer-type');
  const searchFilter = document.getElementById('filter-search');
  const sortBy = document.getElementById('sort-by');
  const clearFilters = document.getElementById('clear-filters');

  // Apply filters on change
  [statusFilter, serviceFilter, customerTypeFilter, sortBy].forEach(el => {
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
      document.getElementById('filter-status').value = '';
      document.getElementById('filter-service').value = '';
      document.getElementById('filter-customer-type').value = '';
      document.getElementById('filter-search').value = '';
      document.getElementById('sort-by').value = 'date-desc';
      applyFilters();
    });
  }

  // Refresh button
  const refreshBtn = document.getElementById('refresh-projects-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async function() {
      await loadProjectsData();
      applyFilters();
      showNotification('Projects data refreshed!', 'success');
    });
  }
}

/**
 * Apply all filters
 */
function applyFilters() {
  const status = document.getElementById('filter-status').value;
  const service = document.getElementById('filter-service').value;
  const customerType = document.getElementById('filter-customer-type').value;
  const search = document.getElementById('filter-search').value.toLowerCase();
  const sortBy = document.getElementById('sort-by').value;

  // Start with all projects
  filteredProjects = allProjects.filter(project => {
    // Status filter
    if (status && project.status !== status) return false;

    // Service filter
    if (service && project.service !== service) return false;

    // Customer type filter
    if (customerType && project.type !== customerType) return false;

    // Search filter
    if (search) {
      const searchableText = `
        ${project.id}
        ${project.name}
        ${project.customer_name}
        ${project.service}
        ${project.location}
      `.toLowerCase();

      if (!searchableText.includes(search)) return false;
    }

    return true;
  });

  // Apply sorting
  filteredProjects.sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.start_date) - new Date(a.start_date);
      case 'date-asc':
        return new Date(a.start_date) - new Date(b.start_date);
      case 'budget-desc':
        return b.budget - a.budget;
      case 'budget-asc':
        return a.budget - b.budget;
      case 'completion-desc':
        return b.completion_percentage - a.completion_percentage;
      case 'completion-asc':
        return a.completion_percentage - b.completion_percentage;
      default:
        return 0;
    }
  });

  // Update results count
  document.getElementById('results-count').textContent = filteredProjects.length;
  document.getElementById('total-count').textContent = allProjects.length;

  // Render filtered projects
  renderProjects();
}

/**
 * Render projects table
 */
function renderProjects() {
  const tbody = document.getElementById('projects-table-body');
  if (!tbody) return;

  if (filteredProjects.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
          No projects found matching your filters
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredProjects.map(project => `
    <tr>
      <td><strong>${project.id}</strong></td>
      <td>
        <div style="max-width: 300px;">
          <strong>${project.name}</strong>
        </div>
      </td>
      <td>${project.customer_name}</td>
      <td><span class="badge ${getBadgeClass(project.type)}">${project.type}</span></td>
      <td>${project.service}</td>
      <td><span class="badge ${getStatusBadgeClass(project.status)}">${project.status}</span></td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="progress-bar" style="width: 80px;">
            <div class="progress-fill" style="width: ${project.completion_percentage}%"></div>
          </div>
          <span style="font-size: 0.875rem; color: var(--text-secondary);">${project.completion_percentage}%</span>
        </div>
      </td>
      <td><strong>$${project.budget.toLocaleString()}</strong></td>
      <td>${formatDate(project.start_date)}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon" title="View Details" onclick="viewProject('${project.id}')">👁️</button>
          <button class="btn-icon" title="Edit" onclick="editProject('${project.id}')">✏️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * Update summary cards
 */
function updateSummaryCards() {
  const inProgress = allProjects.filter(p => p.status === 'In Progress').length;
  const completed = allProjects.filter(p => p.status === 'Completed').length;
  const planning = allProjects.filter(p => p.status === 'Planning').length;
  const totalValue = allProjects.reduce((sum, p) => sum + p.projected_revenue, 0);

  document.getElementById('total-projects').textContent = allProjects.length;
  document.getElementById('in-progress-projects').textContent = inProgress;
  document.getElementById('completed-projects').textContent = completed;
  document.getElementById('planning-projects').textContent = planning;
  document.getElementById('total-value').textContent = '$' + (totalValue / 1000000).toFixed(2) + 'M';
}

/**
 * Setup export buttons
 */
function setupExportButtons() {
  const exportCSV = document.getElementById('export-csv-btn');
  const exportPDF = document.getElementById('export-pdf-btn');

  if (exportCSV) {
    exportCSV.addEventListener('click', function() {
      exportToCSV();
      showNotification('Projects exported to CSV!', 'success');
    });
  }

  if (exportPDF) {
    exportPDF.addEventListener('click', function() {
      window.print();
      showNotification('Print dialog opened', 'info');
    });
  }
}

/**
 * Export projects to CSV
 */
function exportToCSV() {
  const headers = ['ID', 'Name', 'Customer', 'Type', 'Service', 'Status', 'Progress %', 'Budget', 'Start Date', 'Est. Completion'];

  const rows = filteredProjects.map(p => [
    p.id,
    `"${p.name}"`,
    `"${p.customer_name}"`,
    p.type,
    p.service,
    p.status,
    p.completion_percentage,
    p.budget,
    p.start_date,
    p.estimated_completion
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `projects-export-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Helper functions
 */
function getBadgeClass(type) {
  const classes = {
    'Municipal': 'badge-green',
    'Commercial': 'badge-orange',
    'Telecommunications': 'badge-blue',
    'Residential': 'badge-yellow',
    'Emergency': 'badge-red'
  };
  return classes[type] || 'badge-blue';
}

function getStatusBadgeClass(status) {
  const classes = {
    'In Progress': 'badge-blue',
    'Completed': 'badge-green',
    'Planning': 'badge-yellow'
  };
  return classes[status] || 'badge-blue';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function viewProject(id) {
  console.log('[Projects] View project:', id);
  showNotification(`Viewing project ${id}`, 'info');
  // In production, this would open a modal or navigate to detail page
}

function editProject(id) {
  console.log('[Projects] Edit project:', id);
  showNotification(`Edit mode for project ${id}`, 'info');
  // In production, this would open edit modal
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
