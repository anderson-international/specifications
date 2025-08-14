import { useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { TrialFormData, SelectedItemLite } from './trialReviewTypes'

export function useExistingReviewHydration(
  methods: UseFormReturn<TrialFormData>,
  userId: string,
  selectedItem: SelectedItemLite | null,
  draftApplied: boolean,
): void {
  useEffect(() => {
    (async () => {
      if (!selectedItem?.userReviewId) return
      if (draftApplied) return
      const res = await fetch(`/api/trials/${encodeURIComponent(String(selectedItem.userReviewId))}?userId=${encodeURIComponent(userId)}`)
      if (!res.ok) return
      const json = await res.json()
      const t = json?.data?.trial ?? json?.trial
      if (t) {
        methods.setValue('rating', t.rating ?? 0, { shouldDirty: false })
        methods.setValue('review', t.review ?? '', { shouldDirty: false })
        methods.setValue('should_sell', Boolean(t.should_sell), { shouldDirty: false })
        methods.setValue('tasting_note_ids', Array.isArray(t.tasting_note_ids) ? t.tasting_note_ids : [], { shouldDirty: false })
      }
    })()
  }, [methods, userId, selectedItem?.userReviewId, draftApplied])
}
