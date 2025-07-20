import { prisma } from '@/lib/prisma'
import { AI_SYNTH_INCLUDE } from './includes/ai-synth-include'
import { CreateAISynthData, AISynthSourceData, AISynthWithRelations } from './types/ai-synth-types'

export class AISynthWriteRepository {
  static async create(
    data: CreateAISynthData,
    sources: AISynthSourceData[]
  ): Promise<AISynthWithRelations> {
    return prisma.$transaction(async (tx) => {
      const aiSynth = await tx.ai_spec_metadata.create({ data })
      
      if (sources.length > 0) {
        await tx.ai_spec_sources.createMany({
          data: sources.map(source => ({ ai_spec_id: aiSynth.id, ...source })),
        })
      }
      
      return tx.ai_spec_metadata.findUniqueOrThrow({
        where: { id: aiSynth.id },
        include: AI_SYNTH_INCLUDE,
      })
    })
  }

  static async update(
    shopifyHandle: string,
    data: Partial<CreateAISynthData>,
    sources?: AISynthSourceData[]
  ): Promise<AISynthWithRelations> {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.ai_spec_metadata.update({
        where: { shopify_handle: shopifyHandle },
        data: { ...data, updated_at: new Date() },
      })

      if (sources) {
        await tx.ai_spec_sources.deleteMany({ where: { ai_spec_id: updated.id } })
        if (sources.length > 0) {
          await tx.ai_spec_sources.createMany({
            data: sources.map(source => ({ ai_spec_id: updated.id, ...source })),
          })
        }
      }

      return tx.ai_spec_metadata.findUniqueOrThrow({
        where: { id: updated.id },
        include: AI_SYNTH_INCLUDE,
      })
    })
  }
}
