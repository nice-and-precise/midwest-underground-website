import Link from 'next/link'
import { notFound } from 'next/navigation'

// Mock data - will be replaced with API call
const mockInspection = {
  id: 1,
  inspectionNumber: 'INS-2025-001-MU',
  date: '2025-10-23',
  time: '10:30 AM',
  type: 'Final Inspection',
  status: 'Passed',

  project: {
    id: 1,
    name: 'Willmar Fiber Network - Phase 2',
    client: 'Willmar Municipal Utilities'
  },

  location: {
    address: 'County Rd 5 & Hwy 12, Willmar, MN 56201',
    station: 'Station 2+50 to 5+35',
    gpsCoordinates: '45.1234° N, 95.0567° W'
  },

  inspector: {
    name: 'Tom Anderson',
    company: 'Willmar Municipal Utilities',
    title: 'Project Manager',
    license: 'MN-PE-12345',
    phone: '(320) 235-4422',
    email: 'tanderson@willmarmu.gov'
  },

  contractor: {
    company: 'Midwest Underground of Minnesota',
    representative: 'John Smith',
    phone: '(320) 382-6636',
    license: 'MN-C-98765'
  },

  workInspected: {
    description: 'Horizontal directional drilling for fiber optic conduit installation - 485 feet completed',
    workOrderNumber: 'WO-2025-102',
    permitNumber: 'KAN-2025-0145',
    scope: [
      'Entry pit excavation and setup',
      'Directional bore - 485 linear feet',
      '2-inch HDPE conduit installation',
      'Exit pit and pipe termination',
      'Site restoration and cleanup'
    ]
  },

  inspectionItems: [
    {
      category: 'Pre-Construction',
      items: [
        { item: '811 Locate Ticket Valid', result: 'Pass', notes: 'Ticket #25102200145-001, expires 11/08/2025' },
        { item: 'Utilities Marked & Verified', result: 'Pass', notes: 'All utilities located and field verified' },
        { item: 'Permits & Documentation', result: 'Pass', notes: 'All required permits on-site and current' },
        { item: 'Safety Plan Reviewed', result: 'Pass', notes: 'Site-specific safety plan in place' }
      ]
    },
    {
      category: 'Drilling Operations',
      items: [
        { item: 'Bore Path Alignment', result: 'Pass', notes: 'Within 6 inches of planned alignment' },
        { item: 'Depth Verification', result: 'Pass', notes: 'Maintained 6ft depth, 1ft+ clearance from utilities' },
        { item: 'Drilling Fluid Management', result: 'Pass', notes: 'No surface frac-out, proper containment' },
        { item: 'Rod Count Documentation', result: 'Pass', notes: '97 rods logged, matches bore length' }
      ]
    },
    {
      category: 'Conduit Installation',
      items: [
        { item: 'Conduit Size & Type', result: 'Pass', notes: '2-inch HDPE DR11 per specifications' },
        { item: 'Conduit Integrity', result: 'Pass', notes: 'No damage, proper fusion joints' },
        { item: 'Pull Tension Monitoring', result: 'Pass', notes: 'Max tension 8,500 lbs (within limits)' },
        { item: 'End Terminations', result: 'Pass', notes: 'Properly capped and sealed at both ends' }
      ]
    },
    {
      category: 'Site Conditions',
      items: [
        { item: 'Traffic Control', result: 'Pass', notes: 'DOT-compliant setup maintained throughout' },
        { item: 'Environmental Protection', result: 'Pass', notes: 'Erosion control measures in place' },
        { item: 'Site Cleanup', result: 'Pass', notes: 'Excess spoils removed, area graded' },
        { item: 'Surface Restoration', result: 'Pass', notes: 'Asphalt patches scheduled within 48 hours' }
      ]
    }
  ],

  measurements: {
    totalLength: '485 ft',
    averageDepth: '6.2 ft',
    minDepth: '5.8 ft',
    maxDepth: '6.5 ft',
    horizontalTolerance: '±4 inches',
    verticalTolerance: '±6 inches'
  },

  testResults: [
    {
      test: 'Mandrel Test',
      result: 'Pass',
      specification: '2-inch mandrel',
      actual: 'Mandrel passed full length',
      notes: 'No restrictions or deformations detected'
    },
    {
      test: 'Visual Inspection',
      result: 'Pass',
      specification: 'No visible damage',
      actual: 'Conduit intact',
      notes: 'Inspected at entry, exit, and during pullback'
    }
  ],

  deficiencies: [],

  photos: [
    { filename: 'entry-pit-final.jpg', caption: 'Completed entry pit with conduit termination', timestamp: '10:35 AM' },
    { filename: 'exit-pit-final.jpg', caption: 'Exit pit showing conduit installation', timestamp: '10:42 AM' },
    { filename: 'bore-path-markers.jpg', caption: 'Bore path alignment markers', timestamp: '10:50 AM' },
    { filename: 'site-restoration.jpg', caption: 'Site cleanup and restoration complete', timestamp: '11:15 AM' },
    { filename: 'traffic-control.jpg', caption: 'Traffic control setup per DOT standards', timestamp: '11:20 AM' }
  ],

  signatures: {
    inspector: {
      name: 'Tom Anderson',
      title: 'Project Manager / Inspector',
      signed: true,
      timestamp: '2025-10-23 11:45 AM',
      license: 'MN-PE-12345'
    },
    contractor: {
      name: 'John Smith',
      title: 'Crew Lead',
      signed: true,
      timestamp: '2025-10-23 11:50 AM'
    }
  },

  nextSteps: [
    'Complete asphalt patching at road crossing within 48 hours',
    'Submit as-built drawings showing actual bore path and depths',
    'Schedule fiber cable installation inspection',
    'Final site restoration inspection after paving complete'
  ],

  notes: 'Excellent work quality throughout project. Crew demonstrated strong attention to safety and quality standards. Bore path achieved within specified tolerances. All utilities protected with proper clearances maintained. Site left clean and safe. Contractor is approved to proceed with fiber cable installation phase.',

  attachments: [
    { name: 'Inspection Checklist (Completed)', type: 'PDF' },
    { name: 'Field Measurements Log', type: 'PDF' },
    { name: 'Photo Documentation', type: 'ZIP' },
    { name: 'Bore Log - Rod by Rod', type: 'PDF' },
    { name: 'As-Built Survey Data', type: 'PDF' }
  ]
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Inspection #${params.id} | Dashboard`,
    description: `Detailed inspection report and results for inspection ${params.id}`
  }
}

export default function InspectionDetailPage({ params }: { params: { id: string } }) {
  const inspection = mockInspection

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'var(--success)'
      case 'Pass': return 'var(--success)'
      case 'Failed': return 'var(--error)'
      case 'Fail': return 'var(--error)'
      case 'Conditional': return 'var(--warning)'
      case 'Pending': return 'var(--bg-accent)'
      default: return 'var(--text-secondary)'
    }
  }

  const totalItems = inspection.inspectionItems.reduce((sum, cat) => sum + cat.items.length, 0)
  const passedItems = inspection.inspectionItems.reduce(
    (sum, cat) => sum + cat.items.filter(item => item.result === 'Pass').length,
    0
  )

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
            <Link href="/dashboard/inspections" style={{color: 'var(--white)', opacity: 0.8, fontSize: 'var(--text-sm)'}}>
              ← Back to Inspections
            </Link>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 'var(--space-md)'}}>
            <div>
              <h1 style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>
                Inspection #{inspection.inspectionNumber}
              </h1>
              <p style={{fontSize: 'var(--text-lg)', opacity: 0.9}}>
                {inspection.type} • {inspection.date}
              </p>
            </div>
            <div style={{display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap'}}>
              <span style={{
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                backgroundColor: getStatusColor(inspection.status),
                color: 'var(--white)'
              }}>
                {inspection.status}
              </span>
              <button className="btn btn-white">Export PDF</button>
            </div>
          </div>
        </div>
      </section>

      {/* Inspection Overview */}
      <section className="section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-2xl)'
          }}>
            <div style={{backgroundColor: 'var(--white)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Items Inspected</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--color-primary)'}}>
                {totalItems}
              </p>
            </div>
            <div style={{backgroundColor: 'var(--white)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Pass Rate</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--success)'}}>
                {((passedItems / totalItems) * 100).toFixed(0)}%
              </p>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)'}}>
                {passedItems} of {totalItems}
              </p>
            </div>
            <div style={{backgroundColor: 'var(--white)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Deficiencies</p>
              <p style={{fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: inspection.deficiencies.length === 0 ? 'var(--success)' : 'var(--warning)'}}>
                {inspection.deficiencies.length}
              </p>
            </div>
            <div style={{backgroundColor: 'var(--white)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'}}>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)'}}>Inspector</p>
              <p style={{fontSize: 'var(--text-lg)', fontWeight: 600}}>{inspection.inspector.name}</p>
              <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px'}}>
                {inspection.inspector.company}
              </p>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-xl)'}}>
            {/* Left Column */}
            <div>
              {/* Project Information */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Project Information</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Project</p>
                    <Link href={`/dashboard/projects/${inspection.project.id}`} style={{fontWeight: 600, color: 'var(--color-primary)', fontSize: 'var(--text-lg)'}}>
                      {inspection.project.name}
                    </Link>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Client</p>
                    <p style={{fontWeight: 600}}>{inspection.project.client}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Location</p>
                    <p>{inspection.location.address}</p>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px'}}>
                      {inspection.location.station}
                    </p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Work Order</p>
                    <p style={{fontWeight: 600, fontFamily: 'monospace'}}>{inspection.workInspected.workOrderNumber}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Permit Number</p>
                    <p style={{fontWeight: 600, fontFamily: 'monospace'}}>{inspection.workInspected.permitNumber}</p>
                  </div>
                </div>
              </div>

              {/* Inspector Information */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Inspector</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Name</p>
                    <p style={{fontWeight: 600}}>{inspection.inspector.name}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Title</p>
                    <p>{inspection.inspector.title}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Company</p>
                    <p>{inspection.inspector.company}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>License</p>
                    <p style={{fontFamily: 'monospace'}}>{inspection.inspector.license}</p>
                  </div>
                  <div>
                    <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>Contact</p>
                    <p><a href={`tel:${inspection.inspector.phone.replace(/\D/g, '')}`} style={{color: 'var(--color-primary)'}}>{inspection.inspector.phone}</a></p>
                    <p><a href={`mailto:${inspection.inspector.email}`} style={{color: 'var(--color-primary)'}}>{inspection.inspector.email}</a></p>
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Measurements</h2>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)'}}>
                  {Object.entries(inspection.measurements).map(([key, value]) => (
                    <div key={key}>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '4px'}}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p style={{fontWeight: 600}}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Results */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Test Results</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {inspection.testResults.map((test, idx) => (
                    <div key={idx} style={{
                      padding: 'var(--space-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: `4px solid ${getStatusColor(test.result)}`
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-xs)'}}>
                        <p style={{fontWeight: 600}}>{test.test}</p>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          backgroundColor: getStatusColor(test.result),
                          color: 'var(--white)'
                        }}>
                          {test.result}
                        </span>
                      </div>
                      <div style={{fontSize: 'var(--text-sm)', marginTop: 'var(--space-xs)'}}>
                        <p><strong>Specification:</strong> {test.specification}</p>
                        <p><strong>Actual:</strong> {test.actual}</p>
                        {test.notes && (
                          <p style={{marginTop: 'var(--space-xs)', color: 'var(--text-secondary)', fontStyle: 'italic'}}>
                            {test.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Inspection Items */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Inspection Items</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)'}}>
                  {inspection.inspectionItems.map((category, catIdx) => (
                    <div key={catIdx}>
                      <h3 style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)', color: 'var(--color-primary)'}}>
                        {category.category}
                      </h3>
                      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)'}}>
                        {category.items.map((item, itemIdx) => (
                          <div key={itemIdx} style={{
                            padding: 'var(--space-md)',
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-sm)',
                            borderLeft: `3px solid ${getStatusColor(item.result)}`
                          }}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px'}}>
                              <p style={{fontWeight: 600, fontSize: 'var(--text-sm)'}}>{item.item}</p>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 600,
                                backgroundColor: getStatusColor(item.result),
                                color: 'var(--white)'
                              }}>
                                {item.result}
                              </span>
                            </div>
                            {item.notes && (
                              <p style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>
                                {item.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              {inspection.nextSteps.length > 0 && (
                <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                  <h2 style={{marginBottom: 'var(--space-lg)'}}>Next Steps</h2>
                  <ul style={{paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)'}}>
                    {inspection.nextSteps.map((step, idx) => (
                      <li key={idx} style={{lineHeight: 1.6}}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Photos */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Photo Documentation ({inspection.photos.length})</h2>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)'}}>
                  {inspection.photos.map((photo, idx) => (
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
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--text-3xl)'
                      }}>
                        📷
                      </div>
                      <p style={{fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '4px'}}>{photo.caption}</p>
                      <p style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>{photo.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signatures */}
              <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)'}}>
                <h2 style={{marginBottom: 'var(--space-lg)'}}>Signatures</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-md)'}}>
                  {Object.entries(inspection.signatures).map(([role, sig]) => (
                    <div key={role} style={{
                      padding: 'var(--space-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: `4px solid ${sig.signed ? 'var(--success)' : 'var(--warning)'}`
                    }}>
                      <p style={{fontWeight: 600, textTransform: 'capitalize', marginBottom: '4px'}}>
                        {role.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p style={{fontSize: 'var(--text-sm)'}}>{sig.name}</p>
                      <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>{sig.title}</p>
                      {sig.license && (
                        <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontFamily: 'monospace'}}>
                          {sig.license}
                        </p>
                      )}
                      {sig.signed ? (
                        <p style={{fontSize: 'var(--text-sm)', color: 'var(--success)', marginTop: 'var(--space-xs)', fontWeight: 600}}>
                          ✓ Signed {sig.timestamp}
                        </p>
                      ) : (
                        <p style={{fontSize: 'var(--text-sm)', color: 'var(--warning)', marginTop: 'var(--space-xs)'}}>
                          Pending signature
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Inspector Notes */}
          {inspection.notes && (
            <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginTop: 'var(--space-xl)'}}>
              <h2 style={{marginBottom: 'var(--space-lg)'}}>Inspector Notes</h2>
              <p style={{lineHeight: 1.8, fontSize: 'var(--text-base)'}}>{inspection.notes}</p>
            </div>
          )}

          {/* Attachments */}
          <div style={{backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-xl)', marginTop: 'var(--space-xl)'}}>
            <h2 style={{marginBottom: 'var(--space-lg)'}}>Attachments</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-md)'}}>
              {inspection.attachments.map((attachment, idx) => (
                <div key={idx} style={{
                  padding: 'var(--space-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{fontWeight: 600, fontSize: 'var(--text-sm)'}}>{attachment.name}</p>
                    <p style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>{attachment.type}</p>
                  </div>
                  <button className="btn btn-outline btn-sm">Download</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
