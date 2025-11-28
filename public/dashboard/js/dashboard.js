/**
 * Dashboard JavaScript
 * Handles dashboard interactivity, API calls, and data loading
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('[Dashboard] Initializing dashboard...');

  // Sidebar toggle for mobile
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('dashboard-sidebar');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
          sidebar.classList.remove('active');
        }
      }
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to logout?')) {
        // In production, this would call the logout API
        console.log('[Dashboard] Logging out...');
        window.location.href = 'login.html';
      }
    });
  }

  // Load dashboard data
  loadDashboardData();

  // Refresh data button
  const refreshButtons = document.querySelectorAll('.btn-primary');
  refreshButtons.forEach(btn => {
    if (btn.textContent.includes('Refresh')) {
      btn.addEventListener('click', function() {
        console.log('[Dashboard] Refreshing data...');
        loadDashboardData();
        showNotification('Data refreshed successfully!', 'success');
      });
    }
  });

  console.log('[Dashboard] Dashboard initialized successfully');
});

/**
 * Load dashboard data from API
 */
function loadDashboardData() {
  console.log('[Dashboard] Loading dashboard data...');

  // In production, this would be an actual API call
  // For demo purposes, we'll use the static data

  // Simulate API call
  setTimeout(function() {
    updateKPIs({
      revenue_ytd: 4250000,
      active_projects: 7,
      profit_margin: 30.0,
      cash_on_hand: 385000,
      total_customers: 13,
      equipment_utilization: 83.1
    });

    console.log('[Dashboard] Data loaded successfully');
  }, 500);
}

/**
 * Update KPI cards with data
 */
function updateKPIs(data) {
  // Revenue YTD
  const revenueKPI = document.getElementById('kpi-revenue');
  if (revenueKPI) {
    revenueKPI.textContent = formatCurrency(data.revenue_ytd);
    animateValue(revenueKPI, 0, data.revenue_ytd, 1000, formatCurrency);
  }

  // Active Projects
  const projectsKPI = document.getElementById('kpi-projects');
  if (projectsKPI) {
    projectsKPI.textContent = data.active_projects;
    animateValue(projectsKPI, 0, data.active_projects, 1000);
  }

  // Profit Margin
  const marginKPI = document.getElementById('kpi-margin');
  if (marginKPI) {
    marginKPI.textContent = data.profit_margin.toFixed(1) + '%';
  }

  // Cash on Hand
  const cashKPI = document.getElementById('kpi-cash');
  if (cashKPI) {
    cashKPI.textContent = formatCurrency(data.cash_on_hand);
    animateValue(cashKPI, 0, data.cash_on_hand, 1000, formatCurrency);
  }
}

/**
 * Animate number values
 */
function animateValue(element, start, end, duration, formatter) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const timer = setInterval(function() {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = formatter ? formatter(Math.floor(current)) : Math.floor(current);
  }, 16);
}

/**
 * Format currency
 */
function formatCurrency(amount) {
  return '$' + amount.toLocaleString();
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 16px 24px;
    background-color: ${type === 'success' ? '#28A745' : '#4F5B66'};
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

// Add animation keyframes
const dashboardAnimationStyle = document.createElement('style');
dashboardAnimationStyle.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(dashboardAnimationStyle);
