import { WizardDraft, getDraftKey } from './draft-types'
import { deleteDraft } from './draft-operations'
import { cleanupOldDrafts } from './draft-cleanup'

const MAX_DRAFT_AGE_DAYS = 7

export function saveDraft(
  userId: string, 
  productHandle: string, 
  formData: Record<string, unknown>,
  currentStep: number
): void {
  const draft: WizardDraft = {
    userId,
    productHandle,
    formData,
    lastSaved: new Date().toISOString(),
    currentStep,
  }
  
  const key = getDraftKey(userId, productHandle)
  localStorage.setItem(key, JSON.stringify(draft))
  cleanupOldDrafts(userId)
}

export function loadDraft(userId: string, productHandle: string): WizardDraft {
  const key = getDraftKey(userId, productHandle)
  const stored = localStorage.getItem(key)
  
  if (!stored) {
    throw new Error(`No draft found for user ${userId} and product ${productHandle}`)
  }
  
  const draft: WizardDraft = JSON.parse(stored)
  const lastSaved = new Date(draft.lastSaved)
  const maxAge = MAX_DRAFT_AGE_DAYS * 24 * 60 * 60 * 1000
  
  if (Date.now() - lastSaved.getTime() > maxAge) {
    deleteDraft(userId, productHandle)
    throw new Error(`Draft expired for user ${userId} and product ${productHandle}`)
  }
  
  return draft
}

export type { WizardDraft } from './draft-types'
export { formatDraftAge, getDraftKey } from './draft-types'
export { deleteDraft, getAllUserDrafts } from './draft-operations'
