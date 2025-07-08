'use client'

import { useCallback } from 'react'
import type { EnumHookResult } from './types'
import type { SpecificationEnumData } from '@/types/enum'
import { createEnumHook } from './useEnumUtils'

/**
 * Hook for specification statuses enum data
 */
export const useSpecificationStatuses = (): EnumHookResult => {
  const selector = useCallback((data: SpecificationEnumData) => data.specificationStatuses, [])
  return createEnumHook(selector)
}
