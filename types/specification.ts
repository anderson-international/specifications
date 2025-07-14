export type SpecificationStatus = 'published' | 'needs_revision'

export interface SpecificationFormData {
  // Optional ID for edit mode detection
  id?: string
  
  // Product Selection
  shopify_handle: string
  product_brand_id: number

  // Characteristics 1
  product_type_id: number
  experience_level_id: number
  tobacco_type_ids: number[]

  // Characteristics 2
  cure_type_ids: number[]
  grind_id: number
  is_fermented: boolean
  is_oral_tobacco: boolean
  is_artisan: boolean

  // Sensory Profile
  tasting_note_ids: number[]
  nicotine_level_id: number
  moisture_level_id: number

  // Review & Rating
  review?: string
  star_rating: number
  rating_boost?: number

  // Metadata
  status_id: number
  user_id: string
}

export interface Specification extends SpecificationFormData {
  id: string
  userId: string
  status: SpecificationStatus
  progress: number // 0-100
  score?: number // Overall quality score when reviewed
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  lastModified: string // ISO date string for UI display

  // Product information for display
  product: {
    id: string
    handle: string
    title: string
    brand: string
    imageUrl?: string
    variants?: Array<{
      id: string
      title: string
      price?: number
    }>
  }
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


