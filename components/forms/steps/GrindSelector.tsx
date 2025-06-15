'use client'

import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Characteristics2 as Characteristics2Type } from '@/lib/schemas/specification'
import styles from './Characteristics2.module.css'

interface GrindSelectorProps {
  register: UseFormRegister<Characteristics2Type>
  error?: string
}

const GRIND_OPTIONS = [
  { value: 'very_fine', label: 'Very Fine', desc: 'Powder-like consistency' },
  { value: 'fine', label: 'Fine', desc: 'Sand-like consistency' },
  { value: 'medium', label: 'Medium', desc: 'Small granules' },
  { value: 'coarse', label: 'Coarse', desc: 'Large chunks' }
]

export function GrindSelector({
  register,
  error
}: GrindSelectorProps): JSX.Element {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Grind</h3>
      <div className={styles.grindGrid}>
        {GRIND_OPTIONS.map((option) => (
          <label key={option.value} className={styles.grindCard}>
            <input
              type="radio"
              value={option.value}
              {...register('grind')}
              className={styles.grindInput}
            />
            <div className={styles.grindContent}>
              <h4 className={styles.grindTitle}>{option.label}</h4>
              <p className={styles.grindDesc}>{option.desc}</p>
            </div>
          </label>
        ))}
      </div>
      {error && (
        <div className={styles.error}>{error}</div>
      )}
    </div>
  )
}
