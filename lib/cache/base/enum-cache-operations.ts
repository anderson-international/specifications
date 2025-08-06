import { SpecificationEnumData } from '@/types/enum'
import { getSpecificationEnumData } from '@/lib/data/enums'
import redis from '@/lib/redis'

export class EnumCacheOperations {
  static async fetchFreshData(): Promise<SpecificationEnumData> {
    return await getSpecificationEnumData()
  }

  static validateData(data: unknown): data is SpecificationEnumData {
    if (data && typeof data === 'object' && 'data' in data) {
      const nestedData = (data as Record<string, unknown>).data;
      return (
        typeof nestedData === 'object' &&
        nestedData !== null &&
        'productBrands' in nestedData &&
        'experienceLevels' in nestedData
      );
    }
    return (
      typeof data === 'object' &&
      data !== null &&
      'productBrands' in data &&
      'experienceLevels' in data
    );
  }

  static async getAllEnumsWithRetry(getData: () => Promise<SpecificationEnumData>, refreshCache: () => Promise<void>): Promise<SpecificationEnumData> {
    try {
      return await getData()
    } catch {
      await refreshCache()
      return await getData()
    }
  }

  static async invalidateCache(cacheKey: string): Promise<void> {
    try {
      await redis.del(cacheKey)
    } catch (error) {
      throw new Error(`Failed to invalidate enum cache: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
