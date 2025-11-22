'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

interface OverviewKPIs {
  activeProjects: number
  boresInProgress: number
  avgBoreCompletionRate: number
  complianceRate811: number
  inspectionPassRate: number
  rodLoggingEfficiency: number
  dailyReportCompletionRate: number
  equipmentUtilizationRate: number
  totalLinearFeet: number
  avgProjectProfitability: number
}

export default function AdvancedKPICards() {
  const [kpis, setKpis] = useState<OverviewKPIs | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchKPIs()
  }, [])

  const fetchKPIs = async () => {
    try {
      const response = await fetch('/api/kpis/overview')
      if (!response.ok) {
        if (response.status === 403) {
          // User doesn't have permission, skip
          setLoading(false)
          return
        }
        throw new Error('Failed to fetch KPIs')
      }
      const data = await response.json()
      setKpis(data.kpis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load KPIs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error || !kpis) {
    return null // Don't show error for permission issues
  }

  const getStatusColor = (value: number, threshold: number, inverse = false) => {
    const isGood = inverse ? value < threshold : value >= threshold
    return isGood ? 'text-green-600' : 'text-red-600'
  }

  const getTrendIcon = (value: number, threshold: number, inverse = false) => {
    const isGood = inverse ? value < threshold : value >= threshold
    return isGood ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Top Row - Critical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 811 Compliance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">811 Compliance</span>
            {kpis.complianceRate811 < 90 && (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
          </div>
          <div className={`text-3xl font-bold mb-1 ${getStatusColor(kpis.complianceRate811, 90)}`}>
            {kpis.complianceRate811.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            {getTrendIcon(kpis.complianceRate811, 90)}
            Active tickets
          </div>
        </div>

        {/* Inspection Pass Rate */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Inspection Pass Rate</div>
          <div className={`text-3xl font-bold mb-1 ${getStatusColor(kpis.inspectionPassRate, 85)}`}>
            {kpis.inspectionPassRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            {getTrendIcon(kpis.inspectionPassRate, 85)}
            Without corrective actions
          </div>
        </div>

        {/* Daily Report Completion */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">On-Time Reports</div>
          <div className={`text-3xl font-bold mb-1 ${getStatusColor(kpis.dailyReportCompletionRate, 90)}`}>
            {kpis.dailyReportCompletionRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            {getTrendIcon(kpis.dailyReportCompletionRate, 90)}
            By 8pm deadline
          </div>
        </div>

        {/* Rod Logging Efficiency */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Rod Log Efficiency</div>
          <div className={`text-3xl font-bold mb-1 ${getStatusColor(kpis.rodLoggingEfficiency, 80)}`}>
            {kpis.rodLoggingEfficiency.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            {getTrendIcon(kpis.rodLoggingEfficiency, 80)}
            Passes logged vs expected
          </div>
        </div>
      </div>

      {/* Bottom Row - Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bore Completion Rate */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Bore Rate</div>
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {kpis.avgBoreCompletionRate.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">ft/day</div>
        </div>

        {/* Total Linear Feet */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total LF (30d)</div>
          <div className="text-3xl font-bold text-orange-600 mb-1">
            {kpis.totalLinearFeet.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">linear feet</div>
        </div>

        {/* Equipment Utilization */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Equipment Utilization</div>
          <div className={`text-3xl font-bold mb-1 ${getStatusColor(kpis.equipmentUtilizationRate, 70)}`}>
            {kpis.equipmentUtilizationRate.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            {getTrendIcon(kpis.equipmentUtilizationRate, 70)}
            Hours used
          </div>
        </div>
      </div>
    </div>
  )
}
