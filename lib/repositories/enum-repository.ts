import { prisma } from '@/lib/prisma'
import { EnumValue } from '@/types/enum'

export class EnumRepository {
  static async getEnumData(tableName: string): Promise<EnumValue[]> {
    try {
      const data = await (prisma as unknown as Record<string, { findMany: Function }>)[
        tableName
      ].findMany({
        orderBy: { name: 'asc' },
      })
      return data.map(
        (item: { id: number; name: string }): EnumValue => ({ id: item.id, name: item.name })
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
      const [
        productBrands,
        experienceLevels,
        tobaccoTypes,
        cures,
        grinds,
        tastingNotes,
        nicotineLevels,
        moistureLevels,
        specificationStatuses,
      ] = await Promise.all([
        prisma.product_enum_brands.findMany({ orderBy: { name: 'asc' } }),
        prisma.spec_enum_experience.findMany({ orderBy: { name: 'asc' } }),
        prisma.spec_enum_tobacco_types.findMany({ orderBy: { name: 'asc' } }),
        prisma.spec_enum_cures.findMany({ orderBy: { name: 'asc' } }),
        prisma.spec_enum_grinds.findMany({ orderBy: { name: 'asc' } }),
        prisma.spec_enum_tasting_notes.findMany({ orderBy: { name: 'asc' } }),
        prisma.spec_enum_nicotine.findMany({ orderBy: { name: 'asc' } }),
        prisma.spec_enum_moisture.findMany({ orderBy: { name: 'asc' } }),
        prisma.spec_enum_statuses.findMany({ orderBy: { name: 'asc' } }),
      ])

      return {
        productBrands: productBrands.map((item): EnumValue => ({ id: item.id, name: item.name })),
        experienceLevels: experienceLevels.map(
          (item): EnumValue => ({ id: item.id, name: item.name })
        ),
        tobaccoTypes: tobaccoTypes.map((item): EnumValue => ({ id: item.id, name: item.name })),
        cures: cures.map((item): EnumValue => ({ id: item.id, name: item.name })),
        grinds: grinds.map((item): EnumValue => ({ id: item.id, name: item.name })),
        tastingNotes: tastingNotes.map((item): EnumValue => ({ id: item.id, name: item.name })),
        nicotineLevels: nicotineLevels.map((item): EnumValue => ({ id: item.id, name: item.name })),
        moistureLevels: moistureLevels.map((item): EnumValue => ({ id: item.id, name: item.name })),
        specificationStatuses: specificationStatuses.map(
          (item): EnumValue => ({ id: item.id, name: item.name })
        ),
      }
    } catch (_error) {
      throw new Error('Failed to fetch enum data for specification form')
    } finally {
      await prisma.$disconnect()
    }
  }
}
