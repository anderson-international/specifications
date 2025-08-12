import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WizardFormData, SaveStatus } from '../types/wizard.types'
import { saveDraft, deleteDraft } from '@/lib/utils/draft-storage'
import { useAutosaveEngine } from '@/hooks/useAutosaveEngine'

interface UseWizardAutoSaveProps {
  methods: UseFormReturn<WizardFormData>
  userId: string
  productHandle: string | null
  currentStep: number
  isEnabled: boolean
  isSubmitting: boolean
}
interface UseWizardAutoSaveReturn {
  clearDraft: () => void
  forceSave: () => void
  saveStatus: SaveStatus
  lastError: string | null
  hasSavedOnce: boolean
}

export const useWizardAutoSave = ({
  methods,
  userId,
  productHandle,
  currentStep,
  isEnabled,
  isSubmitting,
}: UseWizardAutoSaveProps): UseWizardAutoSaveReturn => {
  const { saveStatus, lastError, hasSavedOnce, forceSave } = useAutosaveEngine<WizardFormData>({
    methods,
    isEnabled,
    canSave: () => !isSubmitting,
    saveFn: (data) => {
      if (!productHandle) {
        throw new Error('Cannot save draft: productHandle is null. Ensure product selection is complete before auto-save.')
      }
      saveDraft(userId, productHandle, data, currentStep)
    },
  })

  const clearDraft = useCallback((): void => {
    if (productHandle) deleteDraft(userId, productHandle)
  }, [userId, productHandle])

  return { clearDraft, forceSave, saveStatus: saveStatus as SaveStatus, lastError, hasSavedOnce }
}
