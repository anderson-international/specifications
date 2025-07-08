'use client'

import { useCallback } from 'react'
import type { EnumHookResult } from './types'
import type { SpecificationEnumData } from '@/types/enum'
import { createEnumHook } from './useEnumUtils'

/**
 * Hook for tasting notes enum data
 */
export const useTastingNotes = (): EnumHookResult => {
  const selector = useCallback((data: SpecificationEnumData) => data.tastingNotes, [])
  return createEnumHook(selector)
}

/**
 * Hook for cures enum data
 */
export const useCures = (): EnumHookResult => {
  const selector = useCallback((data: SpecificationEnumData) => data.cures, [])
  return createEnumHook(selector)
}

/**
 * Hook for tobacco types enum data
 */
export const useTobaccoTypes = (): EnumHookResult => {
  const selector = useCallback((data: SpecificationEnumData) => data.tobaccoTypes, [])
  return createEnumHook(selector)
}
