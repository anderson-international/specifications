import { NextRequest, NextResponse } from 'next/server'
import { createApiError, withErrorHandling } from '@/lib/api/api-errors'
import { SpecificationService } from '@/lib/services/specification-service'
import { SpecificationValidator } from '@/lib/validators/specification-validator'
import { SpecificationReadRepository } from '@/lib/repositories/specification-read-repository'


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
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const { id, error } = SpecificationValidator.validateId(idString)
    if (error) return createApiError(error, 400)

    const specification = await SpecificationService.getSpecificationById(id, userId)
    if (!specification) return createApiError('Specification not found', 404)

    return NextResponse.json({
      specification,
      success: true,
    })
  })
}

export async function PUT(
  request: NextRequest,
  { params }: GetParams
): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { id: idString } = await params
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const { id, error } = SpecificationValidator.validateId(idString)
    if (error) return createApiError(error, 400)

    const userValidationError = SpecificationValidator.validateUserId(userId)
    if (userValidationError) return createApiError(userValidationError, 400)

    const existingSpec = await SpecificationReadRepository.findById(id, userId!)
    if (!existingSpec) return createApiError('Specification not found or unauthorized', 404)

    const result = await SpecificationService.updateSpecification(id, body)

    return NextResponse.json({
      specification: {
        id: result.id,
        userId: result.user_id,
        updatedAt: result.updated_at?.toISOString(),
      },
      success: true,
      message: 'Specification updated successfully',
    })
  })
}
