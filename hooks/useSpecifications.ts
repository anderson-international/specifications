'use client'

import { Specification } from '@/types/specification'
import { useCallback, useEffect, useState } from 'react'

interface UseSpecificationsReturn {
  specifications: Specification[]
  isLoading: boolean
  error: string | null
  handleEdit: (id: string) => void
  handleDelete: (id: string) => void
  handleDuplicate: (id: string) => void
  handleRetry: () => void
}

export function useSpecifications(): UseSpecificationsReturn {
  const [specifications, setSpecifications] = useState<Specification[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Load specifications data
  useEffect((): void => {
    const loadSpecifications = async (): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        setSpecifications([])
      } catch (_err) {
        setError('Failed to load specifications')
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

    // Trigger re-load
    setTimeout(() => {
      setSpecifications([])
      setIsLoading(false)
    }, 500)
  }, [])

  const handleEdit = useCallback((id: string): void => {
    // Navigate to edit specification
    window.location.href = `/create-specification?draft=${id}`
  }, [])

  const handleDelete = useCallback((id: string): void => {
    setSpecifications((prev) => prev.filter((spec) => spec.id !== id))
  }, [])

  const handleDuplicate = useCallback(
    (id: string): void => {
      const specToDuplicate = specifications.find((spec) => spec.id === id)
      if (specToDuplicate) {
        const newId = Date.now().toString()
        // Create a new specification with review removed
        const { review: _review, ...specWithoutReview } = specToDuplicate

        const newSpec: Specification = {
          ...specWithoutReview,
          id: newId,
          status: 'draft',
          progress: 0, // Reset progress for new draft
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          product: {
            ...specToDuplicate.product,
            title: `${specToDuplicate.product.title} (Copy)`,
          },
          // Reset review status to undefined
          review: undefined,
        }
        setSpecifications((prev) => [newSpec, ...prev])
      }
    },
    [specifications]
  )

  return {
    specifications,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleDuplicate,
    handleRetry,
  }
}
