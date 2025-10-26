'use client'

import { useEffect, useState } from 'react'
import type { ProjectKPIs } from '@/lib/services/kpiService'

interface KPIDashboardProps {
  projectId: string
  startDate?: Date
  endDate?: Date
}

export default function KPIDashboard({ projectId, startDate, endDate }: KPIDashboardProps) {
  const [kpis, setKpis] = useState<ProjectKPIs | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchKPIs() {
      try {
        setLoading(true)
        const params = new URLSearchParams({ projectId })
        if (startDate) params.append('startDate', startDate.toISOString())
        if (endDate) params.append('endDate', endDate.toISOString())

        const response = await fetch(`/api/hdd/kpis?${params}`)
        if (!response.ok) throw new Error('Failed to fetch KPIs')

        const data = await response.json()
        setKpis(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchKPIs()
  }, [projectId, startDate, endDate])

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--space-lg)'
      }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            border: '2px solid var(--bg-secondary)'
          }}>
            <div style={{
              height: '80px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
          </div>
        ))}
      </div>
    )
  }

  if (error || !kpis) {
    return (
      <div style={{
        padding: 'var(--space-xl)',
        backgroundColor: '#fee',
        border: '2px solid #fcc',
        borderRadius: 'var(--radius-lg)',
        color: '#c00',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, fontWeight: 600 }}>
          {error || 'Failed to load KPIs'}
        </p>
      </div>
    )
  }

  const formatNumber = (num: number, decimals: number = 1) => {
    return num.toFixed(decimals)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num)
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return '#22c55e' // green
    if (trend < 0) return '#ef4444' // red
    return 'var(--text-secondary)' // gray
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return '↑'
    if (trend < 0) return '↓'
    return '→'
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 'var(--space-lg)'
    }}>
      {/* Feet per Crew Hour */}
      <div style={{
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '2px solid var(--bg-secondary)',
        transition: 'transform var(--transition-base), box-shadow var(--transition-base)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      }}>
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-xs)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Production Rate
        </div>
        <div style={{
          fontSize: 'var(--text-4xl)',
          fontWeight: 700,
          color: 'var(--color-primary)',
          marginBottom: 'var(--space-xs)'
        }}>
          {formatNumber(kpis.feetPerCrewHour, 1)}
          <span style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', marginLeft: 'var(--space-xs)' }}>
            ft/hr
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          fontSize: 'var(--text-sm)',
          color: getTrendColor(kpis.feetPerCrewHourTrend)
        }}>
          <span style={{ fontSize: 'var(--text-lg)' }}>{getTrendIcon(kpis.feetPerCrewHourTrend)}</span>
          <span style={{ fontWeight: 600 }}>
            {formatNumber(Math.abs(kpis.feetPerCrewHourTrend), 1)}%
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>vs previous period</span>
        </div>
      </div>

      {/* Cost per LF */}
      <div style={{
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '2px solid var(--bg-secondary)',
        transition: 'transform var(--transition-base), box-shadow var(--transition-base)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      }}>
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-xs)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Cost Performance
        </div>
        <div style={{
          fontSize: 'var(--text-4xl)',
          fontWeight: 700,
          color: kpis.costPerLF > kpis.budgetPerLF ? '#ef4444' : '#22c55e',
          marginBottom: 'var(--space-xs)'
        }}>
          {formatCurrency(kpis.costPerLF)}
          <span style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', marginLeft: 'var(--space-xs)' }}>
            /LF
          </span>
        </div>
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)'
        }}>
          Budget: {formatCurrency(kpis.budgetPerLF)}/LF
          <span style={{
            marginLeft: 'var(--space-xs)',
            fontWeight: 600,
            color: kpis.costPerLF <= kpis.budgetPerLF ? '#22c55e' : '#ef4444'
          }}>
            ({kpis.costPerLF <= kpis.budgetPerLF ? 'Under' : 'Over'} Budget)
          </span>
        </div>
      </div>

      {/* 811 Compliance */}
      <div style={{
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '2px solid var(--bg-secondary)',
        transition: 'transform var(--transition-base), box-shadow var(--transition-base)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      }}>
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-xs)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          811 Compliance
        </div>
        <div style={{
          fontSize: 'var(--text-4xl)',
          fontWeight: 700,
          color: kpis.complianceRate >= 95 ? '#22c55e' : kpis.complianceRate >= 80 ? '#f59e0b' : '#ef4444',
          marginBottom: 'var(--space-xs)'
        }}>
          {formatNumber(kpis.complianceRate, 0)}
          <span style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', marginLeft: 'var(--space-xs)' }}>
            %
          </span>
        </div>
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)'
        }}>
          {kpis.ticketsActive} active ticket{kpis.ticketsActive !== 1 ? 's' : ''}
          <span style={{
            marginLeft: 'var(--space-xs)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: kpis.complianceRate >= 95 ? '#dcfce7' : kpis.complianceRate >= 80 ? '#fef3c7' : '#fee2e2',
            color: kpis.complianceRate >= 95 ? '#166534' : kpis.complianceRate >= 80 ? '#92400e' : '#991b1b',
            fontWeight: 600,
            fontSize: 'var(--text-xs)'
          }}>
            {kpis.complianceRate >= 95 ? 'Excellent' : kpis.complianceRate >= 80 ? 'Good' : 'Needs Attention'}
          </span>
        </div>
      </div>

      {/* On-Time Daily Reports */}
      <div style={{
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '2px solid var(--bg-secondary)',
        transition: 'transform var(--transition-base), box-shadow var(--transition-base)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      }}>
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-xs)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Daily Reports
        </div>
        <div style={{
          fontSize: 'var(--text-4xl)',
          fontWeight: 700,
          color: kpis.onTimeReports >= 90 ? '#22c55e' : kpis.onTimeReports >= 70 ? '#f59e0b' : '#ef4444',
          marginBottom: 'var(--space-xs)'
        }}>
          {formatNumber(kpis.onTimeReports, 0)}
          <span style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', marginLeft: 'var(--space-xs)' }}>
            %
          </span>
        </div>
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)'
        }}>
          Submitted on time (by 8pm)
          <span style={{
            marginLeft: 'var(--space-xs)',
            fontWeight: 600,
            color: kpis.onTimeReports >= 90 ? '#22c55e' : '#f59e0b'
          }}>
            Target: 90%
          </span>
        </div>
      </div>

      {/* Additional Metrics Row */}
      <div style={{
        gridColumn: '1 / -1',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-md)',
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--bg-accent)',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--bg-secondary)'
      }}>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Linear Feet
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
            {kpis.totalLF.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Costs
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
            {formatCurrency(kpis.totalCosts)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
            Bores Per Day
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
            {formatNumber(kpis.boresPerDay, 1)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
            RFI Cycle Time
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
            {formatNumber(kpis.rfiCycleTime, 1)} days
          </div>
        </div>
      </div>
    </div>
  )
}
