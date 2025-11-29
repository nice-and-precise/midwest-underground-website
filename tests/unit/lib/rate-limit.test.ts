import { describe, it, expect, beforeEach } from 'vitest'
import {
  checkRateLimit,
  rateLimitConfigs,
  recordFailedLogin,
  recordSuccessfulLogin,
  isAccountLocked,
  accountLockConfig,
  getRateLimitHeaders,
  createRateLimitIdentifier,
  resetRateLimitStore
} from '@/lib/rate-limit'

describe('Rate Limiting', () => {
  beforeEach(() => {
    resetRateLimitStore()
  })

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit('test-ip')
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(rateLimitConfigs.api.maxRequests - 1)
    })

    it('should track requests and decrement remaining', () => {
      const identifier = 'test-ip-2'
      const result1 = checkRateLimit(identifier)
      const result2 = checkRateLimit(identifier)
      
      expect(result1.remaining).toBe(99)
      expect(result2.remaining).toBe(98)
    })

    it('should block requests after limit exceeded', () => {
      const identifier = 'test-ip-3'
      const config = { maxRequests: 3, windowMs: 60000 }
      
      checkRateLimit(identifier, config) // 1
      checkRateLimit(identifier, config) // 2
      checkRateLimit(identifier, config) // 3
      const result = checkRateLimit(identifier, config) // 4 - should be blocked
      
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should use auth config for auth endpoints', () => {
      const result = checkRateLimit('auth-ip', rateLimitConfigs.auth)
      expect(result.remaining).toBe(rateLimitConfigs.auth.maxRequests - 1)
    })

    it('should use contact config for contact form', () => {
      const result = checkRateLimit('contact-ip', rateLimitConfigs.contact)
      expect(result.remaining).toBe(rateLimitConfigs.contact.maxRequests - 1)
    })
  })

  describe('Account Lockout', () => {
    it('should not lock on first failed attempt', () => {
      const result = recordFailedLogin('user@example.com')
      expect(result.locked).toBe(false)
      expect(result.remainingAttempts).toBe(accountLockConfig.maxFailedAttempts - 1)
    })

    it('should track failed attempts', () => {
      const identifier = 'user2@example.com'
      recordFailedLogin(identifier) // 1
      recordFailedLogin(identifier) // 2
      const result = recordFailedLogin(identifier) // 3
      
      expect(result.locked).toBe(false)
      expect(result.remainingAttempts).toBe(2)
    })

    it('should lock account after max failed attempts', () => {
      const identifier = 'user3@example.com'
      for (let i = 0; i < accountLockConfig.maxFailedAttempts - 1; i++) {
        recordFailedLogin(identifier)
      }
      const result = recordFailedLogin(identifier) // This should trigger lock
      
      expect(result.locked).toBe(true)
      expect(result.remainingAttempts).toBe(0)
      expect(result.lockUntil).not.toBeNull()
    })

    it('should report locked status correctly', () => {
      const identifier = 'user4@example.com'
      for (let i = 0; i < accountLockConfig.maxFailedAttempts; i++) {
        recordFailedLogin(identifier)
      }
      
      const lockStatus = isAccountLocked(identifier)
      expect(lockStatus.locked).toBe(true)
      expect(lockStatus.remainingMs).toBeGreaterThan(0)
    })

    it('should reset failed attempts on successful login', () => {
      const identifier = 'user5@example.com'
      recordFailedLogin(identifier)
      recordFailedLogin(identifier)
      recordSuccessfulLogin(identifier)
      
      const lockStatus = isAccountLocked(identifier)
      expect(lockStatus.locked).toBe(false)
    })

    it('should return not locked for unknown identifier', () => {
      const lockStatus = isAccountLocked('unknown@example.com')
      expect(lockStatus.locked).toBe(false)
      expect(lockStatus.lockUntil).toBeNull()
    })
  })

  describe('getRateLimitHeaders', () => {
    it('should return proper header object', () => {
      const now = Date.now()
      const resetTime = now + 60000
      const headers = getRateLimitHeaders(50, resetTime)
      
      expect(headers['X-RateLimit-Remaining']).toBe('50')
      expect(headers['X-RateLimit-Reset']).toBeDefined()
      expect(headers['Retry-After']).toBeDefined()
    })
  })

  describe('createRateLimitIdentifier', () => {
    it('should create identifier from IP only', () => {
      const id = createRateLimitIdentifier('192.168.1.1')
      expect(id).toBe('192.168.1.1')
    })

    it('should create identifier with path', () => {
      const id = createRateLimitIdentifier('192.168.1.1', '/api/auth')
      expect(id).toBe('192.168.1.1:/api/auth')
    })
  })

  describe('rateLimitConfigs', () => {
    it('should have auth config with strict limits', () => {
      expect(rateLimitConfigs.auth.maxRequests).toBe(5)
      expect(rateLimitConfigs.auth.windowMs).toBe(15 * 60 * 1000)
    })

    it('should have api config with moderate limits', () => {
      expect(rateLimitConfigs.api.maxRequests).toBe(100)
      expect(rateLimitConfigs.api.windowMs).toBe(60 * 1000)
    })

    it('should have contact config for spam prevention', () => {
      expect(rateLimitConfigs.contact.maxRequests).toBe(3)
      expect(rateLimitConfigs.contact.windowMs).toBe(60 * 60 * 1000)
    })

    it('should have read config with higher limits', () => {
      expect(rateLimitConfigs.read.maxRequests).toBe(200)
      expect(rateLimitConfigs.read.windowMs).toBe(60 * 1000)
    })
  })

  describe('Account Lockout Edge Cases', () => {
    it('should return locked status when calling recordFailedLogin on locked account', () => {
      const identifier = 'locked-user@example.com'
      // Lock the account
      for (let i = 0; i < accountLockConfig.maxFailedAttempts; i++) {
        recordFailedLogin(identifier)
      }

      // Try to record another failed login while locked
      const result = recordFailedLogin(identifier)
      expect(result.locked).toBe(true)
      expect(result.remainingAttempts).toBe(0)
    })

    it('should return unlocked for account without lockUntil set', () => {
      const identifier = 'new-user@example.com'
      // Record some failures but not enough to lock
      recordFailedLogin(identifier)
      recordFailedLogin(identifier)

      const lockStatus = isAccountLocked(identifier)
      expect(lockStatus.locked).toBe(false)
      expect(lockStatus.lockUntil).toBeNull()
      expect(lockStatus.remainingMs).toBeNull()
    })
  })

  describe('Rate Limit Entry Expiration', () => {
    it('should reset after window expires', () => {
      const identifier = 'expiring-ip'
      const shortWindow = { maxRequests: 2, windowMs: 10 } // 10ms window

      checkRateLimit(identifier, shortWindow)
      checkRateLimit(identifier, shortWindow)

      // Wait for window to expire
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const result = checkRateLimit(identifier, shortWindow)
          expect(result.allowed).toBe(true)
          expect(result.remaining).toBe(1)
          resolve()
        }, 20)
      })
    })
  })
})
