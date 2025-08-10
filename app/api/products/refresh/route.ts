import { NextRequest, NextResponse } from 'next/server'
import { RedisProductCache } from '@/lib/cache/redis-product-cache'

import { createApiError, withErrorHandling } from '@/lib/api/api-errors'
import { getBearerUserId, isAdmin } from '@/lib/api/auth-utils'

export async function POST(request: NextRequest): Promise<NextResponse> {
  return withErrorHandling(async (): Promise<{ message: string } | NextResponse> => {
    const userId = getBearerUserId(request)
    if (!userId) return createApiError('Unauthorized', 401)

    const admin = await isAdmin(userId)
    if (!admin) return createApiError('Forbidden', 403)

    await RedisProductCache.getInstance().forceRefresh()
    return { message: 'Product cache refreshed' }
  })
}
