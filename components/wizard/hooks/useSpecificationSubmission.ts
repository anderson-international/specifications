'use client'

import { useCallback, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WizardFormData } from '../types/WizardFormData'
import { TransformedSpecificationData } from '../types/DatabaseTypes'
import { validateRequiredFields } from '../utils/specificationValidation'

interface UseSpecificationSubmissionProps {
  onSubmit: (data: WizardFormData) => void
  methods: UseFormReturn<WizardFormData>
  userId: string
}

interface UseSpecificationSubmissionReturn {
  isSubmitting: boolean
  handleFormSubmit: () => Promise<void>
}

const useSpecificationSubmission = ({
  onSubmit,
  methods,
  userId,
}: UseSpecificationSubmissionProps): UseSpecificationSubmissionReturn => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const transformFormData = useCallback(
    (formData: WizardFormData): TransformedSpecificationData => {
      const { tasting_notes, cures, tobacco_types, ...coreData } = formData

      return {
        specification: {
          shopify_handle: coreData.shopify_handle,
          product_type_id: coreData.product_type_id,
          is_fermented: coreData.is_fermented || false,
          is_oral_tobacco: coreData.is_oral_tobacco || false,
          is_artisan: coreData.is_artisan || false,
          grind_id: coreData.grind_id,
          nicotine_level_id: coreData.nicotine_level_id,
          experience_level_id: coreData.experience_level_id,
          review: coreData.review || '',
          star_rating: coreData.star_rating,
          rating_boost: coreData.rating_boost || 0,
          user_id: userId,
          moisture_level_id: coreData.moisture_level_id,
          product_brand_id: coreData.product_brand_id,
          status_id: 1, // Default to 'published'
        },
        junctionData: {
          tasting_note_ids: tasting_notes || [],
          cure_ids: cures || [],
          tobacco_type_ids: tobacco_types || [],
        },
      }
    },
    [userId]
  )

  const handleFormSubmit = useCallback(async (): Promise<void> => {
    setIsSubmitting(true)

    try {
      const formData = methods.getValues()
      const { specification, junctionData } = transformFormData(formData)

      // Validate transformed data
      validateRequiredFields(specification, junctionData)

      // Submit to database via API
      const response = await fetch('/api/specifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ specification, junctionData }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      // Call success callback
      await onSubmit(formData)
    } catch (error) {
      throw new Error(`Failed to submit specification: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [methods, transformFormData, onSubmit])

  return {
    isSubmitting,
    handleFormSubmit,
  }
}

export default useSpecificationSubmission
