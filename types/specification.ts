import { SpecificationFormData } from '@/lib/schemas/specification'

/**
 * Specification status enum for UI display
 */
export type SpecificationStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'approved' 
  | 'rejected' 
  | 'published'

/**
 * Specification interface for UI components
 * Extends the form data with database and UI-specific fields
 */
export interface Specification extends SpecificationFormData {
  id: string
  userId: string
  status: SpecificationStatus
  progress: number // 0-100
  score?: number // Overall quality score when reviewed
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  lastModified: string // ISO date string for UI display
  reviewedAt?: string // ISO date string
  publishedAt?: string // ISO date string
  
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
  
  // Review information when available
  review?: {
    reviewerId: string
    reviewerName: string
    comments?: string
    reviewedAt: string
  }
}

/**
 * Filtered and grouped specifications for UI display
 */
export interface SpecificationGroup {
  status: SpecificationStatus
  title: string
  count: number
  specifications: Specification[]
  isExpanded: boolean
}

/**
 * Specification filters for search and filtering
 */
export interface SpecificationFilters {
  search: string
  status: SpecificationStatus | 'all'
  sortBy: 'updated' | 'created' | 'progress' | 'score'
  sortOrder: 'asc' | 'desc'
}

/**
 * Specification summary for dashboard stats
 */
export interface SpecificationSummary {
  total: number
  byStatus: Record<SpecificationStatus, number>
  averageProgress: number
  averageScore?: number
  recentActivity: Array<{
    id: string
    productTitle: string
    status: SpecificationStatus
    updatedAt: string
  }>
}

/**
 * Draft specification for auto-save functionality
 */
export interface SpecificationDraft {
  id: string
  userId: string
  formData: Partial<SpecificationFormData>
  currentStep: number
  totalSteps: number
  lastSaved: string // ISO date string
  isAutoSaved: boolean
}

/**
 * Type guards for specification status
 */
export const isValidSpecificationStatus = (status: string): status is SpecificationStatus => {
  return ['draft', 'pending_review', 'approved', 'rejected', 'published'].includes(status)
}

/**
 * Helper type for specification status colors (for UI components)
 */
export type SpecificationStatusColor = {
  background: string
  text: string
  border: string
}

/**
 * Specification API response types
 */
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

export interface SpecificationResponse {
  specification: Specification
  success: boolean
  message?: string
}

/**
 * Specification action types for state management
 */
export type SpecificationAction = 
  | 'create'
  | 'edit' 
  | 'delete'
  | 'submit_for_review'
  | 'approve'
  | 'reject'
  | 'publish'
  | 'archive'

/**
 * Export commonly used types for convenience
 */
export type { SpecificationFormData } from '@/lib/schemas/specification'
