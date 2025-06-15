/**
 * Utility functions for SpecificationCard component
 */

import { SpecificationStatus } from '@/types/specification'

/**
 * Format a date string to human-readable relative time
 */
export function formatLastModified(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
  return date.toLocaleDateString()
}

/**
 * Get the background color for a specification status
 */
export function getStatusColor(status: SpecificationStatus): string {
  switch (status) {
    case 'draft': return '#f59e0b'
    case 'pending_review': return '#3b82f6'
    case 'approved': return '#10b981'
    case 'rejected': return '#ef4444'
    case 'published': return '#8b5cf6'
    default: return '#6b7280'
  }
}

/**
 * Get the display label for a specification status
 */
export function getStatusLabel(status: SpecificationStatus): string {
  switch (status) {
    case 'draft': return 'Draft'
    case 'pending_review': return 'Pending Review'
    case 'approved': return 'Approved'
    case 'rejected': return 'Rejected'
    case 'published': return 'Published'
    default: return status
  }
}
