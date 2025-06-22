import { NextRequest, NextResponse } from 'next/server'

// Middleware disabled for development phase - using client-side auth
export default async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl
  
  // Allow all requests in development mode
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }
  
  // TODO: Re-enable auth middleware for production
  // For now, allow all requests
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
