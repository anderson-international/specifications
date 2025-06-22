'use client'

import { useMemo } from 'react'
import { FieldErrors } from 'react-hook-form'
import { ValidationError } from '../controls/ValidationSummary'

interface ExperienceProfileFormData {
  experience_level_id: number | null
  nicotine_level_id: number | null
  moisture_level_id: number | null
}

interface UseExperienceProfileValidationProps {
  experienceLevelId: number | null
  nicotineLevelId: number | null
  moistureLevelId: number | null
  errors: FieldErrors<ExperienceProfileFormData>
}

interface UseExperienceProfileValidationReturn {
  validationErrors: ValidationError[]
  isValid: boolean
}

/**
 * Custom hook for ExperienceProfile validation logic
 * Centralizes validation error handling and form state validation
 */
export const useExperienceProfileValidation = ({
  experienceLevelId,
  nicotineLevelId,
  moistureLevelId,
  errors
}: UseExperienceProfileValidationProps): UseExperienceProfileValidationReturn => {
  
  // Validation errors - Use schema error messages when available
  const validationErrors = useMemo((): ValidationError[] => {
    const errorList: ValidationError[] = []
    
    if (errors.experience_level_id) {
      errorList.push({
        fieldName: 'experience_level_id',
        message: errors.experience_level_id.message || 'Please select your experience level'
      })
    }
    
    if (errors.nicotine_level_id) {
      errorList.push({
        fieldName: 'nicotine_level_id',
        message: errors.nicotine_level_id.message || 'Please select your nicotine preference'
      })
    }
    
    if (errors.moisture_level_id) {
      errorList.push({
        fieldName: 'moisture_level_id',
        message: errors.moisture_level_id.message || 'Please select your moisture preference'
      })
    }
    
    return errorList
  }, [errors.experience_level_id, errors.nicotine_level_id, errors.moisture_level_id])
  
  // Check if step is valid
  const isValid = useMemo((): boolean => {
    return Boolean(
      experienceLevelId && 
      nicotineLevelId && 
      moistureLevelId &&
      !errors.experience_level_id && 
      !errors.nicotine_level_id && 
      !errors.moisture_level_id
    )
  }, [experienceLevelId, nicotineLevelId, moistureLevelId, errors.experience_level_id, errors.nicotine_level_id, errors.moisture_level_id])

  return {
    validationErrors,
    isValid
  }
}
