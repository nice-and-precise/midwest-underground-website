import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  validateRequestBody,
  validateQueryParams,
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  conflictResponse,
  withErrorHandler
} from '@/lib/api-utils'

// Helper to create mock NextRequest
function createMockRequest(body?: object, url: string = 'http://localhost/api/test'): NextRequest {
  const request = new NextRequest(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  })
  return request
}

describe('API Utils', () => {
  describe('validateRequestBody', () => {
    const testSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email'),
      age: z.number().positive('Age must be positive').optional()
    })

    it('should return success with valid data', async () => {
      const request = createMockRequest({ name: 'John', email: 'john@example.com' })
      const result = await validateRequestBody(request, testSchema)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John')
        expect(result.data.email).toBe('john@example.com')
      }
    })

    it('should return error for invalid data', async () => {
      const request = createMockRequest({ name: '', email: 'invalid-email' })
      const result = await validateRequestBody(request, testSchema)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        const body = await result.response.json()
        expect(body.error).toBe('Validation Error')
        expect(body.details).toBeDefined()
      }
    })

    it('should handle invalid JSON', async () => {
      const request = new NextRequest('http://localhost/api/test', {
        method: 'POST',
        body: 'invalid json{'
      })
      const result = await validateRequestBody(request, testSchema)
      
      expect(result.success).toBe(false)
    })
  })

  describe('validateQueryParams', () => {
    const querySchema = z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      status: z.enum(['active', 'inactive']).optional()
    })

    it('should return success with valid params', () => {
      const request = new NextRequest('http://localhost/api/test?page=1&limit=10&status=active')
      const result = validateQueryParams(request, querySchema)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe('1')
        expect(result.data.status).toBe('active')
      }
    })

    it('should return error for invalid params', () => {
      const request = new NextRequest('http://localhost/api/test?status=unknown')
      const result = validateQueryParams(request, querySchema)
      
      expect(result.success).toBe(false)
    })
  })

  describe('Response Helpers', () => {
    it('successResponse should return JSON with correct status', async () => {
      const response = successResponse({ data: 'test' }, 201)
      const body = await response.json()
      
      expect(response.status).toBe(201)
      expect(body.data).toBe('test')
    })

    it('errorResponse should return error format', async () => {
      const response = errorResponse('Test Error', 'Test message', 400)
      const body = await response.json()
      
      expect(response.status).toBe(400)
      expect(body.error).toBe('Test Error')
      expect(body.message).toBe('Test message')
    })

    it('notFoundResponse should return 404', async () => {
      const response = notFoundResponse('User')
      const body = await response.json()
      
      expect(response.status).toBe(404)
      expect(body.error).toBe('Not Found')
      expect(body.message).toBe('User not found')
    })

    it('unauthorizedResponse should return 401', async () => {
      const response = unauthorizedResponse()
      const body = await response.json()
      
      expect(response.status).toBe(401)
      expect(body.error).toBe('Unauthorized')
    })

    it('forbiddenResponse should return 403', async () => {
      const response = forbiddenResponse('Custom message')
      const body = await response.json()
      
      expect(response.status).toBe(403)
      expect(body.message).toBe('Custom message')
    })

    it('conflictResponse should return 409', async () => {
      const response = conflictResponse('Resource already exists')
      const body = await response.json()
      
      expect(response.status).toBe(409)
      expect(body.error).toBe('Conflict')
    })
  })

  describe('withErrorHandler', () => {
    it('should pass through successful responses', async () => {
      const handler = vi.fn().mockResolvedValue(NextResponse.json({ success: true }))
      const wrappedHandler = withErrorHandler(handler)
      const request = createMockRequest()
      
      const response = await wrappedHandler(request)
      const body = await response.json()
      
      expect(body.success).toBe(true)
    })

    it('should catch and handle errors', async () => {
      const handler = vi.fn().mockRejectedValue(new Error('Test error'))
      const wrappedHandler = withErrorHandler(handler)
      const request = createMockRequest()
      
      const response = await wrappedHandler(request)
      
      expect(response.status).toBe(500)
    })

    it('should handle unique constraint errors', async () => {
      const handler = vi.fn().mockRejectedValue(new Error('Unique constraint failed'))
      const wrappedHandler = withErrorHandler(handler)
      const request = createMockRequest()
      
      const response = await wrappedHandler(request)
      const body = await response.json()
      
      expect(response.status).toBe(409)
      expect(body.error).toBe('Conflict')
    })
  })
})
