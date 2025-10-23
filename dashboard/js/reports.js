/**
 * Reports JavaScript
 * Handles report generation, PDF export, and report history
 */

let reportHistory = [];

document.addEventListener('DOMContentLoaded', function() {
  console.log('[Reports] Initializing reports page...');

  // Load report history from localStorage
  loadReportHistory();

  // Setup event listeners
  setupReportBuilder();
  setupQuickPeriods();

  // Set default dates (last 30 days)
  setDefaultDates();

  console.log('[Reports] Reports page initialized');
});

/**
 * Set default date range
 */
function setDefaultDates() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  document.getElementById('report-start-date').valueAsDate = startDate;
  document.getElementById('report-end-date').valueAsDate = endDate;
}

/**
 * Setup quick period selector
 */
function setupQuickPeriods() {
  const periodSelect = document.getElementById('report-period');

  if (periodSelect) {
    periodSelect.addEventListener('change', function() {
      const period = this.value;
      const today = new Date();
      let startDate, endDate;

      switch (period) {
        case 'today':
          startDate = new Date(today);
          endDate = new Date(today);
          break;
        case 'yesterday':
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 1);
          endDate = new Date(startDate);
          break;
        case 'last-7':
          endDate = new Date(today);
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'last-30':
          endDate = new Date(today);
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 30);
          break;
        case 'this-month':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          endDate = new Date(today);
          break;
        case 'last-month':
          startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          endDate = new Date(today.getFullYear(), today.getMonth(), 0);
          break;
        case 'this-quarter':
          const quarter = Math.floor(today.getMonth() / 3);
          startDate = new Date(today.getFullYear(), quarter * 3, 1);
          endDate = new Date(today);
          break;
        case 'this-year':
          startDate = new Date(today.getFullYear(), 0, 1);
          endDate = new Date(today);
          break;
        case 'last-year':
          startDate = new Date(today.getFullYear() - 1, 0, 1);
          endDate = new Date(today.getFullYear() - 1, 11, 31);
          break;
        default:
          return; // Custom - don't change dates
      }

      if (startDate && endDate) {
        document.getElementById('report-start-date').valueAsDate = startDate;
        document.getElementById('report-end-date').valueAsDate = endDate;
      }
    });
  }
}

/**
 * Setup report builder
 */
function setupReportBuilder() {
  const previewBtn = document.getElementById('preview-report-btn');
  const generateBtn = document.getElementById('generate-report-btn');
  const clearHistoryBtn = document.getElementById('clear-history-btn');

  if (previewBtn) {
    previewBtn.addEventListener('click', function() {
      const reportData = getReportData();
      previewReport(reportData);
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', function() {
      const reportData = getReportData();
      generatePDFReport(reportData);
    });
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to clear all report history?')) {
        reportHistory = [];
        localStorage.setItem('report-history', JSON.stringify(reportHistory));
        renderReportHistory();
        showNotification('Report history cleared', 'success');
      }
    });
  }
}

/**
 * Get report configuration data
 */
function getReportData() {
  const startDate = document.getElementById('report-start-date').value;
  const endDate = document.getElementById('report-end-date').value;
  const reportType = document.querySelector('input[name="report-type"]:checked').value;

  if (!startDate || !endDate) {
    showNotification('Please select start and end dates', 'error');
    return null;
  }

  return {
    startDate,
    endDate,
    reportType,
    generatedAt: new Date().toISOString(),
    generatedBy: 'John Anderson'
  };
}

/**
 * Preview report in new window
 */
function previewReport(reportData) {
  if (!reportData) return;

  // In a real application, this would open a modal or new window with report preview
  showNotification(`Previewing ${getReportTypeName(reportData.reportType)} report...`, 'info');

  // Simulate preview delay
  setTimeout(() => {
    console.log('[Reports] Report preview data:', reportData);
    alert(`Report Preview:\n\nType: ${getReportTypeName(reportData.reportType)}\nDate Range: ${formatDate(reportData.startDate)} to ${formatDate(reportData.endDate)}\n\nThis would open a preview window in production.`);
  }, 500);
}

/**
 * Generate PDF report
 */
function generatePDFReport(reportData) {
  if (!reportData) return;

  showNotification('Generating PDF report...', 'info');

  // Simulate PDF generation
  setTimeout(() => {
    // Add to history
    const historyEntry = {
      id: Date.now(),
      name: `${getReportTypeName(reportData.reportType)} Report`,
      type: reportData.reportType,
      startDate: reportData.startDate,
      endDate: reportData.endDate,
      generatedAt: reportData.generatedAt,
      generatedBy: reportData.generatedBy
    };

    reportHistory.unshift(historyEntry);
    if (reportHistory.length > 20) reportHistory = reportHistory.slice(0, 20);

    // Save to localStorage
    localStorage.setItem('report-history', JSON.stringify(reportHistory));

    // Render updated history
    renderReportHistory();

    // In production, this would trigger actual PDF download
    console.log('[Reports] Generated PDF report:', historyEntry);
    showNotification(`PDF report generated successfully!`, 'success');

    // Simulate download
    window.print();
  }, 1000);
}

/**
 * Generate quick report
 */
function generateQuickReport(reportType) {
  showNotification(`Generating ${reportType} report...`, 'info');

  setTimeout(() => {
    const today = new Date();
    let startDate, endDate, typeName;

    switch (reportType) {
      case 'monthly-pl':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        typeName = 'Monthly P&L';
        break;
      case 'ytd-financial':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today);
        typeName = 'YTD Financial';
        break;
      case 'active-projects':
        startDate = new Date(today);
        endDate = new Date(today);
        typeName = 'Active Projects';
        break;
      case 'customer-directory':
        startDate = new Date(today);
        endDate = new Date(today);
        typeName = 'Customer Directory';
        break;
      case 'equipment-inventory':
        startDate = new Date(today);
        endDate = new Date(today);
        typeName = 'Equipment Inventory';
        break;
      case 'ar-aging':
        startDate = new Date(today);
        endDate = new Date(today);
        typeName = 'A/R Aging';
        break;
      default:
        return;
    }

    // Add to history
    const historyEntry = {
      id: Date.now(),
      name: typeName,
      type: reportType,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      generatedAt: new Date().toISOString(),
      generatedBy: 'John Anderson'
    };

    reportHistory.unshift(historyEntry);
    if (reportHistory.length > 20) reportHistory = reportHistory.slice(0, 20);

    localStorage.setItem('report-history', JSON.stringify(reportHistory));
    renderReportHistory();

    showNotification(`${typeName} generated successfully!`, 'success');
    window.print();
  }, 800);
}

/**
 * Load report history from localStorage
 */
function loadReportHistory() {
  const stored = localStorage.getItem('report-history');
  if (stored) {
    try {
      reportHistory = JSON.parse(stored);
      renderReportHistory();
    } catch (e) {
      console.error('[Reports] Error loading history:', e);
      reportHistory = [];
    }
  }
}

/**
 * Render report history table
 */
function renderReportHistory() {
  const tbody = document.getElementById('report-history-body');
  if (!tbody) return;

  if (reportHistory.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
          No reports generated yet. Generate your first report above!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = reportHistory.map(report => `
    <tr>
      <td><strong>${report.name}</strong></td>
      <td><span class="badge badge-blue">${getReportTypeName(report.type)}</span></td>
      <td>${formatDate(report.startDate)} - ${formatDate(report.endDate)}</td>
      <td>${formatDateTime(report.generatedAt)}</td>
      <td>${report.generatedBy}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon" title="Download" onclick="downloadReport('${report.id}')">📥</button>
          <button class="btn-icon" title="Delete" onclick="deleteReport('${report.id}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * Download report from history
 */
function downloadReport(id) {
  const report = reportHistory.find(r => r.id == id);
  if (report) {
    showNotification(`Downloading ${report.name}...`, 'info');
    setTimeout(() => {
      window.print();
    }, 500);
  }
}

/**
 * Delete report from history
 */
function deleteReport(id) {
  if (confirm('Delete this report from history?')) {
    reportHistory = reportHistory.filter(r => r.id != id);
    localStorage.setItem('report-history', JSON.stringify(reportHistory));
    renderReportHistory();
    showNotification('Report deleted from history', 'success');
  }
}

/**
 * Helper functions
 */
function getReportTypeName(type) {
  const names = {
    'financial': 'Financial',
    'projects': 'Projects',
    'customers': 'Customers',
    'equipment': 'Equipment',
    'monthly-pl': 'Monthly P&L',
    'ytd-financial': 'YTD Financial',
    'active-projects': 'Active Projects',
    'customer-directory': 'Customer Directory',
    'equipment-inventory': 'Equipment Inventory',
    'ar-aging': 'A/R Aging'
  };
  return names[type] || type;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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
