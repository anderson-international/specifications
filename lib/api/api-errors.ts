import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'
import { createApiResponse } from './api-responses'

export function createApiError(
  error: string | Error,
  status: number = 500,
  details?: Record<string, unknown>
): NextResponse<ApiResponse> {
  const message = error instanceof Error ? error.message : error

  const response: ApiResponse = {
    error: message,
    message: message,
    timestamp: new Date().toISOString(),
  }

  if (details) {
    response.details = details
  }

  return NextResponse.json(response, { status })
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  if (error instanceof Error) {
    return createApiError(error.message, 500)
  }

  return createApiError('An unexpected error occurred', 500)
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>
): Promise<NextResponse<ApiResponse<T>> | NextResponse<ApiResponse>> {
  try {
    const result = await operation()
    
    if (result instanceof NextResponse) {
      return result
    }
    
    return createApiResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}
