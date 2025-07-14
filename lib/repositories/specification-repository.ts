import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

const SPECIFICATION_INCLUDE = {
  users: { select: { id: true, name: true, email: true } },
  enum_specification_statuses: { select: { id: true, name: true } },
  enum_product_brands: { select: { id: true, name: true } },
  enum_product_types: { select: { id: true, name: true } },
  enum_experience_levels: { select: { id: true, name: true } },
  enum_grinds: { select: { id: true, name: true } },
  enum_nicotine_levels: { select: { id: true, name: true } },
  enum_moisture_levels: { select: { id: true, name: true } },
  spec_tasting_notes: {
    include: { enum_tasting_notes: { select: { id: true, name: true } } }
  },
  spec_cures: {
    include: { enum_cures: { select: { id: true, name: true } } }
  },
  spec_tobacco_types: {
    include: { enum_tobacco_types: { select: { id: true, name: true } } }
  },
} as const

export type SpecificationWithRelations = Prisma.specificationsGetPayload<{
  include: typeof SPECIFICATION_INCLUDE
}>

export interface CreateSpecificationData {
  shopify_handle: string
  product_type_id: number
  is_fermented?: boolean
  is_oral_tobacco?: boolean
  is_artisan?: boolean
  grind_id: number
  nicotine_level_id: number
  experience_level_id: number
  review?: string
  star_rating: number
  rating_boost?: number
  user_id: string
  moisture_level_id: number
  product_brand_id: number
  status_id: number
}

export interface JunctionData {
  tasting_note_ids: number[]
  cure_ids: number[]
  tobacco_type_ids: number[]
}

export class SpecificationRepository {
  static async findMany(filters: {
    userId?: string
    status?: string
  }): Promise<SpecificationWithRelations[]> {
    const where = {
      ...(filters.userId && { user_id: filters.userId }),
      ...(filters.status && { enum_specification_statuses: { name: filters.status } }),
    }

    return prisma.specifications.findMany({
      where,
      include: SPECIFICATION_INCLUDE,
      orderBy: { updated_at: 'desc' },
    })
  }

  static async findById(
    id: number,
    userId?: string
  ): Promise<SpecificationWithRelations | null> {
    return prisma.specifications.findFirst({
      where: {
        id,
        ...(userId && { user_id: userId }),
      },
      include: SPECIFICATION_INCLUDE,
    })
  }

  static async create(
    data: CreateSpecificationData,
    junctionData: JunctionData
  ): Promise<SpecificationWithRelations> {
    return prisma.$transaction(async (tx) => {
      const newSpec = await tx.specifications.create({ data })

      await Promise.all([
        junctionData.tasting_note_ids.length > 0 && tx.spec_tasting_notes.createMany({
          data: junctionData.tasting_note_ids.map(id => ({
            specification_id: newSpec.id,
            enum_tasting_note_id: id,
          })),
        }),
        junctionData.cure_ids.length > 0 && tx.spec_cures.createMany({
          data: junctionData.cure_ids.map(id => ({
            specification_id: newSpec.id,
            enum_cure_id: id,
          })),
        }),
        junctionData.tobacco_type_ids.length > 0 && tx.spec_tobacco_types.createMany({
          data: junctionData.tobacco_type_ids.map(id => ({
            specification_id: newSpec.id,
            enum_tobacco_type_id: id,
          })),
        }),
      ].filter(Boolean))

      return tx.specifications.findUniqueOrThrow({
        where: { id: newSpec.id },
        include: SPECIFICATION_INCLUDE,
      })
    })
  }

  static async update(
    id: number,
    data: Partial<CreateSpecificationData>,
    junctionData?: Partial<JunctionData>
  ): Promise<{ id: number; user_id: string; updated_at: Date | null }> {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.specifications.update({
        where: { id },
        data: { ...data, updated_at: new Date() },
      })

      if (junctionData) {
        await Promise.all([
          tx.spec_tasting_notes.deleteMany({ where: { specification_id: id } }),
          tx.spec_cures.deleteMany({ where: { specification_id: id } }),
          tx.spec_tobacco_types.deleteMany({ where: { specification_id: id } }),
        ])

        await Promise.all([
          junctionData.tasting_note_ids?.length && tx.spec_tasting_notes.createMany({
            data: junctionData.tasting_note_ids.map(noteId => ({
              specification_id: id,
              enum_tasting_note_id: noteId,
            })),
          }),
          junctionData.cure_ids?.length && tx.spec_cures.createMany({
            data: junctionData.cure_ids.map(cureId => ({
              specification_id: id,
              enum_cure_id: cureId,
            })),
          }),
          junctionData.tobacco_type_ids?.length && tx.spec_tobacco_types.createMany({
            data: junctionData.tobacco_type_ids.map(tobaccoId => ({
              specification_id: id,
              enum_tobacco_type_id: tobaccoId,
            })),
          }),
        ].filter(Boolean))
      }

      return updated
    })
  }
}
