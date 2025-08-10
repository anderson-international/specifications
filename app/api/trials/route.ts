import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandling, createApiError } from '@/lib/api/api-errors'
import { TrialService } from '@/lib/services/trial-service'
import { TrialValidator } from '@/lib/validators/trial-validator'

export async function GET(): Promise<NextResponse> {
  return withErrorHandling(async (): Promise<{ trials: Awaited<ReturnType<typeof TrialService.getTrials>> } | NextResponse> => {
    const trials = await TrialService.getTrials()
    return { trials }
  })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return withErrorHandling(async (): Promise<Awaited<ReturnType<typeof TrialService.createTrial>> | NextResponse> => {
    const body = await request.json()
    const validationError = TrialValidator.validateCreateRequest(body)
    if (validationError) return createApiError(validationError, 400)

    const result = await TrialService.createTrial(body.trial, body.junctionData)
    return result
  })
}
