'use client'

import React, { useState, useCallback, useMemo } from 'react'
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
  maxBoost = 5
}: RatingBoostProps): JSX.Element => {
  const [hoverValue, setHoverValue] = useState(0)

  const boosts = useMemo(() => {
    return Array.from({ length: maxBoost }, (_, i) => i + 1)
  }, [maxBoost])

  const handleBoostClick = useCallback((boostValue: number): void => {
    if (disabled) return
    onChange(value === boostValue ? 0 : boostValue)
  }, [onChange, value, disabled])

  const boostText = value > 0 ? `+${value}` : ''

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.boosts}>
        {boosts.map((boost) => (
          <button
            key={boost}
            type="button"
            className={`${styles.boost} ${boost <= (hoverValue || value) ? styles.filled : ''}`}
            onClick={(): void => handleBoostClick(boost)}
            onMouseEnter={(): void => setHoverValue(boost)}
            onMouseLeave={(): void => setHoverValue(0)}
            disabled={disabled}
            aria-label={`Boost rating by ${boost}`}
            aria-pressed={boost <= value}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="18"
              height="18"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        ))}
      </div>
      {boostText && <span className={styles.boostText}>{boostText}</span>}
    </div>
  )
}

export default React.memo(RatingBoost)
