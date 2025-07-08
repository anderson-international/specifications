'use client'

import React from 'react'
import WizardStepCard from '../controls/WizardStepCard'
import CharacteristicSelect from './CharacteristicSelect'
import ProductAttributeToggles from './ProductAttributeToggles'
import { useProductCharacteristics } from '../hooks/useProductCharacteristics'
import {
  useGrinds,
  useExperienceLevels,
  useNicotineLevels,
  useMoistureLevels,
} from '../hooks/useEnumData'
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
  disabled = false,
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
    handleArtisanChange,
  } = useProductCharacteristics()

  // Fetch enum data from database
  const { data: grinds, isLoading: grindsLoading } = useGrinds()
  const { data: experienceLevels, isLoading: experienceLoading } = useExperienceLevels()
  const { data: nicotineLevels, isLoading: nicotineLoading } = useNicotineLevels()
  const { data: moistureLevels, isLoading: moistureLoading } = useMoistureLevels()

  const isLoadingEnums = grindsLoading || experienceLoading || nicotineLoading || moistureLoading

  return (
    <WizardStepCard title="Product Characteristics" stepNumber={stepNumber} totalSteps={totalSteps}>
      <div className={styles.characteristicsContainer}>
        <div className={styles.characteristicsRow}>
          <CharacteristicSelect
            id="grind-filter"
            label="Select Grind"
            value={grindId || ''}
            onChange={handleGrindChange}
            options={grinds || []}
            disabled={disabled || isLoadingEnums}
          />
          <CharacteristicSelect
            id="experience-level-filter"
            label="Select Experience"
            value={experienceLevelId || ''}
            onChange={handleExperienceChange}
            options={experienceLevels || []}
            disabled={disabled || isLoadingEnums}
          />
        </div>
        <div className={styles.characteristicsRow}>
          <CharacteristicSelect
            id="nicotine-level-filter"
            label="Select Nicotine Level"
            value={nicotineLevelId || ''}
            onChange={handleNicotineLevelChange}
            options={nicotineLevels || []}
            disabled={disabled || isLoadingEnums}
          />
          <CharacteristicSelect
            id="moisture-level-filter"
            label="Select Moisture Level"
            value={moistureLevelId || ''}
            onChange={handleMoistureLevelChange}
            options={moistureLevels || []}
            disabled={disabled || isLoadingEnums}
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
