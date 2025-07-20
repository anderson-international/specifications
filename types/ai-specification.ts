export interface AISpecificationFilters {
  search: string
  status: string
  sortBy: string
  sortOrder: string
  page: number
  limit: number
}

export interface AISpecificationResponse {
  id: string
  userId: string
  status: string
  progress: number
  createdAt: string
  updatedAt: string
  lastModified: string
  product: {
    id: string
    handle: string
    title: string
    brand: string
  }
  ai: {
    model?: string
    confidence?: number
    createdAt?: string
    updatedAt?: string
  }
  author: {
    name?: string
    email?: string
  }
  review?: string
  starRating?: number
}

export interface AISpecificationListResponse {
  specifications: AISpecificationResponse[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: AISpecificationFilters
}
