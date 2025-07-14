import { enumCache, RedisEnumCache } from '@/lib/cache'

export async function GET(): Promise<Response> {
  try {
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
      })
    }

    const enumData = await enumCache.getAllEnums()
    
    const response = {
      data: enumData,
      cached: true,
    }
    
    const jsonString = JSON.stringify(response)
    return new Response(jsonString, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (_error) {
    return Response.json(
      { error: 'Internal server error', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
