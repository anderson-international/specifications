import { type SpecificationWithRelations } from '@/lib/repositories/types/specification-types'

export interface SynthesizedSpecificationData {
  specification: {
    shopify_handle: string
    product_type_id: number
    product_brand_id: number
    grind_id: number
    nicotine_level_id: number
    moisture_level_id: number
    experience_level_id: number
    is_fermented: boolean
    is_oral_tobacco: boolean
    is_artisan: boolean
    star_rating: number
    rating_boost: number
    review: string
    user_id: string
    status_id: number
  }
  junctionData: {
    tasting_note_ids: number[]
    cure_ids: number[]
    tobacco_type_ids: number[]
  }
}

export class AIDataSynthesisService {
  static async synthesizeSpecificationData(
    sources: Array<SpecificationWithRelations>,
    aiUserId: string
  ): Promise<SynthesizedSpecificationData> {
    const firstSource = sources[0]
    
    const avgStarRating = Math.round(
      sources.reduce((sum, spec) => sum + (spec.star_rating || 0), 0) / sources.length
    )

    const mostCommonValue = <T>(values: T[]): T => {
      const counts = values.reduce((acc, val) => {
        acc[val as string] = (acc[val as string] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      return Object.entries(counts).reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b)[0] as T
    }

    return {
      specification: {
        shopify_handle: firstSource.shopify_handle,
        product_type_id: mostCommonValue(sources.map(s => s.product_type_id)),
        product_brand_id: mostCommonValue(sources.map(s => s.product_brand_id)),
        grind_id: mostCommonValue(sources.map(s => s.grind_id)),
        nicotine_level_id: mostCommonValue(sources.map(s => s.nicotine_level_id)),
        moisture_level_id: mostCommonValue(sources.map(s => s.moisture_level_id)),
        experience_level_id: mostCommonValue(sources.map(s => s.experience_level_id)),
        is_fermented: sources.filter(s => s.is_fermented).length > sources.length / 2,
        is_oral_tobacco: sources.filter(s => s.is_oral_tobacco).length > sources.length / 2,
        is_artisan: sources.filter(s => s.is_artisan).length > sources.length / 2,
        star_rating: avgStarRating,
        rating_boost: 0,
        review: `AI-synthesized from ${sources.length} user specifications`,
        user_id: aiUserId,
        status_id: 1,
      },
      junctionData: {
        tasting_note_ids: [...new Set(sources.flatMap(s => s.spec_junction_tasting_notes?.map(tn => tn.spec_enum_tasting_notes.id) || []))],
        cure_ids: [...new Set(sources.flatMap(s => s.spec_junction_cures?.map(c => c.spec_enum_cures.id) || []))],
        tobacco_type_ids: [...new Set(sources.flatMap(s => s.spec_junction_tobacco_types?.map(tt => tt.spec_enum_tobacco_types.id) || []))],
      },
    }
  }
}
