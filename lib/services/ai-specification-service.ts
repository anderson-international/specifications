import { prisma } from '@/lib/prisma'
import { Specification, SpecificationStatus } from '@/types/specification'
import { SPECIFICATION_INCLUDE } from '@/lib/repositories/includes/specification-include'
import { ProductLookupService } from '@/lib/services/product-lookup-service'
import { SpecificationWithRelations } from '@/lib/repositories/types/specification-types'

export class AISpecificationService {
  static async getAISpecifications(): Promise<{ specifications: Specification[] }> {
    try {
      const aiSpecs: SpecificationWithRelations[] = await prisma.specifications.findMany({
        where: {
          ai_spec_metadata: {
            isNot: null
          }
        },
        include: {
          ...SPECIFICATION_INCLUDE,
          ai_spec_metadata: {
            select: {
              ai_model: true,
              confidence: true,
              created_at: true,
              updated_at: true
            }
          }
        },
        orderBy: {
          updated_at: 'desc'
        }
      })

      const specsWithProducts = await ProductLookupService.populateProductsInSpecs(aiSpecs) as (SpecificationWithRelations & { product: { handle: string; title: string; brand: string } })[]
      
      const transformedSpecs: Specification[] = specsWithProducts.map((spec): Specification => ({
          id: spec.id.toString(),
          userId: spec.user_id,
          status: (spec.spec_enum_statuses?.name as SpecificationStatus) || 'published',
          progress: 100,
          createdAt: spec.created_at?.toISOString() || '',
          updatedAt: spec.updated_at?.toISOString() || '',
          lastModified: spec.updated_at?.toISOString() || '',
          
          shopify_handle: spec.shopify_handle,
          product_brand_id: spec.product_brand_id,
          product_type_id: spec.product_type_id,
          experience_level_id: spec.experience_level_id,
          grind_id: spec.grind_id,
          nicotine_level_id: spec.nicotine_level_id,
          moisture_level_id: spec.moisture_level_id,
          star_rating: spec.star_rating || 0,
          status_id: spec.status_id,
          user_id: spec.user_id,
          
          tobacco_type_ids: [],
          cure_type_ids: [],
          tasting_note_ids: [],
          is_fermented: spec.is_fermented || false,
          is_oral_tobacco: spec.is_oral_tobacco || false,
          is_artisan: spec.is_artisan || false,
          review: spec.review || undefined,
          rating_boost: spec.rating_boost || undefined,
          
          product: {
            id: spec.product?.handle || spec.shopify_handle,
            handle: spec.shopify_handle,
            title: spec.product?.title || 'Unknown Product',
            brand: spec.product?.brand || 'Unknown Brand'
          }
        }))

      return { specifications: transformedSpecs }
    } catch (error) {
      throw new Error(`AI specifications retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
