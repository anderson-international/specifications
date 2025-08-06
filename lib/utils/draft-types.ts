export interface WizardDraft {
  userId: string
  productHandle: string
  formData: Record<string, unknown>
  lastSaved: string
  currentStep: number
}

const DRAFT_KEY_PREFIX = 'wizard-draft'

export function getDraftKey(userId: string, productHandle: string): string {
  return `${DRAFT_KEY_PREFIX}-${userId}-${productHandle}`
}

export function formatDraftAge(lastSaved: string): string {
  const now = Date.now()
  const saved = new Date(lastSaved).getTime()
  const diffMs = now - saved
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
}
