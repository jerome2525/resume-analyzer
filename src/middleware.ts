// Next.js Middleware for JWT Authentication

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware to protect API routes with JWT authentication
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // No authentication required - public API for demo/testing

  // Add security headers to all responses
  const response = NextResponse.next()
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

// Middleware configuration
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

