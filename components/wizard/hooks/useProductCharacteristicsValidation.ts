'use client'

import { useMemo } from 'react'
import { FieldErrors } from 'react-hook-form'
import { ValidationError } from '../controls/ValidationSummary'

interface ProductCharacteristicsFormData {
  product_type_id: number | null
  grind_id: number | null
  experience_level_id: number | null
  is_fermented: boolean
  is_oral_tobacco: boolean
  is_artisan: boolean
}

interface UseValidationReturn {
  validationErrors: ValidationError[]
  isValid: boolean
}

/**
 * Custom hook for product characteristics validation
 */
export const useProductCharacteristicsValidation = (
  productTypeId: number | null,
  grindId: number | null,
  experienceLevelId: number | null,
  errors: FieldErrors<ProductCharacteristicsFormData>
): UseValidationReturn => {
  
  const validationErrors = useMemo((): ValidationError[] => {
    const errorList: ValidationError[] = []
    
    if (errors.product_type_id) {
      errorList.push({
        fieldName: 'product_type_id',
        message: 'Please select a product type'
      })
    }
    
    if (errors.grind_id) {
      errorList.push({
        fieldName: 'grind_id',
        message: 'Please select a grind type'
      })
    }
    
    if (errors.experience_level_id) {
      errorList.push({
        fieldName: 'experience_level_id',
        message: 'Please select your experience level'
      })
    }
    
    return errorList
  }, [errors.product_type_id, errors.grind_id, errors.experience_level_id])
  
  const isValid = useMemo((): boolean => {
    return Boolean(
      productTypeId && 
      grindId && 
      experienceLevelId &&
      !errors.product_type_id && 
      !errors.grind_id && 
      !errors.experience_level_id
    )
  }, [productTypeId, grindId, experienceLevelId, errors.product_type_id, errors.grind_id, errors.experience_level_id])
  
  return { validationErrors, isValid }
}
