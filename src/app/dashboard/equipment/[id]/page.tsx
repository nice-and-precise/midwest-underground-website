import Link from 'next/link'
import { notFound } from 'next/navigation'

// Mock data - will be replaced with API call
const mockEquipment = {
  id: 1,
  name: 'Ditch Witch JT40',
  type: 'Directional Drill',
  model: 'JT40',
  manufacturer: 'Ditch Witch',
  serialNumber: 'DW-2019-JT40-1247',
  year: 2019,
  status: 'Active',
  condition: 'Good',
  location: 'Willmar Shop',
  assignedTo: 'Crew A - John Smith',
  purchaseDate: '2019-04-15',
  purchasePrice: 285000,
  currentValue: 185000,

  specifications: {
    thrustPull: '40,000 lbs',
    pullback: '40,000 lbs',
    torque: '4,500 ft-lbs',
    rotationSpeed: '0-120 RPM',
    pipeCapacity: '2" - 16" diameter',
    maxDepth: '50 ft',
    length: '22 ft',
    width: '8.5 ft',
    weight: '18,500 lbs',
    engine: 'Caterpillar C7.1 ACERT (300 HP)',
    fuelCapacity: '100 gallons',
    hydraulicCapacity: '60 gallons'
  },

  operatingHours: {
    total: 3420,
    thisYear: 680,
    thisMonth: 95,
    average: 60 // per month
  },

  maintenanceHistory: [
    {
      date: '2025-10-15',
      type: 'Scheduled Maintenance',
      description: '500-hour service - Oil change, filter replacement, hydraulic inspection',
      hours: 3400,
      cost: 850,
      technician: 'Dave Anderson',
      status: 'Completed'
    },
    {
      date: '2025-09-20',
      type: 'Repair',
      description: 'Hydraulic hose replacement - main cylinder',
      hours: 3280,
      cost: 425,
      technician: 'Dave Anderson',
      status: 'Completed'
    },
    {
      date: '2025-08-10',
      type: 'Scheduled Maintenance',
      description: '250-hour service - Fluid check, greasing, inspection',
      hours: 3150,
      cost: 320,
      technician: 'Mike Johnson',
      status: 'Completed'
    },
    {
      date: '2025-07-05',
      type: 'Repair',
      description: 'Drill rod connector repair',
      hours: 3050,
      cost: 560,
      technician: 'Dave Anderson',
      status: 'Completed'
    }
  ],

  upcomingMaintenance: [
    {
      type: 'Scheduled Maintenance',
      description: '1000-hour service - Major inspection',
      dueHours: 4000,
      hoursRemaining: 580,
      estimatedCost: 1500
    },
    {
      type: 'Annual Inspection',
      description: 'DOT annual safety inspection',
      dueDate: '2026-04-15',
      estimatedCost: 450
    }
  ],

  projectHistory: [
    {
      id: 1,
      name: 'Willmar Fiber Network - Phase 2',
      startDate: '2025-09-15',
      endDate: '2025-11-30',
      status: 'Active',
      hoursUsed: 245
    },
    {
      id: 12,
      name: 'Willmar Fiber Network - Phase 1',
      startDate: '2024-05-01',
      endDate: '2024-08-30',
      status: 'Completed',
      hoursUsed: 420
    }
  ],

  documents: [
    { name: 'Owner\'s Manual', type: 'PDF', uploadDate: '2019-04-15' },
    { name: 'Service Records 2024', type: 'PDF', uploadDate: '2024-12-31' },
    { name: 'Inspection Certificate 2025', type: 'PDF', uploadDate: '2025-04-15' }
  ]
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: `Equipment #${id} | Dashboard`,
    description: `Equipment details and maintenance history for equipment ${id}`
  }
}

export default async function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const equipment = mockEquipment

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const utilizationRate = (equipment.operatingHours.thisMonth / equipment.operatingHours.average) * 100

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
            <Link href="/dashboard/equipment" style={{color: 'var(--white)', opacity: 0.8, fontSize: 'var(--text-sm)'}}>
              ← Back to Equipment
            </Link>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 'var(--space-md)'}}>
            <div>
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>{equipment.name}</h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>{equipment.manufacturer} {equipment.model} ({equipment.year})</p>
            </div>
            <div style={{display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap'}}>
              <span style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--white)'
              }}>
                {equipment.status}
              </span>
              <span style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                backgroundColor: 'var(--success)',
                color: 'var(--white)'
              }}>
                {equipment.condition}
              </span>
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
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Total Hours</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-primary)'}}>
                {equipment.operatingHours.total.toLocaleString()}
              </p>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>
                {equipment.operatingHours.thisYear} this year
              </p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>This Month</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-secondary)'}}>
                {equipment.operatingHours.thisMonth} hrs
              </p>
              <p style={{fontSize: 'var(--text-sm)', color: utilizationRate > 100 ? 'var(--warning)' : 'var(--success)', marginTop: 'var(--space-xs)'}}>
                {utilizationRate.toFixed(0)}% utilization
              </p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Current Value</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--success)'}}>
                {formatCurrency(equipment.currentValue)}
              </p>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>
                Purchased: {formatCurrency(equipment.purchasePrice)}
              </p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Assignment</p>
              <p style={{fontSize: 'var(--text-lg)', fontWeight: 600}}>{equipment.assignedTo}</p>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>
                {equipment.location}
              </p>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-xl)'}}>
            {/* Left Column */}
            <div>
              {/* Specifications */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Specifications</h2>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-md)'}}>
                  {Object.entries(equipment.specifications).map(([key, value]) => (
                    <div key={key}>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p style={{fontWeight: 600}}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Basic Information */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Equipment Information</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Serial Number</p>
                    <p style={{fontWeight: 600, fontFamily: 'monospace'}}>{equipment.serialNumber}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Purchase Date</p>
                    <p style={{fontWeight: 600}}>{equipment.purchaseDate}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Type</p>
                    <p style={{fontWeight: 600}}>{equipment.type}</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Maintenance */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Upcoming Maintenance</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {equipment.upcomingMaintenance.map((maintenance, idx) => (
                    <div key={idx} style={{
                      padding: 'var(--space-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '4px solid var(--warning)'
                    }}>
                      <p style={{fontWeight: 600}}>{maintenance.type}</p>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px'}}>
                        {maintenance.description}
                      </p>
                      {maintenance.dueHours && (
                        <p style={{fontSize: 'var(--text-sm)', marginTop: 'var(--space-xs)'}}>
                          Due at {maintenance.dueHours} hours ({maintenance.hoursRemaining} hours remaining)
                        </p>
                      )}
                      {maintenance.dueDate && (
                        <p style={{fontSize: 'var(--text-sm)', marginTop: 'var(--space-xs)'}}>
                          Due: {maintenance.dueDate}
                        </p>
                      )}
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--success)', fontWeight: 600, marginTop: 'var(--space-xs)'}}>
                        Est. Cost: {formatCurrency(maintenance.estimatedCost)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Maintenance History */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Maintenance History</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {equipment.maintenanceHistory.map((record, idx) => (
                    <div key={idx} style={{
                      padding: 'var(--space-md)',
                      borderLeft: `4px solid ${
                        record.type === 'Repair' ? 'var(--warning)' : 'var(--success)'
                      }`,
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-xs)'}}>
                        <p style={{fontWeight: 600}}>{record.type}</p>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          backgroundColor: 'var(--success)',
                          color: 'var(--white)'
                        }}>
                          {record.status}
                        </span>
                      </div>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>
                        {record.date} • {record.hours} hours
                      </p>
                      <p style={{fontSize: 'var(--text-sm)', marginBottom: 'var(--space-xs)'}}>
                        {record.description}
                      </p>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginTop: 'var(--space-xs)'}}>
                        <span style={{color: 'var(--text-secondary)'}}>Tech: {record.technician}</span>
                        <span style={{fontWeight: 600, color: 'var(--success)'}}>{formatCurrency(record.cost)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-outline btn-sm" style={{marginTop: 'var(--space-md)', width: '100%'}}>
                  View All Records
                </button>
              </div>

              {/* Project History */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Project History</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {equipment.projectHistory.map((project) => (
                    <div key={project.id} style={{
                      padding: 'var(--space-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)'
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
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>
                        {project.startDate} - {project.endDate}
                      </p>
                      <p style={{fontSize: 'var(--text-sm)', marginTop: 'var(--space-xs)'}}>
                        Hours Used: <strong>{project.hoursUsed}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Documents</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)'}}>
                  {equipment.documents.map((doc, idx) => (
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
                          {doc.type} • Uploaded {doc.uploadDate}
                        </p>
                      </div>
                      <button className="btn btn-outline btn-sm">Download</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-outline btn-sm" style={{marginTop: 'var(--space-md)', width: '100%'}}>
                  Upload Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
