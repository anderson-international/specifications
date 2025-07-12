'use client'

import { useCallback } from 'react'
import type { EnumHookResult } from './types'
import type { SpecificationEnumData } from '@/types/enum'
import { useCreateEnumHook } from './useEnumUtils'

/**
 * Hook for experience levels enum data
 */
export const useExperienceLevels = (): EnumHookResult => {
  const selector = useCallback((data: SpecificationEnumData) => data.experienceLevels, [])
  return useCreateEnumHook(selector)
}

/**
 * Hook for grinds enum data
 */
export const useGrinds = (): EnumHookResult => {
  const selector = useCallback((data: SpecificationEnumData) => data.grinds, [])
  return useCreateEnumHook(selector)
}

/**
 * Hook for nicotine levels enum data
 */
export const useNicotineLevels = (): EnumHookResult => {
  const selector = useCallback((data: SpecificationEnumData) => data.nicotineLevels, [])
  return useCreateEnumHook(selector)
}

/**
 * Hook for moisture levels enum data
 */
export const useMoistureLevels = (): EnumHookResult => {
  const selector = useCallback((data: SpecificationEnumData) => data.moistureLevels, [])
  return useCreateEnumHook(selector)
}
