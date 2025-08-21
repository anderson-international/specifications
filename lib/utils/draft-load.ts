import { WizardDraft, getDraftKey } from './draft-types'

export function loadDraft(userId: string, productHandle: string): WizardDraft | null {
  const key = getDraftKey(userId, productHandle)
  const stored = localStorage.getItem(key)
  
  if (!stored) {
    return null
  }
  
  const draft: WizardDraft = JSON.parse(stored)
  return draft
}
