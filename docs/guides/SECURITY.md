# Security Guide

**Last Updated:** 2025-11-28
**Version:** 1.0.0
**Target Audience:** Developers, Security Reviewers

---

## Table of Contents

- [Overview](#overview)
- [Security Architecture](#security-architecture)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Input Validation](#input-validation)
- [Rate Limiting](#rate-limiting)
- [Security Headers](#security-headers)
- [Error Handling](#error-handling)
- [Audit Logging](#audit-logging)
- [Monitoring](#monitoring)
- [Best Practices](#best-practices)
- [Security Checklist](#security-checklist)

---

## Overview

This document describes the security architecture and features implemented in the Midwest Underground platform. The security implementation follows defense-in-depth principles with multiple layers of protection.

### Security Layers

```
┌─────────────────────────────────────────────────────┐
│                    Security Headers                  │
│              (CSP, HSTS, X-Frame-Options)           │
├─────────────────────────────────────────────────────┤
│                    Rate Limiting                     │
│        (IP-based, endpoint-specific limits)         │
├─────────────────────────────────────────────────────┤
│                   Authentication                     │
│           (NextAuth v5, JWT, bcrypt)                │
├─────────────────────────────────────────────────────┤
│                   Authorization                      │
│         (Role-based access control)                 │
├─────────────────────────────────────────────────────┤
│                 Input Validation                     │
│              (Zod schemas, sanitization)            │
├─────────────────────────────────────────────────────┤
│                  Audit Logging                       │
│        (Action tracking, security alerts)           │
└─────────────────────────────────────────────────────┘
```

---

## Security Architecture

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | NextAuth configuration |
| `src/lib/auth-utils.ts` | Authentication utilities |
| `src/lib/rate-limit.ts` | Rate limiting implementation |
| `src/lib/security-headers.ts` | HTTP security headers |
| `src/lib/validations.ts` | Zod validation schemas |
| `src/lib/errors.ts` | Error handling utilities |
| `src/lib/audit.ts` | Audit logging service |
| `src/lib/monitoring.ts` | Health checks and metrics |
| `src/middleware.ts` | Request middleware |

---

## Authentication

### NextAuth v5 Configuration

Authentication is handled by NextAuth v5 with the following settings:

```typescript
// src/lib/auth.ts
export const { auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' }
      },
      authorize: async (credentials) => {
        // Password verification with bcrypt
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        // Return user or null
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      session.user.id = token.id
      return session
    }
  }
})
```

### Password Security

- Passwords hashed with bcrypt (12 rounds)
- Minimum 8 characters required
- No plain-text storage

### Session Management

- JWT tokens stored in httpOnly cookies
- 24-hour session expiry
- Automatic token refresh
- Secure cookie flags in production

---

## Authorization

### Role-Based Access Control

Roles are defined in the Prisma schema:

```prisma
enum Role {
  OWNER
  ADMIN
  SUPER
  FOREMAN
  CREW
  OFFICE
  VIEWER
}
```

### Permission Hierarchy

| Role | Description | Access Level |
|------|-------------|--------------|
| OWNER | Company owner | Full system access |
| ADMIN | Administrator | Full system access |
| SUPER | Superintendent | Operations management |
| FOREMAN | Field foreman | Crew and project management |
| CREW | Field worker | Limited data entry |
| OFFICE | Office staff | Administrative functions |
| VIEWER | Read-only | View-only access |

### Authorization Utilities

```typescript
import { requireAuth, requireRole } from '@/lib/auth-utils'

// Require any authenticated user
const session = await requireAuth()

// Require specific role
const session = await requireRole('ADMIN')

// Check role in component
if (hasRole(session.user.role, 'FOREMAN')) {
  // Show foreman features
}
```

---

## Input Validation

### Zod Schemas

All input is validated using Zod schemas before processing:

```typescript
// src/lib/validations.ts
export const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'ON_HOLD']),
  startDate: z.coerce.date().optional(),
  customerId: z.string().uuid().optional()
})

// Usage in API route
const body = await request.json()
const validated = createProjectSchema.parse(body)
```

### Common Validation Patterns

| Pattern | Schema |
|---------|--------|
| UUID | `z.string().uuid()` |
| Email | `z.string().email()` |
| Date | `z.coerce.date()` |
| Phone | `z.string().regex(/^\+?[\d\s-()]+$/)` |
| URL | `z.string().url()` |

### XSS Prevention

- All user input is escaped before rendering
- React's JSX escaping prevents XSS in components
- Content-Security-Policy header blocks inline scripts

### SQL Injection Prevention

- Prisma ORM uses parameterized queries
- No raw SQL queries without proper escaping
- Input validation before database operations

---

## Rate Limiting

### Implementation

Rate limiting protects against brute force attacks and DoS:

```typescript
// src/lib/rate-limit.ts
const rateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  keyGenerator: (req) => getClientIP(req)
})
```

### Endpoint-Specific Limits

| Endpoint | Window | Max Requests |
|----------|--------|--------------|
| `/api/auth/signin` | 15 min | 5 |
| `/api/auth/signup` | 60 min | 3 |
| `/api/contact` | 60 min | 10 |
| General API | 15 min | 100 |

### Rate Limit Response

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 900
}
```

HTTP Status: 429 Too Many Requests

---

## Security Headers

### Implementation

```typescript
// src/lib/security-headers.ts
export function getSecurityHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': cspHeader,
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
}
```

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

---

## Error Handling

### Secure Error Responses

Errors are handled consistently without leaking sensitive information:

```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public isOperational: boolean = true
  ) {
    super(message)
  }
}

// Production error response (no stack traces)
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": { "field": "email", "message": "Invalid email format" }
}
```

### Error Types

| Error Class | Status | Use Case |
|-------------|--------|----------|
| `ValidationError` | 400 | Invalid input |
| `AuthenticationError` | 401 | Not logged in |
| `AuthorizationError` | 403 | Insufficient permissions |
| `NotFoundError` | 404 | Resource not found |
| `ConflictError` | 409 | Duplicate resource |
| `RateLimitError` | 429 | Too many requests |

---

## Audit Logging

### Audit Actions

All security-sensitive actions are logged:

```typescript
// src/lib/audit.ts
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
  | 'SECURITY_ALERT'
  | 'RATE_LIMIT_EXCEEDED'
```

### Logging Example

```typescript
import { auditLogin, auditSecurityAlert } from '@/lib/audit'

// Log successful login
auditLogin(true, {
  userId: user.id,
  userEmail: user.email,
  ipAddress: getClientIP(request)
})

// Log security alert
auditSecurityAlert('Potential SQL injection detected', {
  ipAddress: getClientIP(request),
  details: { endpoint: '/api/projects', query: sanitizedQuery }
})
```

### Severity Levels

| Severity | Actions | Response |
|----------|---------|----------|
| CRITICAL | Failed logins, security alerts | Immediate alert |
| HIGH | Permission changes, user deletion | Warning log |
| MEDIUM | Data changes, settings updates | Info log |
| LOW | Successful logins, data access | Debug log |

### Querying Audit Logs

```typescript
// Get recent security events
const alerts = getRecentAuditEntries(100, {
  severity: 'CRITICAL'
})

// Get user activity
const userTrail = getUserAuditTrail(userId)

// Check for brute force attacks
const failedLogins = getFailedLoginAttempts(ipAddress)
```

---

## Monitoring

### Health Checks

```typescript
// src/lib/monitoring.ts
const health = await performHealthCheck([
  {
    name: 'database',
    check: async () => {
      await prisma.$queryRaw`SELECT 1`
      return true
    }
  }
])

// Response
{
  "status": "healthy",
  "uptime": 86400,
  "checks": [
    { "name": "memory", "status": "pass" },
    { "name": "error_rate", "status": "pass" },
    { "name": "response_time", "status": "pass" },
    { "name": "database", "status": "pass" }
  ]
}
```

### Metrics Collection

```typescript
import { recordRequest, getMetrics } from '@/lib/monitoring'

// Record API request
recordRequest(responseTimeMs, isError)

// Get current metrics
const metrics = getMetrics()
// { requestCount, errorCount, averageResponseTime }

// Get percentiles
const percentiles = getResponseTimePercentiles()
// { p50, p90, p95, p99 }
```

---

## Best Practices

### Development

1. **Never commit secrets** - Use environment variables
2. **Validate all input** - Use Zod schemas
3. **Use parameterized queries** - Prisma handles this
4. **Log security events** - Use audit logging
5. **Test security features** - Run security tests

### Production

1. **Enable HTTPS** - Required for security headers
2. **Set secure cookies** - httpOnly, secure, sameSite
3. **Review audit logs** - Monitor for suspicious activity
4. **Keep dependencies updated** - Use Dependabot
5. **Run security scans** - npm audit regularly

### Code Review

1. Check for hardcoded secrets
2. Verify input validation
3. Confirm authorization checks
4. Review error handling
5. Check for SQL injection risks

---

## Security Checklist

### Pre-Deployment

- [ ] All secrets in environment variables
- [ ] Database credentials secured
- [ ] HTTPS configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Audit logging active

### Regular Reviews

- [ ] Review failed login attempts
- [ ] Check rate limit violations
- [ ] Audit permission changes
- [ ] Update dependencies
- [ ] Run npm audit

### Incident Response

1. Identify the security event
2. Check audit logs for details
3. Block offending IP if needed
4. Reset compromised credentials
5. Document and report incident

---

## Testing Security

### Unit Tests

```bash
# Run security-related tests
npm test -- --run tests/unit/lib/security-headers.test.ts
npm test -- --run tests/unit/lib/rate-limit.test.ts
npm test -- --run tests/unit/lib/audit.test.ts
npm test -- --run tests/unit/lib/auth-utils.test.ts
```

### E2E Tests

```bash
# Run security E2E tests
npm run test:e2e -- tests/e2e/security.spec.ts
npm run test:e2e -- tests/e2e/api-security.spec.ts
```

### Manual Testing

1. Test authentication flows
2. Verify role-based access
3. Check rate limiting
4. Inspect security headers
5. Review error responses

---

## Related Documentation

- [API Reference](../architecture/API-REFERENCE.md)
- [Development Guide](./DEVELOPMENT.md)
- [Testing Guide](./TESTING.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

**Maintained by:** Security Team
**Review Schedule:** Quarterly
