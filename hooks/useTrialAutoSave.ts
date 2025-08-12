import { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { saveTrialDraft, deleteTrialDraft } from '@/lib/utils/trial-draft-storage'
import { useAutosaveEngine } from '@/hooks/useAutosaveEngine'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseTrialAutoSaveProps<T extends object> { methods: UseFormReturn<T>; userId: string; draftKey: string | null; currentStep: number; isEnabled: boolean; isSubmitting: boolean }
interface UseTrialAutoSaveReturn { clearDraft: () => void; forceSave: () => void; saveStatus: SaveStatus; lastError: string | null; hasSavedOnce: boolean }

export function useTrialAutoSave<T extends object>({ methods, userId, draftKey, currentStep, isEnabled, isSubmitting }: UseTrialAutoSaveProps<T>): UseTrialAutoSaveReturn {
  const { saveStatus, lastError, hasSavedOnce, forceSave } = useAutosaveEngine<Record<string, unknown>>({
    methods: methods as unknown as UseFormReturn<Record<string, unknown>>,
    isEnabled,
    canSave: () => !isSubmitting,
    saveFn: (data) => {
      if (!draftKey) throw new Error('Cannot save draft: draftKey is null')
      saveTrialDraft(draftKey, userId, data, currentStep)
    },
  })

  const clearDraft = useCallback((): void => { if (draftKey) deleteTrialDraft(draftKey) }, [draftKey])

  return { clearDraft, forceSave, saveStatus, lastError, hasSavedOnce }
}
