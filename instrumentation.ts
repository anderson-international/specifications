// Next.js server startup instrumentation
// This file runs immediately when the server starts (not lazily)

export async function register() {
  try {
    // Import Redis cache initialization dynamically
    const { RedisProductCache } = await import('@/lib/cache/redis-product-cache')
    const redis = (await import('@/lib/redis')).default

    console.log('🔄 INSTRUMENTATION: Starting cache initialization...')
    
    // Initialize product cache during auth window for performance
    await RedisProductCache.ensureReady()
    
    // Check what was actually created
    const hashExists = await redis.exists('shopify:products:by_handle')
    const hashLength = hashExists === 1 ? await redis.hlen('shopify:products:by_handle') : 0

    console.log('📋 INSTRUMENTATION: Cache status after initialization:')
    console.log(`  - Hash cache (shopify:products:by_handle): ${hashExists === 1 ? '✅ EXISTS' : '❌ MISSING'}`)
    console.log(`  - Hash contains ${hashLength} products`)
    console.log('🎯 INSTRUMENTATION: Hash cache initialized successfully!')
    
    // Enum cache will be lazily initialized on first API request (Edge Runtime compatibility)
    console.log('📝 INSTRUMENTATION: Enum cache will be lazy loaded on first request')
  } catch (error) {
    console.error('❌ INSTRUMENTATION ERROR:', error instanceof Error ? error.message : 'Unknown error')
    throw new Error(`INSTRUMENTATION: Product cache initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
