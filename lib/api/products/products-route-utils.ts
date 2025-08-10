import { NextRequest, NextResponse } from 'next/server'
import { createApiError, withErrorHandling } from '@/lib/api/api-errors'
import { UserProductsService } from '@/lib/services/user-products-service'
import { SpecificationValidator } from '@/lib/validators/specification-validator'

export type UserProductsTab = 'my-specs' | 'to-do'

export function makeUserProductsGetHandler(
  tab: UserProductsTab,
  includeCompleted: boolean
): (request: NextRequest) => Promise<NextResponse> {
  return async function GET(request: NextRequest): Promise<NextResponse> {
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

      const products = await UserProductsService.getUserProducts(userId, includeCompleted)

      return NextResponse.json({
        data: {
          products,
          total: products.length,
          tab,
        },
      })
    })
  }
}
