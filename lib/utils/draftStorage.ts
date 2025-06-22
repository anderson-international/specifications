import { WizardFormData } from '@/components/wizard/types/wizard.types'

const DRAFT_STORAGE_KEY = 'specification-draft'
const DRAFT_EXPIRY_HOURS = 24

interface DraftData {
  data: Partial<WizardFormData>
  timestamp: number
  productId?: string
}

export function saveDraft(data: Partial<WizardFormData>, productId?: string): void {
  try {
    const draftData: DraftData = {
      data,
      timestamp: Date.now(),
      productId
    }
    
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData))
  } catch (error) {
    console.error('Failed to save draft:', error)
  }
}

export function loadDraft(productId?: string): Partial<WizardFormData> | null {
  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!stored) return null
    
    const draftData: DraftData = JSON.parse(stored)
    
    // Check if draft has expired
    const hoursSinceStored = (Date.now() - draftData.timestamp) / (1000 * 60 * 60)
    if (hoursSinceStored > DRAFT_EXPIRY_HOURS) {
      clearDraft()
      return null
    }
    
    // Check if draft is for the same product (if specified)
    if (productId && draftData.productId && draftData.productId !== productId) {
      return null
    }
    
    return draftData.data
  } catch (error) {
    console.error('Failed to load draft:', error)
    return null
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear draft:', error)
  }
}

export function hasDraft(productId?: string): boolean {
  const draft = loadDraft(productId)
  return draft !== null && Object.keys(draft).length > 0
}
