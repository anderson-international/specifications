import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export interface DashboardStats {
  total_products: number
  reviewed_products: number
  total_specifications: number
  pending_specifications: number
}

export async function GET(): Promise<NextResponse> {
  try {
    // Get total unique products (distinct shopify handles)
    const totalProducts = await prisma.specifications.findMany({
      select: {
        shopify_handle: true
      },
      distinct: ['shopify_handle']
    })

    // Get reviewed products count (products with at least one specification)
    const reviewedProductsCount = totalProducts.length

    // Get total specifications count
    const totalSpecifications = await prisma.specifications.count()

    // Get pending specifications (status_id = 1 typically means pending/draft)
    const pendingSpecifications = await prisma.specifications.count({
      where: {
        status_id: 1
      }
    })

    const stats: DashboardStats = {
      total_products: totalProducts.length,
      reviewed_products: reviewedProductsCount,
      total_specifications: totalSpecifications,
      pending_specifications: pendingSpecifications
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
