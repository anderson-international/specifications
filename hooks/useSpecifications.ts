'use client'

import { useState, useEffect, useCallback } from 'react'
import { Specification } from '@/types/specification'

// Mock data - will be replaced with API call
const mockSpecifications: Specification[] = [
  {
    id: '1',
    userId: 'user-1',
    status: 'draft',
    progress: 75,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    lastModified: '2024-01-15T14:20:00Z',
    product: {
      id: 'prod-1',
      handle: 'peterson-early-morning-pipe',
      title: 'Peterson Early Morning Pipe',
      brand: 'Peterson',
      imageUrl: '/images/products/peterson-early-morning.jpg'
    },
    // Form data stored elsewhere in production
  },
  {
    id: '2',
    userId: 'user-1',
    status: 'pending_review',
    progress: 100,
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    lastModified: '2024-01-14T16:45:00Z',
    product: {
      id: 'prod-2',
      handle: 'dunhill-nightcap',
      title: 'Dunhill Nightcap',
      brand: 'Dunhill',
      imageUrl: '/images/products/dunhill-nightcap.jpg'
    },
    // Form data stored elsewhere in production
  },
  {
    id: '3',
    userId: 'user-1',
    status: 'approved',
    progress: 100,
    score: 4.2,
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-12T11:30:00Z',
    lastModified: '2024-01-12T11:30:00Z',
    reviewedAt: '2024-01-12T11:30:00Z',
    product: {
      id: 'prod-3',
      handle: 'mac-baren-hh-old-dark-fired',
      title: 'Mac Baren HH Old Dark Fired',
      brand: 'Mac Baren',
      imageUrl: '/images/products/mac-baren-hh-old-dark.jpg'
    },
    review: {
      reviewerId: 'reviewer-1',
      reviewerName: 'John Reviewer',
      comments: 'Excellent detailed review with accurate tasting notes.',
      reviewedAt: '2024-01-12T11:30:00Z'
    },
    // Form data stored elsewhere in production
  }
]

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
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setSpecifications(mockSpecifications)
      } catch (err) {
        setError('Failed to load specifications')
        console.error('Error loading specifications:', err)
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
      setSpecifications(mockSpecifications)
      setIsLoading(false)
    }, 500)
  }, [])

  const handleEdit = useCallback((id: string): void => {
    // Navigate to edit specification
    window.location.href = `/create-specification?draft=${id}`
  }, [])

  const handleDelete = useCallback((id: string): void => {
    setSpecifications(prev => prev.filter(spec => spec.id !== id))
  }, [])

  const handleDuplicate = useCallback((id: string): void => {
    const specToDuplicate = specifications.find(spec => spec.id === id)
    if (specToDuplicate) {
      const newId = Date.now().toString()
      // Create a new specification with review removed
      const { review, ...specWithoutReview } = specToDuplicate
      
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
          title: `${specToDuplicate.product.title} (Copy)`
        },
        // Reset review status to undefined
        review: undefined
      }
      setSpecifications(prev => [newSpec, ...prev])
    }
  }, [specifications])

  return {
    specifications,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleDuplicate,
    handleRetry
  }
}
