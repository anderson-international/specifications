// Next.js server startup instrumentation
// This file runs immediately when the server starts (not lazily)

export async function register() {
  console.log('🔧 INSTRUMENTATION: register() called');
  console.log('🔧 INSTRUMENTATION: NEXT_RUNTIME =', process.env.NEXT_RUNTIME);
  
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('🔧 INSTRUMENTATION: Running in nodejs runtime, initializing Redis cache...');
    
    try {
      // Import Redis cache initialization dynamically
      const { RedisProductCache } = await import('./lib/cache/redis-cache');
      
      console.log('🔧 INSTRUMENTATION: Starting Redis cache warm-up...');
      const startTime = Date.now();
      
      // Trigger Redis cache warm-up immediately on server startup
      await RedisProductCache.ensureReady();
      
      const endTime = Date.now();
      console.log(`🔧 INSTRUMENTATION: Redis cache warm-up completed in ${endTime - startTime}ms`);
      
      // Verify Redis cache state after initialization
      const instance = RedisProductCache.getInstance();
      const isValid = await instance.isValid();
      const stats = await instance.getStats();
      
      console.log(`🔧 INSTRUMENTATION: Redis cache verification - valid: ${isValid}`);
      console.log(`🔧 INSTRUMENTATION: Redis cache verification - products: ${stats.totalProducts}`);
      
    } catch (error) {
      console.error('🔧 INSTRUMENTATION: CRITICAL ERROR during Redis cache initialization:', error);
    }
  } else {
    console.log('🔧 INSTRUMENTATION: Skipping Redis cache initialization (not nodejs runtime)');
  }
}
