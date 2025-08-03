import { Prisma } from '@prisma/client'
import { SPECIFICATION_INCLUDE } from '../includes/specification-include'

export type SpecificationWithRelations = Prisma.specificationsGetPayload<{
  include: typeof SPECIFICATION_INCLUDE
}>

export interface CreateSpecificationData {
  shopify_handle: string
  is_fermented?: boolean
  is_oral_tobacco?: boolean
  is_artisan?: boolean
  grind_id: number
  nicotine_level_id: number
  experience_level_id: number
  review?: string
  star_rating: number
  rating_boost?: number
  user_id: string
  moisture_level_id: number
  product_brand_id: number
  status_id: number
}

export interface JunctionData {
  tasting_note_ids: number[]
  cure_ids: number[]
  tobacco_type_ids: number[]
}
