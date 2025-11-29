/**
 * Custom Error Classes and Error Handling Utilities
 * Provides standardized error types for the application
 */

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number, code: string, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = isOperational
    
    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      error: this.code,
      message: this.message,
      statusCode: this.statusCode
    }
  }
}

/**
 * Validation error - 400 Bad Request
 */
export class ValidationError extends AppError {
  public readonly details?: Record<string, string[]>

  constructor(message: string, details?: Record<string, string[]>) {
    super(message, 400, 'VALIDATION_ERROR')
    this.details = details
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ...(this.details && { details: this.details })
    }
  }
}

/**
 * Authentication error - 401 Unauthorized
 */
export class AuthError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTH_ERROR')
  }
}

/**
 * Authorization error - 403 Forbidden
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'FORBIDDEN_ERROR')
  }
}

/**
 * Not found error - 404
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR')
  }
}

/**
 * Conflict error - 409
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT_ERROR')
  }
}

/**
 * Rate limit error - 429
 */
export class RateLimitError extends AppError {
  public readonly retryAfter: number

  constructor(retryAfter: number) {
    super('Too many requests. Please try again later.', 429, 'RATE_LIMIT_ERROR')
    this.retryAfter = retryAfter
  }

  toJSON() {
    return {
      ...super.toJSON(),
      retryAfter: this.retryAfter
    }
  }
}

/**
 * Internal server error - 500
 */
export class InternalError extends AppError {
  constructor(message: string = 'An unexpected error occurred') {
    super(message, 500, 'INTERNAL_ERROR', false)
  }
}

/**
 * Database error - 500
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR', false)
  }
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

/**
 * Check if error is operational (expected) vs programming error
 */
export function isOperationalError(error: unknown): boolean {
  if (isAppError(error)) {
    return error.isOperational
  }
  return false
}

/**
 * Sanitize error message for production
 * Removes sensitive information from error messages
 */
export function sanitizeError(error: unknown, isDev: boolean = false): {
  error: string
  message: string
  statusCode: number
  details?: Record<string, unknown>
} {
  // For AppErrors, use the built-in serialization
  if (isAppError(error)) {
    return error.toJSON() as {
      error: string
      message: string
      statusCode: number
      details?: Record<string, unknown>
    }
  }

  // For other errors, sanitize based on environment
  if (error instanceof Error) {
    // In development, show the actual error
    if (isDev) {
      return {
        error: 'INTERNAL_ERROR',
        message: error.message,
        statusCode: 500
      }
    }
    
    // In production, hide details
    return {
      error: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      statusCode: 500
    }
  }

  // Unknown error type
  return {
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500
  }
}

/**
 * Create appropriate error from Prisma error
 */
export function fromPrismaError(error: Error): AppError {
  const message = error.message

  if (message.includes('Unique constraint failed')) {
    return new ConflictError('A record with this value already exists')
  }

  if (message.includes('Record to update not found') || 
      message.includes('Record to delete does not exist')) {
    return new NotFoundError('Record')
  }

  if (message.includes('Foreign key constraint failed')) {
    return new ValidationError('Referenced record does not exist')
  }

  if (message.includes('Invalid')) {
    return new ValidationError(message)
  }

  return new DatabaseError('Database operation failed')
}
