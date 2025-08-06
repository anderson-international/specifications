import { useCallback, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WizardFormData } from '../types/wizard.types'
import { saveDraft, deleteDraft } from '@/lib/utils/draft-storage'

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
}

const AUTO_SAVE_DELAY_MS = 3000

export function useWizardAutoSave({
  methods,
  userId,
  productHandle,
  currentStep,
  isEnabled,
  isSubmitting,
}: UseWizardAutoSaveProps): UseWizardAutoSaveReturn {
  const saveTimeoutRef = useRef<number>()
  const lastSavedDataRef = useRef<string>('')

  const clearDraft = useCallback(() => {
    if (productHandle) {
      deleteDraft(userId, productHandle)
    }
  }, [userId, productHandle])

  const forceSave = useCallback(() => {
    if (!isEnabled || !productHandle || isSubmitting) return

    const formData = methods.getValues()
    const currentDataString = JSON.stringify(formData)

    if (currentDataString !== lastSavedDataRef.current) {
      saveDraft(userId, productHandle, formData, currentStep)
      lastSavedDataRef.current = currentDataString
    }
  }, [methods, userId, productHandle, currentStep, isEnabled, isSubmitting])

  const debouncedSave = useCallback(() => {
    if (!isEnabled || !productHandle || isSubmitting) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = Number(setTimeout(() => {
      forceSave()
    }, AUTO_SAVE_DELAY_MS))
  }, [forceSave, isEnabled, productHandle, isSubmitting])

  useEffect(() => {
    if (!isEnabled || !productHandle || currentStep < 2) return

    const subscription = methods.watch(() => {
      debouncedSave()
    })

    return () => {
      subscription.unsubscribe()
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [methods, debouncedSave, isEnabled, productHandle, currentStep])

  useEffect(() => {
    if (currentStep >= 2) {
      forceSave()
    }
  }, [currentStep, forceSave])

  useEffect(() => {
    const handleBeforeUnload = (): void => {
      if (isEnabled && productHandle && !isSubmitting) {
        forceSave()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [forceSave, isEnabled, productHandle, isSubmitting])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return {
    clearDraft,
    forceSave,
  }
}
