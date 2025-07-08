/**
 * Utility functions for SpecificationCard component
 */

import { SpecificationStatus } from '@/types/specification'

/**
 * Get the CSS class for a specification status
 */
export function getStatusClass(status: SpecificationStatus): string {
  switch (status) {
    case 'draft':
      return 'status--draft'
    case 'pending_review':
      return 'status--pending_review'
    case 'approved':
      return 'status--approved'
    case 'rejected':
      return 'status--rejected'
    case 'published':
      return 'status--published'
    default:
      return 'status--default'
  }
}

/**
 * Get the display label for a specification status
 */
export function getStatusLabel(status: SpecificationStatus): string {
  switch (status) {
    case 'draft':
      return 'Draft'
    case 'pending_review':
      return 'Pending Review'
    case 'approved':
      return 'Approved'
    case 'rejected':
      return 'Rejected'
    case 'published':
      return 'Published'
    default:
      return status
  }
}
