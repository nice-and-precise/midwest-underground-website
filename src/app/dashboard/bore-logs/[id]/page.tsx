import Link from 'next/link'
import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const bore = await prisma.bore.findUnique({
    where: { id },
    select: { name: true }
  })

  return {
    title: bore ? `${bore.name} | Bore Logs` : 'Bore Log Not Found',
    description: `Detailed bore log information`
  }
}

export default async function BoreLogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) {
    redirect('/auth/login')
  }

  const { id } = await params

  // Fetch bore with all related data
  const bore = await prisma.bore.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          customerName: true,
          status: true
        }
      },
      rodPasses: {
        include: {
          loggedBy: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { sequence: 'asc' }
      },
      inspections: {
        include: {
          assignee: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      _count: {
        select: {
          rodPasses: true,
          inspections: true,
          rfis: true
        }
      }
    }
  })

  if (!bore) {
    notFound()
  }

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
          <div style={{marginBottom: 'var(--space-md)'}}>
            <Link href="/dashboard/bore-logs" style={{color: 'var(--white)', opacity: 0.8, fontSize: 'var(--text-sm)'}}>
              ← Back to Bore Logs
            </Link>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)'}}>
            <div>
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>
                {bore.name}
              </h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>
                <Link href={`/dashboard/projects/${bore.project.id}`} style={{color: 'var(--white)', opacity: 0.9}}>
                  {bore.project.name}
                </Link>
              </p>
            </div>
            <span style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              backgroundColor:
                bore.status === 'IN_PROGRESS' ? '#10b981' :
                bore.status === 'COMPLETED' ? '#3b82f6' :
                bore.status === 'ABANDONED' ? '#ef4444' :
                '#6b7280',
              color: 'var(--white)'
            }}>
              {bore.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </section>

      {/* Log Overview */}
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
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Total Length</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-primary)'}}>
                {bore.totalLength ? Math.round(bore.totalLength) : 'N/A'}
              </p>
              <p style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>linear feet</p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Rod Passes</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-secondary)'}}>
                {bore._count.rodPasses}
              </p>
              <p style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>logged</p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Diameter</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#10b981'}}>
                {bore.diameterIn || 'N/A'}
              </p>
              <p style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>inches</p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Inspections</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#f59e0b'}}>
                {bore._count.inspections}
              </p>
              <p style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>total</p>
            </div>
          </div>

          {/* Details Card */}
          <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-2xl)'}}>
            <h2 style={{marginBottom: 'var(--space-lg)'}}>Bore Details</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-lg)'}}>
              <div>
                <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Product Material</p>
                <p style={{fontWeight: 600}}>{bore.productMaterial || 'Not specified'}</p>
              </div>
              <div>
                <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Tracer Wire</p>
                <p style={{fontWeight: 600}}>{bore.tracerWire ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Created</p>
                <p style={{fontWeight: 600}}>{new Date(bore.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Last Updated</p>
                <p style={{fontWeight: 600}}>{new Date(bore.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Rod Passes */}
          {bore.rodPasses.length > 0 && (
            <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden', marginBottom: 'var(--space-2xl)'}}>
              <div style={{padding: 'var(--space-xl)', borderBottom: '2px solid var(--bg-secondary)'}}>
                <h2>Rod Passes ({bore.rodPasses.length})</h2>
                <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-xs)'}}>
                  Detailed rod-by-rod drilling log
                </p>
              </div>
              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{backgroundColor: 'var(--bg-secondary)'}}>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Sequence</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Pass #</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 600}}>Linear Feet</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Fluid Mix</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 600}}>Volume (gal)</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Logged By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bore.rodPasses.map((rodPass, index) => (
                      <tr key={rodPass.id} style={{borderBottom: index < bore.rodPasses.length - 1 ? '1px solid var(--bg-secondary)' : 'none'}}>
                        <td style={{padding: 'var(--space-md)', fontWeight: 600}}>{rodPass.sequence}</td>
                        <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>{rodPass.passNumber}</td>
                        <td style={{padding: 'var(--space-md)', textAlign: 'right', color: 'var(--text-secondary)'}}>{rodPass.linearFeet}</td>
                        <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>{rodPass.fluidMix || 'N/A'}</td>
                        <td style={{padding: 'var(--space-md)', textAlign: 'right', color: 'var(--text-secondary)'}}>{rodPass.fluidVolumeGal || 'N/A'}</td>
                        <td style={{padding: 'var(--space-md)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>
                          {rodPass.loggedBy.name || rodPass.loggedBy.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Inspections */}
          {bore.inspections.length > 0 && (
            <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
              <h2 style={{marginBottom: 'var(--space-lg)'}}>Recent Inspections</h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                {bore.inspections.map((inspection) => (
                  <div key={inspection.id} style={{padding: 'var(--space-md)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-xs)'}}>
                      <p style={{fontWeight: 600}}>{inspection.templateName || 'Inspection'}</p>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        backgroundColor:
                          inspection.status === 'COMPLETED' ? '#10b981' :
                          inspection.status === 'IN_PROGRESS' ? '#f59e0b' :
                          inspection.status === 'FAILED' ? '#ef4444' :
                          '#6b7280',
                        color: 'white'
                      }}>
                        {inspection.status}
                      </span>
                    </div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>
                      Created: {new Date(inspection.createdAt).toLocaleDateString()}
                    </p>
                    {inspection.assignee && (
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>
                        Assigned to: {inspection.assignee.name || inspection.assignee.email}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
