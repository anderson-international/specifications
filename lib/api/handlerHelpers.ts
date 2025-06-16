import { NextRequest } from 'next/server'
import { ZodTypeAny } from 'zod'
import { ServiceError } from '@/lib/services/enumService'

/**
 * Parse and validate the JSON body of a request using the provided Zod schema.
 * Throws ServiceError on validation failure.
 */
export async function withJsonBody<T extends ZodTypeAny>(
  request: NextRequest,
  schema: T
): Promise<unknown extends T ? never : ReturnType<T['parse']>> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    throw new ServiceError('Invalid JSON body', 400)
  }
  const result = schema.safeParse(body)
  if (!result.success) {
    throw new ServiceError('Invalid request data', 400, {
      validationErrors: result.error.issues
    })
  }
  return result.data as unknown extends T ? never : ReturnType<T['parse']>
}

/**
 * Parse and validate URL query parameters with the given Zod schema.
 */
export function withQuery<T extends ZodTypeAny>(
  request: NextRequest,
  schema: T
): ReturnType<T['parse']> {
  const url = new URL(request.url)
  const params: Record<string, string | null> = {}
  url.searchParams.forEach((value, key) => {
    params[key] = value
  })

  const result = schema.safeParse(params)
  if (!result.success) {
    throw new ServiceError('Invalid query parameters', 400, {
      validationErrors: result.error.issues
    })
  }
  return result.data as ReturnType<T['parse']>
}
