export interface AISynthMetadata {
  id: number
  specification_id: number
  shopify_handle: string
  ai_model?: string
  confidence?: number
  created_at?: Date
  updated_at?: Date
}

export interface AISynthSource {
  id: number
  ai_synth_id: number
  source_spec_id: number
  weight_factor?: number
  contribution_score?: number
  created_at?: Date
  updated_at?: Date
}

export interface AISynthWithRelations {
  id: number
  specification_id: number
  shopify_handle: string
  ai_model?: string
  confidence?: number
  created_at?: Date
  updated_at?: Date
  specifications: {
    id: number
    shopify_handle: string
    is_fermented?: boolean
    is_oral_tobacco?: boolean
    is_artisan?: boolean
    star_rating?: number
    rating_boost?: number
    review?: string
    enum_product_types: { id: number; name: string }
    enum_product_brands: { id: number; name: string }
    enum_grinds: { id: number; name: string }
    enum_nicotine_levels: { id: number; name: string }
    enum_moisture_levels: { id: number; name: string }
    enum_experience_levels: { id: number; name: string }
    enum_specification_statuses: { id: number; name: string }
    users: { id: string; name: string; email: string }
    spec_tasting_notes: Array<{
      enum_tasting_notes: { id: number; name: string }
    }>
    spec_cures: Array<{
      enum_cures: { id: number; name: string }
    }>
    spec_tobacco_types: Array<{
      enum_tobacco_types: { id: number; name: string }
    }>
  }
  sources: Array<{
    source_spec_id: number
    weight_factor?: number
    contribution_score?: number
  }>
}

export interface AISynthResponse {
  id: number
  shopify_handle: string
  ai_model?: string
  confidence?: number
  specification: Record<string, unknown>
  sources: Array<{
    specification_id: number
    weight_factor?: number
    contribution_score?: number
  }>
  created_at: string
  updated_at: string
}

export interface AISynthGenerateRequest {
  shopify_handle: string
  ai_model?: string
  confidence?: number
}

export interface AISynthRefreshRequest {
  ai_model?: string
  confidence?: number
}
