import Link from 'next/link'

const mockProject = {
  id: 1,
  name: 'Willmar Fiber Network - Phase 2',
  client: 'Willmar Municipal Utilities',
  startDate: '2025-09-15',
  endDate: '2025-11-30',
  budget: 245000,
  actualCost: 159250,
  progress: 65,
  status: 'Active',
  footage: '12,450 ft',
  description: 'Installation of fiber optic cable infrastructure for Phase 2 of the city-wide broadband network. Includes directional drilling under major roadways and installation of conduit for fiber cable.',

  team: [
    { name: 'Tom Anderson', role: 'Project Manager', email: 'tanderson@willmarmu.gov' },
    { name: 'John Smith', role: 'Crew Lead', email: 'jsmith@midwestunderground.com' },
    { name: 'Mike Johnson', role: 'Operator', email: 'mjohnson@midwestunderground.com' }
  ],

  milestones: [
    { name: 'Site Survey Complete', date: '2025-09-20', status: 'Completed' },
    { name: 'Permits Obtained', date: '2025-09-25', status: 'Completed' },
    { name: 'Phase 1 Drilling', date: '2025-10-15', status: 'Completed' },
    { name: 'Phase 2 Drilling', date: '2025-11-01', status: 'In Progress' },
    { name: 'Fiber Installation', date: '2025-11-15', status: 'Pending' },
    { name: 'Final Inspection', date: '2025-11-30', status: 'Pending' }
  ],

  recentActivity: [
    { date: '2025-10-23', action: 'Bore log created', user: 'John Smith', details: 'County Rd 5 Bore #12 completed' },
    { date: '2025-10-22', action: 'Field report submitted', user: 'Mike Johnson', details: '485 ft drilled, 8.5 hours' },
    { date: '2025-10-21', action: 'Equipment assigned', user: 'System', details: 'Ditch Witch JT40 assigned to crew' }
  ]
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Project #${params.id} | Dashboard`,
    description: `Project details and management for project ${params.id}`
  }
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = mockProject
  const budgetUsed = (project.actualCost / project.budget) * 100

  return (
    <>
      <section className="section" style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--brand-slate-dark) 100%)',
        color: 'var(--white)',
        paddingTop: 'var(--space-2xl)',
        paddingBottom: 'var(--space-2xl)'
      }}>
        <div className="container">
          <div style={{marginBottom: 'var(--space-md)'}}>
            <Link href="/dashboard/projects" style={{color: 'var(--white)', opacity: 0.8, fontSize: 'var(--text-sm)'}}>
              ← Back to Projects
            </Link>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 'var(--space-md)'}}>
            <div>
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>{project.name}</h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>{project.client}</p>
            </div>
            <span style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--white)'
            }}>
              {project.status}
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Overview Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)'
          }}>
            <div style={{backgroundColor: 'var(--white)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Progress</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-primary)'}}>{project.progress}%</p>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                marginTop: 'var(--space-sm)'
              }}>
                <div style={{
                  width: `${project.progress}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-secondary)',
                  transition: 'width var(--transition-base)'
                }} />
              </div>
            </div>
            <div style={{backgroundColor: 'var(--white)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Budget</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--success)'}}>
                ${(project.budget / 1000).toFixed(0)}K
              </p>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>
                ${(project.actualCost / 1000).toFixed(0)}K used ({budgetUsed.toFixed(0)}%)
              </p>
            </div>
            <div style={{backgroundColor: 'var(--white)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Footage</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-secondary)'}}>
                {project.footage}
              </p>
            </div>
            <div style={{backgroundColor: 'var(--white)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Timeline</p>
              <p style={{fontSize: 'var(--text-lg)', fontWeight: 600}}>{project.startDate}</p>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>to {project.endDate}</p>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)'}}>
            {/* Project Details */}
            <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
              <h2 style={{marginBottom: 'var(--space-lg)'}}>Project Details</h2>
              <p style={{color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-xl)'}}>{project.description}</p>

              <h3 style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)'}}>Project Team</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                {project.team.map((member, idx) => (
                  <div key={idx} style={{
                    padding: 'var(--space-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <p style={{fontWeight: 600}}>{member.name}</p>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>{member.role}</p>
                    <p style={{fontSize: 'var(--text-sm)'}}>
                      <a href={`mailto:${member.email}`} style={{color: 'var(--color-primary)'}}>{member.email}</a>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones & Activity */}
            <div>
              {/* Milestones */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Milestones</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)'}}>
                  {project.milestones.map((milestone, idx) => (
                    <div key={idx} style={{
                      padding: 'var(--space-md)',
                      borderLeft: `4px solid ${
                        milestone.status === 'Completed' ? 'var(--success)' :
                        milestone.status === 'In Progress' ? 'var(--color-secondary)' :
                        'var(--bg-accent)'
                      }`,
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                        <div>
                          <p style={{fontWeight: 600}}>{milestone.name}</p>
                          <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>{milestone.date}</p>
                        </div>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          backgroundColor:
                            milestone.status === 'Completed' ? 'var(--success)' :
                            milestone.status === 'In Progress' ? 'var(--color-secondary)' :
                            'var(--bg-accent)',
                          color: 'var(--white)'
                        }}>
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Recent Activity</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {project.recentActivity.map((activity, idx) => (
                    <div key={idx} style={{paddingBottom: 'var(--space-md)', borderBottom: idx < project.recentActivity.length - 1 ? '1px solid var(--bg-secondary)' : 'none'}}>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>{activity.date}</p>
                      <p style={{fontWeight: 600}}>{activity.action}</p>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>{activity.details}</p>
                      <p style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px'}}>by {activity.user}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
