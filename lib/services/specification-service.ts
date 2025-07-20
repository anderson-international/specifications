import { SpecificationReadRepository } from '@/lib/repositories/specification-read-repository'
import { SpecificationWriteRepository } from '@/lib/repositories/specification-write-repository'
import { type SpecificationWithRelations } from '@/lib/repositories/types/specification-types'
import { ProductLookupService } from '@/lib/services/product-lookup-service'
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
  }): Promise<SpecificationWithRelations[]> {
    const cleanFilters = {
      userId: filters.userId || undefined,
      status: filters.status || undefined,
    }
    const specifications = await SpecificationReadRepository.findMany(cleanFilters)
    return ProductLookupService.populateProductsInSpecs(specifications)
  }

  static async getSpecificationById(
    id: number,
    userId?: string | null
  ): Promise<Record<string, unknown> | null> {
    const specification = await SpecificationReadRepository.findById(id, userId || undefined)
    if (!specification) return null
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
