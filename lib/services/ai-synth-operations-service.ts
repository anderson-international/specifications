import { AISynthRepository } from '@/lib/repositories/ai-synth-repository'
import { SpecificationWriteRepository } from '@/lib/repositories/specification-write-repository'
import { type SpecificationWithRelations } from '@/lib/repositories/types/specification-types'
import { AIUserService } from './ai-user-service'
import { AIDataSynthesisService } from './ai-data-synthesis-service'
import { type AISynthSourceData, type AISynthWithRelations } from '@/lib/repositories/types/ai-synth-types'

export class AISynthOperationsService {
  static async createAISynthesis(
    shopifyHandle: string,
    sources: SpecificationWithRelations[],
    sourceData: AISynthSourceData[],
    aiModel?: string,
    confidence?: number
  ): Promise<AISynthWithRelations> {
    const aiUserId = await AIUserService.getAIUser()
    const synthData = await AIDataSynthesisService.synthesizeSpecifications(sources)
    
    synthData.specification.user_id = aiUserId

    const newSpec = await SpecificationWriteRepository.create(synthData.specification, synthData.junctionData)

    return AISynthRepository.create(
      {
        specification_id: newSpec.id,
        shopify_handle: shopifyHandle,
        ai_model: aiModel,
        confidence,
      },
      sourceData
    )
  }

  static async updateAISynthesis(
    shopifyHandle: string,
    sources: SpecificationWithRelations[],
    sourceData: AISynthSourceData[],
    aiModel?: string,
    confidence?: number
  ): Promise<AISynthWithRelations> {
    const existing = await AISynthRepository.findByShopifyHandle(shopifyHandle)
    if (!existing) {
      throw new Error(`AI synthesis not found for product: ${shopifyHandle}`)
    }

    const aiUserId = await AIUserService.getAIUser()
    const synthData = await AIDataSynthesisService.synthesizeSpecifications(sources)
    
    synthData.specification.user_id = aiUserId

    await SpecificationWriteRepository.update(
      existing.specification_id,
      synthData.specification,
      synthData.junctionData
    )

    return AISynthRepository.update(
      shopifyHandle,
      { ai_model: aiModel, confidence },
      sourceData
    )
  }
}
