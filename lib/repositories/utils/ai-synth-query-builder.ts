import { Prisma } from '@prisma/client'
import { AISynthFilterOptions } from '../types/ai-synth-types'

export function buildWhereClause(filters?: AISynthFilterOptions): Prisma.ai_spec_metadataWhereInput {
  const where: Prisma.ai_spec_metadataWhereInput = {}
  
  if (filters?.shopify_handle) {
    where.shopify_handle = filters.shopify_handle
  }
  
  if (filters?.confidence) {
    where.confidence = filters.confidence
  }
  
  if (filters?.ai_model) {
    where.ai_model = filters.ai_model
  }

  return where
}
