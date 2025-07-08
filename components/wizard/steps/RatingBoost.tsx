'use client'

import React, { useCallback, useMemo } from 'react'
import styles from './RatingBoost.module.css'

interface RatingBoostProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  maxBoost?: number
}

const RatingBoost = ({
  value,
  onChange,
  disabled = false,
  maxBoost = 5,
}: RatingBoostProps): JSX.Element => {
  const boosts = useMemo(() => {
    return Array.from({ length: maxBoost }, (_, i) => i + 1)
  }, [maxBoost])

  const handleBoostClick = useCallback(
    (boostValue: number): void => {
      if (disabled) return
      onChange(value === boostValue ? 0 : boostValue)
    },
    [onChange, value, disabled]
  )

  const boostText = value > 0 ? `+${value}` : ''

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.boosts}>
        {boosts.map((boost) => (
          <button
            key={boost}
            type="button"
            className={`${styles.boost} ${boost <= value ? styles.filled : ''}`}
            onClick={(): void => handleBoostClick(boost)}
            disabled={disabled}
            aria-label={`Boost rating by ${boost}`}
            aria-pressed={boost <= value}
          >
            +
          </button>
        ))}
      </div>
      {boostText && <span className={styles.boostText}>{boostText}</span>}
    </div>
  )
}

export default React.memo(RatingBoost)
