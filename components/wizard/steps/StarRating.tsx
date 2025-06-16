'use client'

import React, { useCallback, useMemo } from 'react'
import styles from './StarRating.module.css'

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  maxRating?: number
}

/**
 * Star rating component with hover effect and accessibility support
 */
const StarRating = ({
  value,
  onChange,
  disabled = false,
  maxRating = 5
}: StarRatingProps): JSX.Element => {
  // Generate stars array based on maxRating
  const stars = useMemo(() => {
    return Array.from({ length: maxRating }, (_, i) => i + 1)
  }, [maxRating])
  
  // Handle star click
  const handleStarClick = useCallback((rating: number): void => {
    if (disabled) return
    // If clicking the same star twice, clear the rating
    onChange(value === rating ? 0 : rating)
  }, [onChange, value, disabled])
  
  // Get appropriate label for aria-label based on star value
  const getRatingLabel = useCallback((starValue: number): string => {
    const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
    return starValue <= labels.length ? labels[starValue - 1] : `${starValue} out of ${maxRating}`
  }, [maxRating])

  return (
    <div className={styles.container} role="group" aria-label="Product rating">
      <div className={`${styles.stars} ${disabled ? styles.disabled : ''}`}>
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            className={`${styles.star} ${star <= value ? styles.filled : ''}`}
            onClick={(): void => handleStarClick(star)}
            disabled={disabled}
            aria-label={`${getRatingLabel(star)}, ${star} out of ${maxRating} stars`}
            aria-pressed={star <= value}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24"
              height="24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </button>
        ))}
      </div>
      
      {value > 0 && (
        <div className={styles.ratingText} aria-live="polite">
          {getRatingLabel(value)}
        </div>
      )}
    </div>
  )
}

// Export with React.memo for performance optimization
export default React.memo(StarRating)
