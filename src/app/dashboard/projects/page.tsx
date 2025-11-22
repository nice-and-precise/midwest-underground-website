import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Projects | Dashboard',
  description: 'View and manage HDD projects'
}

export default async function ProjectsPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch all projects with counts
  const projects = await prisma.project.findMany({
    include: {
      createdBy: {
        select: {
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          bores: true,
          dailyReports: true,
          tickets811: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return (
    <>
      {/* Header */}
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
                Projects
              </h1>
              <p style={{fontSize: 'var(--text-base)', opacity: 0.9, marginBottom: 0}}>
                Manage all HDD projects and their details
              </p>
            </div>
            <Link href="/dashboard" className="btn btn-white">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="section">
        <div className="container">
          {/* Stats Summary */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-2xl)'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                Total Projects
              </div>
              <div style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-primary)'}}>
                {projects.length}
              </div>
            </div>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                Planning
              </div>
              <div style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#6b7280'}}>
                {projects.filter(p => p.status === 'PLANNING').length}
              </div>
            </div>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                In Progress
              </div>
              <div style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#10b981'}}>
                {projects.filter(p => p.status === 'IN_PROGRESS').length}
              </div>
            </div>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                Completed
              </div>
              <div style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#3b82f6'}}>
                {projects.filter(p => p.status === 'COMPLETED').length}
              </div>
            </div>
          </div>

          {/* Projects Table */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden'
          }}>
            <div style={{padding: 'var(--space-xl)', borderBottom: '1px solid var(--bg-secondary)'}}>
              <h2 style={{fontSize: 'var(--text-xl)', marginBottom: 'var(--space-sm)'}}>
                All Projects
              </h2>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 0}}>
                Click on a project to view full details
              </p>
            </div>

            {projects.length === 0 ? (
              <div style={{padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--text-secondary)'}}>
                <p>No projects found. Create your first project to get started.</p>
              </div>
            ) : (
              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{backgroundColor: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-color)'}}>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)'}}>
                        Name
                      </th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)'}}>
                        Customer
                      </th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)'}}>
                        Location
                      </th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)'}}>
                        Status
                      </th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'center', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)'}}>
                        Bores
                      </th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'center', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)'}}>
                        Reports
                      </th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)'}}>
                        Start Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => {
                      const location = project.location as any
                      const locationStr = location?.address || location?.city || 'N/A'

                      return (
                        <tr
                          key={project.id}
                          style={{
                            borderBottom: '1px solid var(--bg-secondary)',
                            transition: 'background-color 150ms ease'
                          }}
                        >
                          <td style={{padding: 'var(--space-md)'}}>
                            <Link
                              href={`/dashboard/projects/${project.id}`}
                              style={{
                                color: 'var(--color-primary)',
                                fontWeight: 600,
                                fontSize: 'var(--text-base)'
                              }}
                            >
                              {project.name}
                            </Link>
                            {project.description && (
                              <div style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-secondary)',
                                marginTop: 'var(--space-xs)',
                                maxWidth: '300px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {project.description}
                              </div>
                            )}
                          </td>
                          <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>
                            {project.customerName || 'N/A'}
                          </td>
                          <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>
                            {locationStr}
                          </td>
                          <td style={{padding: 'var(--space-md)'}}>
                            <span style={{
                              padding: 'var(--space-xs) var(--space-sm)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 600,
                              backgroundColor:
                                project.status === 'IN_PROGRESS' ? '#10b981' :
                                project.status === 'COMPLETED' ? '#3b82f6' :
                                project.status === 'ON_HOLD' ? '#f59e0b' :
                                '#6b7280',
                              color: 'white'
                            }}>
                              {project.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{padding: 'var(--space-md)', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600}}>
                            {project._count.bores}
                          </td>
                          <td style={{padding: 'var(--space-md)', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600}}>
                            {project._count.dailyReports}
                          </td>
                          <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>
                            {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Legend */}
          <div style={{
            marginTop: 'var(--space-lg)',
            padding: 'var(--space-md)',
            backgroundColor: 'var(--bg-accent)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)'
          }}>
            <strong>Status Legend:</strong>
            <div style={{display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-xs)', flexWrap: 'wrap'}}>
              <span><span style={{display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#6b7280', borderRadius: '2px', marginRight: '6px'}}></span> Planning</span>
              <span><span style={{display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px', marginRight: '6px'}}></span> In Progress</span>
              <span><span style={{display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '2px', marginRight: '6px'}}></span> Completed</span>
              <span><span style={{display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '2px', marginRight: '6px'}}></span> On Hold</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
