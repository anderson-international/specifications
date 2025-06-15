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
    // Form data (partial for draft)
    productId: 'prod-1',
    productHandle: 'peterson-early-morning-pipe',
    productTitle: 'Peterson Early Morning Pipe',
    productType: 'nasal_snuff',
    experienceLevel: 'intermediate',
    tobaccoTypes: ['virginia', 'burley'],
    cures: ['air_cured'],
    grind: 'medium',
    isScented: false,
    isMenthol: false,
    isToasted: true,
    tastingNotes: ['woody', 'earthy'],
    nicotineStrength: 6,
    moistureLevel: 4,
    reviewText: '',
    overallRating: 1,
    ratingBoost: 0
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
    // Complete form data
    productId: 'prod-2',
    productHandle: 'dunhill-nightcap',
    productTitle: 'Dunhill Nightcap',
    productType: 'nasal_snuff',
    experienceLevel: 'advanced',
    tobaccoTypes: ['latakia', 'oriental'],
    cures: ['fire_cured'],
    grind: 'fine',
    isScented: false,
    isMenthol: false,
    isToasted: false,
    tastingNotes: ['smoky', 'spicy', 'leather'],
    nicotineStrength: 8,
    moistureLevel: 5,
    reviewText: 'A complex and robust blend with deep smoky flavors and a long finish.',
    overallRating: 4,
    ratingBoost: 1
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
    // Complete form data
    productId: 'prod-3',
    productHandle: 'mac-baren-hh-old-dark-fired',
    productTitle: 'Mac Baren HH Old Dark Fired',
    productType: 'nasal_snuff',
    experienceLevel: 'advanced',
    tobaccoTypes: ['dark_fired'],
    cures: ['fire_cured'],
    grind: 'coarse',
    isScented: false,
    isMenthol: false,
    isToasted: true,
    tastingNotes: ['smoky', 'earthy', 'robust'],
    nicotineStrength: 7,
    moistureLevel: 6,
    reviewText: 'A bold and intense blend with distinctive fire-cured characteristics and rich complexity.',
    overallRating: 5,
    ratingBoost: 0
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
      const newSpec: Specification = {
        ...specToDuplicate,
        id: `${Date.now()}`,
        userId: specToDuplicate.userId,
        status: 'draft',
        progress: 0, // Reset progress for new draft
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        reviewedAt: undefined,
        publishedAt: undefined,
        score: undefined,
        review: undefined,
        product: {
          ...specToDuplicate.product,
          title: `${specToDuplicate.product.title} (Copy)`
        },
        productTitle: `${specToDuplicate.productTitle} (Copy)`,
        // Reset form completion status
        reviewText: '',
        overallRating: 1,
        ratingBoost: 0
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
