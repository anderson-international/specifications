import { type SpecificationWithRelations } from '@/lib/repositories/types/specification-types'
import { type SynthesizedSpecificationData } from '@/lib/repositories/types/ai-synth-types'
import { ClaudeSynthesisService } from './claude-synthesis-service'



export class AIDataSynthesisService {
  static async synthesizeSpecifications(
    sources: SpecificationWithRelations[]
  ): Promise<SynthesizedSpecificationData> {
    if (sources.length === 0) {
      throw new Error('No specifications provided for synthesis')
    }

    if (sources.length === 1) {
      return this.extractSingleSpecification(sources[0])
    }

    try {
      const claudeResult = await ClaudeSynthesisService.synthesizeSpecifications(sources)
      
      return {
        specification: {
          shopify_handle: sources[0].shopify_handle,
          product_brand_id: sources[0].product_brand_id,
          grind_id: claudeResult.grind_id,
          nicotine_level_id: claudeResult.nicotine_level_id,
          moisture_level_id: claudeResult.moisture_level_id,
          experience_level_id: claudeResult.experience_level_id,
          is_fermented: claudeResult.is_fermented,
          is_oral_tobacco: claudeResult.is_oral_tobacco,
          is_artisan: claudeResult.is_artisan,
          star_rating: claudeResult.star_rating,
          rating_boost: 0,
          review: claudeResult.review,
          user_id: 'ai-user-id', // Replace with actual AI user ID
          status_id: 1,
        },
        junctionData: {
          tasting_note_ids: claudeResult.tasting_note_ids,
          cure_ids: claudeResult.cure_ids,
          tobacco_type_ids: claudeResult.tobacco_type_ids,
        },
      }
    } catch (error) {
      throw new Error(`AI synthesis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private static extractSingleSpecification(source: SpecificationWithRelations): SynthesizedSpecificationData {
    return {
      specification: {
        shopify_handle: source.shopify_handle,
        product_brand_id: source.product_brand_id,
        grind_id: source.grind_id,
        nicotine_level_id: source.nicotine_level_id,
        moisture_level_id: source.moisture_level_id,
        experience_level_id: source.experience_level_id,
        is_fermented: source.is_fermented ?? false,
        is_oral_tobacco: source.is_oral_tobacco ?? false,
        is_artisan: source.is_artisan ?? false,
        star_rating: source.star_rating ?? 1,
        rating_boost: 0,
        review: source.review || 'No review available',
        user_id: source.user_id,
        status_id: source.status_id,
      },
      junctionData: {
        tasting_note_ids: source.spec_junction_tasting_notes?.map(tn => tn.spec_enum_tasting_notes.id) || [],
        cure_ids: source.spec_junction_cures?.map(c => c.spec_enum_cures.id) || [],
        tobacco_type_ids: source.spec_junction_tobacco_types?.map(tt => tt.spec_enum_tobacco_types.id) || [],
      },
    }
  }
}
