'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveOffline, queueForSync } from '@/lib/offlineSync'
import OfflineSyncIndicator from '@/components/hdd/OfflineSyncIndicator'

interface DailyReportData {
  // Step 1: Basic Info
  reportDate: string
  projectId: string
  crewLead: string
  crew: Array<{ name: string; role: string; hours: number }>

  // Step 2: Production
  production: Array<{ boreId: string; lf: number; pipeSize: string; pipeType: string }>

  // Step 3: Labor
  labor: Array<{ name: string; role: string; hours: number; rate: number }>

  // Step 4: Equipment
  equipment: Array<{ name: string; hours: number; rate: number }>

  // Step 5: Materials
  materials: Array<{ item: string; qty: number; unit: string; cost: number }>

  // Step 6: Photos & Notes
  photos: Array<{ url: string; caption: string; timestamp: string }>
  notes: string
  safetyNotes: string

  // Step 7: 811 Compliance
  ticket811Numbers: string[]
  hasActiveTickets: boolean

  // Metadata
  weather: { temp: string; conditions: string; precipitation: string }
  location: string
  status: 'DRAFT' | 'SUBMITTED'
}

const STEPS = [
  'Basic Info',
  'Production',
  'Labor',
  'Equipment',
  'Materials',
  'Photos & Notes',
  'Review & Submit'
]

export default function DailyReportPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<DailyReportData>({
    reportDate: new Date().toISOString().split('T')[0],
    projectId: '',
    crewLead: '',
    crew: [],
    production: [],
    labor: [],
    equipment: [],
    materials: [],
    photos: [],
    notes: '',
    safetyNotes: '',
    ticket811Numbers: [],
    hasActiveTickets: false,
    weather: { temp: '', conditions: '', precipitation: '' },
    location: '',
    status: 'DRAFT'
  })
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([])

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSave = async () => {
      if (formData.projectId) {
        await saveOffline('dailyReports', {
          ...formData,
          id: `draft-${formData.reportDate}-${formData.projectId}`,
          lastModified: new Date().toISOString()
        })
        setLastSaved(new Date())
      }
    }

    const interval = setInterval(autoSave, 30000)
    return () => clearInterval(interval)
  }, [formData])

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

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    // 811 Compliance gate
    if (!formData.hasActiveTickets && formData.ticket811Numbers.length === 0) {
      alert('⚠️ 811 Compliance Required\n\nYou must have active 811 tickets before submitting this daily report.')
      return
    }

    setIsSaving(true)
    try {
      const submitData = {
        ...formData,
        status: 'SUBMITTED' as const
      }

      if (navigator.onLine) {
        const response = await fetch('/api/hdd/daily-reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        })

        if (!response.ok) throw new Error('Failed to submit report')

        alert('✅ Daily report submitted successfully!')
        router.push('/dashboard/hdd/reports')
      } else {
        await queueForSync('POST', '/api/hdd/daily-reports', submitData)
        alert('📱 Offline Mode\n\nYour report has been saved and will sync when you are back online.')
        router.push('/dashboard/hdd/reports')
      }
    } catch (error) {
      console.error('Error submitting report:', error)
      alert('❌ Failed to submit report. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <OfflineSyncIndicator />

      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        padding: 'var(--space-xl)'
      }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{
            marginBottom: 'var(--space-2xl)',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: 'var(--space-sm)'
            }}>
              Daily Field Report
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-lg)'
            }}>
              Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
            </p>
            {lastSaved && (
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                marginTop: 'var(--space-xs)'
              }}>
                Auto-saved at {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div style={{
            marginBottom: 'var(--space-2xl)',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-md)',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              gap: 'var(--space-xs)'
            }}>
              {STEPS.map((step, index) => (
                <div
                  key={step}
                  style={{
                    flex: 1,
                    height: '8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: index <= currentStep ? 'var(--color-primary)' : 'var(--bg-tertiary)',
                    transition: 'background-color var(--transition-base)'
                  }}
                />
              ))}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 'var(--space-sm)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)'
            }}>
              {STEPS.map((step, index) => (
                <span
                  key={step}
                  style={{
                    fontWeight: index === currentStep ? 600 : 400,
                    color: index === currentStep ? 'var(--color-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-2xl)',
            boxShadow: 'var(--shadow-lg)',
            marginBottom: 'var(--space-xl)'
          }}>
            {currentStep === 0 && <Step1BasicInfo formData={formData} setFormData={setFormData} projects={projects} />}
            {currentStep === 1 && <Step2Production formData={formData} setFormData={setFormData} />}
            {currentStep === 2 && <Step3Labor formData={formData} setFormData={setFormData} />}
            {currentStep === 3 && <Step4Equipment formData={formData} setFormData={setFormData} />}
            {currentStep === 4 && <Step5Materials formData={formData} setFormData={setFormData} />}
            {currentStep === 5 && <Step6Photos formData={formData} setFormData={setFormData} />}
            {currentStep === 6 && <Step7Review formData={formData} />}
          </div>

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 'var(--space-md)'
          }}>
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              style={{
                padding: 'var(--space-md) var(--space-xl)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--color-primary)',
                border: '2px solid var(--color-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 0 ? 0.5 : 1,
                transition: 'all var(--transition-base)'
              }}
            >
              ← Back
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="btn btn-primary btn-lg"
                style={{ padding: 'var(--space-md) var(--space-2xl)' }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="btn btn-primary btn-lg"
                style={{
                  padding: 'var(--space-md) var(--space-2xl)',
                  opacity: isSaving ? 0.7 : 1
                }}
              >
                {isSaving ? 'Submitting...' : 'Submit Report ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Step Components

function Step1BasicInfo({ formData, setFormData, projects }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-md)' }}>
        Basic Information
      </h2>

      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
          Report Date *
        </label>
        <input
          type="date"
          value={formData.reportDate}
          onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
          style={{
            width: '100%',
            padding: 'var(--space-sm)',
            border: '2px solid var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)'
          }}
          required
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
          Project *
        </label>
        <select
          value={formData.projectId}
          onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
          style={{
            width: '100%',
            padding: 'var(--space-sm)',
            border: '2px solid var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)'
          }}
          required
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
          value={formData.crewLead}
          onChange={(e) => setFormData({ ...formData, crewLead: e.target.value })}
          placeholder="John Smith"
          style={{
            width: '100%',
            padding: 'var(--space-sm)',
            border: '2px solid var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)'
          }}
          required
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
          Location *
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="123 Main St, Willmar, MN"
          style={{
            width: '100%',
            padding: 'var(--space-sm)',
            border: '2px solid var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)'
          }}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
            Temperature (°F)
          </label>
          <input
            type="text"
            value={formData.weather.temp}
            onChange={(e) => setFormData({ ...formData, weather: { ...formData.weather, temp: e.target.value } })}
            placeholder="72"
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
            Conditions
          </label>
          <select
            value={formData.weather.conditions}
            onChange={(e) => setFormData({ ...formData, weather: { ...formData.weather, conditions: e.target.value } })}
            style={{
              width: '100%',
              padding: 'var(--space-sm)',
              border: '2px solid var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-base)'
            }}
          >
            <option value="">Select...</option>
            <option value="Clear">Clear</option>
            <option value="Cloudy">Cloudy</option>
            <option value="Rainy">Rainy</option>
            <option value="Snowy">Snowy</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
            Precipitation
          </label>
          <input
            type="text"
            value={formData.weather.precipitation}
            onChange={(e) => setFormData({ ...formData, weather: { ...formData.weather, precipitation: e.target.value } })}
            placeholder="0 in"
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
    </div>
  )
}

function Step2Production({ formData, setFormData }: any) {
  const addProduction = () => {
    setFormData({
      ...formData,
      production: [...formData.production, { boreId: '', lf: 0, pipeSize: '', pipeType: '' }]
    })
  }

  const updateProduction = (index: number, field: string, value: any) => {
    const updated = [...formData.production]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, production: updated })
  }

  const removeProduction = (index: number) => {
    setFormData({
      ...formData,
      production: formData.production.filter((_: any, i: number) => i !== index)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
          Production Details
        </h2>
        <button
          onClick={addProduction}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-secondary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          + Add Bore
        </button>
      </div>

      {formData.production.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-xl)' }}>
          No production entries yet. Click "Add Bore" to get started.
        </p>
      ) : (
        formData.production.map((item: any, index: number) => (
          <div
            key={index}
            style={{
              padding: 'var(--space-lg)',
              backgroundColor: 'var(--bg-accent)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--bg-secondary)'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 'var(--space-md)', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Bore ID
                </label>
                <input
                  type="text"
                  value={item.boreId}
                  onChange={(e) => updateProduction(index, 'boreId', e.target.value)}
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
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Linear Feet
                </label>
                <input
                  type="number"
                  value={item.lf}
                  onChange={(e) => updateProduction(index, 'lf', parseFloat(e.target.value) || 0)}
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
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Pipe Size
                </label>
                <input
                  type="text"
                  value={item.pipeSize}
                  onChange={(e) => updateProduction(index, 'pipeSize', e.target.value)}
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
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Pipe Type
                </label>
                <input
                  type="text"
                  value={item.pipeType}
                  onChange={(e) => updateProduction(index, 'pipeType', e.target.value)}
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
              <button
                onClick={() => removeProduction(index)}
                style={{
                  padding: 'var(--space-sm)',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}

      {formData.production.length > 0 && (
        <div style={{
          padding: 'var(--space-md)',
          backgroundColor: '#dcfce7',
          borderRadius: 'var(--radius-md)',
          border: '2px solid #22c55e'
        }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#166534' }}>
            Total: {formData.production.reduce((sum: number, item: any) => sum + (parseFloat(item.lf) || 0), 0)} LF
          </p>
        </div>
      )}
    </div>
  )
}

function Step3Labor({ formData, setFormData }: any) {
  const addLabor = () => {
    setFormData({
      ...formData,
      labor: [...formData.labor, { name: '', role: '', hours: 0, rate: 0 }]
    })
  }

  const updateLabor = (index: number, field: string, value: any) => {
    const updated = [...formData.labor]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, labor: updated })
  }

  const removeLabor = (index: number) => {
    setFormData({
      ...formData,
      labor: formData.labor.filter((_: any, i: number) => i !== index)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
          Labor Details
        </h2>
        <button
          onClick={addLabor}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-secondary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          + Add Worker
        </button>
      </div>

      {formData.labor.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-xl)' }}>
          No labor entries yet. Click "Add Worker" to get started.
        </p>
      ) : (
        formData.labor.map((item: any, index: number) => (
          <div
            key={index}
            style={{
              padding: 'var(--space-lg)',
              backgroundColor: 'var(--bg-accent)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--bg-secondary)'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 'var(--space-md)', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateLabor(index, 'name', e.target.value)}
                  placeholder="John Doe"
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
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Role
                </label>
                <input
                  type="text"
                  value={item.role}
                  onChange={(e) => updateLabor(index, 'role', e.target.value)}
                  placeholder="Operator"
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
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Hours
                </label>
                <input
                  type="number"
                  value={item.hours}
                  onChange={(e) => updateLabor(index, 'hours', parseFloat(e.target.value) || 0)}
                  placeholder="8"
                  step="0.5"
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
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Rate ($/hr)
                </label>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateLabor(index, 'rate', parseFloat(e.target.value) || 0)}
                  placeholder="45"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm)',
                    border: '2px solid var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-base)'
                  }}
                />
              </div>
              <button
                onClick={() => removeLabor(index)}
                style={{
                  padding: 'var(--space-sm)',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}

      {formData.labor.length > 0 && (
        <div style={{
          padding: 'var(--space-md)',
          backgroundColor: '#dcfce7',
          borderRadius: 'var(--radius-md)',
          border: '2px solid #22c55e'
        }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#166534' }}>
            Total Labor Cost: ${formData.labor.reduce((sum: number, item: any) => sum + (item.hours * item.rate || 0), 0).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  )
}

function Step4Equipment({ formData, setFormData }: any) {
  const addEquipment = () => {
    setFormData({
      ...formData,
      equipment: [...formData.equipment, { name: '', hours: 0, rate: 0 }]
    })
  }

  const updateEquipment = (index: number, field: string, value: any) => {
    const updated = [...formData.equipment]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, equipment: updated })
  }

  const removeEquipment = (index: number) => {
    setFormData({
      ...formData,
      equipment: formData.equipment.filter((_: any, i: number) => i !== index)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
          Equipment Usage
        </h2>
        <button
          onClick={addEquipment}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-secondary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          + Add Equipment
        </button>
      </div>

      {formData.equipment.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-xl)' }}>
          No equipment entries yet. Click "Add Equipment" to get started.
        </p>
      ) : (
        formData.equipment.map((item: any, index: number) => (
          <div
            key={index}
            style={{
              padding: 'var(--space-lg)',
              backgroundColor: 'var(--bg-accent)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--bg-secondary)'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 'var(--space-md)', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Equipment Name
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateEquipment(index, 'name', e.target.value)}
                  placeholder="Drill Rig #1"
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
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Hours
                </label>
                <input
                  type="number"
                  value={item.hours}
                  onChange={(e) => updateEquipment(index, 'hours', parseFloat(e.target.value) || 0)}
                  placeholder="8"
                  step="0.5"
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
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Rate ($/hr)
                </label>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateEquipment(index, 'rate', parseFloat(e.target.value) || 0)}
                  placeholder="150"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm)',
                    border: '2px solid var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-base)'
                  }}
                />
              </div>
              <button
                onClick={() => removeEquipment(index)}
                style={{
                  padding: 'var(--space-sm)',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}

      {formData.equipment.length > 0 && (
        <div style={{
          padding: 'var(--space-md)',
          backgroundColor: '#dcfce7',
          borderRadius: 'var(--radius-md)',
          border: '2px solid #22c55e'
        }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#166534' }}>
            Total Equipment Cost: ${formData.equipment.reduce((sum: number, item: any) => sum + (item.hours * item.rate || 0), 0).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  )
}

function Step5Materials({ formData, setFormData }: any) {
  const addMaterial = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, { item: '', qty: 0, unit: '', cost: 0 }]
    })
  }

  const updateMaterial = (index: number, field: string, value: any) => {
    const updated = [...formData.materials]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, materials: updated })
  }

  const removeMaterial = (index: number) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_: any, i: number) => i !== index)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
          Materials Used
        </h2>
        <button
          onClick={addMaterial}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-secondary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          + Add Material
        </button>
      </div>

      {formData.materials.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-xl)' }}>
          No material entries yet. Click "Add Material" to get started.
        </p>
      ) : (
        formData.materials.map((item: any, index: number) => (
          <div
            key={index}
            style={{
              padding: 'var(--space-lg)',
              backgroundColor: 'var(--bg-accent)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--bg-secondary)'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 'var(--space-md)', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Item
                </label>
                <input
                  type="text"
                  value={item.item}
                  onChange={(e) => updateMaterial(index, 'item', e.target.value)}
                  placeholder="Drilling Fluid"
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
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Quantity
                </label>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateMaterial(index, 'qty', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  step="0.01"
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
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Unit
                </label>
                <input
                  type="text"
                  value={item.unit}
                  onChange={(e) => updateMaterial(index, 'unit', e.target.value)}
                  placeholder="gallons"
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
                <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                  Cost ($)
                </label>
                <input
                  type="number"
                  value={item.cost}
                  onChange={(e) => updateMaterial(index, 'cost', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm)',
                    border: '2px solid var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-base)'
                  }}
                />
              </div>
              <button
                onClick={() => removeMaterial(index)}
                style={{
                  padding: 'var(--space-sm)',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}

      {formData.materials.length > 0 && (
        <div style={{
          padding: 'var(--space-md)',
          backgroundColor: '#dcfce7',
          borderRadius: 'var(--radius-md)',
          border: '2px solid #22c55e'
        }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#166534' }}>
            Total Materials Cost: ${formData.materials.reduce((sum: number, item: any) => sum + (item.qty * item.cost || 0), 0).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  )
}

function Step6Photos({ formData, setFormData }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-md)' }}>
        Photos & Notes
      </h2>

      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
          Work Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Describe the work completed today..."
          rows={6}
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            border: '2px solid var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
          Safety Notes
        </label>
        <textarea
          value={formData.safetyNotes}
          onChange={(e) => setFormData({ ...formData, safetyNotes: e.target.value })}
          placeholder="Any safety concerns, incidents, or observations..."
          rows={4}
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            border: '2px solid var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
          811 Ticket Numbers
        </label>
        <input
          type="text"
          value={formData.ticket811Numbers.join(', ')}
          onChange={(e) => setFormData({
            ...formData,
            ticket811Numbers: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
          })}
          placeholder="Enter ticket numbers separated by commas (e.g., 123456, 789012)"
          style={{
            width: '100%',
            padding: 'var(--space-sm)',
            border: '2px solid var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-base)'
          }}
        />
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' }}>
          Required before submission
        </p>
      </div>

      <div style={{
        padding: 'var(--space-md)',
        backgroundColor: '#fef3c7',
        borderRadius: 'var(--radius-md)',
        border: '2px solid #f59e0b'
      }}>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: '#92400e' }}>
          📸 Photo upload functionality will be added in a future update. For now, please note photo details in the work notes above.
        </p>
      </div>
    </div>
  )
}

function Step7Review({ formData }: any) {
  const totalLF = formData.production.reduce((sum: number, item: any) => sum + (parseFloat(item.lf) || 0), 0)
  const totalLaborCost = formData.labor.reduce((sum: number, item: any) => sum + (item.hours * item.rate || 0), 0)
  const totalEquipmentCost = formData.equipment.reduce((sum: number, item: any) => sum + (item.hours * item.rate || 0), 0)
  const totalMaterialsCost = formData.materials.reduce((sum: number, item: any) => sum + (item.qty * item.cost || 0), 0)
  const grandTotal = totalLaborCost + totalEquipmentCost + totalMaterialsCost

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
        Review & Submit
      </h2>

      {/* 811 Compliance Check */}
      {formData.ticket811Numbers.length === 0 && (
        <div style={{
          padding: 'var(--space-lg)',
          backgroundColor: '#fee2e2',
          border: '2px solid #ef4444',
          borderRadius: 'var(--radius-md)'
        }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#991b1b', fontSize: 'var(--text-base)' }}>
            ⚠️ Warning: No 811 tickets entered
          </p>
          <p style={{ margin: 0, marginTop: 'var(--space-xs)', color: '#7f1d1d', fontSize: 'var(--text-sm)' }}>
            You must enter at least one 811 ticket number before submitting this report.
          </p>
        </div>
      )}

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-md)'
      }}>
        <div style={{
          padding: 'var(--space-md)',
          backgroundColor: 'var(--bg-accent)',
          borderRadius: 'var(--radius-md)',
          border: '2px solid var(--bg-secondary)'
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Linear Feet
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
            {totalLF}
          </div>
        </div>
        <div style={{
          padding: 'var(--space-md)',
          backgroundColor: 'var(--bg-accent)',
          borderRadius: 'var(--radius-md)',
          border: '2px solid var(--bg-secondary)'
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Cost
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
            ${grandTotal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Detailed Review */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Basic Info</h3>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            <p>Date: {formData.reportDate}</p>
            <p>Crew Lead: {formData.crewLead}</p>
            <p>Location: {formData.location}</p>
            <p>Weather: {formData.weather.temp}°F, {formData.weather.conditions}</p>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Production</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            {formData.production.length} bore(s), {totalLF} total LF
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Costs</h3>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            <p>Labor: ${totalLaborCost.toFixed(2)}</p>
            <p>Equipment: ${totalEquipmentCost.toFixed(2)}</p>
            <p>Materials: ${totalMaterialsCost.toFixed(2)}</p>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>811 Compliance</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            {formData.ticket811Numbers.length > 0
              ? `Tickets: ${formData.ticket811Numbers.join(', ')}`
              : 'No tickets entered'
            }
          </p>
        </div>

        {formData.notes && (
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Work Notes</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
              {formData.notes}
            </p>
          </div>
        )}

        {formData.safetyNotes && (
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Safety Notes</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
              {formData.safetyNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
