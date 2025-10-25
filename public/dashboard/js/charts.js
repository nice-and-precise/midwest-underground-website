/**
 * Dashboard Charts - Chart.js Initialization
 * Handles all data visualization charts
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('[Charts] Initializing dashboard charts...');

  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.error('[Charts] Chart.js not loaded!');
    return;
  }

  // Get current theme
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

  // Theme-aware colors (Official Brand Standards)
  const colors = {
    primary: isDarkMode ? '#F2EDE5' : '#23272A',
    secondary: '#FF5A1F',
    accent: '#FFC400',
    success: '#28A745',
    warning: '#FFC400',
    text: isDarkMode ? '#F2EDE5' : '#23272A',
    grid: isDarkMode ? '#4F5B66' : '#D1CCC3',
    steel: '#4F5B66',
    sand: '#F2EDE5'
  };

  // Chart defaults
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = colors.text;
  Chart.defaults.borderColor = colors.grid;

  // Revenue Line Chart
  const revenueCtx = document.getElementById('revenue-chart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['Nov 23', 'Dec 23', 'Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24', 'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24'],
        datasets: [{
          label: 'Monthly Revenue',
          data: [325000, 265000, 225000, 285000, 365000, 425000, 485000, 515000, 525000, 505000, 475000, 445000],
          borderColor: colors.primary,
          backgroundColor: isDarkMode ? 'rgba(242, 237, 229, 0.1)' : 'rgba(35, 39, 42, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return '$' + context.parsed.y.toLocaleString();
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value) {
                return '$' + (value / 1000) + 'K';
              }
            },
            grid: {
              color: colors.grid
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Project Status Pie Chart
  const projectStatusCtx = document.getElementById('project-status-chart');
  if (projectStatusCtx) {
    new Chart(projectStatusCtx, {
      type: 'doughnut',
      data: {
        labels: ['In Progress', 'Completed', 'Planning'],
        datasets: [{
          data: [7, 6, 2],
          backgroundColor: [
            colors.accent,
            colors.success,
            colors.warning
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return label + ': ' + value + ' (' + percentage + '%)';
              }
            }
          }
        }
      }
    });
  }

  // Service Revenue Bar Chart
  const serviceRevenueCtx = document.getElementById('service-revenue-chart');
  if (serviceRevenueCtx) {
    new Chart(serviceRevenueCtx, {
      type: 'bar',
      data: {
        labels: ['Fiber Optic', 'Directional Drilling', 'Underground Utilities', 'Geothermal', 'Emergency Services'],
        datasets: [{
          label: 'Revenue YTD',
          data: [1850000, 1275000, 850000, 198000, 77000],
          backgroundColor: [
            colors.primary,
            colors.accent,
            colors.secondary,
            colors.success,
            colors.warning
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return '$' + context.parsed.x.toLocaleString();
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + (value / 1000000) + 'M';
              }
            },
            grid: {
              color: colors.grid
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  console.log('[Charts] All charts initialized successfully');

  // Update charts when theme changes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'data-theme') {
        console.log('[Charts] Theme changed, reloading page to update charts...');
        // In production, we would update charts dynamically
        // For now, we'll just log it
        location.reload();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
});
