import { type AISynthWithRelations } from '@/lib/repositories/types/ai-synth-types'

export interface AISynthResponse {
  id: number
  shopify_handle: string
  ai_model?: string
  confidence?: number
  specification: Record<string, unknown>
  sources: Array<{
    specification_id: number
    weight_factor?: number
    contribution_score?: number
  }>
  created_at: string
  updated_at: string
}

export class AIResponseTransformer {
  static transformToResponse(aiSynth: AISynthWithRelations): AISynthResponse {
    return {
      id: aiSynth.id,
      shopify_handle: aiSynth.shopify_handle,
      ai_model: aiSynth.ai_model || undefined,
      confidence: aiSynth.confidence || undefined,
      specification: {
        id: aiSynth.specifications.id,
        shopify_handle: aiSynth.specifications.shopify_handle,
        product_brand: aiSynth.specifications.product_enum_brands,
        grind: aiSynth.specifications.spec_enum_grinds,
        nicotine_level: aiSynth.specifications.spec_enum_nicotine,
        moisture_level: aiSynth.specifications.spec_enum_moisture,
        experience_level: aiSynth.specifications.spec_enum_experience,
        is_fermented: aiSynth.specifications.is_fermented,
        is_oral_tobacco: aiSynth.specifications.is_oral_tobacco,
        is_artisan: aiSynth.specifications.is_artisan,
        star_rating: aiSynth.specifications.star_rating,
        rating_boost: aiSynth.specifications.rating_boost,
        review: aiSynth.specifications.review,
        status: aiSynth.specifications.spec_enum_statuses,
        user: aiSynth.specifications.system_users,
        tasting_notes: aiSynth.specifications.spec_junction_tasting_notes.map(tn => tn.spec_enum_tasting_notes),
        cures: aiSynth.specifications.spec_junction_cures.map(c => c.spec_enum_cures),
        tobacco_types: aiSynth.specifications.spec_junction_tobacco_types.map(tt => tt.spec_enum_tobacco_types),
      },
      sources: aiSynth.ai_spec_sources.map(source => ({
        specification_id: source.source_spec_id,
        weight_factor: source.weight_factor ? Number(source.weight_factor) : undefined,
        contribution_score: source.contribution_score ? Number(source.contribution_score) : undefined,
      })),
      created_at: aiSynth.created_at?.toISOString() || '',
      updated_at: aiSynth.updated_at?.toISOString() || '',
    }
  }
}
