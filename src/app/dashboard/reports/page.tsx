import Link from 'next/link'

export const metadata = {
  title: 'Reports & Analytics | Dashboard',
  description: 'Generate reports, analyze KPIs, and export data'
}

const reportCategories = [
  {
    id: 1,
    name: 'Production Reports',
    icon: '📊',
    description: 'Footage drilled, rod counts, and productivity metrics',
    reports: [
      'Daily Production Summary',
      'Weekly Performance Report',
      'Monthly Project Summary',
      'Crew Productivity Analysis'
    ]
  },
  {
    id: 2,
    name: 'Financial Reports',
    icon: '💰',
    description: 'Budget tracking, billing, and revenue analysis',
    reports: [
      'Project Budget vs Actual',
      'Invoice Status Report',
      'Revenue by Client',
      'Cost Analysis by Project'
    ]
  },
  {
    id: 3,
    name: 'Compliance Reports',
    icon: '⚠️',
    description: '811 tickets, inspections, and safety documentation',
    reports: [
      '811 Ticket Status',
      'Inspection Results Summary',
      'Safety Incident Log',
      'Compliance Audit Report'
    ]
  },
  {
    id: 4,
    name: 'Equipment Reports',
    icon: '🚜',
    description: 'Utilization, maintenance, and rig performance',
    reports: [
      'Equipment Utilization',
      'Maintenance Schedule',
      'Equipment Costs by Project',
      'Downtime Analysis'
    ]
  },
  {
    id: 5,
    name: 'Client Reports',
    icon: '🏢',
    description: 'Customer analytics and project history',
    reports: [
      'Customer Project Summary',
      'Revenue by Customer',
      'Customer Retention Analysis',
      'Active Clients Report'
    ]
  },
  {
    id: 6,
    name: 'Custom Reports',
    icon: '⚙️',
    description: 'Build custom reports with query builder',
    reports: [
      'Query Builder',
      'Saved Queries',
      'Report Templates',
      'Scheduled Reports'
    ]
  }
]

export default function ReportsPage() {
  return (
    <>
      <section className="section" style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--brand-slate-dark) 100%)',
        color: 'var(--white)',
        paddingTop: 'var(--space-2xl)',
        paddingBottom: 'var(--space-2xl)'
      }}>
        <div className="container">
          <div>
            <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>Reports & Analytics</h1>
            <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>Generate reports, analyze KPIs, and export data</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Quick Actions */}
          <div style={{
            marginBottom: 'var(--space-2xl)',
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: 'var(--space-md)',
            flexWrap: 'wrap'
          }}>
            <button className="btn btn-primary">Generate Daily Report</button>
            <button className="btn btn-outline">Export to PDF</button>
            <button className="btn btn-outline">Export to Excel</button>
            <button className="btn btn-outline">Schedule Report</button>
          </div>

          {/* Report Categories Grid */}
          <div className="services-grid">
            {reportCategories.map(category => (
              <div key={category.id} style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                padding: 'var(--space-lg)',
                border: '2px solid var(--bg-secondary)'
              }}>
                <div style={{marginBottom: 'var(--space-md)'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)'}}>
                    <span style={{fontSize: 'var(--text-2xl)'}}>{category.icon}</span>
                    <h3 style={{fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)'}}>{category.name}</h3>
                  </div>
                  <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>{category.description}</p>
                </div>

                <div style={{marginBottom: 'var(--space-md)'}}>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    fontSize: 'var(--text-sm)'
                  }}>
                    {category.reports.map((report, idx) => (
                      <li key={idx} style={{
                        padding: 'var(--space-xs) 0',
                        borderBottom: idx < category.reports.length - 1 ? '1px solid var(--bg-secondary)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-xs)'
                      }}>
                        <span style={{color: 'var(--color-secondary)'}}>▸</span>
                        <span>{report}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={`/dashboard/reports/${category.id}`} className="btn btn-primary" style={{width: '100%'}}>
                  View Reports →
                </Link>
              </div>
            ))}
          </div>

          {/* Recent Reports */}
          <div style={{marginTop: 'var(--space-3xl)'}}>
            <h2 style={{marginBottom: 'var(--space-lg)'}}>Recent Reports</h2>
            <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-lg)'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)'}}>
                  <div>
                    <p style={{fontWeight: 600}}>Weekly Production Report</p>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>Generated on 2025-10-23 at 5:30 PM</p>
                  </div>
                  <Link href="/dashboard/reports/1/download" className="btn btn-outline btn-sm">Download</Link>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)'}}>
                  <div>
                    <p style={{fontWeight: 600}}>Monthly Financial Summary</p>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>Generated on 2025-10-20 at 2:15 PM</p>
                  </div>
                  <Link href="/dashboard/reports/2/download" className="btn btn-outline btn-sm">Download</Link>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)'}}>
                  <div>
                    <p style={{fontWeight: 600}}>811 Compliance Report</p>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>Generated on 2025-10-18 at 9:00 AM</p>
                  </div>
                  <Link href="/dashboard/reports/3/download" className="btn btn-outline btn-sm">Download</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
