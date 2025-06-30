// Redis-backed cache implementation for Shopify products
// Refactored to comply with 100-line utility file limit

import { Product, CacheStats } from '../types/product'
import { RedisCacheCore } from './redis-cache-core'
import { CachePerformanceMonitor } from './redis-cache-performance'

export class RedisProductCache {
  private static instance: RedisProductCache
  private static warming = false
  private core: RedisCacheCore

  private constructor() {
    this.core = new RedisCacheCore()
  }

  static getInstance(): RedisProductCache {
    if (!RedisProductCache.instance) {
      RedisProductCache.instance = new RedisProductCache()
    }
    return RedisProductCache.instance
  }

  static isWarming(): boolean {
    return RedisProductCache.warming
  }

  static async ensureReady(): Promise<void> {
    const instance = RedisProductCache.getInstance()
    
    if (await instance.isValid()) {
      console.log('Redis cache already ready and valid')
      return
    }

    if (RedisProductCache.warming) {
      console.log('Redis cache warming already in progress, waiting...')
      
      while (RedisProductCache.warming && !(await instance.isValid())) {
        await new Promise(resolve => setTimeout(resolve, 100)) // Wait 100ms
      }
      
      if (await instance.isValid()) {
        console.log('Redis cache warming completed while waiting')
        return
      } else {
        throw new Error('Redis cache warming completed but cache is still invalid')
      }
    }

    RedisProductCache.warming = true
    console.log('Starting Redis cache warm-up...')
    
    try {
      await instance.core.refreshCache()
      console.log('✅ Redis cache warm-up completed successfully')
    } catch (error) {
      RedisProductCache.warming = false
      console.error('❌ CRITICAL: Redis cache initialization failed - fail-fast mode enabled')
      throw new Error(`Redis cache initialization failed. Application cannot continue without cache. ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      RedisProductCache.warming = false
    }
  }

  async isValid(): Promise<boolean> {
    return this.core.isValid()
  }

  async getAllProducts(): Promise<Product[]> {
    return this.core.getAllProducts()
  }

  async getProductByHandle(handle: string): Promise<Product | null> {
    return this.core.getProductByHandle(handle)
  }

  async forceRefresh(): Promise<void> {
    console.log('Forcing Redis cache refresh...')
    try {
      await this.core.refreshCache()
      console.log('✅ Redis force refresh completed successfully')
    } catch (error) {
      console.error('❌ CRITICAL: Redis force refresh failed - fail-fast mode enabled')
      throw error // Re-throw to maintain fail-fast behavior
    }
  }

  async getStats(): Promise<CacheStats> {
    try {
      const exists = await this.core.isValid()
      const products = exists ? await this.core.getAllProducts() : []
      const metrics = CachePerformanceMonitor.getMetrics()
      
      return {
        totalProducts: products.length,
        cacheSize: products.length,
        lastUpdated: new Date().toISOString(),
        isValid: exists,
        ...metrics
      }
    } catch (error) {
      console.error('Redis cache stats error:', error)
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
        efficiency: 'poor'
      }
    }
  }
}

export const redisProductCache = RedisProductCache.getInstance()
