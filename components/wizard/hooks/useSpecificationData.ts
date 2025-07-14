'use client'

import { useState, useEffect } from 'react'
import { SpecificationFormData } from '@/types/specification'
import { useAuth } from '@/lib/auth-context'

interface SpecificationDataState {
  data: SpecificationFormData | undefined
  isLoading: boolean
  error: Error | null
}

export const useSpecificationData = (specificationId: string): SpecificationDataState => {
  const [data, setData] = useState<SpecificationFormData | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const loadSpecification = async (): Promise<void> => {
      if (!specificationId || !user?.id) {
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/specifications/${specificationId}?userId=${user.id}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch specification: ${response.status}`)
        }
        
        const result = await response.json()
        const specification = result.specification

        // Transform to SpecificationFormData with ID for edit mode detection
        const formData: SpecificationFormData = {
          id: String(specification.id), // Convert to string for type compatibility
          shopify_handle: specification.shopify_handle,
          product_brand_id: specification.product_brand_id,
          product_type_id: specification.product_type_id,
          experience_level_id: specification.experience_level_id,
          tobacco_type_ids: specification.tobacco_type_ids,
          cure_type_ids: specification.cure_type_ids,
          grind_id: specification.grind_id,
          is_fermented: specification.is_fermented,
          is_oral_tobacco: specification.is_oral_tobacco,
          is_artisan: specification.is_artisan,
          tasting_note_ids: specification.tasting_note_ids,
          nicotine_level_id: specification.nicotine_level_id,
          moisture_level_id: specification.moisture_level_id,
          review: specification.review,
          star_rating: specification.star_rating,
          rating_boost: specification.rating_boost,
          status_id: specification.status_id,
          user_id: specification.user_id,
        }

        setData(formData)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load specification'))
      } finally {
        setIsLoading(false)
      }
    }

    loadSpecification()
  }, [specificationId, user?.id])

  return { data, isLoading, error }
}
