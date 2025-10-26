import Link from 'next/link'

export const metadata = {
  title: 'Bore Logs | Dashboard',
  description: 'View and manage HDD bore logs with rod-by-rod tracking'
}

//  Placeholder data
const mockBoreLogs = [
  {
    id: 1,
    date: '2025-10-20',
    project: 'Willmar Fiber Network - Phase 2',
    location: 'County Rd 5 & Hwy 12',
    totalDepth: '485 ft',
    rodCount: 97,
    status: 'Completed',
    crew: 'Crew A - John Smith'
  },
  {
    id: 2,
    date: '2025-10-21',
    project: 'CenturyLink Expansion',
    location: '1st St & Main Ave',
    totalDepth: '320 ft',
    rodCount: 64,
    status: 'Completed',
    crew: 'Crew B - Mike Johnson'
  },
  {
    id: 3,
    date: '2025-10-22',
    project: 'Rural Electric Co-op',
    location: 'Township Rd 42',
    totalDepth: '680 ft',
    rodCount: 136,
    status: 'In Progress',
    crew: 'Crew A - John Smith'
  },
  {
    id: 4,
    date: '2025-10-23',
    project: 'City Water Main',
    location: '3rd St & Oak Dr',
    totalDepth: '210 ft',
    rodCount: 42,
    status: 'Planned',
    crew: 'Crew C - Dave Anderson'
  }
]

export default function BoreLogsPage() {
  return (
    <>
      {/* Page Header */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--brand-slate-dark) 100%)',
        color: 'var(--white)',
        paddingTop: 'var(--space-2xl)',
        paddingBottom: 'var(--space-2xl)'
      }}>
        <div className="container">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)'}}>
            <div>
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>
                Bore Logs
              </h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>
                Rod-by-rod drilling logs with depth profiles and measurements
              </p>
            </div>
            <Link href="/dashboard/bore-logs/new" className="btn btn-white btn-lg">
              + New Bore Log
            </Link>
          </div>
        </div>
      </section>

      {/* Bore Logs Table */}
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
            <input
              type="text"
              placeholder="Search bore logs..."
              style={{
                flex: '1 1 300px',
                padding: 'var(--space-sm)',
                border: '2px solid var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-base)'
              }}
            />
            <select style={{
              padding: 'var(--space-sm)',
              border: '2px solid var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-base)'
            }}>
              <option>All Status</option>
              <option>Completed</option>
              <option>In Progress</option>
              <option>Planned</option>
            </select>
            <select style={{
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

          {/* Data Table */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden'
          }}>
            <div style={{overflowX: 'auto'}}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 'var(--text-sm)'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderBottom: '2px solid var(--bg-primary)'
                  }}>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Date</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Project</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Location</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Depth</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Rods</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Status</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Crew</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBoreLogs.map((log, index) => (
                    <tr key={log.id} style={{
                      borderBottom: index < mockBoreLogs.length - 1 ? '1px solid var(--bg-secondary)' : 'none'
                    }}>
                      <td style={{padding: 'var(--space-md)'}}>{log.date}</td>
                      <td style={{padding: 'var(--space-md)', fontWeight: 600}}>{log.project}</td>
                      <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>{log.location}</td>
                      <td style={{padding: 'var(--space-md)'}}>{log.totalDepth}</td>
                      <td style={{padding: 'var(--space-md)'}}>{log.rodCount}</td>
                      <td style={{padding: 'var(--space-md)'}}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          backgroundColor: log.status === 'Completed' ? 'var(--success)' :
                                         log.status === 'In Progress' ? 'var(--color-secondary)' :
                                         'var(--bg-accent)',
                          color: 'var(--white)'
                        }}>
                          {log.status}
                        </span>
                      </td>
                      <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>{log.crew}</td>
                      <td style={{padding: 'var(--space-md)'}}>
                        <Link href={`/dashboard/bore-logs/${log.id}`} style={{color: 'var(--color-primary)', fontWeight: 600}}>
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div style={{
            marginTop: 'var(--space-xl)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <p style={{color: 'var(--text-secondary)'}}>
              Showing 4 of 4 bore logs
            </p>
            <div style={{display: 'flex', gap: 'var(--space-sm)'}}>
              <button className="btn btn-outline" disabled>Previous</button>
              <button className="btn btn-outline" disabled>Next</button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
