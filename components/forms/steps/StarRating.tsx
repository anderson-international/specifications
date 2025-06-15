'use client'

import React, { useCallback, useState } from 'react'
import styles from './ReviewRating.module.css'

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
  error?: string
}

export const StarRating = React.memo(function StarRating({ value, onChange, error }: StarRatingProps): JSX.Element {
  const [hoveredRating, setHoveredRating] = useState<number>(0)

  const handleStarClick = useCallback((rating: number): void => {
    onChange(rating)
  }, [onChange])

  const handleStarHover = useCallback((rating: number): void => {
    setHoveredRating(rating)
  }, [])

  const handleStarLeave = useCallback((): void => {
    setHoveredRating(0)
  }, [])

  const displayRating = hoveredRating || value

  const getRatingText = (rating: number): string => {
    if (rating === 0) return 'Not rated'
    if (rating === 1) return 'Poor'
    if (rating === 2) return 'Fair'
    if (rating === 3) return 'Good'
    if (rating === 4) return 'Very Good'
    return 'Excellent'
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Overall Rating</h3>
      <p className={styles.sectionDesc}>Rate your overall experience</p>
      
      <div className={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleStarLeave}
            className={`${styles.star} ${
              star <= displayRating ? styles.starFilled : ''
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <div className={styles.ratingLabels}>
        <span className={styles.ratingText}>
          {getRatingText(displayRating)}
        </span>
      </div>

      {error && (
        <div className={styles.error}>{error}</div>
      )}
    </div>
  )
})
