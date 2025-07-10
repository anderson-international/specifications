// Redis cache implementation for Shopify products
import { Product, CacheStats } from '@/lib/types/product'
import { getShopifyProductService } from '@/lib/shopify'
import { RedisCacheBase } from './base/redis-cache-base'
import { CachePerformanceMonitor } from './base/cache-performance'

export class RedisProductCache extends RedisCacheBase<Product[]> {
  private static instance: RedisProductCache
  protected readonly cacheKey = 'shopify:products:all'
  protected readonly TTL_SECONDS = 30 * 60 // 30 minutes

  private constructor() {
    super('products')
  }

  static getInstance(): RedisProductCache {
    return RedisCacheBase.getInstanceFromMap('products', () => new RedisProductCache())
  }

  static isWarming(): boolean {
    return RedisCacheBase.isWarming('products')
  }

  static async ensureReady(): Promise<void> {
    const instance = RedisProductCache.getInstance()
    await instance.ensureReady()
  }

  // Product-specific data fetching
  protected async fetchFreshData(): Promise<Product[]> {
    const shopifyService = getShopifyProductService()
    const products = await shopifyService.fetchAllProducts()

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('No products received from Shopify service')
    }

    return products
  }

  // Product-specific data validation
  protected validateData(data: unknown): data is Product[] {
    // Handle new cache structure: { data: Product[], _cached: string }
    if (data && typeof data === 'object' && 'data' in data) {
      const cacheData = data as { data: unknown; _cached: string }
      return Array.isArray(cacheData.data) && cacheData.data.length > 0
    }
    // Fallback for direct array (backwards compatibility)
    return Array.isArray(data) && data.length > 0
  }

  // Product-specific methods
  async getAllProducts(): Promise<Product[]> {
    try {
      const products = await this.getData()
      CachePerformanceMonitor.recordHit()
      return products
    } catch {
      CachePerformanceMonitor.recordMiss()
      await this.refreshCache()
      return this.getData()
    }
  }

  async getProductByHandle(handle: string): Promise<Product | null> {
    try {
      const products = await this.getAllProducts()
      return products.find((product) => product.handle === handle) || null
    } catch {
      return null
    }
  }

  async forceRefresh(): Promise<void> {
    await this.refreshCache()
  }

  async getStats(): Promise<CacheStats> {
    try {
      const exists = await this.isValid()
      const products = exists ? await this.getData() : []
      const metrics = CachePerformanceMonitor.getMetrics()

      return {
        totalProducts: products.length,
        cacheSize: products.length,
        lastUpdated: new Date().toISOString(),
        isValid: exists,
        ...metrics,
      }
    } catch {
      return {
        totalProducts: 0,
        cacheSize: 0,
        lastUpdated: new Date().toISOString(),
        isValid: false,
        cacheHits: 0,
        cacheMisses: 0,
        hitRatePercentage: 0,
        lastHitTime: null,
        lastMissTime: null,
        efficiency: 'poor',
      }
    }
  }
}

export const redisProductCache = RedisProductCache.getInstance()
