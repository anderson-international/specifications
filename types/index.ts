export interface User {
  id: string
  name: string | null
  email: string | null
  role_id: number
  created_at: Date
  updated_at: Date
}

export interface SpecificationFormData {
  id?: number
  shopify_handle: string
  is_fermented?: boolean
  is_oral_tobacco?: boolean
  is_artisan?: boolean
  grind_id: number
  nicotine_level_id: number
  experience_level_id: number
  review?: string
  star_rating?: number
  rating_boost?: number
  created_at?: Date
  updated_at?: Date
  user_id: string
  moisture_level_id: number
  product_brand_id: number
  tasting_note_ids: number[]
  cure_type_ids: number[]
  tobacco_type_ids: number[]
  submission_id?: string
  status_id: number

  users?: User
  enum_specification_statuses?: EnumStatus
  enum_product_brands?: EnumBrand
}

export interface EnumStatus {
  id: number
  name: string
  created_at: Date
  updated_at: Date
}

export interface EnumBrand {
  id: number
  name: string
  created_at: Date
  updated_at: Date
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  details?: unknown
  timestamp: string
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AuthUser {
  id: string // UUID from database
  name: string | null // TEXT, nullable
  email: string // TEXT, required (NOT NULL)
  role_id: number // INTEGER, required FK to enum_roles.id
  role_name: string // Computed from enum_roles.name via relationship
  created_at?: string // TIMESTAMP WITH TIME ZONE
  slack_userid?: string | null // CHARACTER VARYING(30), nullable
  jotform_name?: string | null // CHARACTER VARYING(100), nullable
}

export interface AuthContextType {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  isAuthenticated: boolean
}

export const USER_ROLES = {
  1: 'Admin',
  2: 'Expert',
  3: 'Public',
} as const

export type UserRole = keyof typeof USER_ROLES
