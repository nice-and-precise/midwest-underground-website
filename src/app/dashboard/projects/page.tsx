import Link from 'next/link'

export const metadata = {
  title: 'Projects | Dashboard',
  description: 'Manage HDD projects, timelines, budgets, and deliverables'
}

const mockProjects = [
  {
    id: 1,
    name: 'Willmar Fiber Network - Phase 2',
    client: 'Willmar Municipal Utilities',
    startDate: '2025-09-15',
    endDate: '2025-11-30',
    budget: '$245,000',
    progress: 65,
    status: 'Active',
    footage: '12,450 ft'
  },
  {
    id: 2,
    name: 'CenturyLink Expansion',
    client: 'CenturyLink',
    startDate: '2025-10-01',
    endDate: '2025-12-15',
    budget: '$180,000',
    progress: 45,
    status: 'Active',
    footage: '8,200 ft'
  },
  {
    id: 3,
    name: 'Rural Electric Co-op',
    client: 'Kandiyohi Power Cooperative',
    startDate: '2025-08-01',
    endDate: '2025-10-31',
    budget: '$320,000',
    progress: 95,
    status: 'Completing',
    footage: '18,650 ft'
  },
  {
    id: 4,
    name: 'City Water Main Extension',
    client: 'City of Willmar',
    startDate: '2025-11-01',
    endDate: '2026-02-28',
    budget: '$425,000',
    progress: 0,
    status: 'Planned',
    footage: '22,100 ft'
  }
]

export default function ProjectsPage() {
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
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>Projects</h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>Manage timelines, budgets, and project deliverables</p>
            </div>
            <Link href="/dashboard/projects/new" className="btn btn-white btn-lg">+ New Project</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="services-grid">
            {mockProjects.map(project => (
              <div key={project.id} style={{
                backgroundColor: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                padding: 'var(--space-lg)',
                border: '2px solid var(--bg-secondary)'
              }}>
                <div style={{marginBottom: 'var(--space-md)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-sm)'}}>
                    <h3 style={{fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)'}}>{project.name}</h3>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      backgroundColor: project.status === 'Active' ? 'var(--color-secondary)' : project.status === 'Completing' ? 'var(--success)' : 'var(--bg-accent)',
                      color: 'var(--white)'
                    }}>
                      {project.status}
                    </span>
                  </div>
                  <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>{project.client}</p>
                </div>

                <div style={{marginBottom: 'var(--space-md)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', fontSize: 'var(--text-sm)'}}>
                    <span style={{color: 'var(--text-secondary)'}}>Progress</span>
                    <span style={{fontWeight: 600}}>{project.progress}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${project.progress}%`,
                      height: '100%',
                      backgroundColor: project.progress >= 90 ? 'var(--success)' : 'var(--color-secondary)',
                      transition: 'width var(--transition-base)'
                    }} />
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-md)',
                  fontSize: 'var(--text-sm)'
                }}>
                  <div>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '2px'}}>Budget</p>
                    <p style={{fontWeight: 600}}>{project.budget}</p>
                  </div>
                  <div>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '2px'}}>Footage</p>
                    <p style={{fontWeight: 600}}>{project.footage}</p>
                  </div>
                  <div>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '2px'}}>Start</p>
                    <p style={{fontWeight: 600}}>{project.startDate}</p>
                  </div>
                  <div>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '2px'}}>End</p>
                    <p style={{fontWeight: 600}}>{project.endDate}</p>
                  </div>
                </div>

                <Link href={`/dashboard/projects/${project.id}`} className="btn btn-primary" style={{width: '100%'}}>
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
