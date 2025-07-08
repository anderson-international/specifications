// Common types for the Product Selection step
// Re-export canonical Product type for consistency
export type { Product } from '@/lib/types/product'

export interface Brand {
  id: number
  name: string
}

export interface ProductSelectionFormData {
  product_id: number | null
  shopify_handle: string | null
  brand_id: number | null
}

export interface ProductFilters {
  brand_id?: number | null
  search?: string
}
