'use client'

import { useMemo } from 'react'
import type { EnumValue, SpecificationEnumData } from '@/types/enum'
import type { EnumOption, EnumHookResult } from './types'
import { useSpecificationEnums } from './useSpecificationEnums'

/**
 * Find enum ID by name (case-insensitive)
 * Returns null if not found
 */
export const findEnumByName = (
  enumValues: EnumValue[] | undefined,
  name: string
): number | null => {
  if (!enumValues || !Array.isArray(enumValues) || !name) {
    return null
  }

  const match = enumValues.find(
    (item) => item?.name?.toLowerCase() === name.toLowerCase()
  )
  return match ? match.id : null
}

/**
 * Transform enum values to option format for form controls
 * Filters out "None" values for required fields
 */
export const transformEnumToOptions = (
  enumValues: EnumValue[] | undefined,
  filterNone: boolean = true
): EnumOption[] => {
  if (!enumValues || !Array.isArray(enumValues)) {
    return []
  }

  let filteredValues = enumValues

  // Filter out "None" values for required fields
  if (filterNone) {
    filteredValues = enumValues.filter((item) => item.name.toLowerCase() !== 'none')
  }

  // Sort by ID ascending to ensure proper dropdown ordering
  filteredValues.sort((a, b) => a.id - b.id)

  return filteredValues.map((item) => ({
    id: item.id,
    value: item.id,
    label: item.name,
  }))
}

/**
 * Helper hook to create memoized enum hook with proper return types
 */
export const useCreateEnumHook = (
  selector: (data: SpecificationEnumData) => EnumValue[]
): EnumHookResult => {
  const { data: allEnums, isLoading, error } = useSpecificationEnums()

  const transformedData = useMemo(
    () => (allEnums ? transformEnumToOptions(selector(allEnums)) : undefined),
    [allEnums, selector]
  )

  return useMemo(
    () => ({
      data: transformedData,
      isLoading,
      error,
    }),
    [transformedData, isLoading, error]
  )
}

// Export alias for backward compatibility
export const createEnumHook = useCreateEnumHook
