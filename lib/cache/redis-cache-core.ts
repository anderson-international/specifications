// Redis cache core operations
// Extracted from redis-cache.ts to comply with 100-line utility file limit

import redis from '@/lib/redis'
import { Product } from '../types/product'
import { getShopifyProductService } from '@/lib/shopify'
import { CachePerformanceMonitor, TTLInfo } from './redis-cache-performance'

export class RedisCacheCore {
  private readonly TTL_SECONDS = 30 * 60 // 30 minutes
  private readonly CACHE_KEY = 'shopify:products:all'

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
      const cached = await redis.getex(this.CACHE_KEY, { ex: this.TTL_SECONDS })
      
      if (cached && Array.isArray(cached) && cached.length > 0) {
        // Track cache hit
        CachePerformanceMonitor.recordHit()
        console.log(`✅ Redis cache hit with TTL extended (${cached.length} products) [Hits: ${CachePerformanceMonitor.getCacheHits()}]`)
        return cached
      } else {
        // Track cache miss
        CachePerformanceMonitor.recordMiss()
        console.log(`Cache miss: no valid cached data found [Misses: ${CachePerformanceMonitor.getCacheMisses()}]`)
      }
    } catch (error) {
      // Track cache miss due to error
      CachePerformanceMonitor.recordMiss()
      console.warn(`⚠️ Redis cache access failed, falling back to fresh fetch [Misses: ${CachePerformanceMonitor.getCacheMisses()}]:`, error)
    }
    
    // Graceful fallback: fetch fresh data and re-cache
    return await this.refreshCacheAndReturn()
  }

  // Refresh cache and return fresh data
  async refreshCacheAndReturn(): Promise<Product[]> {
    try {
      console.log('Refreshing Redis cache from Shopify...')
      await this.refreshCache()
      
      // Get the newly cached data
      const freshData = await redis.get(this.CACHE_KEY)
      if (freshData && Array.isArray(freshData)) {
        console.log(`✅ Redis cache refreshed and retrieved (${freshData.length} products)`)
        return freshData
      } else {
        throw new Error('Failed to retrieve data after cache refresh')
      }
    } catch (error) {
      console.error('❌ CRITICAL: Failed to refresh and retrieve cache data')
      throw error // Fail-fast on critical cache errors
    }
  }

  // Get single product by handle with graceful fallback
  async getProductByHandle(handle: string): Promise<Product | null> {
    try {
      const products = await this.getAllProducts()
      return products.find(product => product.handle === handle) || null
    } catch (error) {
      console.error('Error getting product by handle:', error)
      return null // Graceful degradation for single product lookup
    }
  }

  // Get TTL information for cache health monitoring
  async getTTLInfo(): Promise<TTLInfo> {
    try {
      const ttl = await redis.ttl(this.CACHE_KEY)
      const exists = await this.isValid()
      
      return {
        ttlSeconds: ttl,
        ttlMinutes: ttl > 0 ? Math.round(ttl / 60) : ttl,
        exists,
        isExpiring: ttl > 0 && ttl < 300, // Less than 5 minutes
        needsRefresh: ttl <= 0 || !exists
      }
    } catch (error) {
      console.error('TTL check error:', error)
      return {
        ttlSeconds: -1,
        ttlMinutes: -1,
        exists: false,
        isExpiring: false,
        needsRefresh: true
      }
    }
  }

  // Refresh cache from Shopify - FAIL-FAST: No silent failures
  async refreshCache(): Promise<void> {
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
      throw new Error(`Failed to refresh Redis product cache from Shopify: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
