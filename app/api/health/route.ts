import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    // Test database connection with a simple query
    const [userCount, specCount, statusCount] = await Promise.all([
      prisma.users.count(),
      prisma.specifications.count(),
      prisma.enum_specification_statuses.count()
    ])

    // Test a relationship query
    await prisma.specifications.findFirst({
      include: {
        users: true,
        enum_specification_statuses: true
      }
    })

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        users: userCount,
        specifications: specCount,
        statuses: statusCount
      },
      environment: process.env.NODE_ENV
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      environment: process.env.NODE_ENV
    }, { status: 503 })
  }
}
