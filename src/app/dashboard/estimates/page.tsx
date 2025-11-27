import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/services/costCalculator'

export const metadata = {
  title: 'Estimates | Midwest Underground',
  description: 'View and manage project estimates'
}

export default async function EstimatesPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const estimates = await prisma.estimate.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      project: {
        select: { id: true, name: true }
      },
      createdBy: {
        select: { id: true, name: true, email: true }
      },
      _count: {
        select: { lines: true }
      }
    }
  })

  // Calculate summary stats
  const totalEstimates = estimates.length
  const draftCount = estimates.filter(e => e.status === 'DRAFT').length
  const sentCount = estimates.filter(e => e.status === 'SENT').length
  const approvedCount = estimates.filter(e => e.status === 'APPROVED').length
  const totalValue = estimates.reduce((sum, e) => sum + e.total, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return '#6b7280'
      case 'SENT': return '#f59e0b'
      case 'APPROVED': return '#10b981'
      case 'REJECTED': return '#ef4444'
      case 'EXPIRED': return '#8b5cf6'
      default: return '#6b7280'
    }
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-sm)' }}>
                Project Estimates
              </h1>
              <p style={{ fontSize: 'var(--text-lg)', opacity: 0.9, marginBottom: 0 }}>
                Create and manage HDD project estimates
              </p>
            </div>
            <Link
              href="/dashboard/estimates/new"
              className="btn btn-secondary"
              style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}
            >
              + New Estimate
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="section" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                Total Estimates
              </div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                {totalEstimates}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                Draft
              </div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#6b7280' }}>
                {draftCount}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                Approved
              </div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#10b981' }}>
                {approvedCount}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                Total Value
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
                {formatCurrency(totalValue)}
              </div>
            </div>
          </div>

          {/* Estimates Table */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--bg-secondary)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 0 }}>All Estimates</h2>
            </div>

            {estimates.length === 0 ? (
              <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                  No estimates created yet
                </p>
                <Link href="/dashboard/estimates/new" className="btn btn-primary">
                  Create Your First Estimate
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-accent)' }}>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Name</th>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Customer</th>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Project</th>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Lines</th>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Total</th>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimates.map(estimate => (
                      <tr key={estimate.id} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                        <td style={{ padding: 'var(--space-md)' }}>
                          <Link
                            href={`/dashboard/estimates/${estimate.id}`}
                            style={{ color: 'var(--color-primary)', fontWeight: 600 }}
                          >
                            {estimate.name}
                          </Link>
                        </td>
                        <td style={{ padding: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                          {estimate.customerName || '-'}
                        </td>
                        <td style={{ padding: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                          {estimate.project?.name || '-'}
                        </td>
                        <td style={{ padding: 'var(--space-md)' }}>
                          <span style={{
                            padding: 'var(--space-xs) var(--space-sm)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600,
                            backgroundColor: getStatusColor(estimate.status),
                            color: 'white'
                          }}>
                            {estimate.status}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--space-md)', textAlign: 'right', color: 'var(--text-secondary)' }}>
                          {estimate._count.lines}
                        </td>
                        <td style={{ padding: 'var(--space-md)', textAlign: 'right', fontWeight: 600 }}>
                          {formatCurrency(estimate.total)}
                        </td>
                        <td style={{ padding: 'var(--space-md)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                          {new Date(estimate.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
