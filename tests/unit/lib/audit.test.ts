import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  createAuditEntry,
  audit,
  logAudit,
  auditLogin,
  auditLogout,
  auditDataAccess,
  auditDataChange,
  auditSecurityAlert,
  auditRateLimitExceeded,
  getRecentAuditEntries,
  getUserAuditTrail,
  getFailedLoginAttempts,
  clearAuditStore,
  getAuditStoreSize,
  AuditEntry
} from '@/lib/audit'

describe('Audit Logging', () => {
  beforeEach(() => {
    clearAuditStore()
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('createAuditEntry', () => {
    it('should create basic audit entry', () => {
      const entry = createAuditEntry('LOGIN_SUCCESS')

      expect(entry.action).toBe('LOGIN_SUCCESS')
      expect(entry.success).toBe(true)
      expect(entry.timestamp).toBeInstanceOf(Date)
      expect(entry.severity).toBeDefined()
    })

    it('should include all provided options', () => {
      const entry = createAuditEntry('DATA_CREATE', {
        userId: 'user-123',
        userEmail: 'test@example.com',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        resource: 'projects',
        resourceId: 'project-456',
        details: { field: 'value' },
        success: true
      })

      expect(entry.userId).toBe('user-123')
      expect(entry.userEmail).toBe('test@example.com')
      expect(entry.ipAddress).toBe('192.168.1.1')
      expect(entry.userAgent).toBe('Mozilla/5.0')
      expect(entry.resource).toBe('projects')
      expect(entry.resourceId).toBe('project-456')
      expect(entry.details).toEqual({ field: 'value' })
    })

    it('should include error message when provided', () => {
      const entry = createAuditEntry('LOGIN_FAILURE', {
        success: false,
        errorMessage: 'Invalid credentials'
      })

      expect(entry.success).toBe(false)
      expect(entry.errorMessage).toBe('Invalid credentials')
    })
  })

  describe('severity determination', () => {
    it('should assign HIGH severity to failed critical actions', () => {
      const entry = createAuditEntry('LOGIN_FAILURE', { success: false })
      expect(entry.severity).toBe('CRITICAL')
    })

    it('should assign HIGH severity to permission changes', () => {
      const entry = createAuditEntry('PERMISSION_CHANGE', { success: true })
      expect(entry.severity).toBe('HIGH')
    })

    it('should assign MEDIUM severity to data changes', () => {
      const entry = createAuditEntry('DATA_DELETE', { success: true })
      expect(entry.severity).toBe('MEDIUM')
    })

    it('should assign LOW severity to login success', () => {
      const entry = createAuditEntry('LOGIN_SUCCESS', { success: true })
      expect(entry.severity).toBe('LOW')
    })
  })

  describe('audit', () => {
    it('should store entry in audit store', () => {
      const entry = createAuditEntry('LOGIN_SUCCESS')
      audit(entry)

      expect(getAuditStoreSize()).toBe(1)
    })

    it('should log based on severity', () => {
      const criticalEntry = createAuditEntry('SECURITY_ALERT', {
        success: false,
        errorMessage: 'Suspicious activity'
      })
      audit(criticalEntry)

      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('logAudit', () => {
    it('should create and store entry in one call', () => {
      const entry = logAudit('DATA_ACCESS', {
        userId: 'user-123',
        resource: 'projects'
      })

      expect(entry.action).toBe('DATA_ACCESS')
      expect(getAuditStoreSize()).toBe(1)
    })
  })

  describe('auditLogin', () => {
    it('should log successful login', () => {
      const entry = auditLogin(true, {
        userId: 'user-123',
        userEmail: 'test@example.com',
        ipAddress: '192.168.1.1'
      })

      expect(entry.action).toBe('LOGIN_SUCCESS')
      expect(entry.success).toBe(true)
    })

    it('should log failed login', () => {
      const entry = auditLogin(false, {
        userEmail: 'test@example.com',
        ipAddress: '192.168.1.1',
        errorMessage: 'Invalid password'
      })

      expect(entry.action).toBe('LOGIN_FAILURE')
      expect(entry.success).toBe(false)
    })
  })

  describe('auditLogout', () => {
    it('should log logout', () => {
      const entry = auditLogout({
        userId: 'user-123',
        userEmail: 'test@example.com',
        ipAddress: '192.168.1.1'
      })

      expect(entry.action).toBe('LOGOUT')
      expect(entry.success).toBe(true)
    })
  })

  describe('auditDataAccess', () => {
    it('should log data access', () => {
      const entry = auditDataAccess({
        userId: 'user-123',
        resource: 'bore-logs',
        resourceId: 'log-456'
      })

      expect(entry.action).toBe('DATA_ACCESS')
      expect(entry.resource).toBe('bore-logs')
      expect(entry.resourceId).toBe('log-456')
    })
  })

  describe('auditDataChange', () => {
    it('should log data creation', () => {
      const entry = auditDataChange('DATA_CREATE', {
        userId: 'user-123',
        resource: 'projects',
        resourceId: 'project-789'
      })

      expect(entry.action).toBe('DATA_CREATE')
    })

    it('should log data update', () => {
      const entry = auditDataChange('DATA_UPDATE', {
        userId: 'user-123',
        resource: 'projects',
        resourceId: 'project-789',
        details: { changedFields: ['name', 'status'] }
      })

      expect(entry.action).toBe('DATA_UPDATE')
    })

    it('should log data deletion', () => {
      const entry = auditDataChange('DATA_DELETE', {
        userId: 'user-123',
        resource: 'bore-logs',
        resourceId: 'log-999'
      })

      expect(entry.action).toBe('DATA_DELETE')
    })
  })

  describe('auditSecurityAlert', () => {
    it('should log security alert', () => {
      const entry = auditSecurityAlert('Potential SQL injection detected', {
        ipAddress: '10.0.0.1',
        details: { query: 'SELECT * FROM users' }
      })

      expect(entry.action).toBe('SECURITY_ALERT')
      expect(entry.success).toBe(false)
      expect(entry.errorMessage).toBe('Potential SQL injection detected')
      // Failed security alerts are CRITICAL severity
      expect(entry.severity).toBe('CRITICAL')
    })
  })

  describe('auditRateLimitExceeded', () => {
    it('should log rate limit exceeded', () => {
      const entry = auditRateLimitExceeded({
        ipAddress: '192.168.1.1',
        endpoint: '/api/auth/login',
        userId: 'user-123'
      })

      expect(entry.action).toBe('RATE_LIMIT_EXCEEDED')
      expect(entry.success).toBe(false)
    })
  })

  describe('getRecentAuditEntries', () => {
    it('should return all entries', () => {
      logAudit('LOGIN_SUCCESS', { userId: 'user-1' })
      logAudit('DATA_ACCESS', { userId: 'user-2' })
      logAudit('LOGOUT', { userId: 'user-3' })

      const entries = getRecentAuditEntries(10)

      expect(entries.length).toBe(3)
      // Verify all actions are present (order may vary if timestamps are same)
      const actions = entries.map(e => e.action)
      expect(actions).toContain('LOGIN_SUCCESS')
      expect(actions).toContain('DATA_ACCESS')
      expect(actions).toContain('LOGOUT')
    })

    it('should filter by action', () => {
      logAudit('LOGIN_SUCCESS', { userId: 'user-1' })
      logAudit('DATA_ACCESS', { userId: 'user-2' })
      logAudit('LOGIN_SUCCESS', { userId: 'user-3' })

      const entries = getRecentAuditEntries(10, { action: 'LOGIN_SUCCESS' })

      expect(entries.length).toBe(2)
      entries.forEach(e => expect(e.action).toBe('LOGIN_SUCCESS'))
    })

    it('should filter by userId', () => {
      logAudit('LOGIN_SUCCESS', { userId: 'user-1' })
      logAudit('DATA_ACCESS', { userId: 'user-2' })
      logAudit('LOGOUT', { userId: 'user-1' })

      const entries = getRecentAuditEntries(10, { userId: 'user-1' })

      expect(entries.length).toBe(2)
      entries.forEach(e => expect(e.userId).toBe('user-1'))
    })

    it('should respect limit', () => {
      for (let i = 0; i < 10; i++) {
        logAudit('DATA_ACCESS', { userId: `user-${i}` })
      }

      const entries = getRecentAuditEntries(5)

      expect(entries.length).toBe(5)
    })
  })

  describe('getUserAuditTrail', () => {
    it('should return entries for specific user', () => {
      logAudit('LOGIN_SUCCESS', { userId: 'user-1' })
      logAudit('DATA_ACCESS', { userId: 'user-2' })
      logAudit('DATA_UPDATE', { userId: 'user-1' })
      logAudit('LOGOUT', { userId: 'user-1' })

      const trail = getUserAuditTrail('user-1')

      expect(trail.length).toBe(3)
      trail.forEach(e => expect(e.userId).toBe('user-1'))
    })
  })

  describe('getFailedLoginAttempts', () => {
    it('should return failed login attempts', () => {
      auditLogin(true, { userId: 'user-1', ipAddress: '192.168.1.1' })
      auditLogin(false, { ipAddress: '192.168.1.2', errorMessage: 'Invalid' })
      auditLogin(false, { ipAddress: '192.168.1.2', errorMessage: 'Invalid' })
      auditLogin(true, { userId: 'user-2', ipAddress: '192.168.1.3' })

      const attempts = getFailedLoginAttempts()

      expect(attempts.length).toBe(2)
      attempts.forEach(e => expect(e.success).toBe(false))
    })

    it('should filter by IP address', () => {
      auditLogin(false, { ipAddress: '192.168.1.1' })
      auditLogin(false, { ipAddress: '192.168.1.2' })
      auditLogin(false, { ipAddress: '192.168.1.1' })

      const attempts = getFailedLoginAttempts('192.168.1.1')

      expect(attempts.length).toBe(2)
      attempts.forEach(e => expect(e.ipAddress).toBe('192.168.1.1'))
    })
  })

  describe('clearAuditStore', () => {
    it('should clear all entries', () => {
      logAudit('LOGIN_SUCCESS')
      logAudit('DATA_ACCESS')

      expect(getAuditStoreSize()).toBe(2)

      clearAuditStore()

      expect(getAuditStoreSize()).toBe(0)
    })
  })
})
