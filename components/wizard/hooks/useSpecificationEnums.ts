'use client'

import { useState, useEffect } from 'react'
import type { SpecificationEnumData } from '@/types/enum'

interface EnumDataState {
  data: SpecificationEnumData | undefined
  isLoading: boolean
  error: Error | null
}

/**
 * Core hook to fetch all enum data required for the specification wizard
 * Fixed version that properly handles API response data
 */
export const useSpecificationEnums = (): EnumDataState => {
  const [data, setData] = useState<SpecificationEnumData | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/enums')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        setData(result.data)
      } catch (error) {
        setError(error as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnums()
  }, [])

  return { data, isLoading, error }
}
