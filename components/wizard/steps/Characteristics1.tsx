'use client'

import React, { useMemo, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import SegmentedControl from '../controls/SegmentedControl'
import ToggleSwitch from '../controls/ToggleSwitch'
import ValidationSummary, { ValidationError } from '../controls/ValidationSummary'
import styles from './Characteristics1.module.css'

interface Characteristics1Props {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
}

interface Characteristics1FormData {
  type_id: number | null
  category_id: number | null
  has_nicotine: boolean
}

/**
 * Second step of the specification wizard for product characteristics
 */
const Characteristics1 = ({
  stepNumber,
  totalSteps,
  disabled = false
}: Characteristics1Props): JSX.Element => {
  // Form context
  const { 
    watch, 
    setValue, 
    formState: { errors } 
  } = useFormContext<Characteristics1FormData>()
  
  // Watch for form value changes
  const typeId = watch('type_id')
  const categoryId = watch('category_id')
  const hasNicotine = watch('has_nicotine')
  
  // Product type options
  const typeOptions = useMemo(() => [
    { id: 1, value: 1, label: 'Ready to Use' },
    { id: 2, value: 2, label: 'Concentrate' },
    { id: 3, value: 3, label: 'Raw Material' }
  ], [])
  
  // Product category options
  const categoryOptions = useMemo(() => [
    { id: 1, value: 1, label: 'Single Flavor' },
    { id: 2, value: 2, label: 'Complex Mixture' },
    { id: 3, value: 3, label: 'Base' }
  ], [])
  
  // Validation errors
  const validationErrors = useMemo((): ValidationError[] => {
    const errorList: ValidationError[] = []
    
    if (errors.type_id) {
      errorList.push({
        fieldName: 'type_id',
        message: errors.type_id.message || 'Please select a product type'
      })
    }
    
    if (errors.category_id) {
      errorList.push({
        fieldName: 'category_id',
        message: errors.category_id.message || 'Please select a product category'
      })
    }
    
    return errorList
  }, [errors])

  // Handle product type change
  const handleTypeChange = useCallback((value: string | number): void => {
    // Convert to number if it's a string
    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value
    setValue('type_id', numericValue, { shouldValidate: true })
  }, [setValue])
  
  // Handle product category change
  const handleCategoryChange = useCallback((value: string | number): void => {
    // Convert to number if it's a string
    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value
    setValue('category_id', numericValue, { shouldValidate: true })
  }, [setValue])
  
  // Handle nicotine toggle change
  const handleNicotineChange = useCallback((checked: boolean): void => {
    setValue('has_nicotine', checked, { shouldValidate: true })
  }, [setValue])

  // Check if the step is valid
  const isValid = useMemo((): boolean => {
    return !errors.type_id && !errors.category_id
  }, [errors.type_id, errors.category_id])

  return (
    <WizardStepCard
      title="Product Characteristics"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isValid={isValid}
    >
      <ValidationSummary errors={validationErrors} />
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Product Type</label>
        <SegmentedControl
          options={typeOptions}
          value={typeId || 0}
          onChange={handleTypeChange}
          disabled={disabled}
          name="product-type"
          fullWidth
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Product Category</label>
        <SegmentedControl
          options={categoryOptions}
          value={categoryId || 0}
          onChange={handleCategoryChange}
          disabled={disabled}
          name="product-category"
          fullWidth
        />
      </div>
      
      <div className={styles.formGroup}>
        <div className={styles.toggleGroup}>
          <ToggleSwitch
            checked={hasNicotine || false}
            onChange={handleNicotineChange}
            disabled={disabled}
            name="has-nicotine"
            label="Contains Nicotine"
          />
        </div>
      </div>
    </WizardStepCard>
  )
}

// Export with React.memo for performance optimization
export default React.memo(Characteristics1)
