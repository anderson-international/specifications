'use client'

import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import MultiSelectChips from '../controls/MultiSelectChips'
import ProductWithDraftIndicator from '../components/ProductWithDraftIndicator'

import { transformEnumToOptions } from '../hooks/useEnumUtils'
import { Product } from '@/lib/types/product'
import { SpecificationEnumData } from '@/types/enum'
import styles from './TastingProfile.module.css'

interface TastingProfileProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
  selectedProduct?: Product | null
  enumData?: SpecificationEnumData
  enumsLoading?: boolean
  saveStatus?: import('../types/wizard.types').SaveStatus
  hasSavedOnce?: boolean
}

interface TastingProfileFormData {
  tasting_note_ids: number[]
  cure_type_ids: number[]
  tobacco_type_ids: number[]
}

const TastingProfile = ({
  stepNumber,
  totalSteps,
  disabled = false,
  selectedProduct,
  enumData,
  enumsLoading = false,
  saveStatus = 'idle',
  hasSavedOnce = false,
}: TastingProfileProps): JSX.Element => {
  const { watch, setValue } = useFormContext<TastingProfileFormData>()

  const tastingNoteOptions = enumData?.tastingNotes ? transformEnumToOptions(enumData.tastingNotes) : undefined
  const cureOptions = enumData?.cures ? transformEnumToOptions(enumData.cures) : undefined
  const tobaccoTypeOptions = enumData?.tobaccoTypes ? transformEnumToOptions(enumData.tobaccoTypes) : undefined

  const isLoadingEnums = enumsLoading || false

  const { tasting_note_ids: tastingNotes = [], cure_type_ids: cures = [], tobacco_type_ids: tobaccoTypes = [] } = watch()

  const createMultiSelectHandler = useCallback(
    (fieldName: keyof TastingProfileFormData) => (values: (number | string)[]) => {
      setValue(fieldName, values.map(Number), { shouldValidate: true })
    },
    [setValue]
  )

  const handleTastingNotesChange = createMultiSelectHandler('tasting_note_ids')
  const handleCuresChange = createMultiSelectHandler('cure_type_ids')
  const handleTobaccoTypesChange = createMultiSelectHandler('tobacco_type_ids')

  if (isLoadingEnums || !enumData) {
    return (
      <WizardStepCard title="Tasting Profile" stepNumber={stepNumber} totalSteps={totalSteps}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          Loading tasting profile options...
        </div>
      </WizardStepCard>
    )
  }

  return (
    <WizardStepCard title="Tasting Profile" stepNumber={stepNumber} totalSteps={totalSteps}>
      {selectedProduct && (
        <ProductWithDraftIndicator 
          product={selectedProduct}
          saveStatus={saveStatus}
          hasSavedOnce={hasSavedOnce}
          isEnabled={!disabled}
        />
      )}
      <div className={styles.container}>
        <div className={styles.formGroup} role="group" aria-labelledby="tasting-notes-label">
          <label id="tasting-notes-label" className={styles.label}>
            Tasting Notes
          </label>

          <MultiSelectChips
            options={tastingNoteOptions ?? (() => { throw new Error('TastingProfile: tastingNoteOptions enum data is required but missing. Check enum loading service.') })()}
            selectedValues={tastingNotes}
            onChange={handleTastingNotesChange}
            disabled={disabled || isLoadingEnums}
            name="tasting-notes"
          />
        </div>

        <div className={styles.grid}>
          <div className={styles.formGroup} role="group" aria-labelledby="cures-label">
            <label id="cures-label" className={styles.label}>
              Cures
            </label>

            <MultiSelectChips
              options={cureOptions ?? (() => { throw new Error('TastingProfile: cureOptions enum data is required but missing. Check enum loading service.') })()}
              selectedValues={cures}
              onChange={handleCuresChange}
              disabled={disabled || isLoadingEnums}
              name="cures"
            />
          </div>

          <div className={styles.formGroup} role="group" aria-labelledby="tobacco-types-label">
            <label id="tobacco-types-label" className={styles.label}>
              Tobacco Types
            </label>

            <MultiSelectChips
              options={tobaccoTypeOptions ?? (() => { throw new Error('TastingProfile: tobaccoTypeOptions enum data is required but missing. Check enum loading service.') })()}
              selectedValues={tobaccoTypes}
              onChange={handleTobaccoTypesChange}
              disabled={disabled || isLoadingEnums}
              name="tobacco-types"
            />
          </div>
        </div>
      </div>
    </WizardStepCard>
  )
}

export default React.memo(TastingProfile)
