import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandling, createApiError } from '@/lib/api/api-errors'
import { TrialService } from '@/lib/services/trial-service'
import { TrialValidator } from '@/lib/validators/trial-validator'

interface GetParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: GetParams
): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { id: idString } = await params
    const { id, error } = TrialValidator.validateId(idString)
    if (error) return createApiError(error, 400)

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const trial = await TrialService.getTrialById(id, userId)
    if (!trial) return createApiError('Trial not found', 404)

    return { trial }
  })
}

export async function PUT(
  request: NextRequest,
  { params }: GetParams
): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { id: idString } = await params
    const { id, error } = TrialValidator.validateId(idString)
    if (error) return createApiError(error, 400)

    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (userId) {
      const userValidationError = TrialValidator.validateUserId(userId)
      if (userValidationError) return createApiError(userValidationError, 400)
    }

    if (userId) {
      const existing = await TrialService.getTrialById(id, userId)
      if (!existing) return createApiError('Trial not found or unauthorized', 404)
    }

    const result = await TrialService.updateTrial(id, body)

    return {
      trial: {
        id: result.id,
        userId: result.user_id,
        updatedAt: result.updated_at?.toISOString(),
      },
    }
  })
}

export async function DELETE(
  _request: NextRequest,
  { params }: GetParams
): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { id: idString } = await params
    const { id, error } = TrialValidator.validateId(idString)
    if (error) return createApiError(error, 400)

    await TrialService.deleteTrial(id)

    return { success: true }
  })
}
