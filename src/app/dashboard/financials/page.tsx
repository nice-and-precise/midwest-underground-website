import Link from 'next/link'

export const metadata = {
  title: 'Financials | Dashboard',
  description: 'Project costs, billing, and financial tracking'
}

const mockFinancials = [
  {
    id: 1,
    project: 'Willmar Fiber Network - Phase 2',
    budgeted: 245000,
    actual: 159250,
    variance: -85750,
    variancePercent: -35,
    invoiced: 180000,
    received: 180000,
    outstanding: 0,
    status: 'On Budget'
  },
  {
    id: 2,
    project: 'CenturyLink Expansion',
    budgeted: 180000,
    actual: 81000,
    variance: -99000,
    variancePercent: -55,
    invoiced: 90000,
    received: 90000,
    outstanding: 0,
    status: 'Under Budget'
  },
  {
    id: 3,
    project: 'Rural Electric Co-op',
    budgeted: 320000,
    actual: 340000,
    variance: 20000,
    variancePercent: 6.25,
    invoiced: 320000,
    received: 256000,
    outstanding: 64000,
    status: 'Over Budget'
  },
  {
    id: 4,
    project: 'City Water Main Extension',
    budgeted: 425000,
    actual: 0,
    variance: -425000,
    variancePercent: -100,
    invoiced: 0,
    received: 0,
    outstanding: 0,
    status: 'Not Started'
  }
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
}

export default function FinancialsPage() {
  const totalBudgeted = mockFinancials.reduce((sum, f) => sum + f.budgeted, 0)
  const totalActual = mockFinancials.reduce((sum, f) => sum + f.actual, 0)
  const totalInvoiced = mockFinancials.reduce((sum, f) => sum + f.invoiced, 0)
  const totalReceived = mockFinancials.reduce((sum, f) => sum + f.received, 0)
  const totalOutstanding = mockFinancials.reduce((sum, f) => sum + f.outstanding, 0)

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
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>Financial Overview</h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>Project costs, billing, and revenue tracking</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Financial Summary Cards */}
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
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Total Budgeted</div>
              <div style={{fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-primary)'}}>{formatCurrency(totalBudgeted)}</div>
            </div>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Total Spent</div>
              <div style={{fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-secondary)'}}>{formatCurrency(totalActual)}</div>
            </div>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Total Invoiced</div>
              <div style={{fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--success)'}}>{formatCurrency(totalInvoiced)}</div>
            </div>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Outstanding</div>
              <div style={{fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: '#DC2626'}}>{formatCurrency(totalOutstanding)}</div>
            </div>
          </div>

          {/* Financial Table */}
          <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden'}}>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)'}}>
                <thead>
                  <tr style={{backgroundColor: 'var(--bg-secondary)', borderBottom: '2px solid var(--bg-primary)'}}>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Project</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'right', fontWeight: 600}}>Budget</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'right', fontWeight: 600}}>Actual</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'right', fontWeight: 600}}>Variance</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'right', fontWeight: 600}}>Invoiced</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'right', fontWeight: 600}}>Received</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'right', fontWeight: 600}}>Outstanding</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockFinancials.map((fin, index) => (
                    <tr key={fin.id} style={{borderBottom: index < mockFinancials.length - 1 ? '1px solid var(--bg-secondary)' : 'none'}}>
                      <td style={{padding: 'var(--space-md)', fontWeight: 600}}>{fin.project}</td>
                      <td style={{padding: 'var(--space-md)', textAlign: 'right'}}>{formatCurrency(fin.budgeted)}</td>
                      <td style={{padding: 'var(--space-md)', textAlign: 'right'}}>{formatCurrency(fin.actual)}</td>
                      <td style={{padding: 'var(--space-md)', textAlign: 'right'}}>
                        <span style={{
                          fontWeight: 600,
                          color: fin.variance < 0 ? 'var(--success)' : fin.variance > 0 ? '#DC2626' : 'var(--text-primary)'
                        }}>
                          {formatCurrency(Math.abs(fin.variance))}
                          <span style={{fontSize: 'var(--text-xs)', marginLeft: '4px'}}>
                            ({fin.variancePercent > 0 ? '+' : ''}{fin.variancePercent}%)
                          </span>
                        </span>
                      </td>
                      <td style={{padding: 'var(--space-md)', textAlign: 'right'}}>{formatCurrency(fin.invoiced)}</td>
                      <td style={{padding: 'var(--space-md)', textAlign: 'right', color: 'var(--success)', fontWeight: 600}}>{formatCurrency(fin.received)}</td>
                      <td style={{padding: 'var(--space-md)', textAlign: 'right'}}>
                        <span style={{
                          fontWeight: 600,
                          color: fin.outstanding > 0 ? '#DC2626' : 'var(--text-secondary)'
                        }}>
                          {formatCurrency(fin.outstanding)}
                        </span>
                      </td>
                      <td style={{padding: 'var(--space-md)'}}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          backgroundColor:
                            fin.status === 'On Budget' || fin.status === 'Under Budget' ? 'var(--success)' :
                            fin.status === 'Over Budget' ? '#DC2626' :
                            'var(--bg-accent)',
                          color: 'var(--white)'
                        }}>
                          {fin.status}
                        </span>
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
