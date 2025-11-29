/**
 * API Utility Functions
 * Provides standardized request validation and error handling for API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { z, ZodSchema, ZodError } from 'zod'

/**
 * Validation error response format
 */
interface ValidationErrorResponse {
  error: string
  message: string
  details?: Record<string, string[]>
}

/**
 * Standard error response format
 */
interface ErrorResponse {
  error: string
  message: string
  code?: string
}

/**
 * Parse and validate request body with Zod schema
 * @param request - NextRequest object
 * @param schema - Zod schema to validate against
 * @returns Validated data or error response
 */
export async function validateRequestBody<T extends ZodSchema>(
  request: NextRequest,
  schema: T
): Promise<{ success: true; data: z.infer<T> } | { success: false; response: NextResponse }> {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof ZodError) {
      const response: ValidationErrorResponse = {
        error: 'Validation Error',
        message: 'Request body validation failed',
        details: error.flatten().fieldErrors as Record<string, string[]>
      }
      return {
        success: false,
        response: NextResponse.json(response, { status: 400 })
      }
    }

    if (error instanceof SyntaxError) {
      const response: ErrorResponse = {
        error: 'Invalid JSON',
        message: 'Request body must be valid JSON'
      }
      return {
        success: false,
        response: NextResponse.json(response, { status: 400 })
      }
    }

    const response: ErrorResponse = {
      error: 'Bad Request',
      message: 'Failed to parse request body'
    }
    return {
      success: false,
      response: NextResponse.json(response, { status: 400 })
    }
  }
}

/**
 * Parse and validate query parameters with Zod schema
 * @param request - NextRequest object
 * @param schema - Zod schema to validate against
 * @returns Validated data or error response
 */
export function validateQueryParams<T extends ZodSchema>(
  request: NextRequest,
  schema: T
): { success: true; data: z.infer<T> } | { success: false; response: NextResponse } {
  try {
    const { searchParams } = new URL(request.url)
    const params: Record<string, string | string[]> = {}

    // Convert searchParams to object
    searchParams.forEach((value, key) => {
      const existing = params[key]
      if (existing) {
        if (Array.isArray(existing)) {
          existing.push(value)
        } else {
          params[key] = [existing, value]
        }
      } else {
        params[key] = value
      }
    })

    const data = schema.parse(params)
    return { success: true, data }
  } catch (error) {
    if (error instanceof ZodError) {
      const response: ValidationErrorResponse = {
        error: 'Validation Error',
        message: 'Query parameter validation failed',
        details: error.flatten().fieldErrors as Record<string, string[]>
      }
      return {
        success: false,
        response: NextResponse.json(response, { status: 400 })
      }
    }

    const response: ErrorResponse = {
      error: 'Bad Request',
      message: 'Failed to parse query parameters'
    }
    return {
      success: false,
      response: NextResponse.json(response, { status: 400 })
    }
  }
}

/**
 * Create a standardized success response
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(data, { status })
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  error: string,
  message: string,
  status: number = 500,
  details?: Record<string, unknown>
): NextResponse {
  const response: ErrorResponse & { details?: Record<string, unknown> } = {
    error,
    message,
    ...(details && { details })
  }
  return NextResponse.json(response, { status })
}

/**
 * Create a 404 Not Found response
 */
export function notFoundResponse(resource: string): NextResponse {
  return errorResponse('Not Found', `${resource} not found`, 404)
}

/**
 * Create a 401 Unauthorized response
 */
export function unauthorizedResponse(message: string = 'Authentication required'): NextResponse {
  return errorResponse('Unauthorized', message, 401)
}

/**
 * Create a 403 Forbidden response
 */
export function forbiddenResponse(message: string = 'Access denied'): NextResponse {
  return errorResponse('Forbidden', message, 403)
}

/**
 * Create a 409 Conflict response
 */
export function conflictResponse(message: string): NextResponse {
  return errorResponse('Conflict', message, 409)
}

/**
 * Wrap an API handler with error catching
 */
export function withErrorHandler(
  handler: (request: NextRequest, context?: unknown) => Promise<NextResponse>
): (request: NextRequest, context?: unknown) => Promise<NextResponse> {
  return async (request: NextRequest, context?: unknown): Promise<NextResponse> => {
    try {
      return await handler(request, context)
    } catch (error) {
      console.error('API Error:', error)
      
      // Handle Prisma errors
      if (error instanceof Error) {
        if (error.message.includes('Unique constraint failed')) {
          return conflictResponse('A record with this value already exists')
        }
        if (error.message.includes('Record to update not found')) {
          return notFoundResponse('Record')
        }
        if (error.message.includes('Foreign key constraint failed')) {
          return errorResponse('Bad Request', 'Referenced record does not exist', 400)
        }
      }

      // Generic error
      const isDev = process.env.NODE_ENV === 'development'
      return errorResponse(
        'Internal Server Error',
        isDev && error instanceof Error ? error.message : 'An unexpected error occurred',
        500
      )
    }
  }
}

/**
 * Extract ID parameter from route context
 */
export function getIdParam(context: { params: { id: string } | Promise<{ id: string }> }): Promise<string> {
  const params = context.params
  if (params instanceof Promise) {
    return params.then(p => p.id)
  }
  return Promise.resolve(params.id)
}
