'use client'

import React, { useState, useCallback, useMemo } from 'react'
import styles from './StarRating.module.css'

// StarIcon Component for reusability
const StarIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
)

const getRatingLabel = (rating: number): string => {
  switch (rating) {
    case 1:
      return 'Poor'
    case 2:
      return 'Fair'
    case 3:
      return 'Good'
    case 4:
      return 'Very Good'
    case 5:
      return 'Excellent'
    default:
      return ''
  }
}

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  maxRating?: number
  disabled?: boolean
}

const StarRating = ({
  value,
  onChange,
  maxRating = 5,
  disabled = false
}: StarRatingProps): JSX.Element => {
  const [hoverValue, setHoverValue] = useState(0)

  const handleStarClick = useCallback(
    (rating: number) => {
      if (!disabled) {
        // Allow deselecting to 0, but default to 1 if it was 1
        const newValue = value === rating ? 0 : rating
        onChange(newValue)
      }
    },
    [value, onChange, disabled]
  )

  const stars = useMemo(() => Array.from({ length: maxRating }, (_, i) => i + 1), [
    maxRating
  ])

  const ratingText = getRatingLabel(value)

  return (
    <div
      className={`${styles.container} ${disabled ? styles.disabled : ''}`}
      role="group"
      aria-label="Product rating"
    >
      <div className={styles.stars}>
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            className={`${styles.star} ${star <= (hoverValue || value) ? styles.filled : ''}`}
            onClick={(): void => handleStarClick(star)}
            onMouseEnter={(): void => setHoverValue(star)}
            onMouseLeave={(): void => setHoverValue(0)}
            disabled={disabled}
            aria-label={`Rate ${star} out of ${maxRating}`}
            aria-pressed={star <= value}
          >
            <StarIcon />
          </button>
        ))}
      </div>
      {ratingText && <span className={styles.ratingText}>{ratingText}</span>}
    </div>
  )
}

export default React.memo(StarRating)
