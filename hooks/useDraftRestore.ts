import { useLayoutEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { loadTrialDraft, type TrialDraft } from '@/lib/utils/trial-draft-storage'
import type { TrialFormData } from './trialReviewTypes'

export function useDraftRestore(
  methods: UseFormReturn<TrialFormData>,
  draftKey: string | null,
  setRestoreDraft: (d: TrialDraft | null) => void,
  setShowRestore: (v: boolean) => void,
  setDraftApplied: (v: boolean) => void,
): void {
  useLayoutEffect(() => {
    if (!draftKey) return
    const d = loadTrialDraft(draftKey)
    if (d) {
      setRestoreDraft(d)
      setShowRestore(true)
      methods.reset(d.formData as Partial<TrialFormData>, { keepDefaultValues: false })
      setDraftApplied(true)
    }
  }, [methods, draftKey, setRestoreDraft, setShowRestore, setDraftApplied])
}
