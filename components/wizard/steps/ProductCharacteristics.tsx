'use client'

import React from 'react'
import WizardStepCard from '../controls/WizardStepCard'
import ProductAttributeToggles from './ProductAttributeToggles'
import { useProductCharacteristics } from '../hooks/useProductCharacteristics'
import { GRINDS, EXPERIENCE_LEVELS, NICOTINE_LEVELS, MOISTURE_LEVELS } from '@/constants/wizardOptions'
import styles from './ProductCharacteristics.module.css'

interface ProductCharacteristicsProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
}

/**
 * Step 2: Product characteristics including grind, experience level and boolean flags
 */
const ProductCharacteristics = ({
  stepNumber,
  totalSteps,
  disabled = false
}: ProductCharacteristicsProps): JSX.Element => {
  const {
    register,
    grindId,
    experienceLevelId,
    nicotineLevelId,
    moistureLevelId,
    isFermented,
    isOralTobacco,
    isArtisan,
    handleGrindChange,
    handleExperienceChange,
    handleNicotineLevelChange,
    handleMoistureLevelChange,
    handleFermentedChange,
    handleOralTobaccoChange,
    handleArtisanChange
  } = useProductCharacteristics()

  return (
    <WizardStepCard
      title="Product Characteristics"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
    >
      <div className={styles.characteristicsContainer}>
        <div className={styles.characteristicsRow}>
          <div>
            <select
              id="grind-filter"
              {...register('grind_id')}
              value={grindId || ''}
              onChange={handleGrindChange}
              disabled={disabled}
              className={styles.select}
            >
              <option value="">Select Grind</option>
              {GRINDS.map(grind => (
                <option key={grind.id} value={grind.id}>
                  {grind.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              id="experience-level-filter"
              {...register('experience_level_id')}
              value={experienceLevelId || ''}
              onChange={handleExperienceChange}
              disabled={disabled}
              className={styles.select}
            >
              <option value="">Select Experience</option>
              {EXPERIENCE_LEVELS.map(level => (
                <option key={level.id} value={level.id}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={styles.characteristicsRow}>
          <div>
            <select
              id="nicotine-level-filter"
              {...register('nicotine_level_id')}
              value={nicotineLevelId || ''}
              onChange={handleNicotineLevelChange}
              disabled={disabled}
              className={styles.select}
            >
              <option value="">Select Nicotine Level</option>
              {NICOTINE_LEVELS.map(level => (
                <option key={level.id} value={level.id}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              id="moisture-level-filter"
              {...register('moisture_level_id')}
              value={moistureLevelId || ''}
              onChange={handleMoistureLevelChange}
              disabled={disabled}
              className={styles.select}
            >
              <option value="">Select Moisture Level</option>
              {MOISTURE_LEVELS.map(level => (
                <option key={level.id} value={level.id}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
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
