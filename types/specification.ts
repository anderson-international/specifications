import type { SpecificationFormData } from './index'
export type { SpecificationFormData }
import type { Product } from '@/lib/types/product'

type SpecificationStatus = 'published' | 'needs_revision'

export interface Specification {
  id: string
  userId: string
  status: SpecificationStatus
  progress: number
  score?: number
  createdAt: string
  updatedAt: string
  lastModified: string

  shopify_handle: string
  user_id: string
  is_fermented?: boolean
  is_oral_tobacco?: boolean
  is_artisan?: boolean
  grind_id: number
  nicotine_level_id: number
  experience_level_id: number
  review?: string
  star_rating?: number
  rating_boost?: number
  moisture_level_id: number
  product_brand_id: number
  tasting_note_ids: number[]
  cure_type_ids: number[]
  tobacco_type_ids: number[]
  submission_id?: string
  status_id: number

  aiModel?: string
  confidence?: number
  aiCreatedAt?: string
  aiUpdatedAt?: string

  product: Product | null
}

