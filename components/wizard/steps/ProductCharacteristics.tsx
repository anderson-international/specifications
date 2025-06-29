'use client'

import React from 'react'
import WizardStepCard from '../controls/WizardStepCard'
import CharacteristicSelect from './CharacteristicSelect'
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
          <CharacteristicSelect
            id="grind-filter"
            label="Select Grind"
            value={grindId || ''}
            onChange={handleGrindChange}
            options={GRINDS}
            disabled={disabled}
          />
          <CharacteristicSelect
            id="experience-level-filter"
            label="Select Experience"
            value={experienceLevelId || ''}
            onChange={handleExperienceChange}
            options={EXPERIENCE_LEVELS}
            disabled={disabled}
          />
        </div>
        <div className={styles.characteristicsRow}>
          <CharacteristicSelect
            id="nicotine-level-filter"
            label="Select Nicotine Level"
            value={nicotineLevelId || ''}
            onChange={handleNicotineLevelChange}
            options={NICOTINE_LEVELS}
            disabled={disabled}
          />
          <CharacteristicSelect
            id="moisture-level-filter"
            label="Select Moisture Level"
            value={moistureLevelId || ''}
            onChange={handleMoistureLevelChange}
            options={MOISTURE_LEVELS}
            disabled={disabled}
          />
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
