'use client'

import { Specification } from '@/types/specification'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'

interface UseSpecificationsListConfig {
  aiGenerated?: boolean
  userId?: string
  navigateTo: 'edit' | 'markdown'
}

interface UseSpecificationsListReturn {
  specifications: Specification[]
  isLoading: boolean
  error: string | null
  handleClick: (id: string) => void
  handleRetry: () => void
}

export function useSpecificationsList(config: UseSpecificationsListConfig): UseSpecificationsListReturn {
  const { user } = useAuth()
  const [specifications, setSpecifications] = useState<Specification[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect((): void => {
    const loadSpecifications = async (): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams()
        
        if (config.aiGenerated !== undefined) {
          params.append('aiGenerated', String(config.aiGenerated))
        }
        
        if (config.userId) {
          params.append('userId', config.userId)
        } else if (!config.aiGenerated && user?.id) {
          params.append('userId', user.id)
        }

        const queryString = params.toString()
        const url = `/api/specifications${queryString ? `?${queryString}` : ''}`
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch specifications: ${response.status}`)
        }
        
        const data = await response.json()
        const responseData = data.data || data // Support both formats during transition
        setSpecifications(responseData.specifications || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load specifications')
      } finally {
        setIsLoading(false)
      }
    }

    if (config.aiGenerated || user?.id || config.userId) {
      loadSpecifications()
    } else if (!config.aiGenerated) {
      setError('User not authenticated')
      setIsLoading(false)
    }
  }, [user?.id, config.aiGenerated, config.userId])

  const handleRetry = useCallback((): void => {
    setSpecifications([])
    setError(null)
    setIsLoading(true)

    setTimeout(() => {
      setSpecifications([])
      setIsLoading(false)
    }, 500)
  }, [])

  const handleClick = useCallback((id: string): void => {
    if (config.navigateTo === 'edit') {
      window.location.href = `/edit-specification/${id}`
    } else {
      window.location.href = `/ai-specifications/${id}/markdown`
    }
  }, [config.navigateTo])

  return {
    specifications,
    isLoading,
    error,
    handleClick,
    handleRetry,
  }
}
