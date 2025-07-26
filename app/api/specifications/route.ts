import { NextRequest, NextResponse } from 'next/server'
import { createApiError, withErrorHandling } from '@/lib/api/api-errors'
import { SpecificationService } from '@/lib/services/specification-service'
import { SpecificationValidator } from '@/lib/validators/specification-validator'

export async function GET(request: NextRequest): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const aiGenerated = searchParams.get('aiGenerated')

    if (userId) {
      const validationError = SpecificationValidator.validateUserId(userId)
      if (validationError) return createApiError(validationError, 400)
    }

    let aiGeneratedFilter: boolean | null = null
    if (aiGenerated === 'true') aiGeneratedFilter = true
    else if (aiGenerated === 'false') aiGeneratedFilter = false

    const specifications = await SpecificationService.getSpecifications({ 
      userId, 
      status, 
      aiGenerated: aiGeneratedFilter 
    })
    return { specifications }
  })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const body = await request.json()
    
    const validationError = SpecificationValidator.validateCreateRequest(body)
    if (validationError) return createApiError(validationError, 400)

    const result = await SpecificationService.createSpecification(
      body.specification,
      body.junctionData
    )
    return result
  })
}
