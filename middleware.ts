import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Allow access to development auth endpoints in development
  if (process.env.NODE_ENV === 'development' && pathname.startsWith('/api/auth/dev-users')) {
    return NextResponse.next()
  }
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/signin',
    '/auth/verify-request',
    '/auth/error',
    '/api/health',
    '/api/auth'
  ]
  
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Development mode: Allow access without authentication for testing
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }
  
  // Production mode: Get session and check authentication
  const session = await auth()
  
  if (!session?.user) {
    const signInUrl = new URL('/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(signInUrl)
  }
  
  // Admin-only routes
  const adminRoutes = [
    '/api/enum',
    '/api/admin', 
    '/admin'
  ]
  
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    // In production, check admin role
    if (process.env.NODE_ENV === 'production' && (session.user as any).role_id !== 1) {
      return new NextResponse('Unauthorized', { status: 403 })
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
