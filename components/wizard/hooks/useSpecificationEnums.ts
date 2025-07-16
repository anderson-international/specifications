'use client'

import { useState, useEffect, useMemo } from 'react'
import type { SpecificationEnumData } from '@/types/enum'

interface EnumDataState {
  data: SpecificationEnumData | undefined
  isLoading: boolean
  error: Error | null
}

export const useSpecificationEnums = (): EnumDataState => {
  const [data, setData] = useState<SpecificationEnumData | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchEnums = async (): Promise<void> => {
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

  return useMemo(() => ({ data, isLoading, error }), [data, isLoading, error])
}
