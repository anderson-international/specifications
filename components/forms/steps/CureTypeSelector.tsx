'use client'

import React from 'react'
import styles from './Characteristics2.module.css'

interface CureTypeSelectorProps {
  selectedCures: string[]
  onCureToggle: (cure: string) => void
  error?: string
}

const CURE_TYPES = [
  'Air Cured', 'Fire Cured', 'Flue Cured', 'Sun Cured', 
  'Dark Air Cured', 'Fermented', 'Other'
]

export function CureTypeSelector({
  selectedCures,
  onCureToggle,
  error
}: CureTypeSelectorProps): JSX.Element {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Cure Types</h3>
      <p className={styles.sectionDesc}>Select all that apply</p>
      <div className={styles.tagGrid}>
        {CURE_TYPES.map((cure) => (
          <button
            key={cure}
            type="button"
            onClick={() => onCureToggle(cure)}
            className={`${styles.tagButton} ${
              selectedCures.includes(cure) ? styles.tagSelected : ''
            }`}
          >
            {cure}
          </button>
        ))}
      </div>
      {error && (
        <div className={styles.error}>{error}</div>
      )}
    </div>
  )
}
