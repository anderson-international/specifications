import { NextRequest, NextResponse } from 'next/server'
import { createApiError, withErrorHandling } from '@/lib/api/api-errors'
import { SpecificationService } from '@/lib/services/specification-service'
import { SpecificationValidator } from '@/lib/validators/specification-validator'

export async function GET(request: NextRequest): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return createApiError('User ID is required', 400)
    }

    const validationError = SpecificationValidator.validateUserId(userId)
    if (validationError) {
      return createApiError(validationError, 400)
    }

    const products = await SpecificationService.getUserProducts(userId, false)
    
    return NextResponse.json({
      data: {
        products,
        total: products.length,
        tab: 'to-do'
      }
    })
  })
}
