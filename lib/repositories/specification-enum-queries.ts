import { prisma } from '@/lib/prisma'
import { EnumValue } from '@/types/enum'
import { EnumMappers, PrismaEnumWithOrder, PrismaEnumWithoutOrder } from './enum-mappers'

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

export class SpecificationEnumQueries {
  static async fetchAllSpecificationEnums(): Promise<SpecificationEnumData> {
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
      prisma.spec_enum_experience.findMany({ orderBy: { sort_order: 'asc' } }),
      prisma.spec_enum_tobacco_types.findMany({ orderBy: { sort_order: 'asc' } }),
      prisma.spec_enum_cures.findMany({ orderBy: { sort_order: 'asc' } }),
      prisma.spec_enum_grinds.findMany({ orderBy: { sort_order: 'asc' } }),
      prisma.spec_enum_tasting_notes.findMany({ orderBy: { sort_order: 'asc' } }),
      prisma.spec_enum_nicotine.findMany({ orderBy: { sort_order: 'asc' } }),
      prisma.spec_enum_moisture.findMany({ orderBy: { sort_order: 'asc' } }),
      prisma.spec_enum_statuses.findMany({ orderBy: { name: 'asc' } }),
    ])

    return {
      productBrands: EnumMappers.mapWithoutSortOrder(productBrands as PrismaEnumWithoutOrder[]),
      experienceLevels: EnumMappers.mapWithSortOrder(experienceLevels as PrismaEnumWithOrder[]),
      tobaccoTypes: EnumMappers.mapWithSortOrder(tobaccoTypes as PrismaEnumWithOrder[]),
      cures: EnumMappers.mapWithSortOrder(cures as PrismaEnumWithOrder[]),
      grinds: EnumMappers.mapWithSortOrder(grinds as PrismaEnumWithOrder[]),
      tastingNotes: EnumMappers.mapWithSortOrder(tastingNotes as PrismaEnumWithOrder[]),
      nicotineLevels: EnumMappers.mapWithSortOrder(nicotineLevels as PrismaEnumWithOrder[]),
      moistureLevels: EnumMappers.mapWithSortOrder(moistureLevels as PrismaEnumWithOrder[]),
      specificationStatuses: EnumMappers.mapWithoutSortOrder(specificationStatuses as PrismaEnumWithoutOrder[])
    }
  }
}
