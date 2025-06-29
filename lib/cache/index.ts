// Redis cache module exports
import { RedisProductCache, redisProductCache } from './redis-cache';

// Re-export for external use
export { RedisProductCache };
export { redisProductCache as productCache };
export type { Product } from '@/lib/types/product';

// Legacy export for compatibility during migration
export const ProductCache = RedisProductCache;
