import { prisma } from '@/lib/prisma'
import { EnumValue } from '@/types/enum'
import { EnumMappers } from './enum-mappers'
import { SpecificationEnumQueries } from './specification-enum-queries'

export class EnumRepository {
  static async getEnumData(tableName: string): Promise<EnumValue[]> {
    try {
      const hasOrderColumn = tableName.startsWith('spec_enum_') && ![
        'spec_enum_snuff_types',
        'spec_enum_statuses'
      ].includes(tableName)
      
      const data = await (prisma as unknown as Record<string, { findMany: Function }>)[
        tableName
      ].findMany({
        orderBy: hasOrderColumn ? { sort_order: 'asc' } : { name: 'asc' },
      })
      return data.map((item: { id: number; name: string; sort_order?: number }): EnumValue => 
        EnumMappers.mapGenericEnum(item)
      )
    } catch (_error) {
      throw new Error(`Failed to fetch enum data for ${tableName}`)
    } finally {
      await prisma.$disconnect()
    }
  }

  static async getAllEnumTables(): Promise<{
    productBrands: EnumValue[]
    experienceLevels: EnumValue[]
    tobaccoTypes: EnumValue[]
    cures: EnumValue[]
    grinds: EnumValue[]
    tastingNotes: EnumValue[]
    nicotineLevels: EnumValue[]
    moistureLevels: EnumValue[]
    specificationStatuses: EnumValue[]
  }> {
    try {
      return await SpecificationEnumQueries.fetchAllSpecificationEnums()
    } catch (_error) {
      throw new Error('Failed to fetch enum data for specification form')
    } finally {
      await prisma.$disconnect()
    }
  }
}
