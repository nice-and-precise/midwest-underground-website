import Link from 'next/link'
import { notFound } from 'next/navigation'

// Mock data - will be replaced with API call
const mockCustomer = {
  id: 1,
  name: 'Willmar Municipal Utilities',
  contactPerson: 'Tom Anderson',
  email: 'tanderson@willmarmu.gov',
  phone: '(320) 235-4422',
  address: '333 6th St SW, Willmar, MN 56201',
  type: 'Municipal',
  status: 'Active',
  since: '2018-03-15',
  totalRevenue: 1245000,
  currentProjects: 2,
  completedProjects: 8,
  website: 'https://www.willmarmn.gov',

  projects: [
    {
      id: 1,
      name: 'Willmar Fiber Network - Phase 2',
      status: 'Active',
      startDate: '2025-09-15',
      endDate: '2025-11-30',
      budget: 245000,
      progress: 65
    },
    {
      id: 6,
      name: 'Downtown Fiber Loop',
      status: 'Active',
      startDate: '2025-10-10',
      endDate: '2025-12-20',
      budget: 180000,
      progress: 40
    },
    {
      id: 12,
      name: 'Willmar Fiber Network - Phase 1',
      status: 'Completed',
      startDate: '2024-05-01',
      endDate: '2024-08-30',
      budget: 320000,
      progress: 100
    }
  ],

  revenueHistory: [
    { year: 2025, revenue: 425000, projects: 2 },
    { year: 2024, revenue: 520000, projects: 4 },
    { year: 2023, revenue: 180000, projects: 2 },
    { year: 2022, revenue: 120000, projects: 2 }
  ],

  contacts: [
    { name: 'Tom Anderson', role: 'Project Manager', email: 'tanderson@willmarmu.gov', phone: '(320) 235-4422' },
    { name: 'Sarah Miller', role: 'Procurement Director', email: 'smiller@willmarmu.gov', phone: '(320) 235-4423' },
    { name: 'Bob Wilson', role: 'Engineering Lead', email: 'bwilson@willmarmu.gov', phone: '(320) 235-4424' }
  ],

  notes: [
    { date: '2025-10-20', user: 'System', note: 'Phase 2 project progressing ahead of schedule' },
    { date: '2025-10-15', user: 'John Smith', note: 'Met with Tom Anderson on-site to discuss expansion plans for 2026' },
    { date: '2025-09-30', user: 'System', note: 'Payment received for September invoice - $45,000' }
  ]
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: `Customer #${id} | Dashboard`,
    description: `Customer profile and project history for customer ${id}`
  }
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = mockCustomer

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
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
            <Link href="/dashboard/customers" style={{color: 'var(--white)', opacity: 0.8, fontSize: 'var(--text-sm)'}}>
              ← Back to Customers
            </Link>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 'var(--space-md)'}}>
            <div>
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>{customer.name}</h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>Customer since {new Date(customer.since).getFullYear()}</p>
            </div>
            <div style={{display: 'flex', gap: 'var(--space-sm)'}}>
              <button className="btn btn-white">Edit Customer</button>
              <button className="btn btn-outline" style={{borderColor: 'var(--white)', color: 'var(--white)'}}>
                View Invoices
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)'
          }}>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Total Revenue</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--success)'}}>
                {formatCurrency(customer.totalRevenue)}
              </p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Active Projects</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-secondary)'}}>
                {customer.currentProjects}
              </p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Completed</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-primary)'}}>
                {customer.completedProjects}
              </p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Customer Type</p>
              <p style={{fontSize: 'var(--text-xl)', fontWeight: 600}}>{customer.type}</p>
              <span style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                backgroundColor: 'var(--success)',
                color: 'var(--white)'
              }}>
                {customer.status}
              </span>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-xl)'}}>
            {/* Contact Information */}
            <div>
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Contact Information</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Primary Contact</p>
                    <p style={{fontWeight: 600}}>{customer.contactPerson}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Email</p>
                    <a href={`mailto:${customer.email}`} style={{color: 'var(--color-primary)'}}>{customer.email}</a>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Phone</p>
                    <a href={`tel:${customer.phone.replace(/\D/g, '')}`} style={{color: 'var(--color-primary)'}}>{customer.phone}</a>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Address</p>
                    <p>{customer.address}</p>
                  </div>
                  {customer.website && (
                    <div>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Website</p>
                      <a href={customer.website} target="_blank" rel="noopener noreferrer" style={{color: 'var(--color-primary)'}}>
                        {customer.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Contacts */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
                <h3 style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)'}}>Additional Contacts</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {customer.contacts.map((contact, idx) => (
                    <div key={idx} style={{
                      padding: 'var(--space-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <p style={{fontWeight: 600}}>{contact.name}</p>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>{contact.role}</p>
                      <p style={{fontSize: 'var(--text-sm)', marginTop: '4px'}}>
                        <a href={`mailto:${contact.email}`} style={{color: 'var(--color-primary)'}}>{contact.email}</a>
                      </p>
                      <p style={{fontSize: 'var(--text-sm)'}}>
                        <a href={`tel:${contact.phone.replace(/\D/g, '')}`} style={{color: 'var(--color-primary)'}}>{contact.phone}</a>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects & History */}
            <div>
              {/* Active Projects */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Projects</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {customer.projects.map((project) => (
                    <div key={project.id} style={{
                      padding: 'var(--space-md)',
                      borderLeft: `4px solid ${
                        project.status === 'Active' ? 'var(--color-secondary)' :
                        project.status === 'Completed' ? 'var(--success)' :
                        'var(--bg-accent)'
                      }`,
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-xs)'}}>
                        <Link href={`/dashboard/projects/${project.id}`} style={{fontWeight: 600, color: 'var(--color-primary)'}}>
                          {project.name}
                        </Link>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          backgroundColor: project.status === 'Active' ? 'var(--color-secondary)' : 'var(--success)',
                          color: 'var(--white)'
                        }}>
                          {project.status}
                        </span>
                      </div>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                        {project.startDate} to {project.endDate}
                      </p>
                      <p style={{fontSize: 'var(--text-sm)', fontWeight: 600}}>
                        Budget: {formatCurrency(project.budget)}
                      </p>
                      {project.status !== 'Completed' && (
                        <div style={{marginTop: 'var(--space-sm)'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '4px'}}>
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '6px',
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${project.progress}%`,
                              height: '100%',
                              backgroundColor: 'var(--color-secondary)',
                              transition: 'width var(--transition-base)'
                            }} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue History */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h3 style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)'}}>Revenue History</h3>
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)'}}>
                    <thead>
                      <tr style={{backgroundColor: 'var(--bg-secondary)'}}>
                        <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Year</th>
                        <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Revenue</th>
                        <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Projects</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customer.revenueHistory.map((year, index) => (
                        <tr key={year.year} style={{borderBottom: index < customer.revenueHistory.length - 1 ? '1px solid var(--bg-secondary)' : 'none'}}>
                          <td style={{padding: 'var(--space-md)', fontWeight: 600}}>{year.year}</td>
                          <td style={{padding: 'var(--space-md)', color: 'var(--success)', fontWeight: 600}}>
                            {formatCurrency(year.revenue)}
                          </td>
                          <td style={{padding: 'var(--space-md)'}}>{year.projects}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
                <h3 style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)'}}>Recent Notes</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {customer.notes.map((note, idx) => (
                    <div key={idx} style={{paddingBottom: 'var(--space-md)', borderBottom: idx < customer.notes.length - 1 ? '1px solid var(--bg-secondary)' : 'none'}}>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>
                        {note.date} • {note.user}
                      </p>
                      <p>{note.note}</p>
                    </div>
                  ))}
                </div>
                <button className="btn btn-outline btn-sm" style={{marginTop: 'var(--space-md)', width: '100%'}}>
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
