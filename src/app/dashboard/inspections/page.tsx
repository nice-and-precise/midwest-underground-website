import Link from 'next/link'

export const metadata = {
  title: 'Inspections | Dashboard',
  description: 'QA/QC inspections, tracking, and corrective actions'
}

const mockInspections = [
  {
    id: 1,
    date: '2025-10-22',
    project: 'Willmar Fiber Network - Phase 2',
    inspector: 'Mike Chen',
    type: 'Final Inspection',
    location: 'County Rd 5 Bore #12',
    result: 'Passed',
    issues: 0,
    photos: 8
  },
  {
    id: 2,
    date: '2025-10-21',
    project: 'CenturyLink Expansion',
    inspector: 'Sarah Johnson',
    type: 'Mid-Point Inspection',
    location: '1st St Bore #6',
    result: 'Passed with Notes',
    issues: 2,
    photos: 12
  },
  {
    id: 3,
    date: '2025-10-20',
    project: 'Rural Electric Co-op',
    inspector: 'Mike Chen',
    type: 'Initial Inspection',
    location: 'Township Rd 42 Bore #3',
    result: 'Failed',
    issues: 5,
    photos: 15
  },
  {
    id: 4,
    date: '2025-10-19',
    project: 'City Water Main',
    inspector: 'Sarah Johnson',
    type: 'Safety Inspection',
    location: '3rd St Work Zone',
    result: 'Passed',
    issues: 0,
    photos: 6
  }
]

export default function InspectionsPage() {
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
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>Quality Inspections</h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>QA/QC tracking and corrective action management</p>
            </div>
            <Link href="/dashboard/inspections/new" className="btn btn-white btn-lg">+ New Inspection</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden'}}>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)'}}>
                <thead>
                  <tr style={{backgroundColor: 'var(--bg-secondary)', borderBottom: '2px solid var(--bg-primary)'}}>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Date</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Project</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Location</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Type</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Inspector</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Issues</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Photos</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Result</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInspections.map((inspection, index) => (
                    <tr key={inspection.id} style={{borderBottom: index < mockInspections.length - 1 ? '1px solid var(--bg-secondary)' : 'none'}}>
                      <td style={{padding: 'var(--space-md)'}}>{inspection.date}</td>
                      <td style={{padding: 'var(--space-md)', fontWeight: 600}}>{inspection.project}</td>
                      <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>{inspection.location}</td>
                      <td style={{padding: 'var(--space-md)'}}>{inspection.type}</td>
                      <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>{inspection.inspector}</td>
                      <td style={{padding: 'var(--space-md)'}}>
                        <span style={{
                          fontWeight: 600,
                          color: inspection.issues === 0 ? 'var(--success)' : inspection.issues <= 2 ? '#F59E0B' : '#DC2626'
                        }}>
                          {inspection.issues}
                        </span>
                      </td>
                      <td style={{padding: 'var(--space-md)'}}>{inspection.photos}</td>
                      <td style={{padding: 'var(--space-md)'}}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          backgroundColor: inspection.result === 'Passed' ? 'var(--success)' : inspection.result === 'Passed with Notes' ? '#F59E0B' : '#DC2626',
                          color: 'var(--white)'
                        }}>
                          {inspection.result}
                        </span>
                      </td>
                      <td style={{padding: 'var(--space-md)'}}>
                        <Link href={`/dashboard/inspections/${inspection.id}`} style={{color: 'var(--color-primary)', fontWeight: 600}}>View →</Link>
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
