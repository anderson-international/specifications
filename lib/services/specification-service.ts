import { SpecificationReadRepository } from '@/lib/repositories/specification-read-repository'
import { SpecificationWriteRepository } from '@/lib/repositories/specification-write-repository'
import { type SpecificationWithRelations } from '@/lib/repositories/types/specification-types'
import { ProductLookupService } from '@/lib/services/product-lookup-service'
import { productCache } from '@/lib/cache'
import { type Product } from '@/lib/types/product'
import { getAllSpecCountsMap } from '@/lib/shopify/database'

import { transformSpecificationToApiResponse } from './specification-transformers-api'
import {
  transformSpecificationForCreate,
  transformSpecificationForUpdate,
  transformJunctionDataForCreate,
  transformJunctionDataForUpdate
} from './specification-transformers-db'

export class SpecificationService {
  static async getSpecifications(filters: {
    userId?: string | null
    status?: string | null
    aiGenerated?: boolean | null
  }): Promise<SpecificationWithRelations[]> {
    const cleanFilters = {
      userId: filters.userId || undefined,
      status: filters.status || undefined,
    }
    
    let specifications: SpecificationWithRelations[]
    
    if (filters.aiGenerated === true) {
      specifications = await SpecificationReadRepository.findManyWithAI(cleanFilters)
    } else if (filters.aiGenerated === false) {
      specifications = await SpecificationReadRepository.findManyWithoutAI(cleanFilters)
    } else {
      specifications = await SpecificationReadRepository.findMany(cleanFilters)
    }
    
    return ProductLookupService.populateProductsInSpecs(specifications)
  }

  static async getSpecificationById(
    id: number,
    userId?: string | null
  ): Promise<Record<string, unknown>> {
    const specification = await SpecificationReadRepository.findById(id, userId || undefined)
    if (!specification) {
      throw new Error(`Specification not found: id=${id}, userId=${userId}`)
    }
    return transformSpecificationToApiResponse(specification)
  }

  static async createSpecification(
    specification: Record<string, unknown>,
    junctionData: Record<string, unknown>
  ): Promise<SpecificationWithRelations> {
    return SpecificationWriteRepository.create(
      transformSpecificationForCreate(specification),
      transformJunctionDataForCreate(junctionData)
    )
  }

  static async updateSpecification(
    id: number,
    body: Record<string, unknown>
  ): Promise<{ id: number; user_id: string; updated_at: Date | null }> {
    return SpecificationWriteRepository.update(
      id,
      transformSpecificationForUpdate(body),
      transformJunctionDataForUpdate(body)
    )
  }

  static async getUserProducts(userId: string, userHasSpec: boolean): Promise<Array<Product & { userHasSpec: boolean; specCount: number }>> {
    // Get products with spec counts (not from cache)
    const cachedProducts = await productCache.getAllProducts()
    const specCountsMap = await getAllSpecCountsMap()
    
    // Merge cached products with spec counts
    const allProducts = cachedProducts.map(product => ({
      ...product,
      spec_count_total: specCountsMap.get(product.handle) ?? 0
    }))
    
    const userSpecs = await SpecificationReadRepository.findMany({ userId })
    const userShopifyHandles = new Set(userSpecs.map(spec => spec.shopify_handle))
    
    const filtered = allProducts.filter(product => userShopifyHandles.has(product.handle) === userHasSpec)
    
    return filtered
      .map(product => ({
        ...product,
        userHasSpec,
        specCount: product.spec_count_total || 0
      }))
      .sort((a, b) => {
        const titleComparison = a.title.localeCompare(b.title)
        return titleComparison !== 0 ? titleComparison : a.brand.localeCompare(b.brand)
      })
  }
}
