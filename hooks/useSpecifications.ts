'use client'

import { Specification } from '@/types/specification'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'

interface UseSpecificationsReturn {
  specifications: Specification[]
  isLoading: boolean
  error: string | null
  handleEdit: (id: string) => void
  handleRetry: () => void
}

export function useSpecifications(): UseSpecificationsReturn {
  const { user } = useAuth()
  const [specifications, setSpecifications] = useState<Specification[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Load specifications data
  useEffect((): void => {
    const loadSpecifications = async (): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)

        if (!user?.id) {
          throw new Error('User not authenticated')
        }
        
        const response = await fetch(`/api/specifications?userId=${user.id}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch specifications: ${response.status}`)
        }
        
        const data = await response.json()
        // Handle canonical API response format: { data: { specifications, pagination }, timestamp }
        const responseData = data.data || data // Support both formats during transition
        setSpecifications(responseData.specifications || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load specifications')
      } finally {
        setIsLoading(false)
      }
    }

    loadSpecifications()
  }, [user?.id])

  const handleRetry = useCallback((): void => {
    setSpecifications([])
    setError(null)
    setIsLoading(true)

    // Trigger re-load
    setTimeout(() => {
      setSpecifications([])
      setIsLoading(false)
    }, 500)
  }, [])

  const handleEdit = useCallback((id: string): void => {
    // Navigate to edit specification
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
