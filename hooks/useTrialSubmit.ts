import { useCallback } from 'react'
import { type RouterLike, type SelectedItemLite, type TrialFormData, TRIAL_MIN_REVIEW_CHARS } from './trialReviewTypes'

export function useTrialSubmit(
  params: {
    userId: string
    selectedItem: SelectedItemLite | null
    clearDraft: () => void
    router: RouterLike
  },
): (data: TrialFormData) => Promise<void> {
  const { userId, selectedItem, clearDraft, router } = params
  return useCallback(async (data: TrialFormData): Promise<void> => {
    const rating = Number(data.rating)
    if (!Array.isArray(data.tasting_note_ids) || data.tasting_note_ids.length < 1) {
      throw new Error('Please select at least one tasting note')
    }
    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }
    const trimmed = typeof data.review === 'string' ? data.review.trim() : ''
    if (trimmed.length < TRIAL_MIN_REVIEW_CHARS) {
      throw new Error(`Review must be at least ${TRIAL_MIN_REVIEW_CHARS} characters`)
    }
    const review: string = trimmed

    if (selectedItem?.userReviewId) {
      const res = await fetch(
        `/api/trials/${encodeURIComponent(String(selectedItem.userReviewId))}?userId=${encodeURIComponent(userId)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating, review, should_sell: Boolean(data.should_sell), tasting_note_ids: data.tasting_note_ids }),
        },
      )
      if (!res.ok) throw new Error(`Update failed (${res.status})`)
    } else {
      const body = {
        trial: {
          product_name: data.product_name,
          brand_id: Number(data.brand_id),
          rating,
          review,
          should_sell: Boolean(data.should_sell),
          user_id: userId,
        },
        junctionData: { tasting_note_ids: data.tasting_note_ids },
      }
      const res = await fetch('/api/trials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(`Create failed (${res.status})`)
    }

    clearDraft()
    router.replace('/trials?tab=done')
  }, [userId, selectedItem, clearDraft, router])
}
