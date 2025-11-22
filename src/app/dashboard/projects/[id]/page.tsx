import Link from 'next/link'
import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    select: { name: true }
  })

  return {
    title: project ? `${project.name} | Dashboard` : 'Project Not Found',
    description: `Project details and management`
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) {
    redirect('/auth/login')
  }

  const { id } = await params

  // Fetch project with all related data
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      bores: {
        include: {
          _count: {
            select: {
              rodPasses: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      dailyReports: {
        include: {
          createdBy: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { reportDate: 'desc' },
        take: 5
      },
      tickets811: {
        orderBy: { ticketDate: 'desc' },
        take: 5
      },
      _count: {
        select: {
          bores: true,
          dailyReports: true,
          tickets811: true,
          inspections: true
        }
      }
    }
  })

  if (!project) {
    notFound()
  }

  // Calculate stats
  const totalFootage = project.bores.reduce((sum, bore) => sum + (bore.totalLength || 0), 0)
  const activeBores = project.bores.filter(b => b.status === 'IN_PROGRESS').length
  const completedBores = project.bores.filter(b => b.status === 'COMPLETED').length

  const location = project.location as any

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
          <div style={{marginBottom: 'var(--space-md)'}}>
            <Link href="/dashboard/projects" style={{color: 'var(--white)', opacity: 0.8, fontSize: 'var(--text-sm)'}}>
              ← Back to Projects
            </Link>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 'var(--space-md)'}}>
            <div>
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>{project.name}</h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>{project.customerName || 'N/A'}</p>
            </div>
            <span style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              backgroundColor:
                project.status === 'IN_PROGRESS' ? '#10b981' :
                project.status === 'COMPLETED' ? '#3b82f6' :
                project.status === 'ON_HOLD' ? '#f59e0b' :
                '#6b7280',
              color: 'var(--white)'
            }}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          {/* Overview Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)'
          }}>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Total Bores</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-primary)'}}>{project._count.bores}</p>
              <p style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>
                {activeBores} active, {completedBores} completed
              </p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Total Footage</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-secondary)'}}>
                {Math.round(totalFootage)}
              </p>
              <p style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>linear feet</p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Daily Reports</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#10b981'}}>
                {project._count.dailyReports}
              </p>
              <p style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>submitted</p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>811 Tickets</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#f59e0b'}}>
                {project._count.tickets811}
              </p>
              <p style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>active</p>
            </div>
          </div>

          {/* Project Details and Bores */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-xl)'}}>
            {/* Project Details */}
            <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
              <h2 style={{marginBottom: 'var(--space-lg)'}}>Project Details</h2>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-lg)'}}>
                <div>
                  <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Description</p>
                  <p style={{color: 'var(--text-primary)'}}>{project.description || 'No description provided'}</p>
                </div>
                <div>
                  <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Customer Contact</p>
                  <p style={{color: 'var(--text-primary)'}}>{project.customerContact || 'N/A'}</p>
                </div>
                <div>
                  <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Location</p>
                  <p style={{color: 'var(--text-primary)'}}>{location?.address || location?.city || 'N/A'}</p>
                </div>
                <div>
                  <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Timeline</p>
                  <p style={{color: 'var(--text-primary)'}}>
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                    {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
                  </p>
                </div>
                {project.budget && (
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Budget</p>
                    <p style={{color: 'var(--text-primary)'}}>${project.budget.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Created By</p>
                  <p style={{color: 'var(--text-primary)'}}>{project.createdBy.name || project.createdBy.email}</p>
                </div>
              </div>
            </div>

            {/* Bores List */}
            {project.bores.length > 0 && (
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Bores ({project.bores.length})</h2>
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{borderBottom: '2px solid var(--bg-secondary)'}}>
                        <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Name</th>
                        <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Status</th>
                        <th style={{padding: 'var(--space-md)', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 600}}>Length (ft)</th>
                        <th style={{padding: 'var(--space-md)', textAlign: 'center', fontSize: 'var(--text-sm)', fontWeight: 600}}>Rod Passes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.bores.map((bore) => (
                        <tr key={bore.id} style={{borderBottom: '1px solid var(--bg-secondary)'}}>
                          <td style={{padding: 'var(--space-md)'}}>
                            <Link href={`/dashboard/bore-logs/${bore.id}`} style={{color: 'var(--color-primary)', fontWeight: 600}}>
                              {bore.name}
                            </Link>
                          </td>
                          <td style={{padding: 'var(--space-md)'}}>
                            <span style={{
                              padding: 'var(--space-xs) var(--space-sm)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 600,
                              backgroundColor: bore.status === 'IN_PROGRESS' ? '#10b981' : bore.status === 'COMPLETED' ? '#3b82f6' : '#6b7280',
                              color: 'white'
                            }}>
                              {bore.status}
                            </span>
                          </td>
                          <td style={{padding: 'var(--space-md)', textAlign: 'right', color: 'var(--text-secondary)'}}>
                            {bore.totalLength ? Math.round(bore.totalLength) : 'N/A'}
                          </td>
                          <td style={{padding: 'var(--space-md)', textAlign: 'center', color: 'var(--text-secondary)'}}>
                            {bore._count.rodPasses}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recent Daily Reports */}
            {project.dailyReports.length > 0 && (
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Recent Daily Reports</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {project.dailyReports.map((report) => (
                    <div key={report.id} style={{padding: 'var(--space-md)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-xs)'}}>
                        <p style={{fontWeight: 600}}>{new Date(report.reportDate).toLocaleDateString()}</p>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          backgroundColor: report.status === 'APPROVED' ? '#10b981' : report.status === 'SUBMITTED' ? '#f59e0b' : '#6b7280',
                          color: 'white'
                        }}>
                          {report.status}
                        </span>
                      </div>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>
                        By {report.createdBy.name || report.createdBy.email}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 811 Tickets */}
            {project.tickets811.length > 0 && (
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>811 Tickets</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {project.tickets811.map((ticket) => (
                    <div key={ticket.id} style={{padding: 'var(--space-md)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                        <div>
                          <p style={{fontWeight: 600}}>Ticket #{ticket.ticketNumber}</p>
                          <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>
                            Issued: {new Date(ticket.ticketDate).toLocaleDateString()}
                          </p>
                          <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>
                            Expires: {new Date(ticket.expirationDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          backgroundColor: ticket.status === 'ACTIVE' ? '#10b981' : ticket.status === 'EXPIRED' ? '#ef4444' : '#f59e0b',
                          color: 'white'
                        }}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
