import { SpecificationReadRepository } from '@/lib/repositories/specification-read-repository'
import { SpecificationWriteRepository } from '@/lib/repositories/specification-write-repository'
import { type SpecificationWithRelations } from '@/lib/repositories/types/specification-types'
import { ProductLookupService } from '@/lib/services/product-lookup-service'

import { transformSpecificationToApiResponse, type ApiResponse } from './specification-transformers-api'
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
  ): Promise<ApiResponse> {
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

}
