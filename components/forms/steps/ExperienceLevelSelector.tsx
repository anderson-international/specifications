'use client'

import { UseFormRegister } from 'react-hook-form'
import { Characteristics1 as Characteristics1Type } from '@/lib/schemas/specification'
import styles from './Characteristics1.module.css'

interface ExperienceLevelSelectorProps {
  register: UseFormRegister<Characteristics1Type>
  error?: string
}

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner', desc: 'New to this product type' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
  { value: 'advanced', label: 'Advanced', desc: 'Very experienced' }
]

export function ExperienceLevelSelector({
  register,
  error
}: ExperienceLevelSelectorProps): JSX.Element {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Your Experience Level</h3>
      <div className={styles.experienceGrid}>
        {EXPERIENCE_LEVELS.map((level) => (
          <label key={level.value} className={styles.experienceCard}>
            <input
              type="radio"
              value={level.value}
              {...register('experienceLevel')}
              className={styles.experienceInput}
            />
            <div className={styles.experienceContent}>
              <h4 className={styles.experienceTitle}>{level.label}</h4>
              <p className={styles.experienceDesc}>{level.desc}</p>
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
