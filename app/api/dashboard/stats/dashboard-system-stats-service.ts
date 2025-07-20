import { prisma } from '@/lib/prisma'
import { productCache } from '@/lib/cache'
import { BrandCoverageAnalyzer } from './dashboard-brand-analysis'
import { RecentActivityAnalyzer } from './dashboard-recent-activity'
import { ProductInsight } from './types'

export interface SystemStatsResult {
  total_products: number
  published_specifications: number
  coverage_percentage: number
  products_fully_covered: number
  products_needs_attention: number
  products_partial_coverage: number
  products_needing_attention: ProductInsight[]
  products_needing_coverage: ProductInsight[]
  brand_coverage_gaps: any[]
  recent_activity_weekly: any[]
  recent_activity_monthly: any[]
}

export class DashboardSystemStatsService {
  static async getSystemStats(): Promise<SystemStatsResult> {
    const [allProducts, publishedSpecifications, rawProductSpecCounts] = await Promise.all([
      productCache.getAllProducts(),
      prisma.specifications.count({ where: { status_id: 1 } }),
      prisma.specifications.groupBy({
        by: ['shopify_handle'],
        where: { status_id: 1 },
        _count: { id: true }
      })
    ])

    const totalProducts = allProducts.length
    const productSpecCounts = rawProductSpecCounts.map((item) => ({
      shopify_handle: item.shopify_handle,
      spec_count: item._count.id
    }))
    const productMap = new Map(allProducts.map((p) => [p.handle, p]))

    const productsWithSpecs = new Set(productSpecCounts.map((p) => p.shopify_handle))

    const productsNeedingAttention: ProductInsight[] = allProducts
      .filter((product) => !productsWithSpecs.has(product.handle))
      .slice(0, 10)
      .map((product) => ({
        handle: product.handle,
        title: product.title,
        brand: product.brand,
        spec_count: 0,
        image_url: product.image_url,
      }))

    const productsNeedingCoverage: ProductInsight[] = productSpecCounts
      .filter((p) => p.spec_count === 1)
      .slice(0, 10)
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
      .filter((p) => p.title !== 'Unknown Product')

    const productsFullyCovered = productSpecCounts.filter((p) => p.spec_count >= 5).length
    const productsPartialCoverage = productSpecCounts.filter(
      (p) => p.spec_count >= 1 && p.spec_count < 5
    ).length
    const productsNeedsAttention = totalProducts - productSpecCounts.length

    const coveragePercentage =
      totalProducts > 0 ? Math.round((productsFullyCovered / totalProducts) * 100) : 0

    const brandCoverageGaps = await BrandCoverageAnalyzer.analyzeBrandCoverage(
      allProducts,
      productsWithSpecs
    )

    const recentActivityMetrics = await RecentActivityAnalyzer.getRecentActivityMetrics()
    const recentActivityWeekly = recentActivityMetrics.weekly
    const recentActivityMonthly = recentActivityMetrics.monthly

    return {
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
    }
  }
}
