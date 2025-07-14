// Generic Redis cache base class - eliminates duplication between product and enum caches
// Supports both TTL-based caches (products) and static caches (enums)
import redis from '@/lib/redis'

export abstract class RedisCacheBase<T> {
  private static warmingStates: Map<string, boolean> = new Map()
  private static instances: Map<string, RedisCacheBase<unknown>> = new Map()
  
  protected abstract readonly cacheKey: string
  protected abstract readonly TTL_SECONDS: number | null // null = no TTL (static cache)
  protected abstract fetchFreshData(): Promise<T>
  protected abstract validateData(data: unknown): data is T

  protected constructor(private readonly instanceKey: string) {}

  // Generic singleton pattern - store in static map
  protected static getInstanceFromMap<U extends RedisCacheBase<unknown>>(
    instanceKey: string,
    createInstance: () => U
  ): U {
    if (!RedisCacheBase.instances.has(instanceKey)) {
      RedisCacheBase.instances.set(instanceKey, createInstance())
    }
    return RedisCacheBase.instances.get(instanceKey)! as U
  }

  // Generic warming state management
  static isWarming(instanceKey: string): boolean {
    return RedisCacheBase.warmingStates.get(instanceKey) || false
  }

  protected setWarming(warming: boolean): void {
    RedisCacheBase.warmingStates.set(this.instanceKey, warming)
  }

  // Generic cache validation
  async isValid(): Promise<boolean> {
    try {
      const exists = await redis.exists(this.cacheKey)
      return exists === 1
    } catch {
      return false
    }
  }

  // Generic cache retrieval - supports both TTL and static patterns
  protected async getData(): Promise<T> {
    try {
      let cached: unknown
      
      if (this.TTL_SECONDS !== null) {
        // TTL-based cache: use canonical getex for atomic sliding expiration
        cached = await redis.getex(this.cacheKey, { ex: this.TTL_SECONDS })
      } else {
        // Static cache: use simple get
        cached = await redis.get(this.cacheKey)
      }
      
      if (cached && this.validateData(cached)) {
        // Extract actual data from new cache structure
        if (cached && typeof cached === 'object' && 'data' in cached) {
          const cacheData = cached as unknown as { data: T; _cached: string }
          return cacheData.data
        }
        // Fallback for direct data (backwards compatibility)
        return cached
      }
      
      throw new Error(`Cache not found: key=${this.cacheKey}`)
    } catch (error) {
      throw new Error(`Redis cache error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Generic cache refresh - supports both TTL and static patterns
  async refreshCache(): Promise<void> {
    try {
      const freshData = await this.fetchFreshData()
      // Store the data directly (preserving array structure) with timestamp
      const cachedData = {
        data: freshData,
        _cached: new Date().toISOString()
      }
      
      if (this.TTL_SECONDS !== null) {
        // TTL-based cache: use setex with expiration
        await redis.setex(this.cacheKey, this.TTL_SECONDS, cachedData)
      } else {
        // Static cache: use simple set (no expiration)
        await redis.set(this.cacheKey, cachedData)
      }
    } catch (error) {
      throw new Error(`Failed to refresh cache: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Generic ensure ready with warming protection
  async ensureReady(): Promise<void> {
    if (await this.isValid()) {
      return
    }

    if (RedisCacheBase.isWarming(this.instanceKey)) {
      while (RedisCacheBase.isWarming(this.instanceKey) && !(await this.isValid())) {
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
      await this.refreshCache()
    } catch (error) {
      throw new Error(
        `Cache initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      this.setWarming(false)
    }
  }
}
