import { NextRequest } from 'next/server'

import { ServiceError } from '@/lib/services/enumService'

/**
 * Parse and validate the JSON body of a request using the provided Zod schema.
 * Throws ServiceError on validation failure.
 */
export async function withJsonBody<T>(request: NextRequest): Promise<T> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    throw new ServiceError('Invalid JSON body', 400)
  }
  return body as T
}

/**
 * Parse and validate URL query parameters with the given Zod schema.
 */
export function withQuery<T>(request: NextRequest): T {
  const url = new URL(request.url)
  const params: Record<string, string | null> = {}
  url.searchParams.forEach((value, key) => {
    params[key] = value
  })

  return params as T
}
