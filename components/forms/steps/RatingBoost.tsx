'use client'

import React, { useCallback } from 'react'
import styles from './ReviewRating.module.css'

interface RatingBoostProps {
  value: number
  baseRating: number
  onChange: (boost: number) => void
}

export const RatingBoost = React.memo(function RatingBoost({ value, baseRating, onChange }: RatingBoostProps): JSX.Element {
  const handleBoostClick = useCallback((boost: number): void => {
    onChange(boost)
  }, [onChange])

  const finalRating: number = Math.max(1, Math.min(5, baseRating + value))

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Rating Adjustment</h3>
      <p className={styles.sectionDesc}>
        Fine-tune your rating based on specific factors
      </p>
      
      <div className={styles.boostContainer}>
        <div className={styles.boostButtons}>
          {[-2, -1, 0, 1, 2].map((boost) => (
            <button
              key={boost}
              type="button"
              onClick={() => handleBoostClick(boost)}
              className={`${styles.boostButton} ${
                value === boost ? styles.boostSelected : ''
              }`}
            >
              {boost > 0 ? `+${boost}` : boost}
            </button>
          ))}
        </div>
        
        <div className={styles.finalRating}>
          <span className={styles.finalRatingLabel}>Final Rating:</span>
          <span className={styles.finalRatingValue}>
            {finalRating.toFixed(1)} ★
          </span>
        </div>
      </div>

      <div className={styles.boostHint}>
        <p>Use +/- adjustments for factors like:</p>
        <ul>
          <li><strong>Value:</strong> Great price point (+1) or overpriced (-1)</li>
          <li><strong>Availability:</strong> Easy to find (+1) or hard to get (-1)</li>
          <li><strong>Packaging:</strong> Excellent (+1) or poor (-1) presentation</li>
        </ul>
      </div>
    </div>
  )
})
