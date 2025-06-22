'use client'

import { useMemo } from 'react'
import { FieldErrors } from 'react-hook-form'
import { ValidationError } from '../controls/ValidationSummary'

interface TastingProfileFormData {
  tasting_notes: number[]
  cures: number[]
  tobacco_types: number[]
}

interface UseTastingProfileValidationProps {
  tastingNotes: number[]
  cures: number[]
  tobaccoTypes: number[]
  errors: FieldErrors<TastingProfileFormData>
}

interface UseTastingProfileValidationReturn {
  validationErrors: ValidationError[]
  isValid: boolean
}

/**
 * Custom hook for TastingProfile validation logic
 * Provides specific error messages for tasting profile fields
 */
export const useTastingProfileValidation = ({
  tastingNotes,
  cures,
  tobaccoTypes,
  errors
}: UseTastingProfileValidationProps): UseTastingProfileValidationReturn => {
  
  // Validation errors with specific messages
  const validationErrors = useMemo((): ValidationError[] => {
    const errorList: ValidationError[] = []
    
    if (errors.tasting_notes) {
      errorList.push({
        fieldName: 'tasting_notes',
        message: errors.tasting_notes.message || 'Please select at least one tasting note'
      })
    }
    
    if (errors.cures) {
      errorList.push({
        fieldName: 'cures',
        message: errors.cures.message || 'Please select at least one cure type'
      })
    }
    
    if (errors.tobacco_types) {
      errorList.push({
        fieldName: 'tobacco_types',
        message: errors.tobacco_types.message || 'Please select at least one tobacco type'
      })
    }
    
    return errorList
  }, [errors.tasting_notes, errors.cures, errors.tobacco_types])
  
  // Check if step is valid
  const isValid = useMemo((): boolean => {
    return Boolean(
      tastingNotes.length > 0 && 
      cures.length > 0 && 
      tobaccoTypes.length > 0 &&
      !errors.tasting_notes && 
      !errors.cures && 
      !errors.tobacco_types
    )
  }, [tastingNotes.length, cures.length, tobaccoTypes.length, errors.tasting_notes, errors.cures, errors.tobacco_types])

  return {
    validationErrors,
    isValid
  }
}
