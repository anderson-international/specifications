import { prisma } from '@/lib/prisma'
import { AI_SYNTH_INCLUDE } from './includes/ai-synth-include'
import { AISynthWithRelations } from './types/ai-synth-types'

export class AISynthSourcesRepository {
  static async getSources(shopifyHandle: string): Promise<AISynthWithRelations['ai_spec_sources']> {
    const aiSynth = await prisma.ai_spec_metadata.findUnique({
      where: { shopify_handle: shopifyHandle },
      include: { ai_spec_sources: { include: AI_SYNTH_INCLUDE.ai_spec_sources.include } },
    })

    return aiSynth?.ai_spec_sources || []
  }

  static async createSources(aiSpecId: number, sources: Array<{ source_spec_id: number; weight_factor?: number; contribution_score?: number }>): Promise<void> {
    await prisma.ai_spec_sources.createMany({
      data: sources.map(source => ({
        ai_spec_id: aiSpecId,
        ...source,
      })),
    })
  }

  static async deleteSources(aiSpecId: number): Promise<void> {
    await prisma.ai_spec_sources.deleteMany({
      where: { ai_spec_id: aiSpecId },
    })
  }
}
