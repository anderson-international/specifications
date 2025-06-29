// Redis-backed cache implementation for Shopify products
import redis from '@/lib/redis'
import { Product, CacheStats } from './types'
import { getShopifyProductService } from '@/lib/shopify'

export class RedisProductCache {
  private static instance: RedisProductCache
  private static warming = false
  private readonly TTL_SECONDS = 30 * 60 // 30 minutes
  private readonly CACHE_KEY = 'shopify:products:all'

  private constructor() {}

  static getInstance(): RedisProductCache {
    if (!RedisProductCache.instance) {
      RedisProductCache.instance = new RedisProductCache()
    }
    return RedisProductCache.instance
  }

  static isWarming(): boolean {
    return RedisProductCache.warming
  }

  // Background initialization with strict fail-fast
  static async ensureReady(): Promise<void> {
    const instance = RedisProductCache.getInstance()
    
    // If already valid, return immediately
    if (await instance.isValid()) {
      console.log('Redis cache already ready and valid')
      return
    }

    // If warming is in progress, wait for it to complete
    if (RedisProductCache.warming) {
      console.log('Redis cache warming already in progress, waiting...')
      
      // Poll until warming completes or cache becomes valid
      while (RedisProductCache.warming && !(await instance.isValid())) {
        await new Promise(resolve => setTimeout(resolve, 100)) // Wait 100ms
      }
      
      // Final validation after warming completes
      if (await instance.isValid()) {
        console.log('Redis cache warming completed while waiting')
        return
      } else {
        throw new Error('Redis cache warming completed but cache is still invalid')
      }
    }

    // Start new warming process
    RedisProductCache.warming = true
    console.log('Starting Redis cache warm-up...')
    
    try {
      await instance.refreshCache()
      console.log('✅ Redis cache warm-up completed successfully')
    } catch (error) {
      RedisProductCache.warming = false
      console.error('❌ CRITICAL: Redis cache initialization failed - fail-fast mode enabled')
      throw new Error(
        `Redis cache initialization failed. Application cannot continue without cache. ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    } finally {
      RedisProductCache.warming = false
    }
  }

  // Check if cache entry is valid (Redis handles TTL automatically)
  async isValid(): Promise<boolean> {
    try {
      const exists = await redis.exists(this.CACHE_KEY)
      return exists === 1
    } catch (error) {
      console.error('Redis cache validation error:', error)
      return false
    }
  }

  // Get all products with sliding expiration and graceful fallback
  async getAllProducts(): Promise<Product[]> {
    try {
      // Attempt to get products with sliding expiration (GETEX - atomic get + extend TTL)
      console.log('Attempting Redis cache access with sliding expiration')
      const cached = await redis.getex(this.CACHE_KEY, { EX: this.TTL_SECONDS })
      
      if (cached && Array.isArray(cached) && cached.length > 0) {
        console.log(`✅ Redis cache hit with TTL extended (${cached.length} products)`)
        return cached
      } else {
        console.log('Cache miss: no valid cached data found')
      }
    } catch (error) {
      console.warn('⚠️ Redis cache access failed, falling back to fresh fetch:', error)
    }
    
    // Graceful fallback: fetch fresh data and re-cache
    console.log('🔄 Cache miss/error - fetching fresh products and re-caching...')
    return await this.refreshCacheAndReturn()
  }

  // Refresh cache and return fresh data
  private async refreshCacheAndReturn(): Promise<Product[]> {
    try {
      // Refresh cache using existing method
      await this.refreshCache()
      
      // Now get the fresh products from cache
      const freshProducts = await redis.get<Product[]>(this.CACHE_KEY)
      
      if (freshProducts && Array.isArray(freshProducts)) {
        console.log(`✅ Fresh products fetched and cached (${freshProducts.length} products)`)
        return freshProducts
      } else {
        throw new Error('Cache refresh succeeded but no valid products found')
      }
    } catch (error) {
      console.error('❌ CRITICAL: Failed to fetch fresh products:', error)
      throw new Error(`Unable to load products: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Get single product by handle with graceful fallback
  async getProductByHandle(handle: string): Promise<Product | null> {
    try {
      // Use getAllProducts which already handles sliding expiration and graceful fallback
      const products = await this.getAllProducts()
      const product = products.find((p: Product) => p.handle === handle)
      
      if (product) {
        console.log(`✅ Product found: ${handle}`)
      } else {
        console.log(`⚠️ Product not found: ${handle}`)
      }
      
      return product || null
    } catch (error) {
      console.error(`❌ Failed to lookup product '${handle}':`, error)
      throw new Error(`Unable to lookup product '${handle}': ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Get cache statistics
  async getCacheStats(): Promise<CacheStats> {
    try {
      const exists = await this.isValid()
      const ttl = exists ? await redis.ttl(this.CACHE_KEY) : -1
      const products = exists ? await this.getAllProducts() : []
      
      return {
        totalProducts: products.length,
        lastRefresh: null, // Redis doesn't track this easily
        cacheHits: 0, // Would need separate tracking
        cacheMisses: 0 // Would need separate tracking
      }
    } catch (error) {
      console.error('Redis cache stats error:', error)
      return {
        totalProducts: 0,
        lastRefresh: null,
        cacheHits: 0,
        cacheMisses: 0
      }
    }
  }

  // Force cache refresh - FAIL-FAST: Throws on failure
  async forceRefresh(): Promise<void> {
    console.log('Forcing Redis cache refresh...')
    try {
      await this.refreshCache()
      console.log('✅ Redis force refresh completed successfully')
    } catch (error) {
      console.error('❌ CRITICAL: Redis force refresh failed - fail-fast mode enabled')
      throw error // Re-throw to maintain fail-fast behavior
    }
  }

  // Refresh cache from Shopify - FAIL-FAST: No silent failures
  private async refreshCache(): Promise<void> {
    try {
      const shopifyService = getShopifyProductService()
      const products = await shopifyService.fetchAllProducts()
      
      // Validate products before caching
      if (!Array.isArray(products) || products.length === 0) {
        throw new Error('No products received from Shopify service')
      }

      // Store products in Redis with TTL
      await redis.setex(this.CACHE_KEY, this.TTL_SECONDS, JSON.stringify(products))

      console.log(`Redis cache refreshed: ${products.length} products cached`)
    } catch (error) {
      console.error('❌ CRITICAL: Redis cache refresh failed - fail-fast mode enabled')
      throw new Error(
        `Failed to refresh Redis product cache from Shopify: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }
}

// Export singleton instance for easy access
export const redisProductCache = RedisProductCache.getInstance()
