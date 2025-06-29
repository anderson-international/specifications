'use client'

import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import MultiSelectChips from '../controls/MultiSelectChips'
import { TASTING_NOTES, CURES, TOBACCO_TYPES } from '@/constants/wizardOptions'
import styles from './TastingProfile.module.css'

interface TastingProfileProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
}

interface TastingProfileFormData {
  tasting_notes: number[]
  cures: number[]
  tobacco_types: number[]
}

/**
 * Step 4: Tasting profile including tasting notes, cures, and tobacco types
 * Multi-select component for sensory and processing characteristics
 */
const TastingProfile = ({
  stepNumber,
  totalSteps,
  disabled = false
}: TastingProfileProps): JSX.Element => {
  const { 
    watch, 
    setValue
  } = useFormContext<TastingProfileFormData>()
  
  // Watch form values - Optimized with single watch call
  const {
    tasting_notes: tastingNotes = [],
    cures = [],
    tobacco_types: tobaccoTypes = []
  } = watch()
  
  const createMultiSelectHandler = useCallback(
    (fieldName: keyof TastingProfileFormData) => (values: (number | string)[]) => {
      setValue(fieldName, values.map(Number), { shouldValidate: true });
    },
    [setValue]
  );

  const handleTastingNotesChange = createMultiSelectHandler('tasting_notes');
  const handleCuresChange = createMultiSelectHandler('cures');
  const handleTobaccoTypesChange = createMultiSelectHandler('tobacco_types');
  
  return (
    <WizardStepCard
      title="Tasting Profile"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
    >
      
      <div className={styles.container}>
        <div 
          className={styles.formGroup}
          role="group"
          aria-labelledby="tasting-notes-label"
        >
          <label 
            id="tasting-notes-label"
            className={styles.label}
          >
            Tasting Notes
          </label>

          <MultiSelectChips
            options={TASTING_NOTES}
            selectedValues={tastingNotes}
            onChange={handleTastingNotesChange}
            disabled={disabled}
            name="tasting-notes"
          />
        </div>

        <div className={styles.grid}>
          <div 
            className={styles.formGroup}
            role="group"
            aria-labelledby="cures-label"
          >
            <label 
              id="cures-label"
              className={styles.label}
            >
              Cures
            </label>

            <MultiSelectChips
              options={CURES}
              selectedValues={cures}
              onChange={handleCuresChange}
              disabled={disabled}
              name="cures"
            />
          </div>
          
          <div 
            className={styles.formGroup}
            role="group"
            aria-labelledby="tobacco-types-label"
          >
            <label 
              id="tobacco-types-label"
              className={styles.label}
            >
              Tobacco Types
            </label>

            <MultiSelectChips
              options={TOBACCO_TYPES}
              selectedValues={tobaccoTypes}
              onChange={handleTobaccoTypesChange}
              disabled={disabled}
              name="tobacco-types"
            />
          </div>
        </div>
      </div>
    </WizardStepCard>
  )
}

export default React.memo(TastingProfile)
