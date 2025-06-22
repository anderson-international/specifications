// NextAuth route disabled for development phase
// Using dev-users endpoint and auth-context instead

import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'NextAuth disabled in development. Use /api/auth/dev-users instead.' },
    { status: 404 }
  )
}

export async function POST(_request: NextRequest): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'NextAuth disabled in development. Use /api/auth/dev-users instead.' },
    { status: 404 }
  )
}
