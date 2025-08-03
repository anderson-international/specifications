import { PrismaClient } from '@prisma/client'

// Define the structure of enum table models
export interface EnumValue {
  id: number
  name: string
}

// Define the operations available on enum tables
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

  create: (args: { data: { name: string } }) => Promise<EnumValue>

  update: (args: { where: { id: number }; data: { name: string } }) => Promise<EnumValue>

  delete: (args: { where: { id: number } }) => Promise<EnumValue>

  count: (args?: {
    where?: { name?: { contains?: string; mode?: 'insensitive' } }
  }) => Promise<number>
}

// Define the valid enum table names (matches actual database schema)
export type EnumTableName =
  | 'enum_product_types'
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

// Create a type-safe interface for accessing enum tables
export type TypedPrismaEnumClient = {
  [K in EnumTableName]: EnumTableOperations
}

// Type guard to check if a string is a valid enum table name
export function isValidEnumTableName(name: string): name is EnumTableName {
  const validTables: EnumTableName[] = [
    'enum_product_types',
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

// Helper function to get typed enum table access
export function getEnumTable(prisma: PrismaClient, tableName: EnumTableName): EnumTableOperations {
  return (prisma as unknown as TypedPrismaEnumClient)[tableName]
}

// Pagination and filtering types
export interface EnumQueryOptions {
  search?: string
  page?: number
  limit?: number
}

export interface EnumQueryResult {
  data: EnumValue[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Specification form enum data interface
export interface SpecificationEnumData {
  productBrands: EnumValue[]
  experienceLevels: EnumValue[]
  tobaccoTypes: EnumValue[]
  cures: EnumValue[]
  grinds: EnumValue[]
  tastingNotes: EnumValue[]
  nicotineLevels: EnumValue[]
  moistureLevels: EnumValue[]
  specificationStatuses: EnumValue[]
}
