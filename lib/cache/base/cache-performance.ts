// Redis cache performance monitoring utilities
// Extracted from redis-cache.ts to comply with 100-line utility file limit

export interface PerformanceMetrics {
  cacheHits: number
  cacheMisses: number
  totalRequests: number
  hitRatePercentage: number
  lastHitTime: string | null
  lastMissTime: string | null
  efficiency: 'excellent' | 'good' | 'fair' | 'poor'
}

export interface TTLInfo {
  ttlSeconds: number
  ttlMinutes: number
  exists: boolean
  isExpiring: boolean
  needsRefresh: boolean
}

export class CachePerformanceMonitor {
  private static cacheHits = 0
  private static cacheMisses = 0
  private static lastHitTime: Date | null = null
  private static lastMissTime: Date | null = null

  static recordHit(): void {
    CachePerformanceMonitor.cacheHits++
    CachePerformanceMonitor.lastHitTime = new Date()
  }

  static recordMiss(): void {
    CachePerformanceMonitor.cacheMisses++
    CachePerformanceMonitor.lastMissTime = new Date()
  }

  static getMetrics(): PerformanceMetrics {
    const totalRequests = CachePerformanceMonitor.cacheHits + CachePerformanceMonitor.cacheMisses
    const hitRate =
      totalRequests > 0 ? Math.round((CachePerformanceMonitor.cacheHits / totalRequests) * 100) : 0

    return {
      cacheHits: CachePerformanceMonitor.cacheHits,
      cacheMisses: CachePerformanceMonitor.cacheMisses,
      totalRequests,
      hitRatePercentage: hitRate,
      lastHitTime: CachePerformanceMonitor.lastHitTime?.toISOString() || null,
      lastMissTime: CachePerformanceMonitor.lastMissTime?.toISOString() || null,
      efficiency:
        hitRate >= 80 ? 'excellent' : hitRate >= 60 ? 'good' : hitRate >= 40 ? 'fair' : 'poor',
    }
  }

  static reset(): void {
    CachePerformanceMonitor.cacheHits = 0
    CachePerformanceMonitor.cacheMisses = 0
    CachePerformanceMonitor.lastHitTime = null
    CachePerformanceMonitor.lastMissTime = null
  }

  static getCacheHits(): number {
    return CachePerformanceMonitor.cacheHits
  }

  static getCacheMisses(): number {
    return CachePerformanceMonitor.cacheMisses
  }

  static getLastHitTime(): Date | null {
    return CachePerformanceMonitor.lastHitTime
  }

  static getLastMissTime(): Date | null {
    return CachePerformanceMonitor.lastMissTime
  }
}
