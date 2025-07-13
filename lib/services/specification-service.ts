import { SpecificationRepository, type SpecificationWithRelations } from '@/lib/repositories/specification-repository'
import { ProductLookupService } from '@/lib/services/product-lookup-service'

export class SpecificationService {
  static async getSpecifications(filters: {
    userId?: string | null
    status?: string | null
  }): Promise<SpecificationWithRelations[]> {
    const cleanFilters = {
      userId: filters.userId || undefined,
      status: filters.status || undefined,
    }
    const specifications = await SpecificationRepository.findMany(cleanFilters)
    return ProductLookupService.populateProductsInSpecs(specifications)
  }

  static async getSpecificationById(
    id: number,
    userId?: string | null
  ): Promise<any | null> {
    const specification = await SpecificationRepository.findById(id, userId || undefined)
    if (!specification) return null

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
      review_text: specification.review,
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

  static async createSpecification(
    specification: any,
    junctionData: any
  ): Promise<SpecificationWithRelations> {
    return SpecificationRepository.create(
      {
        shopify_handle: specification.shopify_handle,
        product_type_id: specification.product_type_id,
        is_fermented: specification.is_fermented,
        is_oral_tobacco: specification.is_oral_tobacco,
        is_artisan: specification.is_artisan,
        grind_id: specification.grind_id,
        nicotine_level_id: specification.nicotine_level_id,
        experience_level_id: specification.experience_level_id,
        review: specification.review,
        star_rating: specification.star_rating,
        rating_boost: specification.rating_boost,
        user_id: specification.user_id,
        moisture_level_id: specification.moisture_level_id,
        product_brand_id: specification.product_brand_id,
        status_id: specification.status_id,
      },
      {
        tasting_note_ids: junctionData.tasting_note_ids,
        cure_ids: junctionData.cure_ids,
        tobacco_type_ids: junctionData.tobacco_type_ids,
      }
    )
  }

  static async updateSpecification(
    id: number,
    body: any
  ): Promise<{ id: number; user_id: string; updated_at: Date | null }> {
    return SpecificationRepository.update(
      id,
      {
        shopify_handle: body.shopify_handle,
        product_brand_id: body.product_brand_id,
        product_type_id: body.product_type_id,
        experience_level_id: body.experience_level_id,
        grind_id: body.grind_id,
        nicotine_level_id: body.nicotine_level_id,
        moisture_level_id: body.moisture_level_id,
        is_fermented: body.is_fermented,
        is_oral_tobacco: body.is_oral_tobacco,
        is_artisan: body.is_artisan,
        review: body.review_text,
        star_rating: body.star_rating,
        rating_boost: body.rating_boost,
        status_id: body.status_id,
      },
      {
        tasting_note_ids: body.tasting_note_ids,
        cure_ids: body.cure_type_ids,
        tobacco_type_ids: body.tobacco_type_ids,
      }
    )
  }
}
