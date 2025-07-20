import { AISynthRepository } from '@/lib/repositories/ai-synth-repository'
import { AISynthValidationService } from './ai-synth-validation-service'
import { AISynthSourcesService } from './ai-synth-sources-service'
import { AISynthOperationsService } from './ai-synth-operations-service'
import { AIResponseTransformer, type AISynthResponse } from './ai-response-transformer'

export interface AISynthGenerateRequest {
  shopify_handle: string
  ai_model?: string
  confidence?: number
}

export interface AISynthFilterOptions {
  shopify_handle?: string
  confidence?: number
  ai_model?: string
}

export class AISynthService {
  static async generateAISynthesis(
    request: AISynthGenerateRequest
  ): Promise<AISynthResponse> {
    const { shopify_handle, ai_model, confidence } = request

    await AISynthValidationService.validateForGeneration(shopify_handle)
    const sources = await AISynthSourcesService.fetchAndFilterSources(shopify_handle)
    const sourceData = AISynthSourcesService.mapSourcesToData(sources)

    const aiSynth = await AISynthOperationsService.createAISynthesis(
      shopify_handle,
      sources,
      sourceData,
      ai_model,
      confidence
    )

    return AIResponseTransformer.transformToResponse(aiSynth)
  }

  static async getAISynthesis(shopifyHandle: string): Promise<AISynthResponse | null> {
    const aiSynth = await AISynthRepository.findByShopifyHandle(shopifyHandle)
    if (!aiSynth) return null

    return AIResponseTransformer.transformToResponse(aiSynth)
  }

  static async refreshAISynthesis(
    shopifyHandle: string,
    ai_model?: string,
    confidence?: number
  ): Promise<AISynthResponse> {
    await AISynthValidationService.validateForRefresh(shopifyHandle)
    const sources = await AISynthSourcesService.fetchAndFilterSources(shopifyHandle)
    const sourceData = AISynthSourcesService.mapSourcesToData(sources)

    const updatedAiSynth = await AISynthOperationsService.updateAISynthesis(
      shopifyHandle,
      sources,
      sourceData,
      ai_model,
      confidence
    )

    return AIResponseTransformer.transformToResponse(updatedAiSynth)
  }

  static async getAllAISyntheses(filters?: AISynthFilterOptions): Promise<AISynthResponse[]> {
    const aiSyntheses = await AISynthRepository.findMany(filters)
    return aiSyntheses.map(aiSynth => AIResponseTransformer.transformToResponse(aiSynth))
  }

  static async getSources(shopifyHandle: string): Promise<Array<Record<string, unknown>>> {
    const sources = await AISynthRepository.getSources(shopifyHandle)
    return sources.map(source => ({
      specification_id: source.source_spec_id,
      weight_factor: source.weight_factor ? Number(source.weight_factor) : undefined,
      contribution_score: source.contribution_score ? Number(source.contribution_score) : undefined,
      specification: {
        id: source.specifications.id,
        user: source.specifications.system_users,
        status: source.specifications.spec_enum_statuses,
        created_at: source.specifications.created_at,
        updated_at: source.specifications.updated_at,
      },
    }))
  }
}
