import { useCallback } from 'react'
import type { RouterLike, TabId } from './trialReviewTypes'

function getLastTab(): TabId | null {
  try {
    const v = sessionStorage.getItem('trials:lastTab') as TabId | null
    return v === 'done' || v === 'to-do' ? v : null
  } catch {
    return null
  }
}

export function useTrialBack(router: RouterLike, initialTab: TabId): () => void {
  return useCallback((): void => {
    const ref = document.referrer
    try {
      if (ref) {
        const u = new URL(ref)
        if (u.origin === window.location.origin && u.pathname.startsWith('/trials')) {
          router.back()
          return
        }
      }
    } catch { void 0 }
    const tab = getLastTab() ?? initialTab
    try {
      router.push(`/trials?tab=${tab}`)
    } catch {
      router.push('/trials')
    }
  }, [router, initialTab])
}
