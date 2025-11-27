import Link from 'next/link'
import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/services/costCalculator'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const estimate = await prisma.estimate.findUnique({
    where: { id },
    select: { name: true }
  })

  return {
    title: estimate ? `${estimate.name} | Estimates` : 'Estimate Not Found',
    description: estimate ? `View estimate: ${estimate.name}` : 'Estimate not found'
  }
}

export default async function EstimateDetailPage({ params }: PageProps) {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const { id } = await params

  const estimate = await prisma.estimate.findUnique({
    where: { id },
    include: {
      project: {
        select: { id: true, name: true, customerName: true }
      },
      createdBy: {
        select: { id: true, name: true, email: true }
      },
      lines: {
        orderBy: { lineNumber: 'asc' },
        include: {
          costItem: {
            select: { id: true, code: true, name: true, unit: true }
          }
        }
      }
    }
  })

  if (!estimate) {
    notFound()
  }

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
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <Link href="/dashboard/estimates" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)' }}>
              &larr; Back to Estimates
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-sm)' }}>
                {estimate.name}
              </h1>
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                <span style={{
                  padding: 'var(--space-xs) var(--space-sm)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  backgroundColor: getStatusColor(estimate.status),
                  color: 'white'
                }}>
                  {estimate.status}
                </span>
                {estimate.customerName && (
                  <span style={{ opacity: 0.9 }}>Customer: {estimate.customerName}</span>
                )}
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold' }}>
              {formatCurrency(estimate.total)}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)' }}>
        <div className="container">
          {/* Summary Cards */}
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
                Subtotal
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>
                {formatCurrency(estimate.subtotal)}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                Markup ({(estimate.markupPercent * 100).toFixed(0)}%)
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>
                {formatCurrency(estimate.markupAmount)}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                Tax ({(estimate.taxPercent * 100).toFixed(0)}%)
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>
                {formatCurrency(estimate.taxAmount)}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              borderLeft: '4px solid var(--color-secondary)'
            }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
                Total
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
                {formatCurrency(estimate.total)}
              </div>
            </div>
          </div>

          {/* Estimate Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)' }}>Estimate Details</h3>
              <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Created By:</span>
                  <span>{estimate.createdBy.name || estimate.createdBy.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Created:</span>
                  <span>{new Date(estimate.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Updated:</span>
                  <span>{new Date(estimate.updatedAt).toLocaleDateString()}</span>
                </div>
                {estimate.validUntil && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Valid Until:</span>
                    <span>{new Date(estimate.validUntil).toLocaleDateString()}</span>
                  </div>
                )}
                {estimate.project && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Project:</span>
                    <Link href={`/dashboard/projects/${estimate.project.id}`} style={{ color: 'var(--color-primary)' }}>
                      {estimate.project.name}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)' }}>Customer Information</h3>
              <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Name:</span>
                  <span>{estimate.customerName || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Email:</span>
                  <span>{estimate.customerEmail || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Phone:</span>
                  <span>{estimate.customerPhone || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--bg-secondary)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 0 }}>
                Line Items ({estimate.lines.length})
              </h2>
            </div>

            {estimate.lines.length === 0 ? (
              <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                  No line items added yet
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-accent)' }}>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600 }}>#</th>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Description</th>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Qty</th>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Unit</th>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Unit Cost</th>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Labor</th>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Equipment</th>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Materials</th>
                      <th style={{ padding: 'var(--space-md)', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimate.lines.map(line => (
                      <tr key={line.id} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                        <td style={{ padding: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                          {line.lineNumber}
                        </td>
                        <td style={{ padding: 'var(--space-md)' }}>
                          <div style={{ fontWeight: 500 }}>{line.description}</div>
                          {line.costItem && (
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                              {line.costItem.code} - {line.costItem.name}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: 'var(--space-md)', textAlign: 'right' }}>
                          {line.quantity.toLocaleString()}
                        </td>
                        <td style={{ padding: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                          {line.unit}
                        </td>
                        <td style={{ padding: 'var(--space-md)', textAlign: 'right' }}>
                          {formatCurrency(line.unitCost)}
                        </td>
                        <td style={{ padding: 'var(--space-md)', textAlign: 'right', color: 'var(--text-secondary)' }}>
                          {formatCurrency(line.laborCost)}
                        </td>
                        <td style={{ padding: 'var(--space-md)', textAlign: 'right', color: 'var(--text-secondary)' }}>
                          {formatCurrency(line.equipmentCost)}
                        </td>
                        <td style={{ padding: 'var(--space-md)', textAlign: 'right', color: 'var(--text-secondary)' }}>
                          {formatCurrency(line.materialCost)}
                        </td>
                        <td style={{ padding: 'var(--space-md)', textAlign: 'right', fontWeight: 600 }}>
                          {formatCurrency(line.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ backgroundColor: 'var(--bg-accent)' }}>
                      <td colSpan={8} style={{ padding: 'var(--space-md)', textAlign: 'right', fontWeight: 600 }}>
                        Subtotal:
                      </td>
                      <td style={{ padding: 'var(--space-md)', textAlign: 'right', fontWeight: 600 }}>
                        {formatCurrency(estimate.subtotal)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={8} style={{ padding: 'var(--space-md)', textAlign: 'right', color: 'var(--text-secondary)' }}>
                        Markup ({(estimate.markupPercent * 100).toFixed(0)}%):
                      </td>
                      <td style={{ padding: 'var(--space-md)', textAlign: 'right' }}>
                        {formatCurrency(estimate.markupAmount)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={8} style={{ padding: 'var(--space-md)', textAlign: 'right', color: 'var(--text-secondary)' }}>
                        Tax ({(estimate.taxPercent * 100).toFixed(0)}%):
                      </td>
                      <td style={{ padding: 'var(--space-md)', textAlign: 'right' }}>
                        {formatCurrency(estimate.taxAmount)}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: 'var(--bg-accent)' }}>
                      <td colSpan={8} style={{ padding: 'var(--space-md)', textAlign: 'right', fontWeight: 'bold', fontSize: 'var(--text-lg)' }}>
                        Total:
                      </td>
                      <td style={{ padding: 'var(--space-md)', textAlign: 'right', fontWeight: 'bold', fontSize: 'var(--text-lg)', color: 'var(--color-secondary)' }}>
                        {formatCurrency(estimate.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Notes & Terms */}
          {(estimate.notes || estimate.terms || estimate.description) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-lg)',
              marginTop: 'var(--space-2xl)'
            }}>
              {estimate.description && (
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  padding: 'var(--space-lg)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)' }}>Description</h3>
                  <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{estimate.description}</p>
                </div>
              )}
              {estimate.notes && (
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  padding: 'var(--space-lg)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)' }}>Notes</h3>
                  <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{estimate.notes}</p>
                </div>
              )}
              {estimate.terms && (
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  padding: 'var(--space-lg)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)' }}>Terms & Conditions</h3>
                  <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{estimate.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
