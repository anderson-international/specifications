import { prisma } from '@/lib/prisma'
import { getEnumTable, type EnumQueryResult } from '@/types/enum'
import {
  EnumTableNameSchema,
  type ValidatedEnumTableName,
  type CreateEnumValueInput,
  type UpdateEnumValueInput
} from '@/lib/validations/enums'

/**
 * Local service-layer error with HTTP status mapping
 */
export class ServiceError extends Error {
  public readonly status: number
  public readonly details?: unknown

  constructor(message: string, status = 400, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
  }
}

export function validateTableName(table: string): ValidatedEnumTableName {
  const result = EnumTableNameSchema.safeParse(table)
  if (!result.success) {
    throw new ServiceError('Invalid enum table name', 400, {
      validationErrors: result.error.issues
    })
  }
  return result.data
}

interface ListParams {
  table: ValidatedEnumTableName
  search?: string
  page: number
  limit: number
}

export async function listEnums({ table, search, page, limit }: ListParams): Promise<EnumQueryResult> {
  const enumTable = getEnumTable(prisma, table)
  const skip = (page - 1) * limit

  const where = search
    ? { name: { contains: search, mode: 'insensitive' as const } }
    : undefined

  const [data, total] = await Promise.all([
    enumTable.findMany({ where, orderBy: { name: 'asc' }, skip, take: limit }),
    enumTable.count({ where })
  ])

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  }
}

export async function createEnum(table: ValidatedEnumTableName, input: CreateEnumValueInput) {
  const enumTable = getEnumTable(prisma, table)

  const duplicate = await enumTable.findFirst({
    where: { name: { equals: input.name, mode: 'insensitive' as const } }
  })
  if (duplicate) {
    throw new ServiceError('Enum value already exists', 409)
  }

  return enumTable.create({ data: { name: input.name } })
}

export async function updateEnum(table: ValidatedEnumTableName, input: UpdateEnumValueInput) {
  const enumTable = getEnumTable(prisma, table)

  const existing = await enumTable.findUnique({ where: { id: input.id } })
  if (!existing) {
    throw new ServiceError('Enum value not found', 404)
  }

  const duplicate = await enumTable.findFirst({
    where: {
      AND: [
        { id: { not: input.id } },
        { name: { equals: input.name, mode: 'insensitive' as const } }
      ]
    }
  })
  if (duplicate) {
    throw new ServiceError('Enum value name already exists', 409)
  }

  return enumTable.update({ where: { id: input.id }, data: { name: input.name } })
}
