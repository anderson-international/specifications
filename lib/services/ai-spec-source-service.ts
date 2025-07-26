import { prisma } from '@/lib/prisma'

export interface AISourceSpecification {
  id: number
  title: string
  weight: number
  contributionScore: number
  specificationId: number
}

export class AISpecSourceService {
  static async getSourceSpecifications(aiSpecId: number): Promise<AISourceSpecification[]> {
    const sources = await prisma.ai_spec_sources.findMany({
      where: {
        ai_spec_id: aiSpecId
      },
      include: {
        specifications: true
      }
    })

    return sources.map(source => ({
      id: source.source_spec_id,
      title: source.specifications ? `Specification ${source.source_spec_id}` : 'Unknown Specification',
      weight: Number(source.weight_factor || 0),
      contributionScore: Number(source.contribution_score || 0),
      specificationId: source.source_spec_id
    }))
  }
}
