import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Bore Logs | Dashboard',
  description: 'View and manage HDD bore logs with rod-by-rod tracking'
}

export default async function BoreLogsPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch all bores with project and rod pass counts
  const bores = await prisma.bore.findMany({
    include: {
      project: {
        select: {
          id: true,
          name: true,
          customerName: true
        }
      },
      _count: {
        select: {
          rodPasses: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
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
              <p style={{fontSize: 'var(--text-base)', opacity: 0.9, marginBottom: 0}}>
                View and manage HDD bore logs with rod-by-rod tracking
              </p>
            </div>
            <Link href="/dashboard" className="btn btn-white">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Bore Logs Table */}
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
                Total Bores
              </div>
              <div style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-primary)'}}>
                {bores.length}
              </div>
            </div>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                Planned
              </div>
              <div style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#6b7280'}}>
                {bores.filter(b => b.status === 'PLANNED').length}
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
                {bores.filter(b => b.status === 'IN_PROGRESS').length}
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
                {bores.filter(b => b.status === 'COMPLETED').length}
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden'
          }}>
            <div style={{padding: 'var(--space-xl)', borderBottom: '1px solid var(--bg-secondary)'}}>
              <h2 style={{fontSize: 'var(--text-xl)', marginBottom: 'var(--space-sm)'}}>
                All Bore Logs
              </h2>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 0}}>
                Click on a bore log to view full details
              </p>
            </div>

            {bores.length === 0 ? (
              <div style={{padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--text-secondary)'}}>
                <p>No bore logs found. Create your first bore log to get started.</p>
              </div>
            ) : (
              <div style={{overflowX: 'auto'}}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderBottom: '2px solid var(--border-color)'
                    }}>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Name</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Project</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Status</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 600}}>Length (ft)</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'center', fontSize: 'var(--text-sm)', fontWeight: 600}}>Rod Passes</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bores.map((bore) => (
                      <tr key={bore.id} style={{
                        borderBottom: '1px solid var(--bg-secondary)'
                      }}>
                        <td style={{padding: 'var(--space-md)'}}>
                          <Link href={`/dashboard/bore-logs/${bore.id}`} style={{color: 'var(--color-primary)', fontWeight: 600}}>
                            {bore.name}
                          </Link>
                        </td>
                        <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>
                          <Link href={`/dashboard/projects/${bore.project.id}`} style={{color: 'var(--text-secondary)'}}>
                            {bore.project.name}
                          </Link>
                        </td>
                        <td style={{padding: 'var(--space-md)'}}>
                          <span style={{
                            padding: 'var(--space-xs) var(--space-sm)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600,
                            backgroundColor:
                              bore.status === 'IN_PROGRESS' ? '#10b981' :
                              bore.status === 'COMPLETED' ? '#3b82f6' :
                              bore.status === 'ABANDONED' ? '#ef4444' :
                              '#6b7280',
                            color: 'white'
                          }}>
                            {bore.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{padding: 'var(--space-md)', textAlign: 'right', color: 'var(--text-secondary)'}}>
                          {bore.totalLength ? Math.round(bore.totalLength) : 'N/A'}
                        </td>
                        <td style={{padding: 'var(--space-md)', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600}}>
                          {bore._count.rodPasses}
                        </td>
                        <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>
                          {new Date(bore.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
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
              <span><span style={{display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#6b7280', borderRadius: '2px', marginRight: '6px'}}></span> Planned</span>
              <span><span style={{display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px', marginRight: '6px'}}></span> In Progress</span>
              <span><span style={{display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '2px', marginRight: '6px'}}></span> Completed</span>
              <span><span style={{display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '2px', marginRight: '6px'}}></span> Abandoned</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
