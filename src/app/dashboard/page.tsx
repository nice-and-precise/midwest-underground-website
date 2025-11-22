import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Dashboard | Midwest Underground',
  description: 'HDD Operations Dashboard - Manage bore logs, field reports, and project data'
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch KPI data
  const [projects, bores, recentBores, recentReports] = await Promise.all([
    prisma.project.findMany({
      select: {
        id: true,
        status: true
      }
    }),
    prisma.bore.findMany({
      select: {
        id: true,
        status: true,
        totalLength: true,
        createdAt: true
      }
    }),
    prisma.bore.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        project: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    }),
    prisma.dailyReport.findMany({
      select: {
        id: true,
        reportDate: true,
        status: true,
        project: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        reportDate: 'desc'
      },
      take: 5
    })
  ])

  // Calculate KPIs
  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length
  const activeBores = bores.filter(b => b.status === 'IN_PROGRESS').length

  // Calculate today's footage
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todaysBores = bores.filter(b => {
    const createdDate = new Date(b.createdAt)
    createdDate.setHours(0, 0, 0, 0)
    return createdDate.getTime() === today.getTime()
  })
  const footageDrilledToday = todaysBores.reduce((sum, bore) => sum + (bore.totalLength || 0), 0)

  // Project status counts
  const planningCount = projects.filter(p => p.status === 'PLANNING').length
  const inProgressCount = projects.filter(p => p.status === 'IN_PROGRESS').length
  const completedCount = projects.filter(p => p.status === 'COMPLETED').length
  const onHoldCount = projects.filter(p => p.status === 'ON_HOLD').length

  return (
    <>
      {/* Dashboard Hero */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--brand-slate-dark) 100%)',
        color: 'var(--white)',
        paddingTop: 'var(--space-2xl)',
        paddingBottom: 'var(--space-2xl)'
      }}>
        <div className="container">
          <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-sm)'}}>
            HDD Operations Dashboard
          </h1>
          <p style={{fontSize: 'var(--text-lg)', opacity: 0.9, marginBottom: 0}}>
            Welcome back, {session.user.name || session.user.email}!
          </p>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="section" style={{paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)'}}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)'
          }}>
            {/* Total Projects */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-xl)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                Total Projects
              </div>
              <div style={{fontSize: 'var(--text-4xl)', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: 'var(--space-xs)'}}>
                {totalProjects}
              </div>
              <div style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>
                {activeProjects} active
              </div>
            </div>

            {/* Active Bores */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-xl)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                Active Bores
              </div>
              <div style={{fontSize: 'var(--text-4xl)', fontWeight: 'bold', color: '#10b981', marginBottom: 'var(--space-xs)'}}>
                {activeBores}
              </div>
              <div style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>
                {bores.length} total
              </div>
            </div>

            {/* Footage Drilled Today */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-xl)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                Footage Today
              </div>
              <div style={{fontSize: 'var(--text-4xl)', fontWeight: 'bold', color: 'var(--color-secondary)', marginBottom: 'var(--space-xs)'}}>
                {Math.round(footageDrilledToday)}
              </div>
              <div style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>
                linear feet
              </div>
            </div>

            {/* Active Crew Members */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-xl)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                Crew Members
              </div>
              <div style={{fontSize: 'var(--text-4xl)', fontWeight: 'bold', color: '#6366f1', marginBottom: 'var(--space-xs)'}}>
                {session.user.role === 'OWNER' ? '18' : '12'}
              </div>
              <div style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>
                active today
              </div>
            </div>
          </div>

          {/* Project Status Summary */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: 'var(--space-xl)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: 'var(--space-2xl)'
          }}>
            <h2 style={{fontSize: 'var(--text-xl)', marginBottom: 'var(--space-lg)'}}>
              Project Status Summary
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-md)'
            }}>
              <div style={{padding: 'var(--space-md)', backgroundColor: 'var(--bg-accent)', borderRadius: 'var(--radius-md)'}}>
                <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                  Planning
                </div>
                <div style={{fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: '#6b7280'}}>
                  {planningCount}
                </div>
              </div>
              <div style={{padding: 'var(--space-md)', backgroundColor: 'var(--bg-accent)', borderRadius: 'var(--radius-md)'}}>
                <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                  In Progress
                </div>
                <div style={{fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: '#10b981'}}>
                  {inProgressCount}
                </div>
              </div>
              <div style={{padding: 'var(--space-md)', backgroundColor: 'var(--bg-accent)', borderRadius: 'var(--radius-md)'}}>
                <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                  Completed
                </div>
                <div style={{fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: '#3b82f6'}}>
                  {completedCount}
                </div>
              </div>
              <div style={{padding: 'var(--space-md)', backgroundColor: 'var(--bg-accent)', borderRadius: 'var(--radius-md)'}}>
                <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                  On Hold
                </div>
                <div style={{fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: '#f59e0b'}}>
                  {onHoldCount}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--space-lg)'
          }}>
            {/* Recent Bore Logs */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-xl)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)'}}>
                <h2 style={{fontSize: 'var(--text-xl)', marginBottom: 0}}>Recent Bore Logs</h2>
                <Link href="/dashboard/bore-logs" style={{fontSize: 'var(--text-sm)', color: 'var(--color-secondary)', fontWeight: 600}}>
                  View All →
                </Link>
              </div>
              {recentBores.length === 0 ? (
                <p style={{color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-xl)'}}>
                  No bore logs yet
                </p>
              ) : (
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{borderBottom: '2px solid var(--bg-secondary)'}}>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Name</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Project</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Status</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBores.map(bore => (
                      <tr key={bore.id} style={{borderBottom: '1px solid var(--bg-secondary)'}}>
                        <td style={{padding: 'var(--space-md)'}}>
                          <Link href={`/dashboard/bore-logs/${bore.id}`} style={{color: 'var(--color-primary)', fontWeight: 600}}>
                            {bore.name}
                          </Link>
                        </td>
                        <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>{bore.project.name}</td>
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
                        <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)'}}>
                          {new Date(bore.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Recent Daily Reports */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-xl)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)'}}>
                <h2 style={{fontSize: 'var(--text-xl)', marginBottom: 0}}>Recent Daily Reports</h2>
                <Link href="/dashboard/field-reports" style={{fontSize: 'var(--text-sm)', color: 'var(--color-secondary)', fontWeight: 600}}>
                  View All →
                </Link>
              </div>
              {recentReports.length === 0 ? (
                <p style={{color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-xl)'}}>
                  No daily reports yet
                </p>
              ) : (
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{borderBottom: '2px solid var(--bg-secondary)'}}>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Project</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Date</th>
                      <th style={{padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600}}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map(report => (
                      <tr key={report.id} style={{borderBottom: '1px solid var(--bg-secondary)'}}>
                        <td style={{padding: 'var(--space-md)', color: 'var(--color-primary)', fontWeight: 600}}>
                          {report.project.name}
                        </td>
                        <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>
                          {new Date(report.reportDate).toLocaleDateString()}
                        </td>
                        <td style={{padding: 'var(--space-md)'}}>
                          <span style={{
                            padding: 'var(--space-xs) var(--space-sm)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600,
                            backgroundColor: report.status === 'APPROVED' ? '#10b981' : report.status === 'SUBMITTED' ? '#f59e0b' : '#6b7280',
                            color: 'white'
                          }}>
                            {report.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: 'var(--space-xl)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            marginTop: 'var(--space-2xl)'
          }}>
            <h2 style={{fontSize: 'var(--text-xl)', marginBottom: 'var(--space-lg)'}}>
              Quick Actions
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-md)'
            }}>
              <Link href="/dashboard/projects" className="btn btn-primary" style={{textAlign: 'center'}}>
                View Projects
              </Link>
              <Link href="/dashboard/bore-logs" className="btn btn-secondary" style={{textAlign: 'center'}}>
                View Bore Logs
              </Link>
              <Link href="/dashboard/811-tickets" className="btn btn-secondary" style={{textAlign: 'center'}}>
                811 Tickets
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
