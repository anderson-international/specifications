// Utility function exports

// Common utility functions following established standards
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function getStatusTitle(status: string): string {
  switch (status) {
    case 'draft':
      return 'Drafts'
    case 'needs_revision':
      return 'Needs Revision'
    case 'in_review':
      return 'In Review'
    case 'published':
      return 'Published'
    case 'archived':
      return 'Archived'
    default:
      return 'Unknown Status'
  }
}

/**
 * Format a date string to human-readable relative time
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
  return date.toLocaleDateString()
}
