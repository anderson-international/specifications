// Next.js server startup instrumentation
// This file runs immediately when the server starts (not lazily)

export async function register() {
  try {
    // Import Redis cache initialization dynamically
    const { RedisProductCache } = await import('./lib/cache/redis-cache')

    // Trigger Redis cache warm-up immediately on server startup
    await RedisProductCache.ensureReady()
  } catch (error) {
    throw new Error(`INSTRUMENTATION: CRITICAL ERROR during Redis cache initialization: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
