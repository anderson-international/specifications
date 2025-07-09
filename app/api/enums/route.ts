import { enumCache, RedisEnumCache } from '@/lib/cache'

export async function GET(): Promise<Response> {
  try {
    // Check if Redis enum cache is still warming up
    const isWarming = RedisEnumCache.isWarming()

    if (isWarming) {
      const warmingResponse = {
        warming: true,
        message: 'Redis enum cache is initializing, please wait...',
        timestamp: new Date().toISOString(),
      }
      const warmingJson = JSON.stringify(warmingResponse)
      return new Response(warmingJson, {
        status: 202,
        headers: { 'Content-Type': 'application/json' },
      }) // 202 Accepted - processing
    }

    // Fetch enum data from Redis cache (auto-refreshes if missing)
    const enumData = await enumCache.getAllEnums()
    
    const response = {
      data: enumData,
      cached: true,
    }
    
    // Bypass NextResponse.json() - send raw JSON string to avoid framework bug
    const jsonString = JSON.stringify(response)
    return new Response(jsonString, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (_globalError) {
    // Global error fallback
    const fallbackResponse = {
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    }
    const fallbackJson = JSON.stringify(fallbackResponse)
    return new Response(fallbackJson, {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
