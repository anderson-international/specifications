import { NextRequest, NextResponse } from 'next/server'
import { DashboardStatsService } from './dashboard-stats-service'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = authHeader.substring(7)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await DashboardStatsService.getDashboardStats(userId)
    return NextResponse.json(stats)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        error: 'Dashboard stats operation failed',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
