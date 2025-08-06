import { PrismaClient } from '@prisma/client'
import { EnumValue } from './enum-value'

export interface EnumTableOperations {
  findMany: (args?: {
    where?: { name?: { contains?: string; mode?: 'insensitive' } }
    orderBy?: { [key: string]: 'asc' | 'desc' }
    skip?: number
    take?: number
  }) => Promise<EnumValue[]>

  findFirst: (args: {
    where: {
      name?: { contains?: string; equals?: string; mode?: 'insensitive' } | string
      id?: { not?: number }
      AND?: Array<{
        name?: { contains?: string; equals?: string; mode?: 'insensitive' } | string
        id?: { not?: number }
      }>
      OR?: Array<{
        name?: { contains?: string; equals?: string; mode?: 'insensitive' } | string
        id?: { not?: number }
      }>
    }
  }) => Promise<EnumValue | null>

  findUnique: (args: { where: { id: number } }) => Promise<EnumValue | null>

  create: (args: { data: { name: string; sort_order?: number } }) => Promise<EnumValue>

  update: (args: { where: { id: number }; data: { name: string; sort_order?: number } }) => Promise<EnumValue>

  delete: (args: { where: { id: number } }) => Promise<EnumValue>

  count: (args?: {
    where?: { name?: { contains?: string; mode?: 'insensitive' } }
  }) => Promise<number>
}

export type EnumTableName =
  | 'enum_product_brands'
  | 'enum_experience_levels'
  | 'enum_tobacco_types'
  | 'enum_cures'
  | 'enum_grinds'
  | 'enum_tasting_notes'
  | 'enum_nicotine_levels'
  | 'enum_moisture_levels'
  | 'enum_specification_statuses'
  | 'enum_roles'
  | 'enum_snuff_types'
  | 'enum_statuses'

export type TypedPrismaEnumClient = {
  [K in EnumTableName]: EnumTableOperations
}

export function isValidEnumTableName(name: string): name is EnumTableName {
  const validTables: EnumTableName[] = [
    'enum_product_brands',
    'enum_experience_levels',
    'enum_tobacco_types',
    'enum_cures',
    'enum_grinds',
    'enum_tasting_notes',
    'enum_nicotine_levels',
    'enum_moisture_levels',
    'enum_specification_statuses',
    'enum_roles',
    'enum_snuff_types',
    'enum_statuses',
  ]
  return validTables.includes(name as EnumTableName)
}

export function getEnumTable(prisma: PrismaClient, tableName: EnumTableName): EnumTableOperations {
  return (prisma as unknown as TypedPrismaEnumClient)[tableName]
}
