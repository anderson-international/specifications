// Brand coverage analysis utilities
// Extracted from route.ts to comply with file size limits

import { Product } from '@/lib/types/product'
import { ProductInsight, BrandCoverageGap } from '@/app/api/dashboard/stats/types'

export class BrandCoverageAnalyzer {
  static async analyzeBrandCoverage(
    allProducts: Product[],
    productsWithSpecs: Set<string>
  ): Promise<BrandCoverageGap[]> {
    const brandCoverageMap = new Map<string, { total: number; withSpecs: Set<string> }>()
    
    // Count products by brand
    allProducts.forEach(product => {
      if (product.brand) {
        if (!brandCoverageMap.has(product.brand)) {
          brandCoverageMap.set(product.brand, { total: 0, withSpecs: new Set() })
        }
        brandCoverageMap.get(product.brand)!.total++
        
        // Check if this product has specs
        if (productsWithSpecs.has(product.handle)) {
          brandCoverageMap.get(product.brand)!.withSpecs.add(product.handle)
        }
      }
    })
    
    // Calculate brand coverage gaps (brands with lowest coverage, min 1 products - DEBUG RELAXED)
    console.log('🔍 DEBUG: Total brands found:', brandCoverageMap.size)
    const brandCoverageGaps: BrandCoverageGap[] = Array.from(brandCoverageMap.entries())
      .filter(([_, data]) => data.total >= 1) // DEBUG: Temporarily relaxed from 3+ to 1+ products
      .map(([brand, data]) => {
        const coverage = data.total > 0 ? Math.round((data.withSpecs.size / data.total) * 100) : 0
        
        // Get sample uncovered products for this brand
        const uncoveredProducts = allProducts
          .filter(p => p.brand === brand && !productsWithSpecs.has(p.handle))
          .slice(0, 3) // Max 3 samples
          .map(product => ({
            handle: product.handle,
            title: product.title,
            brand: product.brand,
            spec_count: 0,
            image_url: product.image_url
          }))
        
        return {
          brand,
          total_products: data.total,
          products_with_specs: data.withSpecs.size,
          coverage_percentage: coverage,
          sample_uncovered_products: uncoveredProducts
        }
      })
      .sort((a, b) => a.coverage_percentage - b.coverage_percentage) // Lowest coverage first
      .slice(0, 5) // Top 5 brands with gaps

    return brandCoverageGaps
  }
}
