'use client'

import React, { useMemo, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import SegmentedControl from '../controls/SegmentedControl'
import ToggleSwitch from '../controls/ToggleSwitch'
import ValidationSummary, { ValidationError } from '../controls/ValidationSummary'
import styles from './Characteristics2.module.css'

interface Characteristics2Props {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
}

interface Characteristics2FormData {
  flavor_complexity_id: number | null
  color_intensity_id: number | null
  is_natural: boolean
  is_custom: boolean
}

/**
 * Third step of the specification wizard for additional product characteristics
 */
const Characteristics2 = ({
  stepNumber,
  totalSteps,
  disabled = false
}: Characteristics2Props): JSX.Element => {
  // Form context
  const { 
    watch, 
    setValue, 
    formState: { errors } 
  } = useFormContext<Characteristics2FormData>()
  
  // Watch for form value changes
  const flavorComplexityId = watch('flavor_complexity_id')
  const colorIntensityId = watch('color_intensity_id')
  const isNatural = watch('is_natural')
  const isCustom = watch('is_custom')
  
  // Flavor complexity options
  const flavorOptions = useMemo(() => [
    { id: 1, value: 1, label: 'Simple' },
    { id: 2, value: 2, label: 'Medium' },
    { id: 3, value: 3, label: 'Complex' }
  ], [])
  
  // Color intensity options
  const colorOptions = useMemo(() => [
    { id: 1, value: 1, label: 'Clear' },
    { id: 2, value: 2, label: 'Light' },
    { id: 3, value: 3, label: 'Medium' },
    { id: 4, value: 4, label: 'Dark' }
  ], [])
  
  // Validation errors
  const validationErrors = useMemo((): ValidationError[] => {
    const errorList: ValidationError[] = []
    
    if (errors.flavor_complexity_id) {
      errorList.push({
        fieldName: 'flavor_complexity_id',
        message: errors.flavor_complexity_id.message || 'Please select flavor complexity'
      })
    }
    
    if (errors.color_intensity_id) {
      errorList.push({
        fieldName: 'color_intensity_id',
        message: errors.color_intensity_id.message || 'Please select color intensity'
      })
    }
    
    return errorList
  }, [errors])

  // Handle flavor complexity change
  const handleFlavorChange = useCallback((value: string | number): void => {
    // Convert to number if it's a string
    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value
    setValue('flavor_complexity_id', numericValue, { shouldValidate: true })
  }, [setValue])
  
  // Handle color intensity change
  const handleColorChange = useCallback((value: string | number): void => {
    // Convert to number if it's a string
    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value
    setValue('color_intensity_id', numericValue, { shouldValidate: true })
  }, [setValue])
  
  // Handle natural toggle change
  const handleNaturalChange = useCallback((checked: boolean): void => {
    setValue('is_natural', checked, { shouldValidate: true })
  }, [setValue])
  
  // Handle custom toggle change
  const handleCustomChange = useCallback((checked: boolean): void => {
    setValue('is_custom', checked, { shouldValidate: true })
  }, [setValue])

  // Check if the step is valid
  const isValid = useMemo((): boolean => {
    return !errors.flavor_complexity_id && !errors.color_intensity_id
  }, [errors.flavor_complexity_id, errors.color_intensity_id])

  return (
    <WizardStepCard
      title="Additional Characteristics"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isValid={isValid}
    >
      <ValidationSummary errors={validationErrors} />
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Flavor Complexity</label>
        <SegmentedControl
          options={flavorOptions}
          value={flavorComplexityId || 0}
          onChange={handleFlavorChange}
          disabled={disabled}
          name="flavor-complexity"
          fullWidth
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Color Intensity</label>
        <SegmentedControl
          options={colorOptions}
          value={colorIntensityId || 0}
          onChange={handleColorChange}
          disabled={disabled}
          name="color-intensity"
          fullWidth
        />
      </div>
      
      <div className={styles.togglesContainer}>
        <div className={styles.toggleGroup}>
          <ToggleSwitch
            checked={isNatural || false}
            onChange={handleNaturalChange}
            disabled={disabled}
            name="is-natural"
            label="Natural Ingredients"
          />
        </div>
        
        <div className={styles.toggleGroup}>
          <ToggleSwitch
            checked={isCustom || false}
            onChange={handleCustomChange}
            disabled={disabled}
            name="is-custom"
            label="Custom Formulation"
          />
        </div>
      </div>
    </WizardStepCard>
  )
}

// Export with React.memo for performance optimization
export default React.memo(Characteristics2)
