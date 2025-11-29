/**
 * Monitoring Utilities
 * Health checks, metrics collection, and system status
 */

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  checks: {
    name: string
    status: 'pass' | 'warn' | 'fail'
    message?: string
    duration?: number
  }[]
}

export interface SystemMetrics {
  timestamp: string
  requestCount: number
  errorCount: number
  averageResponseTime: number
  activeConnections: number
}

// Track startup time
const startTime = Date.now()

// Simple metrics store
interface MetricsStore {
  requestCount: number
  errorCount: number
  totalResponseTime: number
  responseTimes: number[]
  lastReset: Date
}

const metrics: MetricsStore = {
  requestCount: 0,
  errorCount: 0,
  totalResponseTime: 0,
  responseTimes: [],
  lastReset: new Date()
}

const MAX_RESPONSE_TIMES = 1000

/**
 * Get system uptime in seconds
 */
export function getUptime(): number {
  return Math.floor((Date.now() - startTime) / 1000)
}

/**
 * Record a request for metrics
 */
export function recordRequest(responseTimeMs: number, isError: boolean = false): void {
  metrics.requestCount++
  metrics.totalResponseTime += responseTimeMs

  // Keep last N response times for percentile calculations
  metrics.responseTimes.push(responseTimeMs)
  if (metrics.responseTimes.length > MAX_RESPONSE_TIMES) {
    metrics.responseTimes.shift()
  }

  if (isError) {
    metrics.errorCount++
  }
}

/**
 * Get current metrics
 */
export function getMetrics(): SystemMetrics {
  const avgResponseTime = metrics.requestCount > 0
    ? metrics.totalResponseTime / metrics.requestCount
    : 0

  return {
    timestamp: new Date().toISOString(),
    requestCount: metrics.requestCount,
    errorCount: metrics.errorCount,
    averageResponseTime: Math.round(avgResponseTime * 100) / 100,
    activeConnections: 0 // Would need server integration
  }
}

/**
 * Get response time percentiles
 */
export function getResponseTimePercentiles(): {
  p50: number
  p90: number
  p95: number
  p99: number
} {
  if (metrics.responseTimes.length === 0) {
    return { p50: 0, p90: 0, p95: 0, p99: 0 }
  }

  const sorted = [...metrics.responseTimes].sort((a, b) => a - b)
  const len = sorted.length

  return {
    p50: sorted[Math.floor(len * 0.5)] || 0,
    p90: sorted[Math.floor(len * 0.9)] || 0,
    p95: sorted[Math.floor(len * 0.95)] || 0,
    p99: sorted[Math.floor(len * 0.99)] || 0
  }
}

/**
 * Reset metrics (typically at midnight or on demand)
 */
export function resetMetrics(): void {
  metrics.requestCount = 0
  metrics.errorCount = 0
  metrics.totalResponseTime = 0
  metrics.responseTimes = []
  metrics.lastReset = new Date()
}

/**
 * Calculate error rate
 */
export function getErrorRate(): number {
  if (metrics.requestCount === 0) return 0
  return (metrics.errorCount / metrics.requestCount) * 100
}

/**
 * Perform a health check
 */
export async function performHealthCheck(
  customChecks?: Array<{
    name: string
    check: () => Promise<boolean>
  }>
): Promise<HealthCheckResult> {
  const checks: HealthCheckResult['checks'] = []
  let overallStatus: HealthCheckResult['status'] = 'healthy'

  // Memory check
  if (typeof process !== 'undefined' && process.memoryUsage) {
    try {
      const memUsage = process.memoryUsage()
      const heapUsedMB = memUsage.heapUsed / 1024 / 1024
      const heapTotalMB = memUsage.heapTotal / 1024 / 1024
      const heapPercent = (heapUsedMB / heapTotalMB) * 100

      checks.push({
        name: 'memory',
        status: heapPercent > 90 ? 'fail' : heapPercent > 75 ? 'warn' : 'pass',
        message: `Heap usage: ${heapUsedMB.toFixed(1)}MB / ${heapTotalMB.toFixed(1)}MB (${heapPercent.toFixed(1)}%)`
      })

      if (heapPercent > 90) overallStatus = 'unhealthy'
      else if (heapPercent > 75 && overallStatus !== 'unhealthy') overallStatus = 'degraded'
    } catch {
      checks.push({
        name: 'memory',
        status: 'warn',
        message: 'Could not check memory usage'
      })
    }
  }

  // Error rate check
  const errorRate = getErrorRate()
  checks.push({
    name: 'error_rate',
    status: errorRate > 5 ? 'fail' : errorRate > 1 ? 'warn' : 'pass',
    message: `Error rate: ${errorRate.toFixed(2)}%`
  })

  if (errorRate > 5) overallStatus = 'unhealthy'
  else if (errorRate > 1 && overallStatus !== 'unhealthy') overallStatus = 'degraded'

  // Response time check
  const percentiles = getResponseTimePercentiles()
  checks.push({
    name: 'response_time',
    status: percentiles.p95 > 2000 ? 'fail' : percentiles.p95 > 1000 ? 'warn' : 'pass',
    message: `P95 response time: ${percentiles.p95}ms`
  })

  if (percentiles.p95 > 2000) overallStatus = 'unhealthy'
  else if (percentiles.p95 > 1000 && overallStatus !== 'unhealthy') overallStatus = 'degraded'

  // Custom checks
  if (customChecks) {
    for (const { name, check } of customChecks) {
      const startTime = Date.now()
      try {
        const result = await check()
        const duration = Date.now() - startTime
        checks.push({
          name,
          status: result ? 'pass' : 'fail',
          duration
        })
        if (!result) overallStatus = 'unhealthy'
      } catch (err) {
        const duration = Date.now() - startTime
        checks.push({
          name,
          status: 'fail',
          message: err instanceof Error ? err.message : 'Check failed',
          duration
        })
        overallStatus = 'unhealthy'
      }
    }
  }

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: getUptime(),
    checks
  }
}

/**
 * Create a simple health check response for API endpoints
 */
export function createHealthResponse(): {
  status: string
  timestamp: string
  uptime: number
  version: string
} {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: getUptime(),
    version: process.env.npm_package_version || '1.0.0'
  }
}

/**
 * Performance timing utility
 */
export function createTimer(): {
  elapsed: () => number
  reset: () => void
} {
  let start = Date.now()

  return {
    elapsed: () => Date.now() - start,
    reset: () => { start = Date.now() }
  }
}

/**
 * Wrap an async function with timing
 */
export async function withTiming<T>(
  fn: () => Promise<T>,
  label: string = 'operation'
): Promise<{ result: T; duration: number }> {
  const timer = createTimer()
  const result = await fn()
  const duration = timer.elapsed()

  return { result, duration }
}
