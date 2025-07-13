// Redis cache implementation for Shopify products
import redis from '@/lib/redis'
import { getShopifyProductService } from '@/lib/shopify'
import { Product } from '@/lib/types/product'
import { CachePerformanceMonitor } from './base/cache-performance'
import { RedisCacheBase } from './base/redis-cache-base'

export class RedisProductCache extends RedisCacheBase<Product[]> {
  private static instance: RedisProductCache
  protected readonly cacheKey = 'shopify:products:by_handle'
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

  // Override isValid to check hash cache only
  override async isValid(): Promise<boolean> {
    try {
      // Check hash cache exists and has data
      const hashExists = await redis.exists(this.cacheKey)
      if (hashExists !== 1) {
        return false
      }
      
      // Verify hash has actual product data
      const hashData = await redis.hgetall(this.cacheKey)
      return !!(hashData && typeof hashData === 'object' && Object.keys(hashData).length > 0)
    } catch {
      return false
    }
  }

  // Override base ensureReady to use hash cache only
  async ensureReady(): Promise<void> {
    if (await this.isValid()) {
      return
    }

    if (RedisProductCache.isWarming()) {
      while (RedisProductCache.isWarming() && !(await this.isValid())) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      
      if (await this.isValid()) {
        return
      } else {
        throw new Error('Cache warming completed but cache is still invalid')
      }
    }

    this.setWarming(true)

    try {
      await this.refreshHashCache() // Use unified refresh for both array and hash
    } catch (error) {
      throw new Error(
        `Cache initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      this.setWarming(false)
    }
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

  // Hash-based cache refresh with sequential Upstash operations
  async refreshHashCache(): Promise<void> {
    try {
      const products = await this.fetchFreshData()
      
      // Step 1: Clear existing hash
      await redis.del(this.cacheKey)
      
      // Step 2: Build hash data
      const hashData: Record<string, Product> = {}
      for (const product of products) {
        hashData[product.handle] = product
      }
      
      // Step 3: Set all products in single HSET
      await redis.hset(this.cacheKey, hashData)
      
      // Step 4: Set TTL
      await redis.expire(this.cacheKey, this.TTL_SECONDS)
    } catch (error) {
      throw new Error(`Hash cache refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // O(1) hash-based product lookups with fail-fast error handling
  async getProductsByHandles(handles: string[]): Promise<Product[]> {
    if (handles.length === 0) {
      return []
    }

    try {
      const results = await redis.hmget(this.cacheKey, ...handles)
      
      if (!results || typeof results !== 'object') {
        return []
      }
      
      // HMGET returns object with field names as keys, extract values
      const products: Product[] = []
      for (const handle of handles) {
        const product = results[handle]
        if (product) {
          products.push(product as Product)
        }
      }
      
      return products
    } catch (error) {
      throw new Error(`Product hash lookup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getProductByHandleFromHash(handle: string): Promise<Product | null> {
    try {
      const result = await redis.hget(this.cacheKey, handle)
      return (result as Product) || null
    } catch (error) {
      throw new Error(`Product hash lookup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Product-specific methods
  async getAllProducts(): Promise<Product[]> {
    try {
      // Use hash cache as single source of truth
      const hashData = await redis.hgetall(this.cacheKey)
      if (!hashData || typeof hashData !== 'object') {
        throw new Error('Hash cache empty or invalid')
      }
      
      // Convert hash object values to array
      const products = Object.values(hashData) as Product[]
      CachePerformanceMonitor.recordHit()
      return products
    } catch {
      CachePerformanceMonitor.recordMiss()
      await this.refreshHashCache()
      // Retry with hash cache after refresh
      const hashData = await redis.hgetall(this.cacheKey)
      return Object.values(hashData || {}) as Product[]
    }
  }

  async getProductByHandle(handle: string): Promise<Product | null> {
    return this.getProductByHandleFromHash(handle)
  }

  async forceRefresh(): Promise<void> {
    await this.refreshHashCache()
  }
}

export const redisProductCache = RedisProductCache.getInstance()
