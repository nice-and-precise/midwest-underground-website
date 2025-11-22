import Link from 'next/link'

export const metadata = {
  title: 'Field Reports | Dashboard',
  description: 'Daily field reports with crew activities, production metrics, and equipment tracking'
}

// Fetch daily reports from API
async function getDailyReports() {
  try {
    // In production, this would be: await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hdd/daily-reports`)
    // For now, return mock data
    return [
      {
        id: 1,
        date: '2025-10-23',
        project: { id: 1, name: 'Willmar Fiber Network - Phase 2' },
        bore: { id: 1, boreId: 'B-001' },
        crew: 'Crew A - John Smith',
        hours: 8.5,
        footage: 485,
        status: 'SUBMITTED'
      },
      {
        id: 2,
        date: '2025-10-22',
        project: { id: 2, name: 'CenturyLink Expansion' },
        bore: { id: 2, boreId: 'B-002' },
        crew: 'Crew B - Mike Johnson',
        hours: 7.0,
        footage: 320,
        status: 'APPROVED'
      },
      {
        id: 3,
        date: '2025-10-21',
        project: { id: 3, name: 'Rural Electric Co-op' },
        bore: { id: 3, boreId: 'B-003' },
        crew: 'Crew A - John Smith',
        hours: 9.5,
        footage: 680,
        status: 'DRAFT'
      }
    ]
  } catch (error) {
    console.error('Failed to fetch daily reports:', error)
    return []
  }
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    DRAFT: '#6b7280',
    SUBMITTED: '#3b82f6',
    APPROVED: '#10b981',
    REJECTED: '#ef4444'
  }
  return (
    <span style={{
      padding: 'var(--space-xs) var(--space-sm)',
      borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--text-xs)',
      fontWeight: 600,
      backgroundColor: colors[status] || '#6b7280',
      color: 'white'
    }}>
      {status}
    </span>
  )
}

export default async function FieldReportsPage() {
  const reports = await getDailyReports()

  return (
    <>
      <section className="section" style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--brand-slate-dark) 100%)',
        color: 'var(--white)',
        paddingTop: 'var(--space-2xl)',
        paddingBottom: 'var(--space-2xl)'
      }}>
        <div className="container">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)'}}>
            <div>
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>Daily Field Reports</h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>Crew activities, production metrics, and equipment usage</p>
            </div>
            <Link href="/dashboard/hdd/daily-report" className="btn btn-white btn-lg">+ New Report</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div style={{
            marginBottom: 'var(--space-xl)',
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: 'var(--space-md)',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                Date Range
              </label>
              <input
                type="date"
                style={{
                  width: '100%',
                  padding: 'var(--space-sm)',
                  border: '2px solid var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-base)'
                }}
              />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                Project
              </label>
              <select style={{
                width: '100%',
                padding: 'var(--space-sm)',
                border: '2px solid var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-base)'
              }}>
                <option>All Projects</option>
                <option>Willmar Fiber Network</option>
                <option>CenturyLink Expansion</option>
                <option>Rural Electric Co-op</option>
              </select>
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                Crew
              </label>
              <select style={{
                width: '100%',
                padding: 'var(--space-sm)',
                border: '2px solid var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-base)'
              }}>
                <option>All Crews</option>
                <option>Crew A</option>
                <option>Crew B</option>
                <option>Crew C</option>
              </select>
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                Status
              </label>
              <select style={{
                width: '100%',
                padding: 'var(--space-sm)',
                border: '2px solid var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-base)'
              }}>
                <option>All Status</option>
                <option>Draft</option>
                <option>Submitted</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          {/* Reports Table */}
          <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden'}}>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)'}}>
                <thead>
                  <tr style={{backgroundColor: 'var(--bg-secondary)', borderBottom: '2px solid var(--bg-primary)'}}>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Date</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Project</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Bore</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Crew</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Hours</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Footage</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Status</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--text-secondary)'}}>
                        No field reports found. Create your first report to get started.
                      </td>
                    </tr>
                  ) : (
                    reports.map((report, index) => (
                      <tr key={report.id} style={{borderBottom: index < reports.length - 1 ? '1px solid var(--bg-secondary)' : 'none'}}>
                        <td style={{padding: 'var(--space-md)', fontWeight: 600}}>{report.date}</td>
                        <td style={{padding: 'var(--space-md)'}}>{report.project.name}</td>
                        <td style={{padding: 'var(--space-md)', fontFamily: 'monospace', color: 'var(--text-secondary)'}}>{report.bore.boreId}</td>
                        <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>{report.crew}</td>
                        <td style={{padding: 'var(--space-md)'}}>{report.hours} hrs</td>
                        <td style={{padding: 'var(--space-md)', fontWeight: 600}}>{report.footage} ft</td>
                        <td style={{padding: 'var(--space-md)'}}>
                          <StatusBadge status={report.status} />
                        </td>
                        <td style={{padding: 'var(--space-md)'}}>
                          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                            <Link href={`/dashboard/field-reports/${report.id}`} style={{color: 'var(--color-primary)', fontWeight: 600}}>
                              View
                            </Link>
                            {report.status === 'DRAFT' && (
                              <>
                                <span style={{ color: 'var(--text-secondary)' }}>•</span>
                                <Link href={`/dashboard/field-reports/${report.id}/edit`} style={{color: 'var(--color-secondary)', fontWeight: 600}}>
                                  Edit
                                </Link>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div style={{
            marginTop: 'var(--space-xl)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-md)'
          }}>
            <div style={{
              padding: 'var(--space-lg)',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                Total Reports
              </p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                {reports.length}
              </p>
            </div>
            <div style={{
              padding: 'var(--space-lg)',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                Total Footage
              </p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-secondary)' }}>
                {reports.reduce((sum, r) => sum + r.footage, 0)} ft
              </p>
            </div>
            <div style={{
              padding: 'var(--space-lg)',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                Total Hours
              </p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--success)' }}>
                {reports.reduce((sum, r) => sum + r.hours, 0).toFixed(1)} hrs
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
