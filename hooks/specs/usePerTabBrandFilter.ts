'use client'

import { useCallback, useState } from 'react'
import type { SpecTabId } from '@/hooks/useUserProducts'

export interface UsePerTabBrandFilterReturn {
  selectedBrand: string
  setSelectedBrand: (value: string) => void
  clearBrand: () => void
}

export function usePerTabBrandFilter(activeTab: SpecTabId): UsePerTabBrandFilterReturn {
  const [brandByTab, setBrandByTab] = useState<Record<SpecTabId, string>>({
    'to-do': '',
    'my-specs': '',
  })

  const selectedBrand: string = brandByTab[activeTab] ?? ''

  const setSelectedBrand = useCallback((value: string): void => {
    setBrandByTab(prev => ({
      ...prev,
      [activeTab]: value,
    }))
  }, [activeTab])

  const clearBrand = useCallback((): void => {
    setBrandByTab(prev => ({
      ...prev,
      [activeTab]: '',
    }))
  }, [activeTab])

  return { selectedBrand, setSelectedBrand, clearBrand }
}
