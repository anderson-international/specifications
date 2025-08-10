import { prisma } from '@/lib/prisma'
import { TRIAL_INCLUDE } from './includes/trial-include'
import type { TrialReviewWithRelations } from './types/trial-types'

export class TrialReadRepository {
  static async findMany(): Promise<TrialReviewWithRelations[]> {
    return prisma.trial_product_reviews.findMany({
      include: TRIAL_INCLUDE,
      orderBy: { updated_at: 'desc' },
    })
  }

  static async findById(id: bigint, userId?: string): Promise<TrialReviewWithRelations | null> {
    return prisma.trial_product_reviews.findFirst({
      where: {
        id,
        ...(userId ? { user_id: userId } : {}),
      },
      include: TRIAL_INCLUDE,
    })
  }
}
