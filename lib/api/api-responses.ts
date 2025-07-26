import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'

export function createApiResponse<T>(data?: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    data,
    message,
    timestamp: new Date().toISOString(),
  })
}
