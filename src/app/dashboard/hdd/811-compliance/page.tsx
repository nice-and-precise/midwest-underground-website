'use client'

import { useState, useEffect } from 'react'

interface Ticket811 {
  id: string
  ticketNumber: string
  projectId: string
  project: { name: string }
  ticketDate: string
  expirationDate: string
  location: string
  type: string
  status: string
  responses: Array<{
    id: string
    utilityName: string
    responseType: string
    responseDate: string
  }>
}

export default function Compliance811Page() {
  const [tickets, setTickets] = useState<Ticket811[]>([])
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(true)
  const [showAddTicket, setShowAddTicket] = useState(false)
  const [showAddResponse, setShowAddResponse] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const [newTicket, setNewTicket] = useState({
    ticketNumber: '',
    projectId: '',
    ticketDate: new Date().toISOString().split('T')[0],
    expirationDate: '',
    location: '',
    type: 'NORMAL',
    status: 'ACTIVE'
  })

  const [newResponse, setNewResponse] = useState({
    utilityName: '',
    responseType: 'POSITIVE',
    responseDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [ticketsRes, projectsRes] = await Promise.all([
        fetch('/api/hdd/811-tickets'),
        fetch('/api/hdd/projects')
      ])

      if (ticketsRes.ok) {
        const ticketsData = await ticketsRes.json()
        setTickets(ticketsData)
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/hdd/811-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket)
      })

      if (!response.ok) throw new Error('Failed to add ticket')

      alert('✅ 811 ticket added successfully!')
      setShowAddTicket(false)
      setNewTicket({
        ticketNumber: '',
        projectId: '',
        ticketDate: new Date().toISOString().split('T')[0],
        expirationDate: '',
        location: '',
        type: 'NORMAL',
        status: 'ACTIVE'
      })
      loadData()
    } catch (error) {
      console.error('Error adding ticket:', error)
      alert('❌ Failed to add ticket. Please try again.')
    }
  }

  const handleAddResponse = async (e: React.FormEvent, ticketId: string) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/hdd/811-tickets/${ticketId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResponse)
      })

      if (!response.ok) throw new Error('Failed to add response')

      alert('✅ Utility response added successfully!')
      setShowAddResponse(null)
      setNewResponse({
        utilityName: '',
        responseType: 'POSITIVE',
        responseDate: new Date().toISOString().split('T')[0]
      })
      loadData()
    } catch (error) {
      console.error('Error adding response:', error)
      alert('❌ Failed to add response. Please try again.')
    }
  }

  const getStatusBadge = (ticket: Ticket811) => {
    const expirationDate = new Date(ticket.expirationDate)
    const today = new Date()
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    let backgroundColor = '#dcfce7'
    let borderColor = '#22c55e'
    let textColor = '#166534'
    let label = 'Active'

    if (ticket.status === 'EXPIRED' || daysUntilExpiration < 0) {
      backgroundColor = '#fee2e2'
      borderColor = '#ef4444'
      textColor = '#991b1b'
      label = 'Expired'
    } else if (daysUntilExpiration <= 3) {
      backgroundColor = '#fef3c7'
      borderColor = '#f59e0b'
      textColor = '#92400e'
      label = `Expires in ${daysUntilExpiration}d`
    }

    return { backgroundColor, borderColor, textColor, label, daysUntilExpiration }
  }

  const getComplianceStats = () => {
    const active = tickets.filter(t => {
      const status = getStatusBadge(t)
      return status.daysUntilExpiration >= 0
    })
    const withResponses = tickets.filter(t => t.responses.length > 0)
    const complianceRate = tickets.length > 0 ? (withResponses.length / tickets.length) * 100 : 0

    return {
      total: tickets.length,
      active: active.length,
      expired: tickets.length - active.length,
      withResponses: withResponses.length,
      complianceRate
    }
  }

  const stats = getComplianceStats()

  const filteredTickets = tickets.filter(ticket => {
    if (filterStatus === 'all') return true
    const status = getStatusBadge(ticket)
    if (filterStatus === 'active') return status.daysUntilExpiration >= 0
    if (filterStatus === 'expiring') return status.daysUntilExpiration >= 0 && status.daysUntilExpiration <= 3
    if (filterStatus === 'expired') return status.daysUntilExpiration < 0
    return true
  })

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        padding: 'var(--space-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: 'var(--text-lg)' }}>Loading 811 tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      padding: 'var(--space-xl)'
    }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          marginBottom: 'var(--space-2xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: 'var(--space-sm)'
            }}>
              811 Compliance Tracker
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-lg)'
            }}>
              Manage utility locate tickets and ensure compliance
            </p>
          </div>
          <button
            onClick={() => setShowAddTicket(true)}
            className="btn btn-primary btn-lg"
          >
            + Add Ticket
          </button>
        </div>

        {/* Compliance Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-lg)',
          marginBottom: 'var(--space-2xl)'
        }}>
          <div style={{
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            border: '2px solid var(--bg-secondary)'
          }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Tickets
            </div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
              {stats.total}
            </div>
          </div>

          <div style={{
            padding: 'var(--space-lg)',
            backgroundColor: '#dcfce7',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            border: '2px solid #22c55e'
          }}>
            <div style={{ fontSize: 'var(--text-xs)', color: '#166534', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
              Active Tickets
            </div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: '#22c55e' }}>
              {stats.active}
            </div>
          </div>

          <div style={{
            padding: 'var(--space-lg)',
            backgroundColor: '#fee2e2',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            border: '2px solid #ef4444'
          }}>
            <div style={{ fontSize: 'var(--text-xs)', color: '#991b1b', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
              Expired Tickets
            </div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: '#ef4444' }}>
              {stats.expired}
            </div>
          </div>

          <div style={{
            padding: 'var(--space-lg)',
            backgroundColor: stats.complianceRate >= 95 ? '#dcfce7' : '#fef3c7',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            border: `2px solid ${stats.complianceRate >= 95 ? '#22c55e' : '#f59e0b'}`
          }}>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: stats.complianceRate >= 95 ? '#166534' : '#92400e',
              marginBottom: 'var(--space-xs)',
              textTransform: 'uppercase',
              fontWeight: 600
            }}>
              Compliance Rate
            </div>
            <div style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 700,
              color: stats.complianceRate >= 95 ? '#22c55e' : '#f59e0b'
            }}>
              {stats.complianceRate.toFixed(0)}%
            </div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: stats.complianceRate >= 95 ? '#166534' : '#92400e',
              marginTop: 'var(--space-xs)'
            }}>
              {stats.withResponses} of {stats.total} with responses
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-xl)',
          borderBottom: '2px solid var(--bg-secondary)',
          paddingBottom: 'var(--space-sm)'
        }}>
          {[
            { key: 'all', label: 'All Tickets' },
            { key: 'active', label: 'Active' },
            { key: 'expiring', label: 'Expiring Soon' },
            { key: 'expired', label: 'Expired' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              style={{
                padding: 'var(--space-sm) var(--space-lg)',
                backgroundColor: filterStatus === tab.key ? 'var(--color-primary)' : 'transparent',
                color: filterStatus === tab.key ? 'white' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-base)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div style={{
            padding: 'var(--space-2xl)',
            textAlign: 'center',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
              No 811 tickets found. Click "Add Ticket" to get started.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {filteredTickets.map(ticket => {
              const status = getStatusBadge(ticket)
              return (
                <div
                  key={ticket.id}
                  style={{
                    padding: 'var(--space-xl)',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-md)',
                    border: `3px solid ${status.borderColor}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-lg)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xs)' }}>
                        <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                          Ticket #{ticket.ticketNumber}
                        </h3>
                        <span style={{
                          padding: 'var(--space-xs) var(--space-sm)',
                          backgroundColor: status.backgroundColor,
                          color: status.textColor,
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 600,
                          border: `2px solid ${status.borderColor}`
                        }}>
                          {status.label}
                        </span>
                        <span style={{
                          padding: 'var(--space-xs) var(--space-sm)',
                          backgroundColor: 'var(--bg-accent)',
                          color: 'var(--text-secondary)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 600
                        }}>
                          {ticket.type}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        {ticket.project.name}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddResponse(ticket.id)}
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
                      + Add Response
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--space-md)',
                    marginBottom: 'var(--space-lg)',
                    fontSize: 'var(--text-sm)'
                  }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Location: </span>
                      {ticket.location}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Ticket Date: </span>
                      {new Date(ticket.ticketDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Expiration: </span>
                      {new Date(ticket.expirationDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Responses: </span>
                      {ticket.responses.length}
                    </div>
                  </div>

                  {/* Utility Responses */}
                  {ticket.responses.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>
                        Utility Responses
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        {ticket.responses.map(response => (
                          <div
                            key={response.id}
                            style={{
                              padding: 'var(--space-md)',
                              backgroundColor: 'var(--bg-accent)',
                              borderRadius: 'var(--radius-md)',
                              border: '2px solid var(--bg-secondary)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ fontSize: 'var(--text-sm)' }}>
                              <span style={{ fontWeight: 600 }}>{response.utilityName}</span>
                              {' - '}
                              <span style={{
                                color: response.responseType === 'POSITIVE' ? '#22c55e' : '#f59e0b',
                                fontWeight: 600
                              }}>
                                {response.responseType}
                              </span>
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                              {new Date(response.responseDate).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Response Form */}
                  {showAddResponse === ticket.id && (
                    <form
                      onSubmit={(e) => handleAddResponse(e, ticket.id)}
                      style={{
                        marginTop: 'var(--space-lg)',
                        padding: 'var(--space-lg)',
                        backgroundColor: '#fef3c7',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid #f59e0b'
                      }}
                    >
                      <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-md)', color: '#92400e' }}>
                        Add Utility Response
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 'var(--space-md)', alignItems: 'end' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                            Utility Name *
                          </label>
                          <input
                            type="text"
                            value={newResponse.utilityName}
                            onChange={(e) => setNewResponse({ ...newResponse, utilityName: e.target.value })}
                            placeholder="Xcel Energy"
                            required
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
                            Response Type *
                          </label>
                          <select
                            value={newResponse.responseType}
                            onChange={(e) => setNewResponse({ ...newResponse, responseType: e.target.value })}
                            style={{
                              width: '100%',
                              padding: 'var(--space-sm)',
                              border: '2px solid var(--bg-secondary)',
                              borderRadius: 'var(--radius-md)',
                              fontSize: 'var(--text-base)'
                            }}
                          >
                            <option value="POSITIVE">Positive</option>
                            <option value="NEGATIVE">Negative</option>
                            <option value="PENDING">Pending</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                            Response Date *
                          </label>
                          <input
                            type="date"
                            value={newResponse.responseDate}
                            onChange={(e) => setNewResponse({ ...newResponse, responseDate: e.target.value })}
                            required
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
                          type="submit"
                          className="btn btn-primary"
                          style={{ padding: 'var(--space-sm) var(--space-md)' }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddResponse(null)}
                          style={{
                            padding: 'var(--space-sm) var(--space-md)',
                            backgroundColor: 'var(--bg-card)',
                            color: 'var(--text-secondary)',
                            border: '2px solid var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Add Ticket Modal */}
        {showAddTicket && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--space-xl)'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-2xl)',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-2xl)'
            }}>
              <h2 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                marginBottom: 'var(--space-xl)'
              }}>
                Add 811 Ticket
              </h2>

              <form onSubmit={handleAddTicket} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
                    Ticket Number *
                  </label>
                  <input
                    type="text"
                    value={newTicket.ticketNumber}
                    onChange={(e) => setNewTicket({ ...newTicket, ticketNumber: e.target.value })}
                    placeholder="123456789"
                    required
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
                    value={newTicket.projectId}
                    onChange={(e) => setNewTicket({ ...newTicket, projectId: e.target.value })}
                    required
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
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newTicket.location}
                    onChange={(e) => setNewTicket({ ...newTicket, location: e.target.value })}
                    placeholder="123 Main St, Willmar, MN"
                    required
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
                      Ticket Date *
                    </label>
                    <input
                      type="date"
                      value={newTicket.ticketDate}
                      onChange={(e) => setNewTicket({ ...newTicket, ticketDate: e.target.value })}
                      required
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
                      Expiration Date *
                    </label>
                    <input
                      type="date"
                      value={newTicket.expirationDate}
                      onChange={(e) => setNewTicket({ ...newTicket, expirationDate: e.target.value })}
                      required
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

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>
                    Type
                  </label>
                  <select
                    value={newTicket.type}
                    onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: 'var(--space-sm)',
                      border: '2px solid var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-base)'
                    }}
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="EMERGENCY">Emergency</option>
                    <option value="ROUTINE">Routine</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Add Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTicket(false)}
                    style={{
                      flex: 1,
                      padding: 'var(--space-sm) var(--space-md)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-secondary)',
                      border: '2px solid var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
