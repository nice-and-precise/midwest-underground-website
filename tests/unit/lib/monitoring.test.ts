import { describe, it, expect, beforeEach } from 'vitest'
import {
  getUptime,
  recordRequest,
  getMetrics,
  getResponseTimePercentiles,
  resetMetrics,
  getErrorRate,
  performHealthCheck,
  createHealthResponse,
  createTimer,
  withTiming
} from '@/lib/monitoring'

describe('Monitoring', () => {
  beforeEach(() => {
    resetMetrics()
  })

  describe('getUptime', () => {
    it('should return uptime in seconds', () => {
      const uptime = getUptime()
      expect(typeof uptime).toBe('number')
      expect(uptime).toBeGreaterThanOrEqual(0)
    })
  })

  describe('recordRequest and getMetrics', () => {
    it('should track request count', () => {
      recordRequest(100)
      recordRequest(150)
      recordRequest(200)

      const metrics = getMetrics()
      expect(metrics.requestCount).toBe(3)
    })

    it('should track error count', () => {
      recordRequest(100, false)
      recordRequest(150, true)
      recordRequest(200, true)

      const metrics = getMetrics()
      expect(metrics.errorCount).toBe(2)
    })

    it('should calculate average response time', () => {
      recordRequest(100)
      recordRequest(200)
      recordRequest(300)

      const metrics = getMetrics()
      expect(metrics.averageResponseTime).toBe(200)
    })

    it('should return timestamp in metrics', () => {
      const metrics = getMetrics()
      expect(metrics.timestamp).toBeDefined()
      expect(new Date(metrics.timestamp).getTime()).toBeLessThanOrEqual(Date.now())
    })
  })

  describe('getResponseTimePercentiles', () => {
    it('should return zeros with no data', () => {
      const percentiles = getResponseTimePercentiles()
      expect(percentiles.p50).toBe(0)
      expect(percentiles.p90).toBe(0)
      expect(percentiles.p95).toBe(0)
      expect(percentiles.p99).toBe(0)
    })

    it('should calculate percentiles correctly', () => {
      // Add 100 requests with increasing times
      for (let i = 1; i <= 100; i++) {
        recordRequest(i * 10)
      }

      const percentiles = getResponseTimePercentiles()
      // Allow small variation due to Math.floor rounding
      expect(percentiles.p50).toBeGreaterThanOrEqual(490)
      expect(percentiles.p50).toBeLessThanOrEqual(520)
      expect(percentiles.p90).toBeGreaterThanOrEqual(890)
      expect(percentiles.p90).toBeLessThanOrEqual(920)
      expect(percentiles.p95).toBeGreaterThanOrEqual(940)
      expect(percentiles.p95).toBeLessThanOrEqual(970)
      expect(percentiles.p99).toBeGreaterThanOrEqual(980)
      expect(percentiles.p99).toBeLessThanOrEqual(1010)
    })
  })

  describe('resetMetrics', () => {
    it('should reset all metrics', () => {
      recordRequest(100)
      recordRequest(200, true)

      resetMetrics()

      const metrics = getMetrics()
      expect(metrics.requestCount).toBe(0)
      expect(metrics.errorCount).toBe(0)
      expect(metrics.averageResponseTime).toBe(0)
    })
  })

  describe('getErrorRate', () => {
    it('should return 0 with no requests', () => {
      expect(getErrorRate()).toBe(0)
    })

    it('should calculate error rate correctly', () => {
      recordRequest(100)
      recordRequest(100, true)
      recordRequest(100)
      recordRequest(100, true)

      expect(getErrorRate()).toBe(50)
    })
  })

  describe('performHealthCheck', () => {
    it('should return healthy status by default', async () => {
      const result = await performHealthCheck()

      expect(result.status).toBe('healthy')
      expect(result.timestamp).toBeDefined()
      expect(result.uptime).toBeGreaterThanOrEqual(0)
      expect(result.checks).toBeDefined()
    })

    it('should include standard checks', async () => {
      const result = await performHealthCheck()
      const checkNames = result.checks.map(c => c.name)

      expect(checkNames).toContain('memory')
      expect(checkNames).toContain('error_rate')
      expect(checkNames).toContain('response_time')
    })

    it('should run custom checks', async () => {
      const result = await performHealthCheck([
        {
          name: 'custom_check',
          check: async () => true
        }
      ])

      const customCheck = result.checks.find(c => c.name === 'custom_check')
      expect(customCheck).toBeDefined()
      expect(customCheck?.status).toBe('pass')
    })

    it('should handle failing custom checks', async () => {
      const result = await performHealthCheck([
        {
          name: 'failing_check',
          check: async () => false
        }
      ])

      expect(result.status).toBe('unhealthy')
      const failingCheck = result.checks.find(c => c.name === 'failing_check')
      expect(failingCheck?.status).toBe('fail')
    })

    it('should handle custom check errors', async () => {
      const result = await performHealthCheck([
        {
          name: 'error_check',
          check: async () => { throw new Error('Check failed') }
        }
      ])

      expect(result.status).toBe('unhealthy')
      const errorCheck = result.checks.find(c => c.name === 'error_check')
      expect(errorCheck?.status).toBe('fail')
      expect(errorCheck?.message).toBe('Check failed')
    })
  })

  describe('createHealthResponse', () => {
    it('should return health response object', () => {
      const response = createHealthResponse()

      expect(response.status).toBe('ok')
      expect(response.timestamp).toBeDefined()
      expect(response.uptime).toBeGreaterThanOrEqual(0)
      expect(response.version).toBeDefined()
    })
  })

  describe('createTimer', () => {
    it('should track elapsed time', async () => {
      const timer = createTimer()

      await new Promise(resolve => setTimeout(resolve, 50))
      const elapsed = timer.elapsed()

      expect(elapsed).toBeGreaterThanOrEqual(40)
      expect(elapsed).toBeLessThan(150)
    })

    it('should reset correctly', async () => {
      const timer = createTimer()

      await new Promise(resolve => setTimeout(resolve, 30))
      timer.reset()

      const elapsed = timer.elapsed()
      expect(elapsed).toBeLessThan(30)
    })
  })

  describe('withTiming', () => {
    it('should return result and duration', async () => {
      const { result, duration } = await withTiming(async () => {
        await new Promise(resolve => setTimeout(resolve, 20))
        return 'test'
      })

      expect(result).toBe('test')
      expect(duration).toBeGreaterThanOrEqual(10)
    })
  })
})
