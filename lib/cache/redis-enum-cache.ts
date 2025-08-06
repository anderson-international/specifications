

import { SpecificationEnumData } from '@/types/enum'
import { RedisCacheBase } from './base/redis-cache-base'
import { EnumCacheOperations } from './base/enum-cache-operations'

export class RedisEnumCache extends RedisCacheBase<SpecificationEnumData> {
  private static instance: RedisEnumCache
  protected readonly cacheKey = 'specification:enums'
  protected readonly TTL_SECONDS = null

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

  protected async fetchFreshData(): Promise<SpecificationEnumData> {
    return await EnumCacheOperations.fetchFreshData()
  }

  protected validateData(data: unknown): data is SpecificationEnumData {
    return EnumCacheOperations.validateData(data)
  }

  async getAllEnums(): Promise<SpecificationEnumData> {
    return await EnumCacheOperations.getAllEnumsWithRetry(
      () => this.getData(),
      () => this.refreshCache()
    )
  }

  async invalidate(): Promise<void> {
    await EnumCacheOperations.invalidateCache(this.cacheKey)
  }
}

export const redisEnumCache = RedisEnumCache.getInstance()
