import Link from 'next/link'

export const metadata = {
  title: 'Dashboard | Midwest Underground',
  description: 'HDD Operations Dashboard - Manage bore logs, field reports, and project data'
}

export default function DashboardPage() {
  return (
    <>
      {/* Dashboard Hero */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--brand-slate-dark) 100%)',
        color: 'var(--white)',
        paddingTop: 'var(--space-3xl)',
        paddingBottom: 'var(--space-3xl)'
      }}>
        <div className="container">
          <h1 style={{fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-md)'}}>
            HDD Operations Dashboard
          </h1>
          <p style={{fontSize: 'var(--text-xl)', opacity: 0.9}}>
            Comprehensive field operations management for Midwest Underground of Minnesota
          </p>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="section">
        <div className="container">
          <div className="services-grid">
            {/* Bore Logs */}
            <div className="service-card">
              <div className="service-icon">🎯</div>
              <h3>Bore Logs</h3>
              <p>Rod-by-rod drilling logs with depth profiles and field measurements.</p>
              <Link href="/dashboard/bore-logs" className="service-link">
                View Logs <span>→</span>
              </Link>
            </div>

            {/* Field Reports */}
            <div className="service-card">
              <div className="service-icon">📝</div>
              <h3>Field Reports</h3>
              <p>Daily activity reports, crew logs, and production tracking.</p>
              <Link href="/dashboard/field-reports" className="service-link">
                View Reports <span>→</span>
              </Link>
            </div>

            {/* Projects */}
            <div className="service-card">
              <div className="service-icon">🚧</div>
              <h3>Projects</h3>
              <p>Active and completed HDD projects with timelines and budgets.</p>
              <Link href="/dashboard/projects" className="service-link">
                View Projects <span>→</span>
              </Link>
            </div>

            {/* 811 Tickets */}
            <div className="service-card">
              <div className="service-icon">⚠️</div>
              <h3>811 Compliance</h3>
              <p>Utility locate tickets and compliance tracking.</p>
              <Link href="/dashboard/811-tickets" className="service-link">
                Manage Tickets <span>→</span>
              </Link>
            </div>

            {/* Inspections */}
            <div className="service-card">
              <div className="service-icon">✅</div>
              <h3>Inspections</h3>
              <p>Quality assurance and compliance inspections.</p>
              <Link href="/dashboard/inspections" className="service-link">
                View Inspections <span>→</span>
              </Link>
            </div>

            {/* Reports */}
            <div className="service-card">
              <div className="service-icon">📊</div>
              <h3>Analytics</h3>
              <p>KPIs, reports, and data exports for billing.</p>
              <Link href="/dashboard/reports" className="service-link">
                View Reports <span>→</span>
              </Link>
            </div>

            {/* Customers */}
            <div className="service-card">
              <div className="service-icon">🏢</div>
              <h3>Customers</h3>
              <p>Client information and project history.</p>
              <Link href="/dashboard/customers" className="service-link">
                View Customers <span>→</span>
              </Link>
            </div>

            {/* Equipment */}
            <div className="service-card">
              <div className="service-icon">🚜</div>
              <h3>Equipment</h3>
              <p>Rig inventory, maintenance logs, and utilization.</p>
              <Link href="/dashboard/equipment" className="service-link">
                View Equipment <span>→</span>
              </Link>
            </div>

            {/* Financials */}
            <div className="service-card">
              <div className="service-icon">💰</div>
              <h3>Financials</h3>
              <p>Project costs, billing, and financial tracking.</p>
              <Link href="/dashboard/financials" className="service-link">
                View Financials <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="section gradient-bg-light">
        <div className="container">
          <h2 className="text-center" style={{marginBottom: 'var(--space-2xl)', color: 'var(--brand-slate-dark)'}}>
            System Status
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-lg)'
          }}>
            <div style={{
              backgroundColor: 'var(--white)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center'
            }}>
              <div style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-primary)'}}>
                Active
              </div>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>
                System Status
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--white)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center'
            }}>
              <div style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--success)'}}>
                Ready
              </div>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>
                Database Connected
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--white)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center'
            }}>
              <div style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-secondary)'}}>
                17+
              </div>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>
                Data Models
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
