'use client'

import { useCallback } from 'react'
import type { EnumHookResult } from './types'
import { createEnumHook } from './useEnumUtils'

/**
 * Hook for experience levels enum data
 */
export const useExperienceLevels = (): EnumHookResult => {
  const selector = useCallback((data: any) => data.experienceLevels, [])
  return createEnumHook(selector)
}

/**
 * Hook for grinds enum data
 */
export const useGrinds = (): EnumHookResult => {
  const selector = useCallback((data: any) => data.grinds, [])
  return createEnumHook(selector)
}

/**
 * Hook for nicotine levels enum data
 */
export const useNicotineLevels = (): EnumHookResult => {
  const selector = useCallback((data: any) => data.nicotineLevels, [])
  return createEnumHook(selector)
}

/**
 * Hook for moisture levels enum data
 */
export const useMoistureLevels = (): EnumHookResult => {
  const selector = useCallback((data: any) => data.moistureLevels, [])
  return createEnumHook(selector)
}
