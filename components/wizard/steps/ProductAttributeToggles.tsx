'use client'

import React from 'react'
import ToggleSwitch from '../controls/ToggleSwitch'
import styles from './ProductCharacteristics.module.css'

interface ProductAttributeTogglesProps {
  isFermented: boolean
  isOralTobacco: boolean
  isArtisan: boolean
  onFermentedChange: (checked: boolean) => void
  onOralTobaccoChange: (checked: boolean) => void
  onArtisanChange: (checked: boolean) => void
  disabled?: boolean
}

/**
 * Product attribute toggles sub-component
 */
const ProductAttributeToggles = ({
  isFermented,
  isOralTobacco,
  isArtisan,
  onFermentedChange,
  onOralTobaccoChange,
  onArtisanChange,
  disabled = false
}: ProductAttributeTogglesProps): JSX.Element => (
  <div className={styles.toggleSection}>
    <h4 className={styles.sectionTitle}>Product Attributes</h4>
    
    <ToggleSwitch
      checked={isFermented}
      onChange={onFermentedChange}
      disabled={disabled}
      name="is-fermented"
      label="Fermented Product"
    />
    
    <ToggleSwitch
      checked={isOralTobacco}
      onChange={onOralTobaccoChange}
      disabled={disabled}
      name="is-oral-tobacco"
      label="Oral Tobacco"
    />
    
    <ToggleSwitch
      checked={isArtisan}
      onChange={onArtisanChange}
      disabled={disabled}
      name="is-artisan"
      label="Artisan Product"
    />
  </div>
)

export default React.memo(ProductAttributeToggles)
