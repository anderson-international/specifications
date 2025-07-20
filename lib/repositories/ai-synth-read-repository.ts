import { prisma } from '@/lib/prisma'
import { AI_SYNTH_INCLUDE } from './includes/ai-synth-include'
import { buildWhereClause } from './utils/ai-synth-query-builder'
import { AISynthWithRelations, AISynthFilterOptions } from './types/ai-synth-types'

export class AISynthReadRepository {
  static async findMany(filters?: AISynthFilterOptions): Promise<AISynthWithRelations[]> {
    const where = buildWhereClause(filters)

    return prisma.ai_spec_metadata.findMany({
      where,
      include: AI_SYNTH_INCLUDE,
      orderBy: { updated_at: 'desc' },
    })
  }

  static async findByShopifyHandle(
    shopifyHandle: string
  ): Promise<AISynthWithRelations | null> {
    return prisma.ai_spec_metadata.findUnique({
      where: { shopify_handle: shopifyHandle },
      include: AI_SYNTH_INCLUDE,
    })
  }
}
