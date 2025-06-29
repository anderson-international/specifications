import { NextRequest, NextResponse } from 'next/server'
import { createApiResponse, createApiError } from '@/lib/api/utils'
import {
  validateTableName,
  listEnums,
  createEnum,
  updateEnum,
  ServiceError
} from '@/lib/services/enumService'
import { withJsonBody, withQuery } from '@/lib/api/handlerHelpers'
import { EnumQuerySchema, CreateEnumValueSchema, UpdateEnumValueSchema } from '@/lib/validations/enums'

// Centralised error handler to convert service errors into API responses
function handleError(error: unknown): NextResponse {
  if (error instanceof ServiceError) {
    return createApiError(error.message, error.status, error.details as Record<string, unknown>)
  }
  return createApiError('Unexpected error', 500)
}

// GET /api/enum/[table] - List enum values
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
): Promise<NextResponse> {
  try {
    const { table } = await params
    const tableName = validateTableName(table)
    const { search, page, limit } = EnumQuerySchema.parse(withQuery(request))

    const result = await listEnums({ table: tableName, search, page, limit })
    return createApiResponse(result)
  } catch (error) {
    return handleError(error)
  }
}

// POST /api/enum/[table] - Create new enum value
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
): Promise<NextResponse> {
  try {
    const { table } = await params
    const tableName = validateTableName(table)
    const body = CreateEnumValueSchema.parse(await withJsonBody(request))

    const newValue = await createEnum(tableName, body)
    return createApiResponse(newValue, 'Enum value created successfully')
  } catch (error) {
    return handleError(error)
  }
}

// PUT /api/enum/[table] - Update enum value
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
): Promise<NextResponse> {
  try {
    const { table } = await params
    const tableName = validateTableName(table)
    const body = UpdateEnumValueSchema.parse(await withJsonBody(request))

    const updated = await updateEnum(tableName, body)
    return createApiResponse(updated, 'Enum value updated successfully')
  } catch (error) {
    return handleError(error)
  }
}

