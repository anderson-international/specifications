import { WizardDraft, getDraftKey } from './draft-types'

export function deleteDraft(userId: string, productHandle: string): void {
  const key = getDraftKey(userId, productHandle)
  localStorage.removeItem(key)
  if (
    typeof window !== 'undefined' &&
    typeof window.dispatchEvent === 'function' &&
    typeof CustomEvent === 'function'
  ) {
    window.dispatchEvent(
      new CustomEvent('spec-draft-deleted', { detail: { key, userId, productHandle } })
    )
  }
}

export function getAllUserDrafts(userId: string): WizardDraft[] {
  const drafts: WizardDraft[] = []
  const prefix = `wizard-draft-${userId}-`
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(prefix)) {
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          const draft: WizardDraft = JSON.parse(stored)
          drafts.push(draft)
        } catch (_error) {
          localStorage.removeItem(key)
        }
      }
    }
  }
  
  return drafts.sort((a, b) => 
    new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()
  )
}

