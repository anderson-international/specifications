import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

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

export async function GET(): Promise<NextResponse> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  try {
    // --- System Stats ---
    const reviewedProducts = await prisma.specifications.findMany({
      select: {
        shopify_handle: true,
      },
      distinct: ['shopify_handle'],
    })
    const reviewedProductsCount = reviewedProducts.length

    // This is a placeholder; you might have a separate products table
    const totalProductsCount = reviewedProductsCount; // Assuming for now

    // --- User Stats ---
    const totalSpecifications = await prisma.specifications.count({
      where: { user_id: userId },
    })

    const draftSpecifications = await prisma.specifications.count({
      where: {
        user_id: userId,
        status_id: 1, // Draft status
      },
    })

    const stats: DashboardStats = {
      systemStats: {
        total_products: totalProductsCount,
        reviewed_products: reviewedProductsCount,
      },
      userStats: {
        total_specifications: totalSpecifications,
        draft_specifications: draftSpecifications,
      },
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
