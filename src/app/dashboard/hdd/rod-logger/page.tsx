'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveOffline, queueForSync } from '@/lib/offlineSync'
import OfflineSyncIndicator from '@/components/hdd/OfflineSyncIndicator'

interface RodPass {
  passNumber: number
  linearFeet: number
  startTime: string
  endTime?: string
  fluidMix: string
  fluidVolumeGal: number
  pumpPressure: number
  notes: string
  events: Array<{ type: string; timestamp: string; notes: string }>
}

interface BoreSession {
  boreId: string
  projectId: string
  startDate: string
  crew: string
  location: string
  targetDepth: number
  targetLength: number
  pipeSize: string
  pipeType: string
  rodPasses: RodPass[]
}

export default function RodLoggerPage() {
  const router = useRouter()
  const [session, setSession] = useState<BoreSession>({
    boreId: '',
    projectId: '',
    startDate: new Date().toISOString().split('T')[0],
    crew: '',
    location: '',
    targetDepth: 0,
    targetLength: 0,
    pipeSize: '',
    pipeType: '',
    rodPasses: []
  })
  const [currentPass, setCurrentPass] = useState<RodPass | null>(null)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([])

  // Load projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch('/api/hdd/projects')
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error('Failed to load projects:', error)
      }
    }
    loadProjects()
  }, [])

  // Auto-save every 30 seconds
  useEffect(() => {
    if (sessionStarted) {
      const autoSave = async () => {
        await saveOffline('rodPasses', {
          ...session,
          currentPass,
          lastModified: new Date().toISOString()
        })
      }

      const interval = setInterval(autoSave, 30000)
      return () => clearInterval(interval)
    }
  }, [session, currentPass, sessionStarted])

  const startSession = () => {
    if (!session.boreId || !session.projectId || !session.crew) {
      alert('Please fill in Bore ID, Project, and Crew before starting')
      return
    }
    setSessionStarted(true)
  }

  const startNewPass = () => {
    if (currentPass && !currentPass.endTime) {
      alert('Please complete the current pass before starting a new one')
      return
    }

    const newPass: RodPass = {
      passNumber: session.rodPasses.length + 1,
      linearFeet: 0,
      startTime: new Date().toISOString(),
      endTime: undefined,
      fluidMix: 'Bentonite',
      fluidVolumeGal: 0,
      pumpPressure: 0,
      notes: '',
      events: []
    }
    setCurrentPass(newPass)
  }

  const completePass = () => {
    if (!currentPass) return

    const completedPass = {
      ...currentPass,
      endTime: new Date().toISOString()
    }

    setSession({
      ...session,
      rodPasses: [...session.rodPasses, completedPass]
    })
    setCurrentPass(null)
  }

  const addEvent = (type: string) => {
    if (!currentPass) return

    const event = {
      type,
      timestamp: new Date().toISOString(),
      notes: prompt(`Add notes for ${type}:`) || ''
    }

    setCurrentPass({
      ...currentPass,
      events: [...currentPass.events, event]
    })
  }

  const saveSession = async () => {
    try {
      const saveData = {
        ...session,
        rodPasses: currentPass && !currentPass.endTime
          ? [...session.rodPasses, { ...currentPass, endTime: new Date().toISOString() }]
          : session.rodPasses
      }

      if (navigator.onLine) {
        const response = await fetch('/api/hdd/rod-passes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saveData)
        })

        if (!response.ok) throw new Error('Failed to save session')

        alert('✅ Rod logging session saved successfully!')
        router.push('/dashboard/hdd/bore-logs')
      } else {
        await queueForSync('POST', '/api/hdd/rod-passes', saveData)
        alert('📱 Offline Mode\n\nYour session has been saved and will sync when you are back online.')
        router.push('/dashboard/hdd/bore-logs')
      }
    } catch (error) {
      console.error('Error saving session:', error)
      alert('❌ Failed to save session. Please try again.')
    }
  }

  // Calculate totals
  const totalLF = session.rodPasses.reduce((sum, pass) => sum + pass.linearFeet, 0) + (currentPass?.linearFeet || 0)
  const totalFluid = session.rodPasses.reduce((sum, pass) => sum + pass.fluidVolumeGal, 0) + (currentPass?.fluidVolumeGal || 0)
  const progress = session.targetLength > 0 ? (totalLF / session.targetLength) * 100 : 0

  return (
    <>
      <OfflineSyncIndicator />

      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        padding: 'var(--space-lg)'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{
            marginBottom: 'var(--space-xl)',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: 'var(--space-sm)'
            }}>
              Rod-by-Rod Logger
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-lg)'
            }}>
              Real-time bore tracking with offline support
            </p>
          </div>

          {!sessionStarted ? (
            // Session Setup
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-2xl)',
              boxShadow: 'var(--shadow-lg)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <h2 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                marginBottom: 'var(--space-xl)'
              }}>
                Start New Bore Session
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
                    Bore ID *
                  </label>
                  <input
                    type="text"
                    value={session.boreId}
                    onChange={(e) => setSession({ ...session, boreId: e.target.value })}
                    placeholder="B-001"
                    style={{
                      width: '100%',
                      padding: 'var(--space-sm)',
                      border: '2px solid var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-base)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
                    Project *
                  </label>
                  <select
                    value={session.projectId}
                    onChange={(e) => setSession({ ...session, projectId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'var(--space-sm)',
                      border: '2px solid var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-base)'
                    }}
                  >
                    <option value="">Select a project...</option>
                    {projects.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
                    Crew Lead *
                  </label>
                  <input
                    type="text"
                    value={session.crew}
                    onChange={(e) => setSession({ ...session, crew: e.target.value })}
                    placeholder="John Smith"
                    style={{
                      width: '100%',
                      padding: 'var(--space-sm)',
                      border: '2px solid var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-base)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={session.location}
                    onChange={(e) => setSession({ ...session, location: e.target.value })}
                    placeholder="123 Main St, Willmar, MN"
                    style={{
                      width: '100%',
                      padding: 'var(--space-sm)',
                      border: '2px solid var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-base)'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
                      Target Length (LF)
                    </label>
                    <input
                      type="number"
                      value={session.targetLength}
                      onChange={(e) => setSession({ ...session, targetLength: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: 'var(--space-sm)',
                        border: '2px solid var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-base)'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
                      Target Depth (ft)
                    </label>
                    <input
                      type="number"
                      value={session.targetDepth}
                      onChange={(e) => setSession({ ...session, targetDepth: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: 'var(--space-sm)',
                        border: '2px solid var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-base)'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
                      Pipe Size
                    </label>
                    <input
                      type="text"
                      value={session.pipeSize}
                      onChange={(e) => setSession({ ...session, pipeSize: e.target.value })}
                      placeholder="2 inch"
                      style={{
                        width: '100%',
                        padding: 'var(--space-sm)',
                        border: '2px solid var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-base)'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
                      Pipe Type
                    </label>
                    <input
                      type="text"
                      value={session.pipeType}
                      onChange={(e) => setSession({ ...session, pipeType: e.target.value })}
                      placeholder="HDPE"
                      style={{
                        width: '100%',
                        padding: 'var(--space-sm)',
                        border: '2px solid var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-base)'
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={startSession}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: 'var(--space-md)' }}
                >
                  Start Logging Session
                </button>
              </div>
            </div>
          ) : (
            // Active Session
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
              {/* Progress Summary */}
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-xl)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 'var(--space-lg)',
                  marginBottom: 'var(--space-lg)'
                }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Bore ID
                    </div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {session.boreId}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Total Linear Feet
                    </div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {totalLF.toFixed(1)} LF
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Total Passes
                    </div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {session.rodPasses.length + (currentPass ? 1 : 0)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Fluid Used
                    </div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {totalFluid.toFixed(0)} gal
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {session.targetLength > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', fontSize: 'var(--text-sm)' }}>
                      <span style={{ fontWeight: 600 }}>Progress</span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {totalLF.toFixed(1)} / {session.targetLength} LF ({progress.toFixed(1)}%)
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '12px',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(progress, 100)}%`,
                        height: '100%',
                        backgroundColor: progress >= 100 ? '#22c55e' : 'var(--color-primary)',
                        transition: 'width var(--transition-base)'
                      }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Current Pass */}
              {currentPass ? (
                <div style={{
                  backgroundColor: '#fef3c7',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-xl)',
                  border: '3px solid #f59e0b',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-lg)'
                  }}>
                    <h2 style={{
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 700,
                      color: '#92400e',
                      margin: 0
                    }}>
                      Pass #{currentPass.passNumber} - IN PROGRESS
                    </h2>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      color: '#78350f'
                    }}>
                      Started: {new Date(currentPass.startTime).toLocaleTimeString()}
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--space-md)',
                    marginBottom: 'var(--space-lg)'
                  }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)', color: '#78350f' }}>
                        Linear Feet
                      </label>
                      <input
                        type="number"
                        value={currentPass.linearFeet}
                        onChange={(e) => setCurrentPass({ ...currentPass, linearFeet: parseFloat(e.target.value) || 0 })}
                        style={{
                          width: '100%',
                          padding: 'var(--space-sm)',
                          border: '2px solid #f59e0b',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-lg)',
                          fontWeight: 700
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)', color: '#78350f' }}>
                        Fluid Mix
                      </label>
                      <select
                        value={currentPass.fluidMix}
                        onChange={(e) => setCurrentPass({ ...currentPass, fluidMix: e.target.value })}
                        style={{
                          width: '100%',
                          padding: 'var(--space-sm)',
                          border: '2px solid #f59e0b',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-base)'
                        }}
                      >
                        <option value="Bentonite">Bentonite</option>
                        <option value="Polymer">Polymer</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)', color: '#78350f' }}>
                        Fluid Volume (gal)
                      </label>
                      <input
                        type="number"
                        value={currentPass.fluidVolumeGal}
                        onChange={(e) => setCurrentPass({ ...currentPass, fluidVolumeGal: parseFloat(e.target.value) || 0 })}
                        style={{
                          width: '100%',
                          padding: 'var(--space-sm)',
                          border: '2px solid #f59e0b',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-base)'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)', color: '#78350f' }}>
                        Pump Pressure (PSI)
                      </label>
                      <input
                        type="number"
                        value={currentPass.pumpPressure}
                        onChange={(e) => setCurrentPass({ ...currentPass, pumpPressure: parseFloat(e.target.value) || 0 })}
                        style={{
                          width: '100%',
                          padding: 'var(--space-sm)',
                          border: '2px solid #f59e0b',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-base)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Quick Event Buttons */}
                  <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 600, color: '#78350f' }}>
                      Quick Events
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: 'var(--space-sm)'
                    }}>
                      {['Obstruction', 'Frac-Out', 'Tool Change', 'Delay', 'Note'].map(eventType => (
                        <button
                          key={eventType}
                          onClick={() => addEvent(eventType)}
                          style={{
                            padding: 'var(--space-sm)',
                            backgroundColor: 'var(--bg-card)',
                            color: '#92400e',
                            border: '2px solid #f59e0b',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all var(--transition-base)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f59e0b'
                            e.currentTarget.style.color = 'white'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--white)'
                            e.currentTarget.style.color = '#92400e'
                          }}
                        >
                          {eventType}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Events Log */}
                  {currentPass.events.length > 0 && (
                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                      <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontWeight: 600, color: '#78350f' }}>
                        Events ({currentPass.events.length})
                      </label>
                      <div style={{
                        maxHeight: '150px',
                        overflowY: 'auto',
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-sm)',
                        border: '2px solid #f59e0b'
                      }}>
                        {currentPass.events.map((event, i) => (
                          <div key={i} style={{
                            padding: 'var(--space-xs)',
                            borderBottom: i < currentPass.events.length - 1 ? '1px solid var(--bg-secondary)' : 'none',
                            fontSize: 'var(--text-sm)'
                          }}>
                            <span style={{ fontWeight: 600, color: '#92400e' }}>{event.type}</span>
                            {' - '}
                            <span style={{ color: 'var(--text-secondary)' }}>
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                            {event.notes && (
                              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' }}>
                                {event.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, color: '#78350f' }}>
                      Pass Notes
                    </label>
                    <textarea
                      value={currentPass.notes}
                      onChange={(e) => setCurrentPass({ ...currentPass, notes: e.target.value })}
                      placeholder="Add any notes about this pass..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: 'var(--space-sm)',
                        border: '2px solid #f59e0b',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-base)',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <button
                    onClick={completePass}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: 'var(--space-md)' }}
                  >
                    Complete Pass #{currentPass.passNumber}
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={startNewPass}
                    className="btn btn-secondary btn-lg"
                    style={{ padding: 'var(--space-md) var(--space-2xl)' }}
                  >
                    + Start New Pass
                  </button>
                </div>
              )}

              {/* Completed Passes */}
              {session.rodPasses.length > 0 && (
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-xl)',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  <h2 style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    marginBottom: 'var(--space-lg)'
                  }}>
                    Completed Passes ({session.rodPasses.length})
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {session.rodPasses.map((pass, index) => (
                      <div
                        key={index}
                        style={{
                          padding: 'var(--space-md)',
                          backgroundColor: 'var(--bg-accent)',
                          borderRadius: 'var(--radius-md)',
                          border: '2px solid var(--bg-secondary)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                          <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                            Pass #{pass.passNumber}
                          </span>
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                            {new Date(pass.startTime).toLocaleTimeString()} - {pass.endTime && new Date(pass.endTime).toLocaleTimeString()}
                          </span>
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                          gap: 'var(--space-sm)',
                          fontSize: 'var(--text-sm)'
                        }}>
                          <div><strong>LF:</strong> {pass.linearFeet}</div>
                          <div><strong>Fluid:</strong> {pass.fluidMix}</div>
                          <div><strong>Volume:</strong> {pass.fluidVolumeGal} gal</div>
                          <div><strong>Pressure:</strong> {pass.pumpPressure} PSI</div>
                          {pass.events.length > 0 && (
                            <div><strong>Events:</strong> {pass.events.length}</div>
                          )}
                        </div>
                        {pass.notes && (
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-sm)', margin: 0 }}>
                            {pass.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Session */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={saveSession}
                  className="btn btn-primary btn-lg"
                  style={{ padding: 'var(--space-md) var(--space-2xl)' }}
                >
                  Save & Close Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
