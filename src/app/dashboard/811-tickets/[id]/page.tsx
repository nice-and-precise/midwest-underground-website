import Link from 'next/link'
import { notFound } from 'next/navigation'

// Mock data - will be replaced with API call
const mockTicket = {
  id: 1,
  ticketNumber: '25102200145-001',
  status: 'Active',
  type: 'Normal',
  workType: 'Directional Boring',
  digDate: '2025-10-25',
  expirationDate: '2025-11-08',
  daysRemaining: 3,

  requestor: {
    name: 'John Smith',
    company: 'Midwest Underground of Minnesota',
    phone: '(320) 382-6636',
    email: 'jsmith@midwestunderground.com',
    requestDate: '2025-10-22 09:15 AM'
  },

  location: {
    address: 'County Rd 5 & Hwy 12, Willmar, MN 56201',
    county: 'Kandiyohi',
    township: 'Willmar Township',
    coordinates: '45.1234° N, 95.0567° W',
    workArea: '500 ft linear bore along County Rd 5'
  },

  project: {
    id: 1,
    name: 'Willmar Fiber Network - Phase 2',
    client: 'Willmar Municipal Utilities',
    contactPerson: 'Tom Anderson',
    contactPhone: '(320) 235-4422'
  },

  utilities: [
    {
      company: 'Xcel Energy',
      type: 'Electric',
      marked: true,
      markDate: '2025-10-23',
      color: 'Red',
      contact: 'Mark Wilson',
      phone: '(800) 895-4999',
      notes: 'Primary electric service line marked at 4ft depth'
    },
    {
      company: 'CenterPoint Energy',
      type: 'Gas',
      marked: true,
      markDate: '2025-10-23',
      color: 'Yellow',
      contact: 'Sarah Johnson',
      phone: '(800) 245-7464',
      notes: 'Gas main marked at 3.5ft depth, 15ft south of planned bore path'
    },
    {
      company: 'Willmar Municipal Utilities',
      type: 'Water',
      marked: true,
      markDate: '2025-10-23',
      color: 'Blue',
      contact: 'Bob Stevens',
      phone: '(320) 235-4422',
      notes: '8-inch water main at 5ft depth'
    },
    {
      company: 'Century Link',
      type: 'Telecom',
      marked: true,
      markDate: '2025-10-23',
      color: 'Orange',
      contact: 'Dave Miller',
      phone: '(800) 244-1111',
      notes: 'Fiber optic cable in existing conduit at 2.5ft depth'
    },
    {
      company: 'Willmar Cable TV',
      type: 'Cable/CATV',
      marked: false,
      markDate: null,
      color: 'Orange',
      contact: 'N/A',
      phone: '(320) 235-1234',
      notes: 'No response - not in area per records'
    }
  ],

  documentation: [
    { name: 'Locate Request Receipt', type: 'PDF', uploadDate: '2025-10-22' },
    { name: 'Utility Map - Xcel Energy', type: 'PDF', uploadDate: '2025-10-23' },
    { name: 'Utility Map - CenterPoint', type: 'PDF', uploadDate: '2025-10-23' },
    { name: 'Site Photos - Pre-Mark', type: 'Images', uploadDate: '2025-10-22' },
    { name: 'Site Photos - Post-Mark', type: 'Images', uploadDate: '2025-10-23' }
  ],

  inspections: [
    {
      date: '2025-10-23',
      inspector: 'John Smith',
      status: 'Verified',
      notes: 'All utilities marked and verified in field. Photographed all markings. Safe to proceed with boring operation.'
    }
  ],

  notes: [
    {
      date: '2025-10-23 14:30',
      user: 'John Smith',
      note: 'All utilities located and marked. Field verification complete. Photos taken of all markings. Electric and gas lines are clear of planned bore path. Water main crosses bore path at station 2+50 - will bore 6ft depth to maintain 1ft clearance.'
    },
    {
      date: '2025-10-22 11:00',
      user: 'System',
      note: 'Locate request submitted to Gopher One Call. Ticket #25102200145-001 issued.'
    }
  ],

  workStatus: {
    started: true,
    startDate: '2025-10-25',
    completionDate: null,
    remarks: 'Boring operation in progress. All utilities verified before starting work.'
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return {
    title: `811 Ticket #${params.id} | Dashboard`,
    description: `Utility locate ticket details for ticket ${params.id}`
  }
}

export default async function Ticket811DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ticket = mockTicket

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'var(--success)'
      case 'Pending': return 'var(--warning)'
      case 'Expired': return 'var(--error)'
      default: return 'var(--bg-accent)'
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
          <div style={{marginBottom: 'var(--space-md)'}}>
            <Link href="/dashboard/811-tickets" style={{color: 'var(--white)', opacity: 0.8, fontSize: 'var(--text-sm)'}}>
              ← Back to 811 Tickets
            </Link>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 'var(--space-md)'}}>
            <div>
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>
                Ticket #{ticket.ticketNumber}
              </h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>{ticket.project.name}</p>
            </div>
            <div style={{display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap'}}>
              <span style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                backgroundColor: getStatusColor(ticket.status),
                color: 'var(--white)'
              }}>
                {ticket.status}
              </span>
              <span style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--white)'
              }}>
                {ticket.type}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Overview */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)'
          }}>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Dig Date</p>
              <p style={{fontSize: 'var(--text-xl)', fontWeight: 600}}>{ticket.digDate}</p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Expiration</p>
              <p style={{fontSize: 'var(--text-xl)', fontWeight: 600}}>{ticket.expirationDate}</p>
              <p style={{fontSize: 'var(--text-sm)', color: ticket.daysRemaining <= 3 ? 'var(--warning)' : 'var(--success)', marginTop: 'var(--space-xs)'}}>
                {ticket.daysRemaining} days remaining
              </p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Utilities Marked</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--success)'}}>
                {ticket.utilities.filter(u => u.marked).length}/{ticket.utilities.length}
              </p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Work Status</p>
              <p style={{fontSize: 'var(--text-lg)', fontWeight: 600, color: ticket.workStatus.started ? 'var(--color-secondary)' : 'var(--text-secondary)'}}>
                {ticket.workStatus.started ? 'In Progress' : 'Not Started'}
              </p>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-xl)'}}>
            {/* Left Column */}
            <div>
              {/* Location Information */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Location Information</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Address</p>
                    <p style={{fontWeight: 600}}>{ticket.location.address}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>County</p>
                    <p style={{fontWeight: 600}}>{ticket.location.county}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Township</p>
                    <p style={{fontWeight: 600}}>{ticket.location.township}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Coordinates</p>
                    <p style={{fontWeight: 600, fontFamily: 'monospace'}}>{ticket.location.coordinates}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Work Area</p>
                    <p>{ticket.location.workArea}</p>
                  </div>
                </div>
              </div>

              {/* Requestor Information */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Requestor Information</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Name</p>
                    <p style={{fontWeight: 600}}>{ticket.requestor.name}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Company</p>
                    <p style={{fontWeight: 600}}>{ticket.requestor.company}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Phone</p>
                    <a href={`tel:${ticket.requestor.phone.replace(/\D/g, '')}`} style={{color: 'var(--color-primary)'}}>
                      {ticket.requestor.phone}
                    </a>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Email</p>
                    <a href={`mailto:${ticket.requestor.email}`} style={{color: 'var(--color-primary)'}}>
                      {ticket.requestor.email}
                    </a>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Request Date</p>
                    <p>{ticket.requestor.requestDate}</p>
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Project Information</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Project</p>
                    <Link href={`/dashboard/projects/${ticket.project.id}`} style={{fontWeight: 600, color: 'var(--color-primary)'}}>
                      {ticket.project.name}
                    </Link>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Client</p>
                    <p style={{fontWeight: 600}}>{ticket.project.client}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Contact Person</p>
                    <p>{ticket.project.contactPerson}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Contact Phone</p>
                    <a href={`tel:${ticket.project.contactPhone.replace(/\D/g, '')}`} style={{color: 'var(--color-primary)'}}>
                      {ticket.project.contactPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Inspections */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Field Inspections</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {ticket.inspections.map((inspection, idx) => (
                    <div key={idx} style={{
                      padding: 'var(--space-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '4px solid var(--success)'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-xs)'}}>
                        <p style={{fontWeight: 600}}>{inspection.inspector}</p>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          backgroundColor: 'var(--success)',
                          color: 'var(--white)'
                        }}>
                          {inspection.status}
                        </span>
                      </div>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                        {inspection.date}
                      </p>
                      <p style={{fontSize: 'var(--text-sm)'}}>{inspection.notes}</p>
                    </div>
                  ))}
                </div>
                <button className="btn btn-outline btn-sm" style={{marginTop: 'var(--space-md)', width: '100%'}}>
                  Add Inspection
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Utilities */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Affected Utilities</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {ticket.utilities.map((utility, idx) => (
                    <div key={idx} style={{
                      padding: 'var(--space-md)',
                      borderLeft: `4px solid ${utility.marked ? 'var(--success)' : 'var(--warning)'}`,
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-xs)'}}>
                        <div>
                          <p style={{fontWeight: 600}}>{utility.company}</p>
                          <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>{utility.type}</p>
                        </div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          backgroundColor: utility.marked ? 'var(--success)' : 'var(--warning)',
                          color: 'var(--white)'
                        }}>
                          {utility.marked ? 'Marked' : 'Pending'}
                        </span>
                      </div>
                      <div style={{marginTop: 'var(--space-xs)', fontSize: 'var(--text-sm)'}}>
                        <p><strong>Mark Color:</strong> {utility.color}</p>
                        <p><strong>Contact:</strong> {utility.contact}</p>
                        <p><strong>Phone:</strong> <a href={`tel:${utility.phone.replace(/\D/g, '')}`} style={{color: 'var(--color-primary)'}}>{utility.phone}</a></p>
                        {utility.marked && utility.markDate && (
                          <p><strong>Marked:</strong> {utility.markDate}</p>
                        )}
                        {utility.notes && (
                          <p style={{marginTop: 'var(--space-xs)', color: 'var(--text-secondary)', fontStyle: 'italic'}}>
                            {utility.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documentation */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Documentation</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)'}}>
                  {ticket.documentation.map((doc, idx) => (
                    <div key={idx} style={{
                      padding: 'var(--space-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <p style={{fontWeight: 600}}>{doc.name}</p>
                        <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>
                          {doc.type} • {doc.uploadDate}
                        </p>
                      </div>
                      <button className="btn btn-outline btn-sm">View</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-outline btn-sm" style={{marginTop: 'var(--space-md)', width: '100%'}}>
                  Upload Document
                </button>
              </div>

              {/* Activity Log */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Activity Log</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {ticket.notes.map((note, idx) => (
                    <div key={idx} style={{
                      paddingBottom: 'var(--space-md)',
                      borderBottom: idx < ticket.notes.length - 1 ? '1px solid var(--bg-secondary)' : 'none'
                    }}>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>
                        {note.date} • {note.user}
                      </p>
                      <p style={{lineHeight: 1.6}}>{note.note}</p>
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
