/**
 * Rate Limiting Utility for Next.js API Routes
 *
 * Uses in-memory store for development. For production, consider:
 * - Redis-based rate limiting
 * - Upstash Rate Limit
 * - Vercel Edge Config
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  limit: number; // Max requests per interval
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Default configurations for different route types
export const RATE_LIMIT_CONFIGS = {
  // Strict limit for auth endpoints (prevent brute force)
  auth: { interval: 15 * 60 * 1000, limit: 5 }, // 5 requests per 15 minutes

  // Standard API limit
  api: { interval: 60 * 1000, limit: 60 }, // 60 requests per minute

  // Relaxed limit for read-only endpoints
  read: { interval: 60 * 1000, limit: 120 }, // 120 requests per minute

  // Very strict for sensitive operations
  sensitive: { interval: 60 * 60 * 1000, limit: 10 }, // 10 requests per hour

  // Contact form (prevent spam)
  contact: { interval: 60 * 60 * 1000, limit: 5 }, // 5 submissions per hour
} as const;

/**
 * Clean up expired entries periodically
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Check for forwarded IP (behind proxy/load balancer)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // Check for real IP header
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a hash of user-agent + accept-language for uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const acceptLang = request.headers.get('accept-language') || 'unknown';
  return `ua:${hashString(userAgent + acceptLang)}`;
}

/**
 * Simple string hash function
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Check rate limit for a given identifier
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.api
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;

  let entry = rateLimitStore.get(key);

  // If no entry or expired, create new one
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + config.interval
    };
    rateLimitStore.set(key, entry);
    return {
      success: true,
      remaining: config.limit - 1,
      resetTime: entry.resetTime
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    remaining: config.limit - entry.count,
    resetTime: entry.resetTime
  };
}

/**
 * Rate limit middleware for API routes
 */
export function rateLimit(
  request: Request,
  configType: keyof typeof RATE_LIMIT_CONFIGS = 'api'
): { success: boolean; headers: Headers; response?: Response } {
  const identifier = getClientIdentifier(request);
  const config = RATE_LIMIT_CONFIGS[configType];
  const result = checkRateLimit(`${configType}:${identifier}`, config);

  const headers = new Headers();
  headers.set('X-RateLimit-Limit', config.limit.toString());
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());

  if (!result.success) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    headers.set('Retry-After', retryAfter.toString());

    return {
      success: false,
      headers,
      response: new Response(
        JSON.stringify({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(headers.entries())
          }
        }
      )
    };
  }

  return { success: true, headers };
}

/**
 * Helper to apply rate limit headers to a response
 */
export function withRateLimitHeaders(
  response: Response,
  rateLimitHeaders: Headers
): Response {
  const newHeaders = new Headers(response.headers);
  rateLimitHeaders.forEach((value, key) => {
    newHeaders.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
