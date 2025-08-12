import { prisma } from '@/lib/prisma'
import { TRIAL_INCLUDE } from './includes/trial-include'
import type { TrialReviewWithRelations, CreateTrialReviewData, UpdateTrialReviewData } from './types/trial-types'
import { TrialJunctionService } from './trial-junction-service'

export class TrialWriteRepository {
  static async create(
    data: CreateTrialReviewData,
    tastingNoteIds: number[]
  ): Promise<TrialReviewWithRelations> {
    return prisma.$transaction(async (tx) => {
      const product = await tx.trial_products.upsert({
        where: { name_brand_id: { name: data.product_name, brand_id: data.brand_id } },
        update: { updated_at: new Date() },
        create: {
          name: data.product_name,
          brand_id: data.brand_id,
        },
      })

      const created = await tx.trial_product_reviews.create({
        data: {
          rating: data.rating,
          review: data.review ?? null,
          should_sell: data.should_sell,
          user_id: data.user_id,
          trial_product_id: product.id,
        },
      })

      await TrialJunctionService.createTastingNotes(tx, created.id, tastingNoteIds)

      return tx.trial_product_reviews.findUniqueOrThrow({
        where: { id: created.id },
        include: TRIAL_INCLUDE,
      })
    })
  }

  static async update(
    id: bigint,
    data: UpdateTrialReviewData,
    tastingNoteIds?: number[]
  ): Promise<{ id: bigint; user_id: string | null; updated_at: Date | null }> {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.trial_product_reviews.update({
        where: { id },
        data: { ...data, updated_at: new Date() },
        select: { id: true, user_id: true, updated_at: true },
      })

      if (tastingNoteIds) {
        await TrialJunctionService.clearTastingNotes(tx, id)
        if (tastingNoteIds.length > 0) {
          await TrialJunctionService.createTastingNotes(tx, id, tastingNoteIds)
        }
      }

      return updated
    })
  }

  static async delete(id: bigint): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await TrialJunctionService.clearTastingNotes(tx, id)
      await tx.trial_product_reviews.delete({ where: { id } })
    })
  }
}
