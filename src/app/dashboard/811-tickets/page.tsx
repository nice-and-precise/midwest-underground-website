import Link from 'next/link'

export const metadata = {
  title: '811 Compliance | Dashboard',
  description: 'Track utility locate tickets, expiration dates, and compliance'
}

const mockTickets = [
  {
    id: 1,
    ticketNumber: '25-10-1234567',
    project: 'Willmar Fiber Network - Phase 2',
    location: 'County Rd 5 & Hwy 12',
    requestDate: '2025-10-18',
    expirationDate: '2025-10-28',
    status: 'Active',
    daysRemaining: 5,
    responseReceived: true
  },
  {
    id: 2,
    ticketNumber: '25-10-1234568',
    project: 'CenturyLink Expansion',
    location: '1st St & Main Ave',
    requestDate: '2025-10-20',
    expirationDate: '2025-10-30',
    status: 'Active',
    daysRemaining: 7,
    responseReceived: true
  },
  {
    id: 3,
    ticketNumber: '25-10-1234566',
    project: 'Rural Electric Co-op',
    location: 'Township Rd 42',
    requestDate: '2025-10-15',
    expirationDate: '2025-10-25',
    status: 'Expiring Soon',
    daysRemaining: 2,
    responseReceived: true
  },
  {
    id: 4,
    ticketNumber: '25-10-1234565',
    project: 'City Water Main',
    location: '3rd St & Oak Dr',
    requestDate: '2025-10-10',
    expirationDate: '2025-10-20',
    status: 'Expired',
    daysRemaining: 0,
    responseReceived: true
  }
]

export default function TicketsPage() {
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
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>811 Compliance Tracking</h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>Utility locate tickets and expiration monitoring</p>
            </div>
            <Link href="/dashboard/811-tickets/new" className="btn btn-white btn-lg">+ New Ticket</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Alert for expiring tickets */}
          <div style={{
            padding: 'var(--space-lg)',
            backgroundColor: '#FEF3C7',
            border: '2px solid #F59E0B',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-xl)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)'
          }}>
            <span style={{fontSize: 'var(--text-2xl)'}}>⚠️</span>
            <div>
              <p style={{fontWeight: 600, color: '#92400E', marginBottom: '4px'}}>Attention Required</p>
              <p style={{color: '#78350F', fontSize: 'var(--text-sm)'}}>1 ticket expiring within 2 days, 1 ticket expired - renewal required</p>
            </div>
          </div>

          <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden'}}>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)'}}>
                <thead>
                  <tr style={{backgroundColor: 'var(--bg-secondary)', borderBottom: '2px solid var(--bg-primary)'}}>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Ticket #</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Project</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Location</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Request Date</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Expiration</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Days Left</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Status</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTickets.map((ticket, index) => (
                    <tr key={ticket.id} style={{
                      borderBottom: index < mockTickets.length - 1 ? '1px solid var(--bg-secondary)' : 'none',
                      backgroundColor: ticket.status === 'Expired' ? '#FEE2E2' : ticket.status === 'Expiring Soon' ? '#FEF3C7' : 'transparent'
                    }}>
                      <td style={{padding: 'var(--space-md)', fontWeight: 600, fontFamily: 'monospace'}}>{ticket.ticketNumber}</td>
                      <td style={{padding: 'var(--space-md)'}}>{ticket.project}</td>
                      <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>{ticket.location}</td>
                      <td style={{padding: 'var(--space-md)'}}>{ticket.requestDate}</td>
                      <td style={{padding: 'var(--space-md)', fontWeight: 600}}>{ticket.expirationDate}</td>
                      <td style={{padding: 'var(--space-md)'}}>
                        <span style={{
                          fontWeight: 600,
                          color: ticket.daysRemaining === 0 ? '#DC2626' : ticket.daysRemaining <= 2 ? '#F59E0B' : 'var(--success)'
                        }}>
                          {ticket.daysRemaining} days
                        </span>
                      </td>
                      <td style={{padding: 'var(--space-md)'}}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          backgroundColor: ticket.status === 'Active' ? 'var(--success)' : ticket.status === 'Expiring Soon' ? '#F59E0B' : '#DC2626',
                          color: 'var(--white)'
                        }}>
                          {ticket.status}
                        </span>
                      </td>
                      <td style={{padding: 'var(--space-md)'}}>
                        {ticket.status === 'Expired' || ticket.status === 'Expiring Soon' ? (
                          <Link href={`/dashboard/811-tickets/${ticket.id}/renew`} style={{color: '#DC2626', fontWeight: 600}}>Renew →</Link>
                        ) : (
                          <Link href={`/dashboard/811-tickets/${ticket.id}`} style={{color: 'var(--color-primary)', fontWeight: 600}}>View →</Link>
                        )}
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
