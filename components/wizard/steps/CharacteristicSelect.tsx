'use client'

import React from 'react'
import styles from './ProductCharacteristics.module.css'

interface Option {
  id: number
  label: string
}

interface CharacteristicSelectProps {
  id: string
  label: string
  value: number | ''
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: readonly Option[]
  disabled?: boolean
}

const CharacteristicSelect = ({
  id,
  label,
  value,
  onChange,
  options,
  disabled = false
}: CharacteristicSelectProps): JSX.Element => (
  <div>
    <select
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={styles.select}
    >
      <option value="">{label}</option>
      {options.map(option => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

export default React.memo(CharacteristicSelect)
