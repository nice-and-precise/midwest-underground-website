import Link from 'next/link'

export const metadata = {
  title: 'Field Reports | Dashboard',
  description: 'Daily field reports with crew activities, production metrics, and equipment tracking'
}

const mockReports = [
  {
    id: 1,
    date: '2025-10-23',
    project: 'Willmar Fiber Network - Phase 2',
    crew: 'Crew A - John Smith',
    hours: 8.5,
    footage: 485,
    equipment: 'Ditch Witch JT40',
    weather: 'Sunny, 68°F',
    status: 'Submitted'
  },
  {
    id: 2,
    date: '2025-10-22',
    project: 'CenturyLink Expansion',
    crew: 'Crew B - Mike Johnson',
    hours: 7.0,
    footage: 320,
    equipment: 'Vermeer D24x40',
    weather: 'Cloudy, 62°F',
    status: 'Approved'
  },
  {
    id: 3,
    date: '2025-10-21',
    project: 'Rural Electric Co-op',
    crew: 'Crew A - John Smith',
    hours: 9.5,
    footage: 680,
    equipment: 'Ditch Witch JT40',
    weather: 'Rain, 58°F',
    status: 'Pending Review'
  }
]

export default function FieldReportsPage() {
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
          <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden'}}>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)'}}>
                <thead>
                  <tr style={{backgroundColor: 'var(--bg-secondary)', borderBottom: '2px solid var(--bg-primary)'}}>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Date</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Project</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Crew</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Hours</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Footage</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Equipment</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Weather</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Status</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockReports.map((report, index) => (
                    <tr key={report.id} style={{borderBottom: index < mockReports.length - 1 ? '1px solid var(--bg-secondary)' : 'none'}}>
                      <td style={{padding: 'var(--space-md)'}}>{report.date}</td>
                      <td style={{padding: 'var(--space-md)', fontWeight: 600}}>{report.project}</td>
                      <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>{report.crew}</td>
                      <td style={{padding: 'var(--space-md)'}}>{report.hours} hrs</td>
                      <td style={{padding: 'var(--space-md)'}}>{report.footage} ft</td>
                      <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>{report.equipment}</td>
                      <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>{report.weather}</td>
                      <td style={{padding: 'var(--space-md)'}}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          backgroundColor: report.status === 'Approved' ? 'var(--success)' : report.status === 'Submitted' ? 'var(--color-secondary)' : 'var(--bg-accent)',
                          color: 'var(--white)'
                        }}>
                          {report.status}
                        </span>
                      </td>
                      <td style={{padding: 'var(--space-md)'}}>
                        <Link href={`/dashboard/field-reports/${report.id}`} style={{color: 'var(--color-primary)', fontWeight: 600}}>View →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
