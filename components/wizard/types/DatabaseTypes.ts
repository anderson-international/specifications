export interface DatabaseSpecificationData {
  shopify_handle: string
  product_type_id: number
  is_fermented: boolean
  is_oral_tobacco: boolean
  is_artisan: boolean
  grind_id: number
  nicotine_level_id: number
  experience_level_id: number
  review: string
  star_rating: number
  rating_boost: number
  user_id: string
  moisture_level_id: number
  product_brand_id: number
  status_id: number
}

export interface JunctionTableData {
  tasting_note_ids: number[]
  cure_ids: number[]
  tobacco_type_ids: number[]
}

export interface TransformedSpecificationData {
  specification: DatabaseSpecificationData
  junctionData: JunctionTableData
}
