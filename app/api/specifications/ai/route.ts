import { NextResponse } from 'next/server'
import { withErrorHandling } from '@/lib/api/utils'
import { AISpecificationService } from '@/lib/services/ai-specification-service'

export async function GET(): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const result = await AISpecificationService.getAISpecifications()
    return result
  })
}
