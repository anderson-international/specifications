'use client'

import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import SegmentedControl, { SegmentedOption } from '../controls/SegmentedControl'
import { EXPERIENCE_LEVELS, NICOTINE_LEVELS, MOISTURE_LEVELS } from '@/constants/wizardOptions'
import styles from './ExperienceProfile.module.css'

interface ExperienceProfileProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
}

interface ExperienceProfileFormData {
  experience_level_id: number | null
  nicotine_level_id: number | null
  moisture_level_id: number | null
}

/**
 * Step 3: Experience profile including experience level, nicotine preference, and moisture preference
 */
const ExperienceProfile = ({
  stepNumber,
  totalSteps,
  disabled = false,
}: ExperienceProfileProps): JSX.Element => {
  const { watch, setValue } = useFormContext<ExperienceProfileFormData>()

  // Watch form values - Optimized with single watch call
  const {
    experience_level_id: experienceLevelId,
    nicotine_level_id: nicotineLevelId,
    moisture_level_id: moistureLevelId,
  } = watch()

  // Handle experience level change
  const handleExperienceChange = useCallback(
    (value: string | number): void => {
      setValue('experience_level_id', Number(value), { shouldValidate: true })
    },
    [setValue]
  )

  // Handle nicotine level change
  const handleNicotineChange = useCallback(
    (value: string | number): void => {
      setValue('nicotine_level_id', Number(value), { shouldValidate: true })
    },
    [setValue]
  )

  // Handle moisture level change
  const handleMoistureChange = useCallback(
    (value: string | number): void => {
      setValue('moisture_level_id', Number(value), { shouldValidate: true })
    },
    [setValue]
  )

  return (
    <WizardStepCard title="Experience Profile" stepNumber={stepNumber} totalSteps={totalSteps}>
      <div className={styles.formGroup} role="group" aria-labelledby="experience-level-label">
        <label id="experience-level-label" className={styles.label}>
          Experience Level
        </label>
        <p className={styles.description}>How familiar are you with this type of product?</p>
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

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="nicotine-level">
          Nicotine Level
        </label>
        <p className={styles.description}>What nicotine level do you prefer?</p>
        <SegmentedControl
          options={NICOTINE_LEVELS as unknown as SegmentedOption[]}
          value={nicotineLevelId}
          onChange={handleNicotineChange}
          disabled={disabled}
          name="nicotine-level"
          fullWidth
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="moisture-level">
          Moisture Level
        </label>
        <p className={styles.description}>What moisture level do you prefer?</p>
        <SegmentedControl
          options={MOISTURE_LEVELS as unknown as SegmentedOption[]}
          value={moistureLevelId}
          onChange={handleMoistureChange}
          disabled={disabled}
          name="moisture-level"
          fullWidth
        />
      </div>
    </WizardStepCard>
  )
}

export default React.memo(ExperienceProfile)
