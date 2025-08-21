'use client'

import { useCallback } from 'react'
import { fromSameRouteReferrer } from '@/lib/utils/navReferrer'

export type SpecTabId = 'to-do' | 'my-specs'

export interface RouterLike {
  back: () => void
  push: (href: string) => void
  replace: (href: string) => void
}

function getLastTab(): SpecTabId | null {
  try {
    const v = sessionStorage.getItem('specs:lastTab') as SpecTabId | null
    return v === 'my-specs' || v === 'to-do' ? v : null
  } catch {
    return null
  }
}

export function useSpecBack(router: RouterLike, initialTab: SpecTabId): () => void {
  return useCallback((): void => {
    const shouldGoBack = fromSameRouteReferrer('/specifications')
    if (shouldGoBack) {
      router.back()
      return
    }
    const tab = getLastTab() ?? initialTab
    router.push(`/specifications?tab=${tab}`)
  }, [router, initialTab])
}
