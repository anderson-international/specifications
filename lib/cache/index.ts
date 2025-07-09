// Redis cache module exports
import { RedisProductCache, redisProductCache } from './redis-product-cache'
import { RedisEnumCache, redisEnumCache } from './redis-enum-cache'

// Re-export for external use
export { RedisProductCache, RedisEnumCache }
export { redisProductCache as productCache, redisEnumCache as enumCache }
export type { Product } from '@/lib/types/product'

// Legacy export for compatibility during migration
export const ProductCache = RedisProductCache
