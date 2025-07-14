import type { CreateSpecificationData, JunctionData } from '@/lib/repositories/specification-repository'

export function transformSpecificationForCreate(specification: Record<string, unknown>): CreateSpecificationData {
  return {
    shopify_handle: specification.shopify_handle as string,
    product_type_id: specification.product_type_id as number,
    is_fermented: specification.is_fermented as boolean,
    is_oral_tobacco: specification.is_oral_tobacco as boolean,
    is_artisan: specification.is_artisan as boolean,
    grind_id: specification.grind_id as number,
    nicotine_level_id: specification.nicotine_level_id as number,
    experience_level_id: specification.experience_level_id as number,
    review: specification.review as string,
    star_rating: specification.star_rating as number,
    rating_boost: specification.rating_boost as number,
    user_id: specification.user_id as string,
    moisture_level_id: specification.moisture_level_id as number,
    product_brand_id: specification.product_brand_id as number,
    status_id: specification.status_id as number,
  }
}

export function transformSpecificationForUpdate(body: Record<string, unknown>): Partial<CreateSpecificationData> {
  return {
    shopify_handle: body.shopify_handle as string,
    product_brand_id: body.product_brand_id as number,
    product_type_id: body.product_type_id as number,
    experience_level_id: body.experience_level_id as number,
    grind_id: body.grind_id as number,
    nicotine_level_id: body.nicotine_level_id as number,
    moisture_level_id: body.moisture_level_id as number,
    is_fermented: body.is_fermented as boolean,
    is_oral_tobacco: body.is_oral_tobacco as boolean,
    is_artisan: body.is_artisan as boolean,
    review: body.review as string,
    star_rating: body.star_rating as number,
    rating_boost: body.rating_boost as number,
    status_id: body.status_id as number,
  }
}

export function transformJunctionDataForCreate(junctionData: Record<string, unknown>): JunctionData {
  return {
    tasting_note_ids: junctionData.tasting_note_ids as number[],
    cure_ids: junctionData.cure_ids as number[],
    tobacco_type_ids: junctionData.tobacco_type_ids as number[],
  }
}

export function transformJunctionDataForUpdate(body: Record<string, unknown>): Partial<JunctionData> {
  return {
    tasting_note_ids: body.tasting_note_ids as number[],
    cure_ids: body.cure_type_ids as number[],
    tobacco_type_ids: body.tobacco_type_ids as number[],
  }
}
