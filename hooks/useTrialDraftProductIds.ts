import { useEffect, useState, useCallback } from 'react'
import { getAllTrialDrafts } from '@/lib/utils/trial-draft-storage'

export function useTrialDraftProductIds(userId: string): Set<number> {
  const [draftProducts, setDraftProducts] = useState<Set<number>>(new Set())

  const computeDrafts = useCallback((): void => {
    try {
      const drafts = getAllTrialDrafts(userId)
      const ids = new Set<number>()
      drafts.forEach((d) => {
        const m = d.key.match(/-product-(\d+)/)
        const id = m ? Number(m[1]) : NaN
        if (!Number.isNaN(id)) ids.add(id)
      })
      setDraftProducts(ids)
    } catch { void 0 }
  }, [userId])

  useEffect(() => {
    computeDrafts()
    const onSaved = (_e: Event): void => computeDrafts()
    const onDeleted = (_e: Event): void => computeDrafts()
    window.addEventListener('trial-draft-saved', onSaved)
    window.addEventListener('trial-draft-deleted', onDeleted)
    return () => {
      window.removeEventListener('trial-draft-saved', onSaved)
      window.removeEventListener('trial-draft-deleted', onDeleted)
    }
  }, [computeDrafts])

  return draftProducts
}
