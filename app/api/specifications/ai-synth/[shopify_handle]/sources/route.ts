import { NextRequest, NextResponse } from 'next/server'
import { createApiError, withErrorHandling } from '@/lib/api/utils'
import { AISynthService } from '@/lib/services/ai-synth-service'

interface GetParams {
  params: Promise<{
    shopify_handle: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: GetParams
): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { shopify_handle } = await params

    if (!shopify_handle) {
      return createApiError('shopify_handle is required', 400)
    }

    const sources = await AISynthService.getSources(shopify_handle)

    return NextResponse.json({
      data: sources,
      success: true,
      timestamp: new Date().toISOString(),
    })
  })
}
