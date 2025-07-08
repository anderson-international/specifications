import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productCache } from '@/lib/cache'
import { BrandCoverageAnalyzer } from './dashboard-brand-analysis'
import { RecentActivityAnalyzer } from './dashboard-recent-activity'
import {
  DashboardStats,
  ReviewerLeaderboard,
  ProductInsight,
} from './types'
export async function GET(request: NextRequest): Promise<NextResponse> {

  try {
    // Enhanced authentication check
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = authHeader.substring(7) // Remove 'Bearer '
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Get real Shopify product count from cache
    const products = await productCache.getAllProducts()
    const totalProducts = products.length

    // System-wide stats
    const publishedSpecifications = await prisma.specifications.count({
      where: { status_id: 1 }, // Published
    })

    // Coverage analysis: products grouped by specification count with product details
    const productSpecCounts = await prisma.$queryRaw<
      Array<{ shopify_handle: string; spec_count: number }>
    >`
      SELECT 
        shopify_handle,
        COUNT(*)::int as spec_count
      FROM specifications 
      WHERE status_id = 1
      GROUP BY shopify_handle
    `

    // Get all products from Shopify cache for actionable insights
    const allProducts = await productCache.getAllProducts()
    const productMap = new Map(allProducts.map((p) => [p.handle, p]))

    // Create actionable product lists
    const productsWithSpecs = new Set(productSpecCounts.map((p) => p.shopify_handle))

    // Products with 0 specifications (needs attention)
    const productsNeedingAttention: ProductInsight[] = allProducts
      .filter((product) => !productsWithSpecs.has(product.handle))
      .slice(0, 10) // Limit to 10 for initial display
      .map((product) => ({
        handle: product.handle,
        title: product.title,
        brand: product.brand,
        spec_count: 0,
        image_url: product.image_url,
      }))

    // Products with exactly 1 specification (needs more coverage)
    const productsNeedingCoverage: ProductInsight[] = productSpecCounts
      .filter((p) => p.spec_count === 1)
      .slice(0, 10) // Limit to 10 for initial display
      .map((p) => {
        const product = productMap.get(p.shopify_handle)
        return {
          handle: p.shopify_handle,
          title: product?.title || 'Unknown Product',
          brand: product?.brand,
          spec_count: 1,
          image_url: product?.image_url || null,
        }
      })
      .filter((p) => p.title !== 'Unknown Product') // Remove products not found in cache

    // Business rule: products need 5+ specs to be "covered"
    const productsFullyCovered = productSpecCounts.filter((p) => p.spec_count >= 5).length
    const productsPartialCoverage = productSpecCounts.filter(
      (p) => p.spec_count >= 1 && p.spec_count < 5
    ).length
    const productsNeedsAttention = totalProducts - productSpecCounts.length // Products with 0 specs

    const coveragePercentage =
      totalProducts > 0 ? Math.round((productsFullyCovered / totalProducts) * 100) : 0

    // Phase 3: Brand coverage analysis (extracted to utility)
    const brandCoverageGaps = await BrandCoverageAnalyzer.analyzeBrandCoverage(
      allProducts,
      productsWithSpecs
    )

    // Phase 3: Recent activity tracking (extracted to utility)
    const recentActivityMetrics = await RecentActivityAnalyzer.getRecentActivityMetrics()
    const recentActivityWeekly = recentActivityMetrics.weekly
    const recentActivityMonthly = recentActivityMetrics.monthly


    // User-specific stats
    const totalUserSpecifications = await prisma.specifications.count({
      where: { user_id: userId },
    })

    const userPublishedSpecs = await prisma.specifications.count({
      where: { user_id: userId, status_id: 1 },
    })

    const userNeedsRevisionSpecs = await prisma.specifications.count({
      where: { user_id: userId, status_id: 2 },
    })

    // Full reviewer leaderboard with ranks
    const leaderboardResults = await prisma.$queryRaw<
      Array<{ user_id: string; name: string | null; email: string; specification_count: number }>
    >`
      SELECT 
        u.id as user_id,
        u.name,
        u.email,
        COUNT(s.id)::int as specification_count
      FROM users u
      LEFT JOIN specifications s ON u.id = s.user_id AND s.status_id = 1
      WHERE u.role_id = 2  -- Expert reviewers only
      GROUP BY u.id, u.name, u.email
      ORDER BY specification_count DESC, u.name ASC
    `

    // Add ranks and find current user's position
    const leaderboard: ReviewerLeaderboard[] = leaderboardResults.map((reviewer, index) => ({
      ...reviewer,
      rank: index + 1,
    }))

    const currentUserRank =
      leaderboard.find((r) => r.user_id === userId)?.rank || leaderboard.length + 1

    const stats: DashboardStats = {
      systemStats: {
        total_products: totalProducts,
        published_specifications: publishedSpecifications,
        coverage_percentage: coveragePercentage,
        products_fully_covered: productsFullyCovered,
        products_needs_attention: productsNeedsAttention,
        products_partial_coverage: productsPartialCoverage,
        products_needing_attention: productsNeedingAttention,
        products_needing_coverage: productsNeedingCoverage,
        brand_coverage_gaps: brandCoverageGaps,
        recent_activity_weekly: recentActivityWeekly,
        recent_activity_monthly: recentActivityMonthly,
      },
      userStats: {
        total_specifications: totalUserSpecifications,
        published_specifications: userPublishedSpecs,
        needs_revision_specifications: userNeedsRevisionSpecs,
        leaderboard_rank: currentUserRank,
      },
      leaderboard,
    }

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
