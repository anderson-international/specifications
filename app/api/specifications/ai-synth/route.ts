import { NextRequest, NextResponse } from 'next/server'
import { createApiError, withErrorHandling } from '@/lib/api/api-errors'
import { AISynthService } from '@/lib/services/ai-synth-service'

export async function GET(request: NextRequest): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { searchParams } = new URL(request.url)
    const shopify_handle = searchParams.get('shopify_handle')
    const confidence = searchParams.get('confidence')
    const ai_model = searchParams.get('ai_model')

    if (confidence && (isNaN(Number(confidence)) || Number(confidence) < 1 || Number(confidence) > 3)) {
      return createApiError('confidence must be a number between 1 and 3', 400)
    }

    const aiSyntheses = await AISynthService.getAllAISyntheses({
      shopify_handle: shopify_handle || undefined,
      confidence: confidence ? Number(confidence) : undefined,
      ai_model: ai_model || undefined,
    })
    
    return NextResponse.json({
      data: aiSyntheses,
      success: true,
      timestamp: new Date().toISOString(),
    })
  })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const body = await request.json()
    
    if (!body.shopify_handle) {
      return createApiError('shopify_handle is required', 400)
    }

    if (typeof body.shopify_handle !== 'string') {
      return createApiError('shopify_handle must be a string', 400)
    }

    if (body.confidence && (typeof body.confidence !== 'number' || body.confidence < 1 || body.confidence > 3)) {
      return createApiError('confidence must be a number between 1 and 3', 400)
    }

    const aiSynthesis = await AISynthService.generateAISynthesis({
      shopify_handle: body.shopify_handle,
      ai_model: body.ai_model,
      confidence: body.confidence,
    })

    return NextResponse.json({
      data: aiSynthesis,
      success: true,
      message: 'AI synthesis generated successfully',
      timestamp: new Date().toISOString(),
    })
  })
}
