import { WizardDraft, getDraftKey } from './draft-types'
import { cleanupOldDrafts } from './draft-cleanup'

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

    cleanupOldDrafts(userId)
  } catch (error) {

    throw new Error(`Failed to save draft: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
