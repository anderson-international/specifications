'use client'

import { useState, useEffect, useCallback } from 'react'
import { Specification } from '@/types/specification'

interface UseAISpecificationsReturn {
  specifications: Specification[]
  isLoading: boolean
  error: string | null
  handleEdit: (id: string) => void
  handleRetry: () => void
}

export function useAISpecifications(): UseAISpecificationsReturn {
  const [specifications, setSpecifications] = useState<Specification[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect((): void => {
    const loadSpecifications = async (): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/specifications/ai')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch AI specifications: ${response.status}`)
        }
        
        const data = await response.json()
        setSpecifications(data.data?.specifications || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load AI specifications')
      } finally {
        setIsLoading(false)
      }
    }

    loadSpecifications()
  }, [])

  const handleRetry = useCallback((): void => {
    setSpecifications([])
    setError(null)
    setIsLoading(true)

    setTimeout(() => {
      setSpecifications([])
      setIsLoading(false)
    }, 500)
  }, [])

  const handleEdit = useCallback((id: string): void => {
    window.location.href = `/edit-specification/${id}`
  }, [])

  return {
    specifications,
    isLoading,
    error,
    handleEdit,
    handleRetry,
  }
}
