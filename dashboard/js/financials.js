/**
 * Financials Management JavaScript
 * Handles financial data display, charts, and A/R aging
 */

let financialData = null;
let revenueChart = null;
let expenseChart = null;

document.addEventListener('DOMContentLoaded', async function() {
  console.log('[Financials] Initializing financials page...');

  // Load financial data
  await loadFinancialData();

  // Setup event listeners
  setupFilters();
  setupExportButtons();

  // Initialize charts
  initializeCharts();

  // Render A/R table
  renderARTable();

  console.log('[Financials] Financials page initialized');
});

/**
 * Load financial data from API/JSON
 */
async function loadFinancialData() {
  try {
    const response = await fetch('api/data/financials.json');
    financialData = await response.json();

    console.log('[Financials] Loaded financial data');
    updateKPIs();
    updateExpenseBreakdown();
    updateCashFlow();
  } catch (error) {
    console.error('[Financials] Error loading financial data:', error);
    showNotification('Error loading financial data', 'error');
  }
}

/**
 * Update KPI cards
 */
function updateKPIs() {
  const ytd = financialData.year_to_date;
  const yoy = financialData.year_over_year;
  const cashFlow = financialData.cash_flow;

  document.getElementById('revenue-ytd').textContent = '$' + (ytd.revenue / 1000000).toFixed(2) + 'M';
  document.getElementById('profit-ytd').textContent = '$' + (ytd.profit / 1000000).toFixed(2) + 'M';
  document.getElementById('profit-margin').textContent = ytd.profit_margin.toFixed(1) + '%';
  document.getElementById('cash-on-hand').textContent = '$' + (cashFlow.cash_on_hand / 1000).toFixed(0) + 'K';
  document.getElementById('ar-outstanding').textContent = '$' + (cashFlow.accounts_receivable_total / 1000).toFixed(0) + 'K';

  document.getElementById('revenue-growth').textContent = yoy.revenue_growth.toFixed(1) + '%';
  document.getElementById('profit-growth').textContent = yoy.profit_growth.toFixed(1) + '%';
}

/**
 * Update expense breakdown table
 */
function updateExpenseBreakdown() {
  const tbody = document.getElementById('expense-breakdown-body');
  const expenses = financialData.expense_categories;

  tbody.innerHTML = Object.values(expenses).map(category => `
    <tr>
      <td>${category.name}</td>
      <td style="text-align: right;"><strong>$${category.monthly_avg.toLocaleString()}</strong></td>
      <td style="text-align: right;">${category.percentage}%</td>
    </tr>
  `).join('');
}

/**
 * Update cash flow section
 */
function updateCashFlow() {
  const cf = financialData.cash_flow;

  document.getElementById('cf-cash').textContent = '$' + cf.cash_on_hand.toLocaleString();
  document.getElementById('cf-ar').textContent = '$' + cf.accounts_receivable_total.toLocaleString();
  document.getElementById('cf-ap').textContent = '-$' + cf.accounts_payable_total.toLocaleString();
  document.getElementById('cf-net').textContent = '$' + cf.net_position.toLocaleString();
  document.getElementById('runway-months').textContent = cf.runway_months.toFixed(1) + ' months';
}

/**
 * Initialize Chart.js charts
 */
function initializeCharts() {
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

  const colors = {
    primary: isDarkMode ? '#F2EDE5' : '#23272A',
    accent: '#FFC400',
    secondary: '#FF5A1F',
    success: '#28A745',
    text: isDarkMode ? '#F2EDE5' : '#23272A',
    grid: isDarkMode ? '#4F5B66' : '#D1CCC3',
    background: isDarkMode ? 'rgba(242, 237, 229, 0.1)' : 'rgba(35, 39, 42, 0.1)'
  };

  // Revenue & Profit Chart
  const revenueCtx = document.getElementById('revenue-profit-chart').getContext('2d');

  const last12Months = financialData.monthly_revenue.slice(-12);
  const monthLabels = last12Months.map(m => {
    const date = new Date(m.month + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  });
  const revenueData = last12Months.map(m => m.revenue);
  const profitData = last12Months.map(m => m.profit);

  revenueChart = new Chart(revenueCtx, {
    type: 'line',
    data: {
      labels: monthLabels,
      datasets: [
        {
          label: 'Revenue',
          data: revenueData,
          borderColor: colors.primary,
          backgroundColor: colors.background,
          borderWidth: 3,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Profit',
          data: profitData,
          borderColor: colors.accent,
          backgroundColor: 'transparent',
          borderWidth: 3,
          fill: false,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.5,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': $' + (context.parsed.y / 1000).toFixed(0) + 'K';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: colors.text,
            callback: function(value) {
              return '$' + (value / 1000).toFixed(0) + 'K';
            }
          },
          grid: {
            color: colors.grid
          }
        },
        x: {
          ticks: {
            color: colors.text
          },
          grid: {
            color: colors.grid
          }
        }
      }
    }
  });

  // Expense Breakdown Chart
  const expenseCtx = document.getElementById('expense-chart').getContext('2d');
  const expenses = financialData.expense_categories;

  const expenseLabels = Object.values(expenses).map(e => e.name);
  const expenseValues = Object.values(expenses).map(e => e.percentage);
  const expenseColors = [
    colors.primary,
    colors.accent,
    colors.secondary,
    colors.success,
    '#DC3545'
  ];

  expenseChart = new Chart(expenseCtx, {
    type: 'doughnut',
    data: {
      labels: expenseLabels,
      datasets: [{
        data: expenseValues,
        backgroundColor: expenseColors,
        borderWidth: 2,
        borderColor: isDarkMode ? '#1E2226' : '#FFFFFF'
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
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + '%';
            }
          }
        }
      }
    }
  });
}

/**
 * Render A/R Aging table
 */
function renderARTable() {
  const tbody = document.getElementById('ar-table-body');
  const arData = financialData.accounts_receivable;

  if (!arData || arData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
          No outstanding invoices
        </td>
      </tr>
    `;
    return;
  }

  // Sort by days outstanding (oldest first)
  const sortedAR = [...arData].sort((a, b) => b.days_outstanding - a.days_outstanding);

  tbody.innerHTML = sortedAR.map(invoice => `
    <tr>
      <td><strong>${invoice.invoice_id}</strong></td>
      <td>${invoice.customer}</td>
      <td style="text-align: right;"><strong>$${invoice.amount.toLocaleString()}</strong></td>
      <td>${formatDate(invoice.invoice_date)}</td>
      <td>${formatDate(invoice.due_date)}</td>
      <td style="text-align: center;">${invoice.days_outstanding}</td>
      <td><span class="badge ${getStatusBadgeClass(invoice.status)}">${invoice.status}</span></td>
      <td><span class="badge ${getAgingBadgeClass(invoice.aging_category)}">${invoice.aging_category}</span></td>
    </tr>
  `).join('');

  document.getElementById('ar-count').textContent = arData.length;
}

/**
 * Setup filter event listeners
 */
function setupFilters() {
  const periodFilter = document.getElementById('filter-period');
  const startDateFilter = document.getElementById('filter-start-date');
  const endDateFilter = document.getElementById('filter-end-date');
  const applyFilterBtn = document.getElementById('apply-date-filter');

  // Period filter auto-sets date ranges
  if (periodFilter) {
    periodFilter.addEventListener('change', function() {
      const today = new Date();
      let startDate, endDate;

      switch (this.value) {
        case 'last-12':
          startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);
          endDate = today;
          break;
        case 'ytd':
          startDate = new Date(today.getFullYear(), 0, 1);
          endDate = today;
          break;
        case 'last-24':
          startDate = new Date(today.getFullYear(), today.getMonth() - 23, 1);
          endDate = today;
          break;
        case 'current-year':
          startDate = new Date(today.getFullYear(), 0, 1);
          endDate = new Date(today.getFullYear(), 11, 31);
          break;
        case 'last-year':
          startDate = new Date(today.getFullYear() - 1, 0, 1);
          endDate = new Date(today.getFullYear() - 1, 11, 31);
          break;
      }

      if (startDate && endDate) {
        startDateFilter.value = startDate.toISOString().split('T')[0];
        endDateFilter.value = endDate.toISOString().split('T')[0];
      }
    });
  }

  // Apply custom date filter
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', function() {
      const startDate = startDateFilter.value;
      const endDate = endDateFilter.value;

      if (!startDate || !endDate) {
        showNotification('Please select both start and end dates', 'error');
        return;
      }

      applyDateFilter(startDate, endDate);
      showNotification('Date filter applied', 'success');
    });
  }

  // Refresh button
  const refreshBtn = document.getElementById('refresh-financials-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async function() {
      await loadFinancialData();

      // Destroy and recreate charts
      if (revenueChart) revenueChart.destroy();
      if (expenseChart) expenseChart.destroy();
      initializeCharts();

      renderARTable();
      showNotification('Financial data refreshed!', 'success');
    });
  }
}

/**
 * Apply date filter to charts and data
 */
function applyDateFilter(startDate, endDate) {
  console.log('[Financials] Applying date filter:', startDate, 'to', endDate);

  const filteredData = financialData.monthly_revenue.filter(m => {
    const monthDate = new Date(m.month + '-01');
    const start = new Date(startDate);
    const end = new Date(endDate);
    return monthDate >= start && monthDate <= end;
  });

  // Update charts with filtered data
  const monthLabels = filteredData.map(m => {
    const date = new Date(m.month + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  });
  const revenueData = filteredData.map(m => m.revenue);
  const profitData = filteredData.map(m => m.profit);

  revenueChart.data.labels = monthLabels;
  revenueChart.data.datasets[0].data = revenueData;
  revenueChart.data.datasets[1].data = profitData;
  revenueChart.update();
}

/**
 * Setup export buttons
 */
function setupExportButtons() {
  const exportCSV = document.getElementById('export-csv-btn');
  const exportPDF = document.getElementById('export-pdf-btn');

  if (exportCSV) {
    exportCSV.addEventListener('click', function() {
      exportFinancialsToCSV();
      showNotification('Financials exported to CSV!', 'success');
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
 * Export financials to CSV
 */
function exportFinancialsToCSV() {
  // Monthly Revenue/Profit
  const headers = ['Month', 'Revenue', 'Expenses', 'Profit', 'Margin %', 'Projects'];
  const rows = financialData.monthly_revenue.map(m => [
    m.month,
    m.revenue,
    m.expenses,
    m.profit,
    m.profit_margin,
    m.projects_completed
  ]);

  const csv = [
    '=== Monthly Revenue & Profit ===',
    headers.join(','),
    ...rows.map(row => row.join(',')),
    '',
    '=== Accounts Receivable ===',
    'Invoice ID,Customer,Amount,Invoice Date,Due Date,Days Outstanding,Status,Aging',
    ...financialData.accounts_receivable.map(ar => [
      ar.invoice_id,
      `"${ar.customer}"`,
      ar.amount,
      ar.invoice_date,
      ar.due_date,
      ar.days_outstanding,
      ar.status,
      ar.aging_category
    ].join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `financials-export-${new Date().toISOString().split('T')[0]}.csv`;
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

function getStatusBadgeClass(status) {
  return status === 'Outstanding' ? 'badge-blue' : 'badge-red';
}

function getAgingBadgeClass(aging) {
  const classes = {
    'Current': 'badge-green',
    '1-30 Days': 'badge-blue',
    '31-60 Days': 'badge-yellow',
    '61-90 Days': 'badge-orange',
    '90+ Days': 'badge-red'
  };
  return classes[aging] || 'badge-blue';
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
    background-color: ${type === 'success' ? '#28A745' : type === 'error' ? '#DC3545' : '#4F5B66'};
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
