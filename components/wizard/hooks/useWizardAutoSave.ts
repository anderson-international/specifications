import { useCallback, useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WizardFormData, SaveStatus } from '../types/wizard.types'
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
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [lastError, setLastError] = useState<string | null>(null)
  const [hasSavedOnce, setHasSavedOnce] = useState<boolean>(false)
  const lastSavedDataRef = useRef<string>('')
  const debounceTimerRef = useRef<number | null>(null)
  const hasUserEditedRef = useRef<boolean>(false)

  const scheduleSaveStatusUpdate = (savingStartTime: number, setSave: (s: SaveStatus) => void): void => {
    const elapsedTime = Date.now() - savingStartTime
    const remainingTime = Math.max(0, 1000 - elapsedTime)
    setTimeout(() => {
      setSave('saved')
      setTimeout(() => { setSave('idle') }, 2000)
    }, remainingTime)
  }

  useEffect(() => {
    lastSavedDataRef.current = JSON.stringify(methods.getValues())
  }, [methods])

  const clearDraft = useCallback((): void => {
    if (productHandle) {
      deleteDraft(userId, productHandle)
    }
  }, [userId, productHandle])

  const forceSave = useCallback((): void => {
    if (!isEnabled || !productHandle || isSubmitting) return

    const formData = methods.getValues()
    const currentDataString = JSON.stringify(formData)

    if (currentDataString !== lastSavedDataRef.current) {
      try {
        setSaveStatus('saving')
        setLastError(null)
        const savingStartTime = Date.now()
        
        saveDraft(userId, productHandle, formData, currentStep)
        lastSavedDataRef.current = currentDataString
        setHasSavedOnce(true)

        scheduleSaveStatusUpdate(savingStartTime, setSaveStatus)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setLastError(errorMessage)
        setSaveStatus('error')
        throw new Error(`Failed to save draft: ${errorMessage}`)
      }
    }
  }, [methods, userId, productHandle, currentStep, isEnabled, isSubmitting])

  useEffect(() => {
    if (!isEnabled) {
      return
    }

    const subscription: { unsubscribe: () => void } = methods.watch((data) => {
      if (isSubmitting) {
        return
      }

      const dataStringImmediate = JSON.stringify(data)
      if (!hasUserEditedRef.current) {
        if (dataStringImmediate !== lastSavedDataRef.current) {
          hasUserEditedRef.current = true
          lastSavedDataRef.current = dataStringImmediate
        }
        return
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = window.setTimeout(() => {
        try {
          const latestData = methods.getValues()
          const dataString = JSON.stringify(latestData)
          if (dataString !== lastSavedDataRef.current) {
            if (!productHandle) {
              throw new Error('Cannot save draft: productHandle is null. Ensure product selection is complete before auto-save.')
            }
            setSaveStatus('saving')
            setLastError(null)
            const savingStartTime = Date.now()
            saveDraft(userId, productHandle, latestData, currentStep)
            lastSavedDataRef.current = dataString
            setHasSavedOnce(true)

            scheduleSaveStatusUpdate(savingStartTime, setSaveStatus)
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          setLastError(errorMessage)
          setSaveStatus('error')
          throw new Error(`Failed to save draft: ${errorMessage}`)
        }
      }, 1000)
    })

    return () => {
      subscription.unsubscribe()
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [methods, userId, productHandle, currentStep, isEnabled, isSubmitting])

  return {
    clearDraft,
    forceSave,
    saveStatus,
    lastError,
    hasSavedOnce,
  }
}
