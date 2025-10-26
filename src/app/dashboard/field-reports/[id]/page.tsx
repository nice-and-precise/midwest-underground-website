import Link from 'next/link'
import { notFound } from 'next/navigation'

// Mock data - will be replaced with API call
const mockFieldReport = {
  id: 1,
  date: '2025-10-22',
  project: 'Willmar Fiber Network - Phase 2',
  projectId: 1,
  crew: 'Crew A - John Smith',
  location: 'County Rd 5 & Hwy 12',
  status: 'Submitted',
  submittedBy: 'John Smith',
  submittedAt: '2025-10-22 16:45',

  workPerformed: {
    startTime: '07:30 AM',
    endTime: '04:15 PM',
    totalHours: 8.75,
    breakTime: 0.5,
    workingHours: 8.25,
    description: 'Completed horizontal directional drilling for fiber optic conduit installation. Bored 485 feet from entry pit to exit pit along County Rd 5. Used Ditch Witch JT40 with standard 5-inch drill head. Encountered clay and sand mix soil conditions. Installed 2-inch HDPE conduit for fiber cable.',
  },

  equipment: [
    { name: 'Ditch Witch JT40', hours: 8.5, operator: 'Mike Johnson' },
    { name: 'Vacuum Excavator', hours: 2.0, operator: 'Dave Anderson' },
    { name: 'Support Truck', hours: 8.5, operator: 'Tom Wilson' }
  ],

  crew: [
    { name: 'John Smith', role: 'Crew Lead', hours: 8.75 },
    { name: 'Mike Johnson', role: 'Operator', hours: 8.75 },
    { name: 'Dave Anderson', role: 'Locator', hours: 8.75 },
    { name: 'Tom Wilson', role: 'Laborer', hours: 8.75 }
  ],

  materials: [
    { item: '2" HDPE Conduit', quantity: 500, unit: 'ft', notes: 'Black DR11' },
    { item: 'Bentonite Drilling Fluid', quantity: 150, unit: 'gallons', notes: 'Mixed on-site' },
    { item: 'Pull Tape', quantity: 500, unit: 'ft', notes: '1/4 inch' },
    { item: 'Drill Rods', quantity: 97, unit: 'each', notes: '5 ft sections' }
  ],

  safetyObservations: {
    incidents: 0,
    nearMisses: 0,
    hazards: [
      'Traffic control maintained at road crossing',
      'Underground utilities marked and cleared',
      'Proper PPE worn by all crew members'
    ],
    notes: 'No safety incidents. All crew members attended morning safety briefing. Traffic control setup per DOT requirements. 811 locate tickets verified before drilling.'
  },

  weather: {
    condition: 'Sunny',
    temperature: '68°F',
    wind: 'Light, 5-10 mph',
    precipitation: 'None',
    impact: 'None - excellent working conditions'
  },

  progress: {
    planned: '450 ft',
    actual: '485 ft',
    variance: '+35 ft',
    percentComplete: 108,
    notes: 'Exceeded planned footage. Entry and exit pits dug. Conduit pulled successfully. Exit point surveyed and marked.'
  },

  issues: [],

  photos: [
    { filename: 'entry-pit-setup.jpg', caption: 'Entry pit setup and drill alignment', timestamp: '07:45 AM' },
    { filename: 'bore-in-progress.jpg', caption: 'Drilling operation in progress', timestamp: '10:30 AM' },
    { filename: 'exit-pit-breakthrough.jpg', caption: 'Successful breakthrough at exit pit', timestamp: '02:15 PM' },
    { filename: 'conduit-installation.jpg', caption: 'HDPE conduit pullback completed', timestamp: '03:45 PM' }
  ],

  signatures: {
    crewLead: { name: 'John Smith', signed: true, timestamp: '2025-10-22 16:30' },
    supervisor: { name: 'Mike Johnson', signed: true, timestamp: '2025-10-22 17:15' },
    client: { name: 'Tom Anderson', signed: false, timestamp: null }
  },

  notes: 'Smooth operation with no complications. Soil conditions were favorable. All equipment performed well. Team worked efficiently and safely. Client representative (Tom Anderson) visited site at 11:00 AM and expressed satisfaction with progress. Ready to proceed with fiber cable installation next week.'
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Field Report #${params.id} | Dashboard`,
    description: `Daily field report and work summary for report ${params.id}`
  }
}

export default function FieldReportDetailPage({ params }: { params: { id: string } }) {
  const report = mockFieldReport

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
            <Link href="/dashboard/field-reports" style={{color: 'var(--white)', opacity: 0.8, fontSize: 'var(--text-sm)'}}>
              ← Back to Field Reports
            </Link>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 'var(--space-md)'}}>
            <div>
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>
                Field Report #{params.id}
              </h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>{report.project} • {report.date}</p>
            </div>
            <div style={{display: 'flex', gap: 'var(--space-sm)'}}>
              <button className="btn btn-white">Edit Report</button>
              <button className="btn btn-outline" style={{borderColor: 'var(--white)', color: 'var(--white)'}}>
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Report Overview */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)'
          }}>
            <div style={{backgroundColor: 'var(--white)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Total Hours</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-primary)'}}>
                {report.workPerformed.totalHours}
              </p>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>
                {report.workPerformed.workingHours} working hours
              </p>
            </div>
            <div style={{backgroundColor: 'var(--white)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Progress</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-secondary)'}}>
                {report.progress.actual}
              </p>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--success)', marginTop: 'var(--space-xs)'}}>
                {report.progress.variance} vs planned
              </p>
            </div>
            <div style={{backgroundColor: 'var(--white)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Safety</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--success)'}}>
                {report.safetyObservations.incidents}
              </p>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>
                Incidents
              </p>
            </div>
            <div style={{backgroundColor: 'var(--white)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Status</p>
              <span style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                backgroundColor: 'var(--success)',
                color: 'var(--white)'
              }}>
                {report.status}
              </span>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-xl)'}}>
            {/* Left Column */}
            <div>
              {/* Work Performed */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Work Performed</h2>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)'}}>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Start Time</p>
                    <p style={{fontWeight: 600}}>{report.workPerformed.startTime}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>End Time</p>
                    <p style={{fontWeight: 600}}>{report.workPerformed.endTime}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Location</p>
                    <p style={{fontWeight: 600}}>{report.location}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Crew</p>
                    <p style={{fontWeight: 600}}>{report.crew}</p>
                  </div>
                </div>
                <div>
                  <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Description</p>
                  <p style={{lineHeight: 1.6}}>{report.workPerformed.description}</p>
                </div>
              </div>

              {/* Crew */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Crew</h2>
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)'}}>
                    <thead>
                      <tr style={{backgroundColor: 'var(--bg-secondary)'}}>
                        <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Name</th>
                        <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Role</th>
                        <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.crew.map((member, index) => (
                        <tr key={index} style={{borderBottom: index < report.crew.length - 1 ? '1px solid var(--bg-secondary)' : 'none'}}>
                          <td style={{padding: 'var(--space-md)', fontWeight: 600}}>{member.name}</td>
                          <td style={{padding: 'var(--space-md)'}}>{member.role}</td>
                          <td style={{padding: 'var(--space-md)'}}>{member.hours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Equipment */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Equipment Used</h2>
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)'}}>
                    <thead>
                      <tr style={{backgroundColor: 'var(--bg-secondary)'}}>
                        <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Equipment</th>
                        <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Operator</th>
                        <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.equipment.map((item, index) => (
                        <tr key={index} style={{borderBottom: index < report.equipment.length - 1 ? '1px solid var(--bg-secondary)' : 'none'}}>
                          <td style={{padding: 'var(--space-md)', fontWeight: 600}}>{item.name}</td>
                          <td style={{padding: 'var(--space-md)'}}>{item.operator}</td>
                          <td style={{padding: 'var(--space-md)'}}>{item.hours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Materials */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Materials Used</h2>
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)'}}>
                    <thead>
                      <tr style={{backgroundColor: 'var(--bg-secondary)'}}>
                        <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Item</th>
                        <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Quantity</th>
                        <th style={{padding: 'var(--space-md)', textAlign: 'left', fontWeight: 600}}>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.materials.map((material, index) => (
                        <tr key={index} style={{borderBottom: index < report.materials.length - 1 ? '1px solid var(--bg-secondary)' : 'none'}}>
                          <td style={{padding: 'var(--space-md)', fontWeight: 600}}>{material.item}</td>
                          <td style={{padding: 'var(--space-md)'}}>{material.quantity} {material.unit}</td>
                          <td style={{padding: 'var(--space-md)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>{material.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Weather */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Weather Conditions</h2>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)'}}>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Condition</p>
                    <p style={{fontWeight: 600}}>{report.weather.condition}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Temperature</p>
                    <p style={{fontWeight: 600}}>{report.weather.temperature}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Wind</p>
                    <p style={{fontWeight: 600}}>{report.weather.wind}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Precipitation</p>
                    <p style={{fontWeight: 600}}>{report.weather.precipitation}</p>
                  </div>
                </div>
                <div style={{marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--bg-secondary)'}}>
                  <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Impact on Work</p>
                  <p>{report.weather.impact}</p>
                </div>
              </div>

              {/* Safety */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Safety Observations</h2>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)'}}>
                  <div style={{
                    padding: 'var(--space-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}>
                    <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--success)'}}>{report.safetyObservations.incidents}</p>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>Incidents</p>
                  </div>
                  <div style={{
                    padding: 'var(--space-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}>
                    <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--warning)'}}>{report.safetyObservations.nearMisses}</p>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>Near Misses</p>
                  </div>
                </div>
                <div>
                  <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Hazards & Controls</p>
                  <ul style={{paddingLeft: 'var(--space-lg)', marginBottom: 'var(--space-md)'}}>
                    {report.safetyObservations.hazards.map((hazard, idx) => (
                      <li key={idx} style={{marginBottom: 'var(--space-xs)'}}>{hazard}</li>
                    ))}
                  </ul>
                  <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Notes</p>
                  <p style={{lineHeight: 1.6}}>{report.safetyObservations.notes}</p>
                </div>
              </div>

              {/* Signatures */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Signatures</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {Object.entries(report.signatures).map(([role, sig]) => (
                    <div key={role} style={{
                      padding: 'var(--space-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: `4px solid ${sig.signed ? 'var(--success)' : 'var(--warning)'}`
                    }}>
                      <p style={{fontWeight: 600, textTransform: 'capitalize'}}>{role.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px'}}>
                        {sig.name}
                      </p>
                      {sig.signed ? (
                        <p style={{fontSize: 'var(--text-sm)', color: 'var(--success)', marginTop: '4px'}}>
                          ✓ Signed {sig.timestamp}
                        </p>
                      ) : (
                        <p style={{fontSize: 'var(--text-sm)', color: 'var(--warning)', marginTop: '4px'}}>
                          Pending signature
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Photos ({report.photos.length})</h2>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)'}}>
                  {report.photos.map((photo, idx) => (
                    <div key={idx} style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-md)'
                    }}>
                      <div style={{
                        width: '100%',
                        height: '120px',
                        backgroundColor: 'var(--bg-accent)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: 'var(--space-xs)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-secondary)'
                      }}>
                        📷
                      </div>
                      <p style={{fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '4px'}}>{photo.caption}</p>
                      <p style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>{photo.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {report.notes && (
            <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginTop: 'var(--space-xl)'}}>
              <h2 style={{marginBottom: 'var(--space-lg)'}}>Additional Notes</h2>
              <p style={{lineHeight: 1.6}}>{report.notes}</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
