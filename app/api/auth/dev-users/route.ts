import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Development endpoints not available in production' },
      { status: 403 }
    )
  }

  try {
    const users = await prisma.users.findMany({
      include: {
        enum_roles: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || user.email || 'Unknown User',
      email: user.email || '',
      role_id: user.role_id,
      role_name: user.enum_roles?.name || 'Unknown Role'
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error('Failed to fetch development users:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
