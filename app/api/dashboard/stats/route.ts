import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// These interfaces match the original frontend hook expectations
export interface SystemStats {
  total_products: number
  reviewed_products: number
}

export interface UserStats {
  total_specifications: number
  draft_specifications: number
}

export interface DashboardStats {
  systemStats: SystemStats
  userStats: UserStats
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = authHeader.substring(7) // Remove 'Bearer '

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // System-wide stats
    const totalSpecifications = await prisma.specifications.count()
    const specificationsAwaitingReview = await prisma.specifications.count({
      where: { status_id: 2 }, // Awaiting Review
    })

    // User-specific stats
    const totalUserSpecifications = await prisma.specifications.count({
      where: { user_id: userId },
    })

    const userStatsByStatus = await prisma.specifications.groupBy({
      by: ['status_id'],
      where: {
        user_id: userId,
      },
      _count: {
        status_id: true,
      },
    })

    const draftSpecifications =
      userStatsByStatus.find(stat => stat.status_id === 1)?._count.status_id || 0

    // The original code had a placeholder for total_products. I'll use totalSpecifications.
    const stats: DashboardStats = {
      systemStats: {
        total_products: totalSpecifications,
        reviewed_products: specificationsAwaitingReview,
      },
      userStats: {
        total_specifications: totalUserSpecifications,
        draft_specifications: draftSpecifications,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
