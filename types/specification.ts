export type SpecificationStatus = 'published' | 'needs_revision'

export interface SpecificationFormData {
  id?: string
  shopify_handle: string
  product_brand_id: number
  product_type_id: number
  experience_level_id: number
  tobacco_type_ids: number[]
  cure_type_ids: number[]
  grind_id: number
  is_fermented: boolean
  is_oral_tobacco: boolean
  is_artisan: boolean
  tasting_note_ids: number[]
  nicotine_level_id: number
  moisture_level_id: number
  review?: string
  star_rating: number
  rating_boost?: number
  status_id: number
  user_id: string
}

import type { Product } from '@/lib/types/product'

export interface Specification extends SpecificationFormData {
  id: string
  userId: string
  status: SpecificationStatus
  progress: number
  score?: number
  createdAt: string
  updatedAt: string
  lastModified: string

  aiModel?: string
  confidence?: number
  aiCreatedAt?: string
  aiUpdatedAt?: string

  product: Product | null
}

export interface SpecificationFilters {
  search: string
  status: SpecificationStatus | 'all'
  sortBy: 'updated' | 'created' | 'progress' | 'score'
  sortOrder: 'asc' | 'desc'
}

export interface SpecificationListResponse {
  specifications: Specification[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: SpecificationFilters
}


