import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/services',
    '/about',
    '/projects',
    '/contact',
    '/auth/login',
    '/auth/error'
  ]

  // Public API routes (only auth-related endpoints)
  const publicApiRoutes = [
    '/api/auth'
  ]

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => pathname === route) ||
    publicApiRoutes.some(route => pathname.startsWith(route))

  // Redirect to login if trying to access protected route while not authenticated
  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if trying to access login page while authenticated
  if (pathname === '/auth/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Add pathname to headers so it's available in layouts
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response
})

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
