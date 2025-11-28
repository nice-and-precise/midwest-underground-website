/**
 * Rate Limiting Utility
 * Implements in-memory rate limiting for API endpoints
 * For production, consider using Redis for distributed rate limiting
 */

import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetTime: number
}

interface RateLimitConfig {
  maxRequests: number  // Maximum requests allowed
  windowMs: number     // Time window in milliseconds
}

interface AccountLockEntry {
  failedAttempts: number
  lockUntil: number | null
  lastAttempt: number
}

// In-memory stores (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitEntry>()
const accountLockStore = new Map<string, AccountLockEntry>()

// Cleanup interval to prevent memory leaks
const CLEANUP_INTERVAL = 60 * 1000 // 1 minute

/**
 * Cleanup expired entries periodically
 */
function cleanupExpiredEntries() {
  const now = Date.now()

  // Cleanup rate limit entries
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }

  // Cleanup account lock entries (keep for 24 hours after last attempt)
  for (const [key, entry] of accountLockStore.entries()) {
    if (entry.lastAttempt + 24 * 60 * 60 * 1000 < now) {
      accountLockStore.delete(key)
    }
  }
}

// Start cleanup interval (only in non-test environments)
if (typeof setInterval !== 'undefined' && process.env.NODE_ENV !== 'test') {
  setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL)
}

/**
 * Default rate limit configurations for different endpoint types
 */
export const rateLimitConfigs = {
  // Auth endpoints - strict limiting
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000 // 15 minutes
  },
  // API endpoints - moderate limiting
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000 // 1 minute
  },
  // Contact form - prevent spam
  contact: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000 // 1 hour
  },
  // Read operations - higher limits
  read: {
    maxRequests: 200,
    windowMs: 60 * 1000 // 1 minute
  }
} as const

/**
 * Account lockout configuration
 */
export const accountLockConfig = {
  maxFailedAttempts: 5,      // Lock after 5 failed attempts
  lockDurationMs: 15 * 60 * 1000, // 15 minute lockout
  attemptWindowMs: 60 * 60 * 1000 // 1 hour window for counting attempts
}

/**
 * Check rate limit for a given identifier
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = rateLimitConfigs.api
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = identifier

  const entry = rateLimitStore.get(key)

  // No existing entry or expired entry
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs
    }
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    }
  }

  // Increment count
  entry.count++
  rateLimitStore.set(key, entry)

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime
  }
}

/**
 * Record a failed login attempt
 * @param identifier - User identifier (email or IP)
 * @returns Whether the account is now locked
 */
export function recordFailedLogin(identifier: string): {
  locked: boolean
  remainingAttempts: number
  lockUntil: number | null
} {
  const now = Date.now()
  const entry = accountLockStore.get(identifier)

  // Check if currently locked
  if (entry?.lockUntil && entry.lockUntil > now) {
    return {
      locked: true,
      remainingAttempts: 0,
      lockUntil: entry.lockUntil
    }
  }

  // Create new entry or update existing
  if (!entry || entry.lastAttempt + accountLockConfig.attemptWindowMs < now) {
    // Reset if no entry or outside window
    accountLockStore.set(identifier, {
      failedAttempts: 1,
      lockUntil: null,
      lastAttempt: now
    })
    return {
      locked: false,
      remainingAttempts: accountLockConfig.maxFailedAttempts - 1,
      lockUntil: null
    }
  }

  // Increment failed attempts
  const newAttempts = entry.failedAttempts + 1
  const shouldLock = newAttempts >= accountLockConfig.maxFailedAttempts
  const lockUntil = shouldLock ? now + accountLockConfig.lockDurationMs : null

  accountLockStore.set(identifier, {
    failedAttempts: newAttempts,
    lockUntil,
    lastAttempt: now
  })

  return {
    locked: shouldLock,
    remainingAttempts: shouldLock ? 0 : accountLockConfig.maxFailedAttempts - newAttempts,
    lockUntil
  }
}

/**
 * Record a successful login (resets failed attempts)
 * @param identifier - User identifier (email or IP)
 */
export function recordSuccessfulLogin(identifier: string): void {
  accountLockStore.delete(identifier)
}

/**
 * Check if an account is currently locked
 * @param identifier - User identifier
 * @returns Lock status and unlock time
 */
export function isAccountLocked(identifier: string): {
  locked: boolean
  lockUntil: number | null
  remainingMs: number | null
} {
  const now = Date.now()
  const entry = accountLockStore.get(identifier)

  if (!entry || !entry.lockUntil) {
    return { locked: false, lockUntil: null, remainingMs: null }
  }

  if (entry.lockUntil > now) {
    return {
      locked: true,
      lockUntil: entry.lockUntil,
      remainingMs: entry.lockUntil - now
    }
  }

  // Lock expired
  return { locked: false, lockUntil: null, remainingMs: null }
}

/**
 * Get rate limit headers for response
 * @param remaining - Remaining requests
 * @param resetTime - Reset timestamp
 * @returns Headers object
 */
export function getRateLimitHeaders(remaining: number, resetTime: number): Record<string, string> {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
    'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString()
  }
}

/**
 * Create identifier from request (IP + optional path)
 * @param ip - IP address
 * @param path - Optional path for route-specific limiting
 * @returns Combined identifier
 */
export function createRateLimitIdentifier(ip: string, path?: string): string {
  return path ? `${ip}:${path}` : ip
}

/**
 * Reset rate limit for testing purposes
 */
export function resetRateLimitStore(): void {
  rateLimitStore.clear()
  accountLockStore.clear()
}

// =============================================================================
// API Route Compatible Functions
// These functions match the signature expected by existing API routes
// =============================================================================

type RateLimitType = 'auth' | 'api' | 'contact' | 'read'

interface RateLimitResult {
  success: boolean
  response?: NextResponse
  headers: Record<string, string>
}

/**
 * Rate limit function for API routes
 * @param request - NextRequest object
 * @param type - Type of rate limit to apply
 * @returns Rate limit result with success status and headers
 */
export function rateLimit(request: NextRequest, type: RateLimitType = 'api'): RateLimitResult {
  // Get client IP from headers or fall back to a default
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwardedFor?.split(',')[0] || realIp || 'anonymous'

  // Get config for this type
  const config = rateLimitConfigs[type]

  // Create identifier combining IP and path for route-specific limiting
  const identifier = createRateLimitIdentifier(ip, request.nextUrl.pathname)

  // Check rate limit
  const result = checkRateLimit(identifier, config)
  const headers = getRateLimitHeaders(result.remaining, result.resetTime)

  if (!result.allowed) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers
        }
      ),
      headers
    }
  }

  return {
    success: true,
    headers
  }
}

/**
 * Apply rate limit headers to a response
 * @param response - NextResponse to modify
 * @param headers - Rate limit headers to apply
 * @returns The response with headers applied
 */
export function withRateLimitHeaders(
  response: NextResponse,
  headers: Record<string, string>
): NextResponse {
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}
