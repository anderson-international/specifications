import { NextRequest, NextResponse } from 'next/server'
import { createApiError, withErrorHandling } from '@/lib/api/api-errors'
import { AISynthService } from '@/lib/services/ai-synth-service'

interface PutParams {
  params: Promise<{
    shopify_handle: string
  }>
}

export async function PUT(
  request: NextRequest,
  { params }: PutParams
): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { shopify_handle } = await params
    const body = await request.json()

    if (!shopify_handle) {
      return createApiError('shopify_handle is required', 400)
    }

    if (body.confidence && (typeof body.confidence !== 'number' || body.confidence < 1 || body.confidence > 3)) {
      return createApiError('confidence must be a number between 1 and 3', 400)
    }

    const aiSynthesis = await AISynthService.refreshAISynthesis(
      shopify_handle,
      body.ai_model,
      body.confidence
    )

    return NextResponse.json({
      data: aiSynthesis,
      success: true,
      message: 'AI synthesis refreshed successfully',
      timestamp: new Date().toISOString(),
    })
  })
}
