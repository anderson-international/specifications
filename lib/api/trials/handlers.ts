import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandling, createApiError } from '@/lib/api/api-errors'
import { TrialProductsService } from '@/lib/services/trial-products-service'
import { TrialValidator } from '@/lib/validators/trial-validator'

type Tab = 'to-do' | 'my-trials'

function parseValidatedUserId(request: NextRequest): string | null {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  if (!userId) return null
  const err = TrialValidator.validateUserId(userId)
  if (err) return null
  return userId
}

function makeHandler(includeCompleted: boolean, tab: Tab): (request: NextRequest) => Promise<NextResponse> {
  return async function GET(request: NextRequest): Promise<NextResponse> {
    return withErrorHandling(async () => {
      const userId = parseValidatedUserId(request)
      if (!userId) return createApiError('User ID is required', 400)
      const products = await TrialProductsService.getUserProducts(userId, includeCompleted)
      return NextResponse.json({ data: { products, total: products.length, tab } })
    })
  }
}

export const GET_TODO = makeHandler(false, 'to-do')
export const GET_MY_TRIALS = makeHandler(true, 'my-trials')
