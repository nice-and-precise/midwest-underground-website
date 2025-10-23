/**
 * Customers Management JavaScript
 * Handles customer data display, filtering, and analytics
 */

let allCustomers = [];
let filteredCustomers = [];
let customerTypeChart = null;
let topCustomersChart = null;

document.addEventListener('DOMContentLoaded', async function() {
  console.log('[Customers] Initializing customers page...');

  // Load customers data
  await loadCustomersData();

  // Setup event listeners
  setupFilters();
  setupExportButtons();

  // Initialize charts
  initializeCharts();

  // Initial render
  renderCustomers();

  console.log('[Customers] Customers page initialized');
});

/**
 * Load customers data from API/JSON
 */
async function loadCustomersData() {
  try {
    const response = await fetch('api/data/customers.json');
    const data = await response.json();
    allCustomers = data.customers;
    filteredCustomers = [...allCustomers];

    console.log(`[Customers] Loaded ${allCustomers.length} customers`);
    updateSummaryCards();
  } catch (error) {
    console.error('[Customers] Error loading customers:', error);
    showNotification('Error loading customers data', 'error');
  }
}

/**
 * Update summary cards
 */
function updateSummaryCards() {
  const totalLTV = allCustomers.reduce((sum, c) => sum + c.lifetime_value, 0);
  const avgLTV = totalLTV / allCustomers.length;
  const activeProjects = allCustomers.reduce((sum, c) => sum + c.active_projects, 0);
  const avgSatisfaction = allCustomers.reduce((sum, c) => sum + c.satisfaction_score, 0) / allCustomers.length;

  document.getElementById('total-customers').textContent = allCustomers.length;
  document.getElementById('total-ltv').textContent = '$' + (totalLTV / 1000000).toFixed(1) + 'M';
  document.getElementById('avg-customer-value').textContent = '$' + (avgLTV / 1000000).toFixed(2) + 'M';
  document.getElementById('active-customer-projects').textContent = activeProjects;
  document.getElementById('avg-satisfaction').textContent = avgSatisfaction.toFixed(1);
}

/**
 * Setup filter event listeners
 */
function setupFilters() {
  const typeFilter = document.getElementById('filter-type');
  const creditFilter = document.getElementById('filter-credit');
  const searchFilter = document.getElementById('filter-search');
  const sortBy = document.getElementById('sort-by');
  const clearFilters = document.getElementById('clear-filters');

  // Apply filters on change
  [typeFilter, creditFilter, sortBy].forEach(el => {
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
      document.getElementById('filter-credit').value = '';
      document.getElementById('filter-search').value = '';
      document.getElementById('sort-by').value = 'ltv-desc';
      applyFilters();
    });
  }

  // Refresh button
  const refreshBtn = document.getElementById('refresh-customers-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async function() {
      await loadCustomersData();
      applyFilters();

      // Refresh charts
      if (customerTypeChart) customerTypeChart.destroy();
      if (topCustomersChart) topCustomersChart.destroy();
      initializeCharts();

      showNotification('Customers data refreshed!', 'success');
    });
  }

  // Add New Customer button
  const addBtn = document.getElementById('add-customer-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      openAddCustomerModal();
    });
  }
}

/**
 * Apply all filters
 */
function applyFilters() {
  const type = document.getElementById('filter-type').value;
  const credit = document.getElementById('filter-credit').value;
  const search = document.getElementById('filter-search').value.toLowerCase();
  const sortBy = document.getElementById('sort-by').value;

  // Start with all customers
  filteredCustomers = allCustomers.filter(customer => {
    // Type filter
    if (type && customer.type !== type) return false;

    // Credit rating filter
    if (credit && customer.credit_rating !== credit) return false;

    // Search filter
    if (search) {
      const searchableText = `
        ${customer.id}
        ${customer.name}
        ${customer.contact_name}
        ${customer.type}
      `.toLowerCase();

      if (!searchableText.includes(search)) return false;
    }

    return true;
  });

  // Apply sorting
  filteredCustomers.sort((a, b) => {
    switch (sortBy) {
      case 'ltv-desc':
        return b.lifetime_value - a.lifetime_value;
      case 'ltv-asc':
        return a.lifetime_value - b.lifetime_value;
      case 'projects-desc':
        return b.total_projects - a.total_projects;
      case 'projects-asc':
        return a.total_projects - b.total_projects;
      case 'satisfaction-desc':
        return b.satisfaction_score - a.satisfaction_score;
      case 'satisfaction-asc':
        return a.satisfaction_score - b.satisfaction_score;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Update results count
  document.getElementById('results-count').textContent = filteredCustomers.length;
  document.getElementById('total-count').textContent = allCustomers.length;

  // Render filtered customers
  renderCustomers();
}

/**
 * Render customers table
 */
function renderCustomers() {
  const tbody = document.getElementById('customers-table-body');
  if (!tbody) return;

  if (filteredCustomers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
          No customers found matching your filters
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredCustomers.map(customer => `
    <tr>
      <td><strong>${customer.id}</strong></td>
      <td>
        <div style="max-width: 250px;">
          <strong>${customer.name}</strong>
        </div>
      </td>
      <td><span class="badge ${getBadgeClass(customer.type)}">${customer.type}</span></td>
      <td>
        <div style="font-size: 0.875rem;">
          <div style="font-weight: 500;">${customer.contact_name}</div>
          <div style="color: var(--text-secondary);">${customer.contact_title}</div>
        </div>
      </td>
      <td style="text-align: center;"><strong>${customer.total_projects}</strong></td>
      <td style="text-align: center;">
        ${customer.active_projects > 0
          ? `<span class="badge badge-blue">${customer.active_projects}</span>`
          : '<span style="color: var(--text-secondary);">—</span>'}
      </td>
      <td style="text-align: right;"><strong>$${(customer.lifetime_value / 1000).toFixed(0)}K</strong></td>
      <td style="text-align: center;"><span class="badge ${getCreditBadgeClass(customer.credit_rating)}">${customer.credit_rating}</span></td>
      <td style="text-align: center;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
          <span style="color: #FFB800;">⭐</span>
          <strong>${customer.satisfaction_score.toFixed(1)}</strong>
        </div>
      </td>
      <td>
        <div class="action-btns">
          <button class="btn-icon" title="View Details" onclick="viewCustomer('${customer.id}')">👁️</button>
          <button class="btn-icon" title="Edit" onclick="editCustomer('${customer.id}')">✏️</button>
          <button class="btn-icon" title="Delete" onclick="deleteCustomer('${customer.id}')">🗑️</button>
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
    secondary: isDarkMode ? '#d9822b' : '#F26419',
    success: isDarkMode ? '#81c3a3' : '#28A745',
    text: isDarkMode ? '#e5e5e5' : '#333333',
    grid: isDarkMode ? '#404040' : '#E0E0E0'
  };

  // Customer Type Distribution Chart
  const typeCtx = document.getElementById('customer-type-chart').getContext('2d');

  const typeCounts = {};
  allCustomers.forEach(c => {
    typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
  });

  const typeLabels = Object.keys(typeCounts);
  const typeValues = Object.values(typeCounts);
  const typeColors = [
    isDarkMode ? '#3a7ca5' : '#003B5C',
    isDarkMode ? '#5fb3d6' : '#2EA3F2',
    isDarkMode ? '#d9822b' : '#F26419',
    isDarkMode ? '#81c3a3' : '#28A745'
  ];

  customerTypeChart = new Chart(typeCtx, {
    type: 'doughnut',
    data: {
      labels: typeLabels,
      datasets: [{
        data: typeValues,
        backgroundColor: typeColors,
        borderWidth: 2,
        borderColor: isDarkMode ? '#1a1a1a' : '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: colors.text,
            padding: 15,
            font: { size: 12 }
          }
        }
      }
    }
  });

  // Top Customers Chart
  const topCtx = document.getElementById('top-customers-chart').getContext('2d');

  const topCustomers = [...allCustomers]
    .sort((a, b) => b.lifetime_value - a.lifetime_value)
    .slice(0, 5);

  const topLabels = topCustomers.map(c => c.name.length > 20 ? c.name.substring(0, 20) + '...' : c.name);
  const topValues = topCustomers.map(c => c.lifetime_value / 1000);

  topCustomersChart = new Chart(topCtx, {
    type: 'bar',
    data: {
      labels: topLabels,
      datasets: [{
        label: 'Lifetime Value ($K)',
        data: topValues,
        backgroundColor: colors.primary,
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
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
      showNotification('Customers exported to CSV!', 'success');
    });
  }
}

/**
 * Export customers to CSV
 */
function exportToCSV() {
  const headers = ['ID', 'Name', 'Type', 'Contact Name', 'Email', 'Phone', 'Total Projects', 'Active Projects', 'Total Revenue', 'Lifetime Value', 'Credit Rating', 'Satisfaction'];

  const rows = filteredCustomers.map(c => [
    c.id,
    `"${c.name}"`,
    c.type,
    `"${c.contact_name}"`,
    c.email,
    c.phone,
    c.total_projects,
    c.active_projects,
    c.total_revenue,
    c.lifetime_value,
    c.credit_rating,
    c.satisfaction_score
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `customers-export-${new Date().toISOString().split('T')[0]}.csv`;
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
    'Residential': 'badge-yellow'
  };
  return classes[type] || 'badge-blue';
}

function getCreditBadgeClass(rating) {
  if (rating === 'A+') return 'badge-green';
  if (rating === 'A' || rating === 'A-') return 'badge-blue';
  if (rating === 'B+' || rating === 'B') return 'badge-yellow';
  return 'badge-orange';
}

function viewCustomer(id) {
  console.log('[Customers] View customer:', id);
  const customer = allCustomers.find(c => c.id === id);
  if (!customer) return;

  // Show view modal with customer details
  const content = `
    <div class="customer-details">
      <div class="detail-grid">
        <div class="detail-item">
          <label>Customer ID:</label>
          <span>${customer.id}</span>
        </div>
        <div class="detail-item">
          <label>Name:</label>
          <span>${customer.name}</span>
        </div>
        <div class="detail-item">
          <label>Type:</label>
          <span class="badge ${getTypeBadgeClass(customer.type)}">${customer.type}</span>
        </div>
        <div class="detail-item">
          <label>Status:</label>
          <span class="badge ${customer.status === 'Active' ? 'badge-green' : 'badge-red'}">${customer.status}</span>
        </div>
        <div class="detail-item">
          <label>Contact Person:</label>
          <span>${customer.contact_person}</span>
        </div>
        <div class="detail-item">
          <label>Phone:</label>
          <span>${customer.phone}</span>
        </div>
        <div class="detail-item">
          <label>Email:</label>
          <span>${customer.email}</span>
        </div>
        <div class="detail-item">
          <label>Address:</label>
          <span>${customer.address || 'N/A'}</span>
        </div>
        <div class="detail-item">
          <label>Total Projects:</label>
          <span>${customer.projects_count}</span>
        </div>
        <div class="detail-item">
          <label>Active Projects:</label>
          <span>${customer.active_projects}</span>
        </div>
        <div class="detail-item">
          <label>Lifetime Value:</label>
          <span>$${customer.lifetime_value.toLocaleString()}</span>
        </div>
        <div class="detail-item">
          <label>Credit Standing:</label>
          <span class="badge ${getCreditBadgeClass(customer.credit_standing)}">${customer.credit_standing}</span>
        </div>
        <div class="detail-item">
          <label>Satisfaction Score:</label>
          <span>${customer.satisfaction_score}/5.0</span>
        </div>
        <div class="detail-item">
          <label>Last Project:</label>
          <span>${customer.last_project_date ? formatDate(customer.last_project_date) : 'N/A'}</span>
        </div>
      </div>
    </div>
  `;

  showModal(`Customer Details: ${customer.name}`, content, {
    buttons: [
      {
        id: 'modal-close-btn-bottom',
        text: 'Close',
        className: 'btn-secondary',
        onClick: function() {
          hideModal();
        }
      }
    ],
    width: '700px'
  });
}

function editCustomer(id) {
  console.log('[Customers] Edit customer:', id);
  const customer = allCustomers.find(c => c.id === id);
  if (!customer) return;

  openEditCustomerModal(customer);
}

/**
 * Open edit customer modal
 */
function openEditCustomerModal(customer) {
  const formData = {
    fields: [
      { name: 'id', label: 'Customer ID', type: 'text', value: customer.id, required: true, readonly: true },
      { name: 'name', label: 'Customer Name', type: 'text', value: customer.name, required: true },
      {
        name: 'type',
        label: 'Customer Type',
        type: 'select',
        value: customer.type,
        required: true,
        options: [
          { value: 'Municipal', label: 'Municipal' },
          { value: 'Commercial', label: 'Commercial' },
          { value: 'Telecommunications', label: 'Telecommunications' },
          { value: 'Residential', label: 'Residential' }
        ]
      },
      { name: 'contact_person', label: 'Contact Person', type: 'text', value: customer.contact_person, required: true },
      { name: 'phone', label: 'Phone', type: 'text', value: customer.phone, required: true },
      { name: 'email', label: 'Email', type: 'email', value: customer.email, required: true },
      { name: 'address', label: 'Address', type: 'textarea', value: customer.address || '', rows: 2 },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        value: customer.status,
        required: true,
        options: [
          { value: 'Active', label: 'Active' },
          { value: 'Inactive', label: 'Inactive' }
        ]
      }
    ]
  };

  showEditModal(`Edit Customer: ${customer.name}`, formData, async function(data) {
    await updateCustomer(data);
  });
}

/**
 * Open add new customer modal
 */
function openAddCustomerModal() {
  const formData = {
    fields: [
      { name: 'name', label: 'Customer Name', type: 'text', value: '', required: true, placeholder: 'Enter customer name' },
      {
        name: 'type',
        label: 'Customer Type',
        type: 'select',
        value: '',
        required: true,
        placeholder: 'Select customer type',
        options: [
          { value: 'Municipal', label: 'Municipal' },
          { value: 'Commercial', label: 'Commercial' },
          { value: 'Telecommunications', label: 'Telecommunications' },
          { value: 'Residential', label: 'Residential' }
        ]
      },
      { name: 'contact_person', label: 'Contact Person', type: 'text', value: '', required: true, placeholder: 'Enter contact name' },
      { name: 'phone', label: 'Phone', type: 'text', value: '', required: true, placeholder: '(555) 123-4567' },
      { name: 'email', label: 'Email', type: 'email', value: '', required: true, placeholder: 'email@example.com' },
      { name: 'address', label: 'Address', type: 'textarea', value: '', rows: 2, placeholder: 'Street address, City, State ZIP' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        value: 'Active',
        required: true,
        options: [
          { value: 'Active', label: 'Active' },
          { value: 'Inactive', label: 'Inactive' }
        ]
      }
    ]
  };

  showEditModal('Add New Customer', formData, async function(data) {
    await createCustomer(data);
  });
}

/**
 * Delete customer with confirmation
 */
function deleteCustomer(id) {
  const customer = allCustomers.find(c => c.id === id);
  if (!customer) return;

  showDeleteModal('customer', customer.name, async function() {
    await performDeleteCustomer(id);
  });
}

/**
 * Update customer via API
 */
async function updateCustomer(data) {
  try {
    const response = await fetch('api/customers/update.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update customer');
    }

    showNotification('Customer updated successfully!', 'success');
    await loadCustomersData();
    applyFilters();

    // Refresh charts
    if (customerTypeChart) customerTypeChart.destroy();
    if (topCustomersChart) topCustomersChart.destroy();
    initializeCharts();
  } catch (error) {
    console.error('[Customers] Update error:', error);
    throw error;
  }
}

/**
 * Create new customer via API
 */
async function createCustomer(data) {
  try {
    const response = await fetch('api/customers/create.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to create customer');
    }

    showNotification('Customer created successfully!', 'success');
    await loadCustomersData();
    applyFilters();

    // Refresh charts
    if (customerTypeChart) customerTypeChart.destroy();
    if (topCustomersChart) topCustomersChart.destroy();
    initializeCharts();
  } catch (error) {
    console.error('[Customers] Create error:', error);
    throw error;
  }
}

/**
 * Delete customer via API
 */
async function performDeleteCustomer(id) {
  try {
    const response = await fetch('api/customers/delete.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: id })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to delete customer');
    }

    showNotification('Customer deleted successfully!', 'success');
    await loadCustomersData();
    applyFilters();

    // Refresh charts
    if (customerTypeChart) customerTypeChart.destroy();
    if (topCustomersChart) topCustomersChart.destroy();
    initializeCharts();
  } catch (error) {
    console.error('[Customers] Delete error:', error);
    throw error;
  }
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
