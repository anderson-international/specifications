import { WizardDraft, getDraftKey } from './draft-types'

export function saveDraft(
  userId: string, 
  productHandle: string, 
  formData: Record<string, unknown>,
  currentStep: number
): void {
  try {
    const draft: WizardDraft = {
      userId,
      productHandle,
      formData,
      lastSaved: new Date().toISOString(),
      currentStep,
    }
    
    const key = getDraftKey(userId, productHandle)
    localStorage.setItem(key, JSON.stringify(draft))
    if (
      typeof window !== 'undefined' &&
      typeof window.dispatchEvent === 'function' &&
      typeof CustomEvent === 'function'
    ) {
      window.dispatchEvent(
        new CustomEvent('spec-draft-saved', { detail: { key, userId, productHandle } })
      )
    }
  } catch (error) {

    throw new Error(`Failed to save draft: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
