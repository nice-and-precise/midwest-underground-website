import { describe, it, expect } from 'vitest'
import { NextResponse } from 'next/server'
import {
  securityHeaders,
  getContentSecurityPolicy,
  applySecurityHeaders,
  createSecureResponse
} from '@/lib/security-headers'

describe('Security Headers', () => {
  describe('securityHeaders constant', () => {
    it('should have X-Content-Type-Options header', () => {
      expect(securityHeaders['X-Content-Type-Options']).toBe('nosniff')
    })

    it('should have X-Frame-Options header', () => {
      expect(securityHeaders['X-Frame-Options']).toBe('DENY')
    })

    it('should have X-XSS-Protection header', () => {
      expect(securityHeaders['X-XSS-Protection']).toBe('1; mode=block')
    })

    it('should have Referrer-Policy header', () => {
      expect(securityHeaders['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    })

    it('should have Permissions-Policy header', () => {
      expect(securityHeaders['Permissions-Policy']).toBe('camera=(), microphone=(), geolocation=()')
    })

    it('should have X-Download-Options header', () => {
      expect(securityHeaders['X-Download-Options']).toBe('noopen')
    })

    it('should have X-DNS-Prefetch-Control header', () => {
      expect(securityHeaders['X-DNS-Prefetch-Control']).toBe('off')
    })
  })

  describe('getContentSecurityPolicy', () => {
    it('should return a valid CSP string', () => {
      const csp = getContentSecurityPolicy()
      expect(typeof csp).toBe('string')
      expect(csp.length).toBeGreaterThan(0)
    })

    it('should include default-src directive', () => {
      const csp = getContentSecurityPolicy()
      expect(csp).toContain("default-src 'self'")
    })

    it('should include script-src directive', () => {
      const csp = getContentSecurityPolicy()
      expect(csp).toContain('script-src')
    })

    it('should include style-src directive', () => {
      const csp = getContentSecurityPolicy()
      expect(csp).toContain('style-src')
    })

    it('should include frame-ancestors directive', () => {
      const csp = getContentSecurityPolicy()
      expect(csp).toContain("frame-ancestors 'none'")
    })

    it('should include object-src directive', () => {
      const csp = getContentSecurityPolicy()
      expect(csp).toContain("object-src 'none'")
    })
  })

  describe('applySecurityHeaders', () => {
    it('should apply all security headers to response', () => {
      const response = NextResponse.next()
      const secureResponse = applySecurityHeaders(response)

      expect(secureResponse.headers.get('X-Content-Type-Options')).toBe('nosniff')
      expect(secureResponse.headers.get('X-Frame-Options')).toBe('DENY')
      expect(secureResponse.headers.get('X-XSS-Protection')).toBe('1; mode=block')
      expect(secureResponse.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
      expect(secureResponse.headers.get('Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=()')
    })

    it('should apply CSP header to response', () => {
      const response = NextResponse.next()
      const secureResponse = applySecurityHeaders(response)

      const cspHeader = secureResponse.headers.get('Content-Security-Policy')
      expect(cspHeader).toBeTruthy()
      expect(cspHeader).toContain("default-src 'self'")
    })

    it('should return the same response object', () => {
      const response = NextResponse.next()
      const secureResponse = applySecurityHeaders(response)
      expect(secureResponse).toBe(response)
    })
  })

  describe('createSecureResponse', () => {
    it('should create a response with all security headers', () => {
      const response = createSecureResponse()

      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
      expect(response.headers.get('X-Frame-Options')).toBe('DENY')
      expect(response.headers.get('Content-Security-Policy')).toBeTruthy()
    })

    it('should return a NextResponse instance', () => {
      const response = createSecureResponse()
      expect(response).toBeInstanceOf(NextResponse)
    })
  })
})
