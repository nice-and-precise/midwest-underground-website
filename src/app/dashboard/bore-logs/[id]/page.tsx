import Link from 'next/link'
import { notFound } from 'next/navigation'

// Mock data - will be replaced with API call
const mockBoreLog = {
  id: 1,
  date: '2025-10-20',
  project: 'Willmar Fiber Network - Phase 2',
  location: 'County Rd 5 & Hwy 12',
  totalDepth: '485 ft',
  rodCount: 97,
  status: 'Completed',
  crew: 'Crew A - John Smith',
  equipment: 'Ditch Witch JT40',
  startTime: '07:30 AM',
  endTime: '04:15 PM',
  weather: 'Sunny, 68°F',
  soilType: 'Clay/Sand Mix',
  notes: 'Smooth operation. No obstacles encountered. Fiber conduit installed successfully.',

  // Rod-by-rod data
  rods: [
    { rodNumber: 1, depth: 5, soilType: 'Topsoil', fluidPressure: 150, notes: 'Entry point' },
    { rodNumber: 2, depth: 10, soilType: 'Clay', fluidPressure: 180, notes: '' },
    { rodNumber: 3, depth: 15, soilType: 'Clay', fluidPressure: 190, notes: '' },
    { rodNumber: 4, depth: 20, soilType: 'Sand', fluidPressure: 160, notes: 'Soil change' },
    { rodNumber: 5, depth: 25, soilType: 'Sand', fluidPressure: 155, notes: '' },
    // ... would continue for all 97 rods
  ]
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return {
    title: `Bore Log #${id} | Dashboard`,
    description: `Detailed bore log information for bore ${id}`
  }
}

export default async function BoreLogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // In real app, fetch data based on params.id
  // const boreLog = await fetchBoreLog(params.id)
  // if (!boreLog) notFound()

  const boreLog = mockBoreLog

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
            <Link href="/dashboard/bore-logs" style={{color: 'var(--white)', opacity: 0.8, fontSize: 'var(--text-sm)'}}>
              ← Back to Bore Logs
            </Link>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)'}}>
            <div>
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>
                Bore Log #{id}
              </h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>{boreLog.project}</p>
            </div>
            <div style={{display: 'flex', gap: 'var(--space-sm)'}}>
              <button className="btn btn-white">Edit Log</button>
              <button className="btn btn-outline" style={{borderColor: 'var(--white)', color: 'var(--white)'}}>
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Log Overview */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)'
          }}>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Date</p>
              <p style={{fontSize: 'var(--text-xl)', fontWeight: 600}}>{boreLog.date}</p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Location</p>
              <p style={{fontSize: 'var(--text-xl)', fontWeight: 600}}>{boreLog.location}</p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Total Depth</p>
              <p style={{fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-primary)'}}>{boreLog.totalDepth}</p>
            </div>
            <div style={{backgroundColor: 'var(--bg-card)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Rod Count</p>
              <p style={{fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-secondary)'}}>{boreLog.rodCount}</p>
            </div>
          </div>

          {/* Details Card */}
          <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-2xl)'}}>
            <h2 style={{marginBottom: 'var(--space-lg)'}}>Operation Details</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)'}}>
              <div>
                <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Crew</p>
                <p style={{fontWeight: 600}}>{boreLog.crew}</p>
              </div>
              <div>
                <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Equipment</p>
                <p style={{fontWeight: 600}}>{boreLog.equipment}</p>
              </div>
              <div>
                <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Start Time</p>
                <p style={{fontWeight: 600}}>{boreLog.startTime}</p>
              </div>
              <div>
                <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>End Time</p>
                <p style={{fontWeight: 600}}>{boreLog.endTime}</p>
              </div>
              <div>
                <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Weather</p>
                <p style={{fontWeight: 600}}>{boreLog.weather}</p>
              </div>
              <div>
                <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Soil Type</p>
                <p style={{fontWeight: 600}}>{boreLog.soilType}</p>
              </div>
              <div>
                <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Status</p>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  backgroundColor: 'var(--success)',
                  color: 'var(--white)'
                }}>
                  {boreLog.status}
                </span>
              </div>
            </div>

            <div style={{marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--bg-secondary)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Notes</p>
              <p>{boreLog.notes}</p>
            </div>
          </div>

          {/* Rod-by-Rod Data */}
          <div style={{backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden'}}>
            <div style={{padding: 'var(--space-xl)', borderBottom: '2px solid var(--bg-secondary)'}}>
              <h2>Rod-by-Rod Log</h2>
              <p style={{color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-xs)'}}>
                Showing first 5 rods of {boreLog.rodCount} total
              </p>
            </div>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)'}}>
                <thead>
                  <tr style={{backgroundColor: 'var(--bg-secondary)'}}>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Rod #</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Depth (ft)</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Soil Type</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Fluid Pressure (PSI)</th>
                    <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {boreLog.rods.map((rod, index) => (
                    <tr key={rod.rodNumber} style={{borderBottom: index < boreLog.rods.length - 1 ? '1px solid var(--bg-secondary)' : 'none'}}>
                      <td style={{padding: 'var(--space-md)', fontWeight: 600}}>{rod.rodNumber}</td>
                      <td style={{padding: 'var(--space-md)'}}>{rod.depth} ft</td>
                      <td style={{padding: 'var(--space-md)'}}>{rod.soilType}</td>
                      <td style={{padding: 'var(--space-md)'}}>{rod.fluidPressure} PSI</td>
                      <td style={{padding: 'var(--space-md)', color: 'var(--text-secondary)'}}>{rod.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{padding: 'var(--space-md)', backgroundColor: 'var(--bg-secondary)', textAlign: 'center'}}>
              <button className="btn btn-outline btn-sm">Load All Rods</button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
