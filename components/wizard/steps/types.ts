// Common types for the Product Selection step

export interface Product {
  id: number | string
  title: string
  handle: string
  brand_id: number
  brand_name: string
  image_url?: string
  is_reviewed: boolean
}

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
