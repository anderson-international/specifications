'use client'

import { useCallback } from 'react'
import type { EnumHookResult } from './types'
import type { SpecificationEnumData, EnumValue } from '@/types/enum'
import { createEnumHook } from './useEnumUtils'

export const useExperienceLevels = (): EnumHookResult => {
  const selector = useCallback(
    (data: SpecificationEnumData): EnumValue[] => data.experienceLevels,
    []
  )
  return createEnumHook(selector)
}

export const useGrinds = (): EnumHookResult => {
  const selector = useCallback(
    (data: SpecificationEnumData): EnumValue[] => data.grinds,
    []
  )
  return createEnumHook(selector)
}

export const useNicotineLevels = (): EnumHookResult => {
  const selector = useCallback(
    (data: SpecificationEnumData): EnumValue[] => data.nicotineLevels,
    []
  )
  return createEnumHook(selector)
}

export const useMoistureLevels = (): EnumHookResult => {
  const selector = useCallback(
    (data: SpecificationEnumData): EnumValue[] => data.moistureLevels,
    []
  )
  return createEnumHook(selector)
}
