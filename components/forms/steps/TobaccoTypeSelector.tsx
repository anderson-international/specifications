'use client'

import styles from './Characteristics1.module.css'

interface TobaccoTypeSelectorProps {
  selectedTypes: string[]
  onTypeToggle: (type: string) => void
  error?: string
}

const TOBACCO_TYPES = [
  'Virginia', 'Burley', 'Kentucky', 'Oriental', 'Latakia', 
  'Perique', 'Dark Air Cured', 'Fire Cured', 'Other'
]

export function TobaccoTypeSelector({
  selectedTypes,
  onTypeToggle,
  error
}: TobaccoTypeSelectorProps): JSX.Element {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Tobacco Types</h3>
      <p className={styles.sectionDesc}>Select all that apply</p>
      <div className={styles.tagGrid}>
        {TOBACCO_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onTypeToggle(type)}
            className={`${styles.tagButton} ${
              selectedTypes.includes(type) ? styles.tagSelected : ''
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      {error && (
        <div className={styles.error}>{error}</div>
      )}
    </div>
  )
}
