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

    const aiSynthesis = await AISynthService.getAISynthesis(shopify_handle)
    
    if (!aiSynthesis) {
      return createApiError('AI synthesis not found', 404)
    }

    return NextResponse.json({
      data: aiSynthesis,
      success: true,
      timestamp: new Date().toISOString(),
    })
  })
}
