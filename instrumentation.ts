// Next.js server startup instrumentation
// This file runs immediately when the server starts (not lazily)

export async function register() {
  try {
    // Import Redis cache initialization dynamically
    const { RedisProductCache } = await import('@/lib/cache/redis-product-cache')
    const redis = (await import('@/lib/redis')).default

    // Initialize product cache during auth window for performance
    await RedisProductCache.ensureReady()
    
    // Check cache status and report concisely
    const hashExists = await redis.exists('shopify:products:by_handle')
    if (hashExists) {
      const hashData = await redis.hgetall('shopify:products:by_handle')
      const _productCount = Object.keys(hashData || {}).length
      // Cache initialized successfully
    } else {
      // Cache is empty - will be populated on first request
    }
  } catch (error) {
    throw new Error(`INSTRUMENTATION: Product cache initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
