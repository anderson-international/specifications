import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createApiResponse, createApiError, withErrorHandling } from '@/lib/api/utils'
import { 
  EnumTableNameSchema, 
  CreateEnumValueSchema, 
  UpdateEnumValueSchema,
  EnumQuerySchema,
  type ValidatedEnumTableName 
} from '@/lib/validations/enums'
import { getEnumTable, type EnumQueryResult } from '@/types/enum'

// GET /api/enum/[table] - List enum values
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { table } = await params
    
    // Validate table name
    const tableResult = EnumTableNameSchema.safeParse(table)
    if (!tableResult.success) {
      return createApiError('Invalid enum table name', 400, {
        validationErrors: tableResult.error.issues
      })
    }
    
    const tableName: ValidatedEnumTableName = tableResult.data
    
    // Parse query parameters
    const url = new URL(request.url)
    const queryParams = {
      search: url.searchParams.get('search') || undefined,
      page: url.searchParams.get('page') || '1',
      limit: url.searchParams.get('limit') || '50'
    }
    
    const queryResult = EnumQuerySchema.safeParse(queryParams)
    if (!queryResult.success) {
      return createApiError('Invalid query parameters', 400, {
        validationErrors: queryResult.error.issues
      })
    }
    
    const { search, page, limit } = queryResult.data
    const skip = (page - 1) * limit
    
    // Build where clause for search
    const where = search ? {
      name: { contains: search, mode: 'insensitive' as const }
    } : undefined
    
    // Get type-safe enum table access
    const enumTable = getEnumTable(prisma, tableName)
    
    // Get enum values with pagination
    const [enumValues, total] = await Promise.all([
      enumTable.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      enumTable.count({ where })
    ])
    
    const result: EnumQueryResult = {
      data: enumValues,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
    
    return createApiResponse(result)
  })
}

// POST /api/enum/[table] - Create new enum value
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { table } = await params
    
    // Validate table name
    const tableResult = EnumTableNameSchema.safeParse(table)
    if (!tableResult.success) {
      return createApiError('Invalid enum table name', 400, {
        validationErrors: tableResult.error.issues
      })
    }
    
    const tableName: ValidatedEnumTableName = tableResult.data
    
    // Parse and validate request body
    const body = await request.json()
    const dataResult = CreateEnumValueSchema.safeParse(body)
    
    if (!dataResult.success) {
      return createApiError('Invalid request data', 400, {
        validationErrors: dataResult.error.issues
      })
    }
    
    const { name } = dataResult.data
    
    // Get type-safe enum table access
    const enumTable = getEnumTable(prisma, tableName)
    
    // Check for duplicate name
    const existing = await enumTable.findFirst({
      where: { name: { equals: name, mode: 'insensitive' as const } }
    })
    
    if (existing) {
      return createApiError('Enum value already exists', 409)
    }
    
    // Create new enum value
    const newValue = await enumTable.create({
      data: { name }
    })
    
    return createApiResponse(newValue, 'Enum value created successfully')
  })
}

// PUT /api/enum/[table] - Update enum value
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { table } = await params
    
    // Validate table name
    const tableResult = EnumTableNameSchema.safeParse(table)
    if (!tableResult.success) {
      return createApiError('Invalid enum table name', 400, {
        validationErrors: tableResult.error.issues
      })
    }
    
    const tableName: ValidatedEnumTableName = tableResult.data
    
    // Parse and validate request body
    const body = await request.json()
    const dataResult = UpdateEnumValueSchema.safeParse(body)
    
    if (!dataResult.success) {
      return createApiError('Invalid request data', 400, {
        validationErrors: dataResult.error.issues
      })
    }
    
    const { id, name } = dataResult.data
    
    // Get type-safe enum table access
    const enumTable = getEnumTable(prisma, tableName)
    
    // Check if enum value exists
    const existing = await enumTable.findUnique({
      where: { id }
    })
    
    if (!existing) {
      return createApiError('Enum value not found', 404)
    }
    
    // Check for duplicate name (excluding current record)
    const duplicate = await enumTable.findFirst({
      where: { 
        name: { equals: name, mode: 'insensitive' as const },
        id: { not: id }
      }
    })
    
    if (duplicate) {
      return createApiError('Enum value name already exists', 409)
    }
    
    // Update enum value
    const updatedValue = await enumTable.update({
      where: { id },
      data: { name }
    })
    
    return createApiResponse(updatedValue, 'Enum value updated successfully')
  })
}
