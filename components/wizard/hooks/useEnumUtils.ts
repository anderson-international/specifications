'use client'

import { useMemo } from 'react'
import type { EnumValue, SpecificationEnumData } from '@/types/enum'
import type { EnumOption, EnumHookResult } from './types'
import { useSpecificationEnums } from './useSpecificationEnums'

export const findEnumByName = (
  enumValues: EnumValue[] | undefined,
  name: string
): number | null => {
  if (!enumValues || !Array.isArray(enumValues) || !name) {
    return null
  }

  const match: EnumValue | undefined = enumValues.find(
    (item): boolean => item?.name?.toLowerCase() === name.toLowerCase()
  )
  return match ? match.id : null
}

export const transformEnumToOptions = (
  enumValues: EnumValue[] | undefined,
  filterNone: boolean = true
): EnumOption[] => {
  if (!enumValues || !Array.isArray(enumValues)) {
    return []
  }

  let filteredValues = enumValues

  if (filterNone) {
    filteredValues = enumValues.filter((item): boolean => item.name.toLowerCase() !== 'none')
  }

  // Sort by sort_order if available, otherwise by name alphabetically
  filteredValues.sort((a, b): number => {
    // If both have sort_order, sort by sort_order ascending
    if (a.sort_order !== undefined && b.sort_order !== undefined) {
      return a.sort_order - b.sort_order
    }
    
    // If only one has sort_order, prioritize it (put it first)
    if (a.sort_order !== undefined && b.sort_order === undefined) {
      return -1
    }
    if (a.sort_order === undefined && b.sort_order !== undefined) {
      return 1
    }
    
    // If neither has sort_order, sort alphabetically by name
    return a.name.localeCompare(b.name)
  })

  return filteredValues.map((item): EnumOption => ({
    id: item.id,
    value: item.id,
    label: item.name,
  }))
}

export const useCreateEnumHook = (
  selector: (data: SpecificationEnumData) => EnumValue[]
): EnumHookResult => {
  const { data: allEnums, isLoading, error } = useSpecificationEnums()

  const transformedData = useMemo(
    (): EnumOption[] | undefined => (allEnums ? transformEnumToOptions(selector(allEnums)) : undefined),
    [allEnums, selector]
  )

  return useMemo(
    (): EnumHookResult => ({
      data: transformedData,
      isLoading,
      error,
    }),
    [transformedData, isLoading, error]
  )
}

export const createEnumHook = useCreateEnumHook
