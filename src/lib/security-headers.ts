/**
 * Security Headers Configuration
 * Implements security best practices for HTTP headers
 */

import { NextResponse } from 'next/server'

/**
 * Security headers to be applied to all responses
 */
export const securityHeaders = {
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',

  // Enable XSS protection (legacy browser support)
  'X-XSS-Protection': '1; mode=block',

  // Control referrer information sent with requests
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Restrict browser features
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

  // Prevent cross-domain downloads in IE
  'X-Download-Options': 'noopen',

  // Prevent DNS prefetching for privacy
  'X-DNS-Prefetch-Control': 'off',

  // Require HTTPS for 1 year (enable in production with HTTPS)
  // 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

/**
 * Content Security Policy configuration
 * Restrictive by default, allows Next.js functionality
 */
export const getContentSecurityPolicy = (): string => {
  const policy = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for Next.js
      "'unsafe-eval'",   // Required for Next.js development (remove in production if possible)
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind CSS and styled-jsx
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
    ],
    'font-src': [
      "'self'",
    ],
    'connect-src': [
      "'self'",
    ],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'object-src': ["'none'"],
  }

  return Object.entries(policy)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')
}

/**
 * Apply security headers to a NextResponse
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Apply standard security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Apply CSP header
  response.headers.set('Content-Security-Policy', getContentSecurityPolicy())

  return response
}

/**
 * Create a new NextResponse with security headers
 */
export function createSecureResponse(): NextResponse {
  const response = NextResponse.next()
  return applySecurityHeaders(response)
}
