'use client'

import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import SegmentedControl, { SegmentedOption } from '../controls/SegmentedControl'
import ValidationSummary from '../controls/ValidationSummary'
import ProductAttributeToggles from './ProductAttributeToggles'
import { useProductCharacteristicsValidation } from '../hooks/useProductCharacteristicsValidation'
import { PRODUCT_TYPES, GRINDS, EXPERIENCE_LEVELS } from '@/constants/wizardOptions'
import styles from './ProductCharacteristics.module.css'

interface ProductCharacteristicsProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
}

interface ProductCharacteristicsFormData {
  product_type_id: number | null
  grind_id: number | null
  experience_level_id: number | null
  is_fermented: boolean
  is_oral_tobacco: boolean
  is_artisan: boolean
}

/**
 * Step 2: Product characteristics including type, grind, experience level and boolean flags
 */
const ProductCharacteristics = ({
  stepNumber,
  totalSteps,
  disabled = false
}: ProductCharacteristicsProps): JSX.Element => {
  const { 
    watch, 
    setValue, 
    formState: { errors } 
  } = useFormContext<ProductCharacteristicsFormData>()
  
  // Watch form values - Optimized with single watch call
  const {
    product_type_id: productTypeId,
    grind_id: grindId,
    experience_level_id: experienceLevelId,
    is_fermented: isFermented,
    is_oral_tobacco: isOralTobacco,
    is_artisan: isArtisan
  } = watch()
  
  // Use extracted validation hook
  const { validationErrors, isValid } = useProductCharacteristicsValidation(
    productTypeId,
    grindId,
    experienceLevelId,
    errors
  )
  
  // Handle product type change
  const handleProductTypeChange = useCallback((value: string | number): void => {
    setValue('product_type_id', Number(value), { shouldValidate: true })
  }, [setValue])
  
  // Handle grind change
  const handleGrindChange = useCallback((value: string | number): void => {
    setValue('grind_id', Number(value), { shouldValidate: true })
  }, [setValue])
  
  // Handle experience level change
  const handleExperienceChange = useCallback((value: string | number): void => {
    setValue('experience_level_id', Number(value), { shouldValidate: true })
  }, [setValue])
  
  // Handle fermented toggle
  const handleFermentedChange = useCallback((checked: boolean): void => {
    setValue('is_fermented', checked, { shouldValidate: true })
  }, [setValue])
  
  // Handle oral tobacco toggle
  const handleOralTobaccoChange = useCallback((checked: boolean): void => {
    setValue('is_oral_tobacco', checked, { shouldValidate: true })
  }, [setValue])
  
  // Handle artisan toggle
  const handleArtisanChange = useCallback((checked: boolean): void => {
    setValue('is_artisan', checked, { shouldValidate: true })
  }, [setValue])

  return (
    <WizardStepCard
      title="Product Characteristics"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isValid={isValid}
    >
      <ValidationSummary errors={validationErrors} />
      
      <div 
        className={styles.formGroup}
        role="group"
        aria-labelledby="product-type-label"
      >
        <label 
          id="product-type-label"
          className={styles.label}
        >
          Product Type
        </label>
        <SegmentedControl
          options={PRODUCT_TYPES as unknown as SegmentedOption[]}
          value={productTypeId}
          onChange={handleProductTypeChange}
          disabled={disabled}
          name="product-type"
          fullWidth
          aria-labelledby="product-type-label"
        />
      </div>
      
      <div 
        className={styles.formGroup}
        role="group"
        aria-labelledby="grind-label"
      >
        <label 
          id="grind-label"
          className={styles.label}
        >
          Grind
        </label>
        <SegmentedControl
          options={GRINDS as unknown as SegmentedOption[]}
          value={grindId}
          onChange={handleGrindChange}
          disabled={disabled}
          name="grind"
          fullWidth
          aria-labelledby="grind-label"
        />
      </div>
      
      <div 
        className={styles.formGroup}
        role="group"
        aria-labelledby="experience-level-label"
      >
        <label 
          id="experience-level-label"
          className={styles.label}
        >
          Experience Level
        </label>
        <SegmentedControl
          options={EXPERIENCE_LEVELS as unknown as SegmentedOption[]}
          value={experienceLevelId}
          onChange={handleExperienceChange}
          disabled={disabled}
          name="experience-level"
          fullWidth
          aria-labelledby="experience-level-label"
        />
      </div>
      
      <ProductAttributeToggles
        isFermented={isFermented}
        isOralTobacco={isOralTobacco}
        isArtisan={isArtisan}
        onFermentedChange={handleFermentedChange}
        onOralTobaccoChange={handleOralTobaccoChange}
        onArtisanChange={handleArtisanChange}
        disabled={disabled}
      />
    </WizardStepCard>
  )
}

export default React.memo(ProductCharacteristics)
