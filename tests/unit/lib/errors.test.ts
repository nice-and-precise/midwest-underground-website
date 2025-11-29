import { describe, it, expect } from 'vitest'
import {
  AppError,
  ValidationError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalError,
  DatabaseError,
  isAppError,
  isOperationalError,
  sanitizeError,
  fromPrismaError
} from '@/lib/errors'

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create with correct properties', () => {
      const error = new AppError('Test message', 400, 'TEST_ERROR')
      
      expect(error.message).toBe('Test message')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('TEST_ERROR')
      expect(error.isOperational).toBe(true)
    })

    it('should serialize to JSON correctly', () => {
      const error = new AppError('Test', 400, 'TEST')
      const json = error.toJSON()
      
      expect(json).toEqual({
        error: 'TEST',
        message: 'Test',
        statusCode: 400
      })
    })
  })

  describe('ValidationError', () => {
    it('should have 400 status code', () => {
      const error = new ValidationError('Validation failed')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
    })

    it('should include details in JSON', () => {
      const details = { email: ['Invalid email'] }
      const error = new ValidationError('Validation failed', details)
      const json = error.toJSON()
      
      expect(json.details).toEqual(details)
    })
  })

  describe('AuthError', () => {
    it('should have 401 status code', () => {
      const error = new AuthError()
      expect(error.statusCode).toBe(401)
      expect(error.code).toBe('AUTH_ERROR')
    })

    it('should use default message if not provided', () => {
      const error = new AuthError()
      expect(error.message).toBe('Authentication required')
    })
  })

  describe('ForbiddenError', () => {
    it('should have 403 status code', () => {
      const error = new ForbiddenError()
      expect(error.statusCode).toBe(403)
      expect(error.code).toBe('FORBIDDEN_ERROR')
    })
  })

  describe('NotFoundError', () => {
    it('should have 404 status code', () => {
      const error = new NotFoundError('User')
      expect(error.statusCode).toBe(404)
      expect(error.message).toBe('User not found')
    })
  })

  describe('ConflictError', () => {
    it('should have 409 status code', () => {
      const error = new ConflictError('Resource exists')
      expect(error.statusCode).toBe(409)
    })
  })

  describe('RateLimitError', () => {
    it('should have 429 status code and retryAfter', () => {
      const error = new RateLimitError(60)
      expect(error.statusCode).toBe(429)
      expect(error.retryAfter).toBe(60)
      
      const json = error.toJSON()
      expect(json.retryAfter).toBe(60)
    })
  })

  describe('InternalError', () => {
    it('should have 500 status code and not be operational', () => {
      const error = new InternalError()
      expect(error.statusCode).toBe(500)
      expect(error.isOperational).toBe(false)
    })
  })

  describe('DatabaseError', () => {
    it('should have 500 status code', () => {
      const error = new DatabaseError()
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('DATABASE_ERROR')
    })
  })
})

describe('Error Utilities', () => {
  describe('isAppError', () => {
    it('should return true for AppError instances', () => {
      expect(isAppError(new ValidationError('test'))).toBe(true)
      expect(isAppError(new AuthError())).toBe(true)
    })

    it('should return false for regular errors', () => {
      expect(isAppError(new Error('test'))).toBe(false)
      expect(isAppError('string')).toBe(false)
      expect(isAppError(null)).toBe(false)
    })
  })

  describe('isOperationalError', () => {
    it('should return true for operational errors', () => {
      expect(isOperationalError(new ValidationError('test'))).toBe(true)
    })

    it('should return false for non-operational errors', () => {
      expect(isOperationalError(new InternalError())).toBe(false)
      expect(isOperationalError(new Error('test'))).toBe(false)
    })
  })

  describe('sanitizeError', () => {
    it('should preserve AppError details', () => {
      const error = new ValidationError('Test', { field: ['error'] })
      const result = sanitizeError(error)
      
      expect(result.error).toBe('VALIDATION_ERROR')
      expect(result.message).toBe('Test')
    })

    it('should hide error details in production', () => {
      const error = new Error('Sensitive info')
      const result = sanitizeError(error, false)
      
      expect(result.message).toBe('An unexpected error occurred')
    })

    it('should show error details in development', () => {
      const error = new Error('Debug info')
      const result = sanitizeError(error, true)
      
      expect(result.message).toBe('Debug info')
    })
  })

  describe('fromPrismaError', () => {
    it('should convert unique constraint to ConflictError', () => {
      const prismaError = new Error('Unique constraint failed on field')
      const result = fromPrismaError(prismaError)
      
      expect(result).toBeInstanceOf(ConflictError)
      expect(result.statusCode).toBe(409)
    })

    it('should convert record not found to NotFoundError', () => {
      const prismaError = new Error('Record to update not found')
      const result = fromPrismaError(prismaError)
      
      expect(result).toBeInstanceOf(NotFoundError)
      expect(result.statusCode).toBe(404)
    })

    it('should convert foreign key constraint to ValidationError', () => {
      const prismaError = new Error('Foreign key constraint failed')
      const result = fromPrismaError(prismaError)
      
      expect(result).toBeInstanceOf(ValidationError)
    })

    it('should default to DatabaseError for unknown errors', () => {
      const prismaError = new Error('Unknown database error')
      const result = fromPrismaError(prismaError)
      
      expect(result).toBeInstanceOf(DatabaseError)
    })
  })
})
