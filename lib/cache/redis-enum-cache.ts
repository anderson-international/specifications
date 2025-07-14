// Redis cache implementation for specification enums
// Provides lazy loading for Edge Runtime compatibility

import { SpecificationEnumData } from '@/types/enum'
import { getSpecificationEnumData } from '@/lib/data/enums'
import { RedisCacheBase } from './base/redis-cache-base'
import redis from '@/lib/redis'

export class RedisEnumCache extends RedisCacheBase<SpecificationEnumData> {
  private static instance: RedisEnumCache
  protected readonly cacheKey = 'specification:enums'
  protected readonly TTL_SECONDS = null // Static cache - no TTL

  private constructor() {
    super('enums')
  }

  static getInstance(): RedisEnumCache {
    return RedisCacheBase.getInstanceFromMap('enums', () => new RedisEnumCache())
  }

  static isWarming(): boolean {
    return RedisCacheBase.isWarming('enums')
  }

  static async ensureReady(): Promise<void> {
    const instance = RedisEnumCache.getInstance()
    await instance.ensureReady()
  }

  // Enum-specific data fetching
  protected async fetchFreshData(): Promise<SpecificationEnumData> {
    return await getSpecificationEnumData()
  }

  // Enum-specific data validation
  protected validateData(data: unknown): data is SpecificationEnumData {
    // Check if this is the wrapped cache structure
    if (data && typeof data === 'object' && 'data' in data) {
      const nestedData = (data as Record<string, unknown>).data;
      // Validate the actual enum data
      return (
        typeof nestedData === 'object' &&
        nestedData !== null &&
        'productTypes' in nestedData &&
        'productBrands' in nestedData
      );
    }
    
    // Fallback: direct validation (backwards compatibility)
    return (
      typeof data === 'object' &&
      data !== null &&
      'productTypes' in data &&
      'productBrands' in data
    );
  }

  // Enum-specific methods
  async getAllEnums(): Promise<SpecificationEnumData> {
    try {
      return await this.getData()
    } catch {
      // Cache miss - refresh and retry (matches product cache pattern)
      await this.refreshCache()
      return this.getData()
    }
  }

  async invalidate(): Promise<void> {
    try {
      await redis.del(this.cacheKey)
    } catch (error) {
      throw new Error(`Failed to invalidate enum cache: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const redisEnumCache = RedisEnumCache.getInstance()
