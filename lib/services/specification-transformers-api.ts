import type { SpecificationWithRelations } from '@/lib/repositories/types/specification-types'

export interface ApiResponse {
  id: number
  userId: string
  status: string
  [key: string]: unknown
}

export function transformSpecificationToApiResponse(specification: SpecificationWithRelations): ApiResponse {
  return {
    id: specification.id,
    userId: specification.user_id,
    shopify_handle: specification.shopify_handle,
    status: specification.spec_enum_statuses?.name || 'Unknown',
    product_brand: specification.product_enum_brands?.name || 'Unknown',
    experience_level: specification.spec_enum_experience?.name || 'Unknown',
    product_brand_id: specification.product_brand_id,
    experience_level_id: specification.experience_level_id,
    tobacco_type_ids: specification.spec_junction_tobacco_types?.map(stt => stt.spec_enum_tobacco_types.id) || [],
    cure_type_ids: specification.spec_junction_cures?.map(sc => sc.spec_enum_cures.id) || [],
    grind_id: specification.grind_id,
    is_fermented: specification.is_fermented,
    is_oral_tobacco: specification.is_oral_tobacco,
    is_artisan: specification.is_artisan,
    tasting_note_ids: specification.spec_junction_tasting_notes?.map(stn => stn.spec_enum_tasting_notes.id) || [],
    nicotine_level_id: specification.nicotine_level_id,
    moisture_level_id: specification.moisture_level_id,
    review: specification.review,
    star_rating: specification.star_rating,
    rating_boost: specification.rating_boost,
    status_id: specification.status_id,
    user_id: specification.user_id,
    enums: {
      status: specification.spec_enum_statuses || null,
      productBrand: specification.product_enum_brands || null,
      experienceLevel: specification.spec_enum_experience || null,
      grind: specification.spec_enum_grinds || null,
      nicotineLevel: specification.spec_enum_nicotine || null,
      moistureLevel: specification.spec_enum_moisture || null,
      tastingNotes: specification.spec_junction_tasting_notes?.map(stn => stn.spec_enum_tasting_notes) || [],
      cures: specification.spec_junction_cures?.map(sc => sc.spec_enum_cures) || [],
      tobaccoTypes: specification.spec_junction_tobacco_types?.map(stt => stt.spec_enum_tobacco_types) || [],
    },
  }
}
