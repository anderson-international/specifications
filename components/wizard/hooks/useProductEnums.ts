'use client'

import { useCallback } from 'react'
import type { EnumHookResult } from './types'
import type { SpecificationEnumData } from '@/types/enum'
import { createEnumHook } from './useEnumUtils'


/**
 * Hook for product brands enum data
 */
export const useProductBrands = (): EnumHookResult => {
  const selector = useCallback((data: SpecificationEnumData) => data.productBrands, [])
  return createEnumHook(selector)
}
