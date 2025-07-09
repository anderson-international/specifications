// Next.js server startup instrumentation
// This file runs immediately when the server starts (not lazily)

export async function register() {
  try {
    // Import Redis cache initialization dynamically
    const { RedisProductCache } = await import('@/lib/cache/redis-product-cache')

    // Initialize product cache during auth window for performance
    await RedisProductCache.ensureReady()
    
    // Enum cache will be lazily initialized on first API request (Edge Runtime compatibility)
    console.log('Instrumentation: Product cache initialized, enum cache will be lazy loaded')
  } catch (error) {
    throw new Error(`INSTRUMENTATION: Product cache initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
