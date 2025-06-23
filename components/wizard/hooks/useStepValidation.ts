'use client'

import { useMemo } from 'react'
import { UseFormReturn, FieldValues } from 'react-hook-form'

interface UseStepValidationProps<T extends FieldValues = FieldValues> {
  currentStepId: string
  methods: UseFormReturn<T>
}

/**
 * Custom hook for step validation logic
 * Returns whether the current step is valid for Next button state
 */
export const useStepValidation = <T extends FieldValues = FieldValues>({ 
  currentStepId, 
  methods 
}: UseStepValidationProps<T>): boolean => {
  return useMemo((): boolean => {
    const values = methods.getValues()
    
    switch (currentStepId) {
      case 'product':
        return Boolean(values.shopify_handle)
      case 'characteristics':
        return Boolean(
          values.grind_id && values.grind_id > 0 &&
          values.experience_level_id && values.experience_level_id > 0 &&
          values.nicotine_level_id && values.nicotine_level_id > 0 &&
          values.moisture_level_id && values.moisture_level_id > 0
        )
      case 'tasting':
        return Boolean(
          values.tasting_notes && values.tasting_notes.length > 0 &&
          values.cures && values.cures.length > 0 &&
          values.tobacco_types && values.tobacco_types.length > 0
        )
      case 'review':
        return Boolean(values.review && values.review.length >= 10 && values.star_rating > 0)
      default:
        return true
    }
  }, [currentStepId, methods])
}
