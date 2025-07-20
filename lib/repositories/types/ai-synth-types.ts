import { Prisma } from '@prisma/client'
import { AI_SYNTH_INCLUDE } from '../includes/ai-synth-include'

export type AISynthWithRelations = Prisma.ai_spec_metadataGetPayload<{
  include: typeof AI_SYNTH_INCLUDE
}>

export interface CreateAISynthData {
  specification_id: number
  shopify_handle: string
  ai_model?: string
  confidence?: number
}

export interface AISynthSourceData {
  source_spec_id: number
  weight_factor?: number
  contribution_score?: number
}

export interface AISynthFilterOptions {
  shopify_handle?: string
  confidence?: number
  ai_model?: string
}
