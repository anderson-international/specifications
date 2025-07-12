'use client'

import React, { useCallback } from 'react'
import styles from './MultiSelectChips.module.css'

export interface ChipProps {
  option: {
    id: string | number
    label: string
    value: string | number | boolean | null
  }
  onRemove: (id: string | number) => void
  disabled?: boolean
}

const ChipComponent = ({ option, onRemove, disabled }: ChipProps): JSX.Element => {
  const handleRemoveClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onRemove(option.id)
    },
    [onRemove, option.id]
  )

  return (
    <div className={styles.chip}>
      {option.label}
      <button
        type="button"
        className={styles.chipRemove}
        onClick={handleRemoveClick}
        disabled={disabled}
        aria-label={`Remove ${option.label}`}
      >
        ×
      </button>
    </div>
  )
}

const Chip = React.memo(ChipComponent)
Chip.displayName = 'Chip'

export default Chip
