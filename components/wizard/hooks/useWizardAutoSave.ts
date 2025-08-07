import { useCallback, useEffect, useRef, useState } from 'react'
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

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

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

  useEffect(() => {
    lastSavedDataRef.current = JSON.stringify(methods.getValues())
  }, [methods])

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
      try {
        setSaveStatus('saving')
        setLastError(null)
        const savingStartTime = Date.now()
        
        saveDraft(userId, productHandle, formData, currentStep)
        lastSavedDataRef.current = currentDataString
        setHasSavedOnce(true)

        const elapsedTime = Date.now() - savingStartTime
        const remainingTime = Math.max(0, 1000 - elapsedTime)
        
        setTimeout(() => {
          setSaveStatus('saved')

          setTimeout(() => {
            setSaveStatus('idle')
          }, 2000)
        }, remainingTime)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setLastError(errorMessage)
        setSaveStatus('error')
        throw new Error(`Failed to save draft: ${errorMessage}`)
      }
    }
  }, [methods, userId, productHandle, currentStep, isEnabled, isSubmitting])

  useEffect(() => {
    if (!isEnabled || currentStep < 2) {
      return
    }

    const subscription = methods.watch((data) => {
      if (isSubmitting) {
        return
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = window.setTimeout(() => {
        try {
          setSaveStatus('saving')
          setLastError(null)
          const savingStartTime = Date.now()
          
          const dataString = JSON.stringify(data)
          if (dataString !== lastSavedDataRef.current) {
            if (!productHandle) {
              throw new Error('Cannot save draft: productHandle is null. Ensure product selection is complete before auto-save.')
            }
            saveDraft(userId, productHandle, data, currentStep)
            lastSavedDataRef.current = dataString
            setHasSavedOnce(true)

            const elapsedTime = Date.now() - savingStartTime
            const remainingTime = Math.max(0, 1000 - elapsedTime)
            
            setTimeout(() => {
              setSaveStatus('saved')

              setTimeout(() => {
                setSaveStatus('idle')
              }, 2000)
            }, remainingTime)
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
