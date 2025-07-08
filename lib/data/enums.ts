import { prisma } from '@/lib/prisma'
import { EnumValue, SpecificationEnumData } from '@/types/enum'

/**
 * Fetch all enum data required for the specification form
 * @returns Promise<SpecificationEnumData> All enum data for the form
 */
export async function getSpecificationEnumData(): Promise<SpecificationEnumData> {
  try {
    const [
      productTypes,
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
      prisma.enum_product_types.findMany({ orderBy: { name: 'asc' } }),
      prisma.enum_product_brands.findMany({ orderBy: { name: 'asc' } }),
      prisma.enum_experience_levels.findMany({ orderBy: { name: 'asc' } }),
      prisma.enum_tobacco_types.findMany({ orderBy: { name: 'asc' } }),
      prisma.enum_cures.findMany({ orderBy: { name: 'asc' } }),
      prisma.enum_grinds.findMany({ orderBy: { name: 'asc' } }),
      prisma.enum_tasting_notes.findMany({ orderBy: { name: 'asc' } }),
      prisma.enum_nicotine_levels.findMany({ orderBy: { name: 'asc' } }),
      prisma.enum_moisture_levels.findMany({ orderBy: { name: 'asc' } }),
      prisma.enum_specification_statuses.findMany({ orderBy: { name: 'asc' } }),
    ])

    return {
      productTypes: productTypes.map((item): EnumValue => ({ id: item.id, name: item.name })),
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

/**
 * Fetch specific enum data by table name
 * @param tableName - The enum table name to fetch from
 * @returns Promise<EnumValue[]> Array of enum values
 */
export async function getEnumData(tableName: string): Promise<EnumValue[]> {
  try {
    // Use PrismaClient with dynamic table name access
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

/**
 * Cache enum data for performance (optional future enhancement)
 * @param data - The enum data to cache
 * @returns void
 */
export function cacheEnumData(_data: SpecificationEnumData): void {
  // Future implementation for caching enum data
  // Could use Redis, memory cache, or Next.js unstable_cache
}
