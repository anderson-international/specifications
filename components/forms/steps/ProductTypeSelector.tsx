'use client'

import { UseFormRegister } from 'react-hook-form'
import { Characteristics1 as Characteristics1Type } from '@/lib/schemas/specification'
import styles from './Characteristics1.module.css'

interface ProductTypeSelectorProps {
  register: UseFormRegister<Characteristics1Type>
  error?: string
}

const PRODUCT_TYPES = [
  { value: 'nasal_snuff', label: 'Nasal Snuff' },
  { value: 'chewing_tobacco', label: 'Chewing Tobacco' },
  { value: 'snus', label: 'Snus' },
  { value: 'other', label: 'Other' }
]

export function ProductTypeSelector({
  register,
  error
}: ProductTypeSelectorProps): JSX.Element {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Product Type</h3>
      <div className={styles.radioGroup}>
        {PRODUCT_TYPES.map((type) => (
          <label key={type.value} className={styles.radioLabel}>
            <input
              type="radio"
              value={type.value}
              {...register('productType')}
              className={styles.radioInput}
            />
            <span className={styles.radioText}>{type.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <div className={styles.error}>{error}</div>
      )}
    </div>
  )
}
