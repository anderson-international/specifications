'use client'

import { Product } from '@/lib/types/product'
import { SpecificationEnumData } from '@/types/enum'
import React from 'react'
import ProductWithDraftIndicator from '../components/ProductWithDraftIndicator'
import WizardStepCard from '../controls/WizardStepCard'
import { transformEnumToOptions } from '../hooks/useEnumUtils'
import { useProductCharacteristics } from '../hooks/useProductCharacteristics'
import CharacteristicSelect from './CharacteristicSelect'
import ProductAttributeToggles from './ProductAttributeToggles'
import styles from './ProductCharacteristics.module.css'

interface ProductCharacteristicsProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
  selectedProduct?: Product | null
  enumData?: SpecificationEnumData
  enumsLoading?: boolean
  saveStatus?: import('../types/wizard.types').SaveStatus
  hasSavedOnce?: boolean
}

const ProductCharacteristics = ({
  stepNumber,
  totalSteps,
  disabled = false,
  selectedProduct,
  enumData,
  enumsLoading = false,
  saveStatus = 'idle',
  hasSavedOnce = false,
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

  const grinds = enumData?.grinds ? transformEnumToOptions(enumData.grinds) : undefined
  const experienceLevels = enumData?.experienceLevels ? transformEnumToOptions(enumData.experienceLevels) : undefined
  const nicotineLevels = enumData?.nicotineLevels ? transformEnumToOptions(enumData.nicotineLevels) : undefined
  const moistureLevels = enumData?.moistureLevels ? transformEnumToOptions(enumData.moistureLevels) : undefined

  const isLoadingEnums = enumsLoading || false

  if (isLoadingEnums || !enumData) {
    return (
      <WizardStepCard title="Characteristics" stepNumber={stepNumber} totalSteps={totalSteps}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          Loading characteristics...
        </div>
      </WizardStepCard>
    )
  }

  return (
    <WizardStepCard title="Characteristics" stepNumber={stepNumber} totalSteps={totalSteps}>
      {selectedProduct && (
        <ProductWithDraftIndicator 
          product={selectedProduct}
          saveStatus={saveStatus}
          hasSavedOnce={hasSavedOnce}
          isEnabled={!disabled}
        />
      )}
      <div className={styles.characteristicsContainer}>
        <div className={styles.characteristicsRow}>
          <CharacteristicSelect
            id="grind-filter"
            label="Select Grind"
            value={grindId ?? (() => { throw new Error('ProductCharacteristics: grindId is required but missing. Check form initialization and enum loading.') })()}
            onChange={handleGrindChange}
            options={grinds ?? (() => { throw new Error('ProductCharacteristics: grinds enum data is required but missing. Check enum loading service.') })()}
            disabled={disabled || isLoadingEnums}
          />
          <CharacteristicSelect
            id="experience-level-filter"
            label="Select Experience"
            value={experienceLevelId ?? (() => { throw new Error('ProductCharacteristics: experienceLevelId is required but missing. Check form initialization and enum loading.') })()}
            onChange={handleExperienceChange}
            options={experienceLevels ?? (() => { throw new Error('ProductCharacteristics: experienceLevels enum data is required but missing. Check enum loading service.') })()}
            disabled={disabled || isLoadingEnums}
          />
        </div>
        <div className={styles.characteristicsRow}>
          <CharacteristicSelect
            id="nicotine-level-filter"
            label="Select Nicotine Level"
            value={nicotineLevelId ?? (() => { throw new Error('ProductCharacteristics: nicotineLevelId is required but missing. Check form initialization and enum loading.') })()}
            onChange={handleNicotineLevelChange}
            options={nicotineLevels ?? (() => { throw new Error('ProductCharacteristics: nicotineLevels enum data is required but missing. Check enum loading service.') })()}
            disabled={disabled || isLoadingEnums}
          />
          <CharacteristicSelect
            id="moisture-level-filter"
            label="Select Moisture Level"
            value={moistureLevelId ?? (() => { throw new Error('ProductCharacteristics: moistureLevelId is required but missing. Check form initialization and enum loading.') })()}
            onChange={handleMoistureLevelChange}
            options={moistureLevels ?? (() => { throw new Error('ProductCharacteristics: moistureLevels enum data is required but missing. Check enum loading service.') })()}
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
