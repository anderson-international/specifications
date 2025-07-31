import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  console.log('🔍 Dev Users API called - NODE_ENV:', process.env.NODE_ENV)
  console.log('🔍 Database URL exists:', !!process.env.DATABASE_URL)
  console.log('🔍 ENABLE_DEV_AUTH:', process.env.ENABLE_DEV_AUTH)
  
  if (process.env.ENABLE_DEV_AUTH !== 'true') {
    console.log('❌ Dev API disabled - ENABLE_DEV_AUTH not set to true')
    return NextResponse.json(
      { error: 'Development endpoints not available' },
      { status: 403 }
    )
  }

  try {
    console.log('🔍 Attempting database connection...')
    const users = await prisma.system_users.findMany({
      include: {
        system_enum_roles: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email || '',
      role_id: user.role_id,
      role_name: user.system_enum_roles?.name || 'Unknown Role',
      created_at: user.created_at?.toISOString(),
      slack_userid: user.slack_userid,
      jotform_name: user.jotform_name,
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error('❌ Database error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: `Failed to fetch users: ${errorMessage}` }, { status: 500 })
  }
}
