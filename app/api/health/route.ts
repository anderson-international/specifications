import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const [userCount, specCount, statusCount] = await Promise.all([
      prisma.system_users.count(),
      prisma.specifications.count(),
      prisma.spec_enum_statuses.count(),
    ])

    await prisma.specifications.findFirst({
      include: {
        system_users: true,
        spec_enum_statuses: true,
      },
    })

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        users: userCount,
        specifications: specCount,
        statuses: statusCount,
      },
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        environment: process.env.NODE_ENV,
      },
      { status: 503 }
    )
  }
}
