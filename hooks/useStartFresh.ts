import { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { deleteTrialDraft, type TrialDraft } from '@/lib/utils/trial-draft-storage'
import type { SelectedItemLite, TrialFormData } from './trialReviewTypes'

function resetToProductDefaults(
  methods: UseFormReturn<TrialFormData>,
  item: SelectedItemLite | null,
  userId: string,
): void {
  methods.reset(
    {
      product_name: item?.name ?? '',
      brand_id: item?.brand.id ?? 0,
      rating: 0,
      review: '',
      should_sell: false,
      tasting_note_ids: [],
      user_id: userId,
    },
    { keepDefaultValues: false },
  )
}

export function useStartFresh(
  methods: UseFormReturn<TrialFormData>,
  params: {
    draftKey: string | null
    selectedItem: SelectedItemLite | null
    userId: string
    setRestoreDraft: (d: TrialDraft | null) => void
    setShowRestore: (v: boolean) => void
    setDraftApplied: (v: boolean) => void
  },
): () => Promise<void> {
  const { draftKey, selectedItem, userId, setRestoreDraft, setShowRestore, setDraftApplied } = params
  return useCallback(async (): Promise<void> => {
    try { if (draftKey) deleteTrialDraft(draftKey) } catch { void 0 }
    setRestoreDraft(null)
    setShowRestore(false)
    setDraftApplied(false)

    if (selectedItem?.userReviewId) {
      try {
        const res = await fetch(`/api/trials/${encodeURIComponent(String(selectedItem.userReviewId))}?userId=${encodeURIComponent(userId)}`)
        if (res.ok) {
          const json = await res.json()
          const t = json?.data?.trial ?? json?.trial
          if (t) {
            methods.setValue('product_name', selectedItem.name, { shouldDirty: false })
            methods.setValue('brand_id', selectedItem.brand.id, { shouldDirty: false })
            methods.setValue('rating', Number(t.rating ?? 0), { shouldDirty: false })
            methods.setValue('review', String(t.review ?? ''), { shouldDirty: false })
            methods.setValue('should_sell', Boolean(t.should_sell), { shouldDirty: false })
            const arr = Array.isArray(t.tasting_note_ids) ? t.tasting_note_ids : []
            methods.setValue('tasting_note_ids', arr.map((x: number | string) => Number(x)), { shouldDirty: false })
            methods.setValue('user_id', userId, { shouldDirty: false })
            return
          }
        }
      } catch { void 0 }
      resetToProductDefaults(methods, selectedItem, userId)
      return
    }

    resetToProductDefaults(methods, selectedItem, userId)
  }, [draftKey, methods, selectedItem, userId, setRestoreDraft, setShowRestore, setDraftApplied])
}
