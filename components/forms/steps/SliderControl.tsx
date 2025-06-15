'use client'

import { memo } from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { SensoryProfile as SensoryProfileType } from '@/lib/schemas/specification'
import styles from './SensoryProfile.module.css'

interface SliderControlProps {
  field: 'nicotineStrength' | 'moistureLevel'
  title: string
  description: string
  value: number
  register: UseFormRegister<SensoryProfileType>
  error?: string
}

const getValueLabel = (field: 'nicotineStrength' | 'moistureLevel', value: number): string => {
  if (field === 'nicotineStrength') {
    return value <= 3 ? 'Mild' : value <= 7 ? 'Medium' : 'Strong'
  }
  return value <= 3 ? 'Dry' : value <= 7 ? 'Medium' : 'Moist'
}

export const SliderControl = memo<SliderControlProps>(function SliderControl({
  field,
  title,
  description,
  value,
  register,
  error
}: SliderControlProps): JSX.Element {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <p className={styles.sectionDesc}>{description}</p>
      <div className={styles.sliderContainer}>
        <input
          type="range"
          min="1"
          max="10"
          {...register(field, { valueAsNumber: true })}
          className={styles.slider}
        />
        <div className={styles.sliderValue}>
          <span className={styles.sliderNumber}>{value}</span>
          <span className={styles.sliderLabel}>
            {getValueLabel(field, value)}
          </span>
        </div>
      </div>
      {error && (
        <div className={styles.error}>{error}</div>
      )}
    </div>
  )
})
