'use client'

import React from 'react'
import WizardStepCard from '../controls/WizardStepCard'
import CharacteristicSelect from './CharacteristicSelect'
import ProductAttributeToggles from './ProductAttributeToggles'
import SelectedProductSummary from './SelectedProductSummary'
import { useProductCharacteristics } from '../hooks/useProductCharacteristics'
import { transformEnumToOptions } from '../hooks/useEnumUtils'
import { Product } from '@/lib/types/product'
import { SpecificationEnumData } from '@/types/enum'
import styles from './ProductCharacteristics.module.css'

interface ProductCharacteristicsProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
  selectedProduct?: Product | null
  enumData?: SpecificationEnumData
  enumsLoading?: boolean
}

/**
 * Step 2: Product characteristics including grind, experience level and boolean flags
 */
const ProductCharacteristics = ({
  stepNumber,
  totalSteps,
  disabled = false,
  selectedProduct,
  enumData,
  enumsLoading,
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

  // Use enum data passed from parent to eliminate redundant API calls
  const grinds = enumData?.grinds ? transformEnumToOptions(enumData.grinds) : undefined
  const experienceLevels = enumData?.experienceLevels ? transformEnumToOptions(enumData.experienceLevels) : undefined
  const nicotineLevels = enumData?.nicotineLevels ? transformEnumToOptions(enumData.nicotineLevels) : undefined
  const moistureLevels = enumData?.moistureLevels ? transformEnumToOptions(enumData.moistureLevels) : undefined

  const isLoadingEnums = enumsLoading || false

  return (
    <WizardStepCard title="Product Characteristics" stepNumber={stepNumber} totalSteps={totalSteps}>
      {selectedProduct && <SelectedProductSummary product={selectedProduct} />}
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
