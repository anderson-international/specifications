'use client'

import React from 'react'
import StarRating from './StarRating'
import RatingBoost from './RatingBoost'
import styles from './Ratings.module.css'

interface RatingsProps {
  starRating: number
  ratingBoost: number
  onStarRatingChange: (value: number) => void
  onRatingBoostChange: (value: number) => void
  disabled?: boolean
}

const Ratings = ({
  starRating,
  ratingBoost,
  onStarRatingChange,
  onRatingBoostChange,
  disabled = false
}: RatingsProps): JSX.Element => {
  return (
    <div className={styles.gridContainer}>
      <label className={styles.label}>Overall Rating</label>
      <StarRating
        value={starRating}
        onChange={onStarRatingChange}
        disabled={disabled}
      />

      <label className={styles.label}>Rating Boost</label>
      <RatingBoost
        value={ratingBoost}
        onChange={onRatingBoostChange}
        disabled={disabled || starRating === 5}
      />
    </div>
  )
}

export default React.memo(Ratings)
