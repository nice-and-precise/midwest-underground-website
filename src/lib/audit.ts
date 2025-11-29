/**
 * Audit Logging Service
 * Provides persistent audit trail for security-sensitive actions
 */

import { info, warn, error } from './logger'

export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGOUT'
  | 'PASSWORD_CHANGE'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'PERMISSION_CHANGE'
  | 'DATA_ACCESS'
  | 'DATA_CREATE'
  | 'DATA_UPDATE'
  | 'DATA_DELETE'
  | 'DATA_EXPORT'
  | 'SETTINGS_CHANGE'
  | 'API_ACCESS'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SECURITY_ALERT'

export type AuditSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface AuditEntry {
  timestamp: Date
  action: AuditAction
  severity: AuditSeverity
  userId?: string
  userEmail?: string
  ipAddress?: string
  userAgent?: string
  resource?: string
  resourceId?: string
  details?: Record<string, unknown>
  success: boolean
  errorMessage?: string
}

// In-memory audit store (for development/testing)
// In production, this should be persisted to database
const auditStore: AuditEntry[] = []
const MAX_IN_MEMORY_ENTRIES = 10000

/**
 * Determine severity based on action type
 */
function getSeverity(action: AuditAction, success: boolean): AuditSeverity {
  const criticalActions: AuditAction[] = [
    'LOGIN_FAILURE',
    'SECURITY_ALERT',
    'PERMISSION_CHANGE',
    'USER_DELETE'
  ]

  const highActions: AuditAction[] = [
    'PASSWORD_CHANGE',
    'USER_CREATE',
    'DATA_DELETE',
    'DATA_EXPORT',
    'RATE_LIMIT_EXCEEDED'
  ]

  const mediumActions: AuditAction[] = [
    'LOGIN_SUCCESS',
    'LOGOUT',
    'USER_UPDATE',
    'DATA_UPDATE',
    'SETTINGS_CHANGE'
  ]

  if (!success && criticalActions.includes(action)) {
    return 'CRITICAL'
  }

  if (criticalActions.includes(action)) return 'HIGH'
  if (highActions.includes(action)) return 'MEDIUM'
  if (mediumActions.includes(action)) return 'LOW'

  return 'LOW'
}

/**
 * Create an audit log entry
 */
export function createAuditEntry(
  action: AuditAction,
  options: {
    userId?: string
    userEmail?: string
    ipAddress?: string
    userAgent?: string
    resource?: string
    resourceId?: string
    details?: Record<string, unknown>
    success?: boolean
    errorMessage?: string
  } = {}
): AuditEntry {
  const {
    userId,
    userEmail,
    ipAddress,
    userAgent,
    resource,
    resourceId,
    details,
    success = true,
    errorMessage
  } = options

  const entry: AuditEntry = {
    timestamp: new Date(),
    action,
    severity: getSeverity(action, success),
    userId,
    userEmail,
    ipAddress,
    userAgent,
    resource,
    resourceId,
    details,
    success,
    ...(errorMessage && { errorMessage })
  }

  return entry
}

/**
 * Log an audit entry
 */
export function audit(entry: AuditEntry): void {
  // Store in memory
  auditStore.push(entry)

  // Trim if exceeds max
  if (auditStore.length > MAX_IN_MEMORY_ENTRIES) {
    auditStore.shift()
  }

  // Also log to console/file based on severity
  const logContext = {
    action: entry.action,
    userId: entry.userId,
    resource: entry.resource,
    resourceId: entry.resourceId,
    success: entry.success,
    ...(entry.details && { details: entry.details })
  }

  switch (entry.severity) {
    case 'CRITICAL':
      error(`AUDIT [CRITICAL]: ${entry.action}`, logContext)
      break
    case 'HIGH':
      warn(`AUDIT [HIGH]: ${entry.action}`, logContext)
      break
    case 'MEDIUM':
      info(`AUDIT [MEDIUM]: ${entry.action}`, logContext)
      break
    default:
      info(`AUDIT [LOW]: ${entry.action}`, logContext)
  }
}

/**
 * Log and create audit entry in one call
 */
export function logAudit(
  action: AuditAction,
  options: {
    userId?: string
    userEmail?: string
    ipAddress?: string
    userAgent?: string
    resource?: string
    resourceId?: string
    details?: Record<string, unknown>
    success?: boolean
    errorMessage?: string
  } = {}
): AuditEntry {
  const entry = createAuditEntry(action, options)
  audit(entry)
  return entry
}

// Convenience functions for common audit actions

export function auditLogin(
  success: boolean,
  options: {
    userId?: string
    userEmail?: string
    ipAddress?: string
    userAgent?: string
    errorMessage?: string
  }
): AuditEntry {
  return logAudit(success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILURE', {
    ...options,
    success,
    details: { attemptTime: new Date().toISOString() }
  })
}

export function auditLogout(options: {
  userId: string
  userEmail?: string
  ipAddress?: string
}): AuditEntry {
  return logAudit('LOGOUT', { ...options, success: true })
}

export function auditDataAccess(options: {
  userId: string
  resource: string
  resourceId?: string
  ipAddress?: string
  details?: Record<string, unknown>
}): AuditEntry {
  return logAudit('DATA_ACCESS', { ...options, success: true })
}

export function auditDataChange(
  action: 'DATA_CREATE' | 'DATA_UPDATE' | 'DATA_DELETE',
  options: {
    userId: string
    resource: string
    resourceId?: string
    ipAddress?: string
    details?: Record<string, unknown>
    success?: boolean
    errorMessage?: string
  }
): AuditEntry {
  return logAudit(action, options)
}

export function auditSecurityAlert(
  message: string,
  options: {
    userId?: string
    ipAddress?: string
    userAgent?: string
    details?: Record<string, unknown>
  }
): AuditEntry {
  return logAudit('SECURITY_ALERT', {
    ...options,
    success: false,
    errorMessage: message,
    details: { ...options.details, alertMessage: message }
  })
}

export function auditRateLimitExceeded(options: {
  ipAddress: string
  endpoint?: string
  userId?: string
}): AuditEntry {
  return logAudit('RATE_LIMIT_EXCEEDED', {
    ...options,
    success: false,
    resource: options.endpoint,
    details: { endpoint: options.endpoint }
  })
}

// Query functions

/**
 * Get recent audit entries
 */
export function getRecentAuditEntries(
  limit: number = 100,
  filters?: {
    action?: AuditAction
    userId?: string
    severity?: AuditSeverity
    success?: boolean
    startDate?: Date
    endDate?: Date
  }
): AuditEntry[] {
  let entries = [...auditStore]

  if (filters) {
    if (filters.action) {
      entries = entries.filter(e => e.action === filters.action)
    }
    if (filters.userId) {
      entries = entries.filter(e => e.userId === filters.userId)
    }
    if (filters.severity) {
      entries = entries.filter(e => e.severity === filters.severity)
    }
    if (filters.success !== undefined) {
      entries = entries.filter(e => e.success === filters.success)
    }
    if (filters.startDate) {
      entries = entries.filter(e => e.timestamp >= filters.startDate!)
    }
    if (filters.endDate) {
      entries = entries.filter(e => e.timestamp <= filters.endDate!)
    }
  }

  return entries
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)
}

/**
 * Get audit entries for a specific user
 */
export function getUserAuditTrail(
  userId: string,
  limit: number = 50
): AuditEntry[] {
  return getRecentAuditEntries(limit, { userId })
}

/**
 * Get failed login attempts for security monitoring
 */
export function getFailedLoginAttempts(
  ipAddress?: string,
  timeWindowMs: number = 60 * 60 * 1000 // 1 hour
): AuditEntry[] {
  const startDate = new Date(Date.now() - timeWindowMs)

  let entries = getRecentAuditEntries(1000, {
    action: 'LOGIN_FAILURE',
    success: false,
    startDate
  })

  if (ipAddress) {
    entries = entries.filter(e => e.ipAddress === ipAddress)
  }

  return entries
}

/**
 * Clear audit store (for testing only)
 */
export function clearAuditStore(): void {
  auditStore.length = 0
}

/**
 * Get audit store size
 */
export function getAuditStoreSize(): number {
  return auditStore.length
}
