import type { SpecificationWithRelations } from '@/lib/repositories/specification-repository'

interface ApiResponse {
  id: number
  userId: string
  status: string
  [key: string]: unknown
}

export function transformSpecificationToApiResponse(specification: SpecificationWithRelations): ApiResponse {
  return {
    id: specification.id,
    userId: specification.user_id,
    status: specification.enum_specification_statuses?.name || 'unknown',
    createdAt: specification.created_at?.toISOString(),
    updatedAt: specification.updated_at?.toISOString(),
    lastModified: specification.updated_at?.toISOString(),
    shopify_handle: specification.shopify_handle,
    product_brand_id: specification.product_brand_id,
    product_type_id: specification.product_type_id,
    experience_level_id: specification.experience_level_id,
    tobacco_type_ids: specification.spec_tobacco_types?.map(stt => stt.enum_tobacco_types.id) || [],
    cure_type_ids: specification.spec_cures?.map(sc => sc.enum_cures.id) || [],
    grind_id: specification.grind_id,
    is_fermented: specification.is_fermented,
    is_oral_tobacco: specification.is_oral_tobacco,
    is_artisan: specification.is_artisan,
    tasting_note_ids: specification.spec_tasting_notes?.map(stn => stn.enum_tasting_notes.id) || [],
    nicotine_level_id: specification.nicotine_level_id,
    moisture_level_id: specification.moisture_level_id,
    review: specification.review,
    star_rating: specification.star_rating,
    rating_boost: specification.rating_boost,
    status_id: specification.status_id,
    user_id: specification.user_id,
    enums: {
      status: specification.enum_specification_statuses || null,
      brand: specification.enum_product_brands || null,
      productType: specification.enum_product_types || null,
      experienceLevel: specification.enum_experience_levels || null,
      grind: specification.enum_grinds || null,
      nicotineLevel: specification.enum_nicotine_levels || null,
      moistureLevel: specification.enum_moisture_levels || null,
      tastingNotes: specification.spec_tasting_notes?.map(stn => stn.enum_tasting_notes) || [],
      cures: specification.spec_cures?.map(sc => sc.enum_cures) || [],
      tobaccoTypes: specification.spec_tobacco_types?.map(stt => stt.enum_tobacco_types) || [],
    },
  }
}
