import { SpecificationReadRepository } from '@/lib/repositories/specification-read-repository'
import { type SpecificationWithRelations } from '@/lib/repositories/types/specification-types'
import { type AISynthSourceData } from '@/lib/repositories/types/ai-synth-types'

export class AISynthSourcesService {
  static async fetchAndFilterSources(shopifyHandle: string): Promise<SpecificationWithRelations[]> {
    const sourceSpecs = await SpecificationReadRepository.findMany({
      userId: undefined,
      status: 'published'
    })

    const productSources = sourceSpecs.filter((spec: SpecificationWithRelations) => spec.shopify_handle === shopifyHandle)

    if (productSources.length === 0) {
      throw new Error(`No source specifications found for product: ${shopifyHandle}`)
    }

    return productSources
  }

  static mapSourcesToData(sources: SpecificationWithRelations[]): AISynthSourceData[] {
    return sources.map(source => ({
      source_spec_id: source.id,
      weight_factor: 1.0,
      contribution_score: 1.0 / sources.length,
    }))
  }
}
