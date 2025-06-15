'use client'

import React from 'react'
import { UseFormRegister } from 'react-hook-form'
import { Characteristics2 as Characteristics2Type } from '@/lib/schemas/specification'
import styles from './Characteristics2.module.css'

interface BooleanCharacteristicsProps {
  register: UseFormRegister<Characteristics2Type>
}

const BOOLEAN_OPTIONS = [
  {
    field: 'isScented' as const,
    label: 'Scented',
    description: 'Contains added fragrances or essential oils'
  },
  {
    field: 'isMenthol' as const,
    label: 'Menthol',
    description: 'Contains menthol for cooling sensation'
  },
  {
    field: 'isToasted' as const,
    label: 'Toasted',
    description: 'Tobacco has been toasted for enhanced flavor'
  }
]

export const BooleanCharacteristics = React.memo(function BooleanCharacteristics({
  register
}: BooleanCharacteristicsProps): JSX.Element {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Additional Characteristics</h3>
      <div className={styles.booleanGrid}>
        {BOOLEAN_OPTIONS.map((option) => (
          <label key={option.field} className={styles.booleanLabel}>
            <input
              type="checkbox"
              {...register(option.field)}
              className={styles.booleanInput}
            />
            <span className={styles.booleanText}>{option.label}</span>
            <span className={styles.booleanDesc}>
              {option.description}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
})
