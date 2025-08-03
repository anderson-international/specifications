// Canonical Product Type Definition
// This is the single source of truth for Product types across the entire application

// Static product data suitable for caching (no dynamic counts)
export interface CacheableProduct {
  id: string
  handle: string
  title: string
  brand: string
  image_url: string
}

// Full product with dynamic spec count (not cached)
export interface Product extends CacheableProduct {
  spec_count_total: number
}

export interface CacheStats {
  totalProducts: number
  cacheSize: number
  lastUpdated: string
  isValid: boolean
  cacheHits: number
  cacheMisses: number
  hitRatePercentage: number
  lastHitTime: string | null
  lastMissTime: string | null
  efficiency: 'excellent' | 'good' | 'fair' | 'poor'
}
