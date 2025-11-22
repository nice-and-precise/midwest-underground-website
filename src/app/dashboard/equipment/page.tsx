import Link from 'next/link'

export const metadata = {
  title: 'Equipment | Dashboard',
  description: 'Rig inventory, maintenance logs, and utilization tracking'
}

const mockEquipment = [
  {
    id: 1,
    name: 'Ditch Witch JT40',
    type: 'HDD Rig',
    serialNumber: 'DW-JT40-2019-1234',
    status: 'In Use',
    location: 'Willmar Fiber Network - Phase 2',
    lastMaintenance: '2025-09-15',
    nextMaintenance: '2025-11-15',
    hoursUsed: 2450,
    maintenanceStatus: 'Good'
  },
  {
    id: 2,
    name: 'Vermeer D24x40',
    type: 'HDD Rig',
    serialNumber: 'VER-D24-2020-5678',
    status: 'In Use',
    location: 'CenturyLink Expansion',
    lastMaintenance: '2025-10-01',
    nextMaintenance: '2025-12-01',
    hoursUsed: 1820,
    maintenanceStatus: 'Good'
  },
  {
    id: 3,
    name: 'Ditch Witch JT25',
    type: 'HDD Rig',
    serialNumber: 'DW-JT25-2018-9012',
    status: 'Available',
    location: 'Yard - Willmar',
    lastMaintenance: '2025-08-20',
    nextMaintenance: '2025-10-28',
    hoursUsed: 3150,
    maintenanceStatus: 'Due Soon'
  },
  {
    id: 4,
    name: 'Locator System Pro',
    type: 'Locating Equipment',
    serialNumber: 'LOC-PRO-2021-3456',
    status: 'In Maintenance',
    location: 'Service Center - Minneapolis',
    lastMaintenance: '2025-10-18',
    nextMaintenance: '2026-01-18',
    hoursUsed: 850,
    maintenanceStatus: 'In Service'
  }
]

export default function EquipmentPage() {
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
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>Equipment Inventory</h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>Rig tracking, maintenance logs, and utilization</p>
            </div>
            <Link href="/dashboard/equipment/new" className="btn btn-white btn-lg">+ Add Equipment</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Equipment Stats */}
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
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center'
            }}>
              <div style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--success)'}}>2</div>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>In Use</div>
            </div>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center'
            }}>
              <div style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-primary)'}}>1</div>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>Available</div>
            </div>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center'
            }}>
              <div style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#F59E0B'}}>1</div>
              <div style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>In Maintenance</div>
            </div>
          </div>

          {/* Equipment Cards */}
          <div className="services-grid">
            {mockEquipment.map(equip => (
              <div key={equip.id} style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                padding: 'var(--space-lg)',
                border: '2px solid var(--bg-secondary)'
              }}>
                <div style={{marginBottom: 'var(--space-md)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-xs)'}}>
                    <h3 style={{fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)'}}>{equip.name}</h3>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      backgroundColor: equip.status === 'In Use' ? 'var(--success)' : equip.status === 'Available' ? 'var(--color-primary)' : '#F59E0B',
                      color: 'var(--white)'
                    }}>
                      {equip.status}
                    </span>
                  </div>
                  <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-xs)'}}>{equip.type}</p>
                  <p style={{fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>{equip.serialNumber}</p>
                </div>

                <div style={{
                  marginBottom: 'var(--space-md)',
                  padding: 'var(--space-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-xs)'}}>
                    <span>📍</span>
                    <span style={{color: 'var(--text-secondary)'}}>{equip.location}</span>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-md)',
                  fontSize: 'var(--text-sm)'
                }}>
                  <div>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '2px'}}>Hours Used</p>
                    <p style={{fontWeight: 600}}>{equip.hoursUsed} hrs</p>
                  </div>
                  <div>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '2px'}}>Status</p>
                    <p style={{
                      fontWeight: 600,
                      color: equip.maintenanceStatus === 'Good' ? 'var(--success)' : equip.maintenanceStatus === 'Due Soon' ? '#F59E0B' : 'var(--text-primary)'
                    }}>
                      {equip.maintenanceStatus}
                    </p>
                  </div>
                  <div>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '2px'}}>Last Service</p>
                    <p style={{fontWeight: 600}}>{equip.lastMaintenance}</p>
                  </div>
                  <div>
                    <p style={{color: 'var(--text-secondary)', marginBottom: '2px'}}>Next Service</p>
                    <p style={{fontWeight: 600}}>{equip.nextMaintenance}</p>
                  </div>
                </div>

                <Link href={`/dashboard/equipment/${equip.id}`} className="btn btn-primary" style={{width: '100%'}}>
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
