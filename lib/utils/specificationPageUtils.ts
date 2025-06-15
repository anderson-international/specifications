/**
 * Utility functions for specifications page
 */

/**
 * Get the display title for a specification status
 */
export function getStatusTitle(status: string): string {
  switch (status) {
    case 'draft':
      return 'Draft'
    case 'submitted':
      return 'Submitted'
    case 'reviewed':
      return 'Reviewed'
    default:
      return ''
  }
}
