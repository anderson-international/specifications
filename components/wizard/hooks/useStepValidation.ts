'use client'

import { useMemo } from 'react'
import { UseFormReturn, Path } from 'react-hook-form'
import { WizardFormData } from '../types/wizard.types'

interface UseStepValidationProps {
  currentStepId: string
  methods: UseFormReturn<WizardFormData>
}

/**
 * Custom hook for step validation logic
 * Returns whether the current step is valid for Next button state
 */
export const useStepValidation = ({ currentStepId, methods }: UseStepValidationProps): boolean => {
  const validationFields: Record<string, Path<WizardFormData>[]> = {
    product: ['shopify_handle'],
    characteristics: ['grind_id', 'experience_level_id', 'nicotine_level_id', 'moisture_level_id'],
    tasting: ['tasting_notes', 'cures', 'tobacco_types'],
    review: ['review', 'star_rating'],
  }

  const fieldsToWatch = validationFields[currentStepId] || []
  const values = methods.watch(fieldsToWatch as Path<WizardFormData>[])

  return useMemo((): boolean => {
    // Use the watched values directly for validation.
    switch (currentStepId) {
      case 'product':
        return Boolean(values[0]) // shopify_handle
      case 'characteristics':
        return Boolean(
          values[0] && // grind_id
            values[1] && // experience_level_id
            values[2] && // nicotine_level_id
            values[3] // moisture_level_id
        )
      case 'tasting':
        return Boolean(
          (values[0] as number[])?.length > 0 && // tasting_notes
            (values[1] as number[])?.length > 0 && // cures
            (values[2] as number[])?.length > 0 // tobacco_types
        )
      case 'review':
        return Boolean(
          (values[0] as string) && (values[0] as string).length >= 150 && (values[1] as number) > 0 // review, star_rating
        )
      default:
        return true
    }
  }, [currentStepId, values])
}
