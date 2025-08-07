import { WizardDraft, getDraftKey } from './draft-types'
import { deleteDraft } from './draft-operations'

const MAX_DRAFT_AGE_DAYS = 7

export function loadDraft(userId: string, productHandle: string): WizardDraft | null {
  const key = getDraftKey(userId, productHandle)
  const stored = localStorage.getItem(key)
  
  if (!stored) {
    return null
  }
  
  const draft: WizardDraft = JSON.parse(stored)
  const lastSaved = new Date(draft.lastSaved)
  const maxAge = MAX_DRAFT_AGE_DAYS * 24 * 60 * 60 * 1000
  
  if (Date.now() - lastSaved.getTime() > maxAge) {
    deleteDraft(userId, productHandle)
    return null
  }
  
  return draft
}
