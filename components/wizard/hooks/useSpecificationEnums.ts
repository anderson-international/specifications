'use client'

import { useState, useEffect, useCallback } from 'react'

import type { SpecificationEnumData } from '@/types/enum'

interface EnumDataState {
  data: SpecificationEnumData | undefined
  isLoading: boolean
  error: Error | null
}

/**
 * Core hook to fetch all enum data required for the specification wizard
 * Implements caching strategy using standard React hooks
 */
export const useSpecificationEnums = (): EnumDataState => {
  const [state, setState] = useState<EnumDataState>({
    data: undefined,
    isLoading: false,
    error: null,
  })

  const fetchEnumData = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/enums')

      if (!response.ok) {
        throw new Error(`Failed to fetch enum data: ${response.status} ${response.statusText}`)
      }

      const responseData = await response.json()
      setState({ data: responseData.data, isLoading: false, error: null })
    } catch (error) {
      setState({ data: undefined, isLoading: false, error: error as Error })
    }
  }, [])

  useEffect(() => {
    fetchEnumData()
  }, [fetchEnumData])

  return state
}
