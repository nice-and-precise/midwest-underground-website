import Link from 'next/link'

export const metadata = {
  title: 'Customers | Dashboard',
  description: 'Client information and project history management'
}

const mockCustomers = [
  {
    id: 1,
    name: 'Willmar Municipal Utilities',
    type: 'Municipal',
    contact: 'Tom Anderson',
    email: 'tanderson@willmarmu.gov',
    phone: '(320) 235-4200',
    activeProjects: 2,
    totalProjects: 8,
    totalRevenue: '$1.2M',
    status: 'Active'
  },
  {
    id: 2,
    name: 'CenturyLink',
    type: 'Telecommunications',
    contact: 'Lisa Martinez',
    email: 'lisa.martinez@centurylink.com',
    phone: '(612) 555-0123',
    activeProjects: 1,
    totalProjects: 12,
    totalRevenue: '$2.1M',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Kandiyohi Power Cooperative',
    type: 'Electric Utility',
    contact: 'Dave Peterson',
    email: 'dpeterson@kandipowerco-op.com',
    phone: '(320) 231-3111',
    activeProjects: 1,
    totalProjects: 15,
    totalRevenue: '$3.5M',
    status: 'Active'
  },
  {
    id: 4,
    name: 'City of Willmar',
    type: 'Municipal',
    contact: 'Jennifer Lee',
    email: 'jlee@willmarmn.gov',
    phone: '(320) 235-4100',
    activeProjects: 0,
    totalProjects: 6,
    totalRevenue: '$850K',
    status: 'Inactive'
  }
]

export default function CustomersPage() {
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
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>Customers</h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>Client information and project history</p>
            </div>
            <Link href="/dashboard/customers/new" className="btn btn-white btn-lg">+ New Customer</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="services-grid">
            {mockCustomers.map(customer => (
              <div key={customer.id} style={{
                backgroundColor: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                padding: 'var(--space-lg)',
                border: '2px solid var(--bg-secondary)'
              }}>
                <div style={{marginBottom: 'var(--space-md)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-xs)'}}>
                    <h3 style={{fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)'}}>{customer.name}</h3>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      backgroundColor: customer.status === 'Active' ? 'var(--success)' : 'var(--bg-accent)',
                      color: 'var(--white)'
                    }}>
                      {customer.status}
                    </span>
                  </div>
                  <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-sm)'}}>{customer.type}</p>
                </div>

                <div style={{marginBottom: 'var(--space-md)', fontSize: 'var(--text-sm)'}}>
                  <div style={{marginBottom: 'var(--space-xs)'}}>
                    <span style={{fontWeight: 600}}>{customer.contact}</span>
                  </div>
                  <div style={{color: 'var(--text-secondary)', marginBottom: '2px'}}>
                    <a href={`mailto:${customer.email}`} style={{color: 'var(--color-primary)'}}>{customer.email}</a>
                  </div>
                  <div style={{color: 'var(--text-secondary)'}}>
                    <a href={`tel:${customer.phone}`} style={{color: 'var(--color-primary)'}}>{customer.phone}</a>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-md)',
                  fontSize: 'var(--text-sm)',
                  paddingTop: 'var(--space-md)',
                  borderTop: '1px solid var(--bg-secondary)'
                }}>
                  <div>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '2px'}}>Active Projects</p>
                    <p style={{fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--color-secondary)'}}>{customer.activeProjects}</p>
                  </div>
                  <div>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '2px'}}>Total Projects</p>
                    <p style={{fontWeight: 700, fontSize: 'var(--text-xl)'}}>{customer.totalProjects}</p>
                  </div>
                  <div style={{gridColumn: '1 / -1'}}>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '2px'}}>Total Revenue</p>
                    <p style={{fontWeight: 700, fontSize: 'var(--text-2xl)', color: 'var(--success)'}}>{customer.totalRevenue}</p>
                  </div>
                </div>

                <Link href={`/dashboard/customers/${customer.id}`} className="btn btn-primary" style={{width: '100%'}}>
                  View Profile →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
