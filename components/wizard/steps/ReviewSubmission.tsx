'use client'

import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import Ratings from './Ratings'
import styles from './ReviewSubmission.module.css'

interface ReviewSubmissionProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
}

interface ReviewSubmissionFormData {
  review: string
  star_rating: number
  rating_boost: number
}

/**
 * Step 5: Review submission with text review and star rating
 */
const ReviewSubmission = ({
  stepNumber,
  totalSteps,
  disabled = false
}: ReviewSubmissionProps): JSX.Element => {
  const { 
    watch, 
    setValue, 
    register
  } = useFormContext<ReviewSubmissionFormData>()
  
  // Watch form values - Optimized with single watch call
  const {
    review = '',
    star_rating: starRating = 2,
    rating_boost: ratingBoost = 0
  } = watch()
  
  return (
    <WizardStepCard
      title="Write Your Review"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      disabled={disabled}
    >
      <Ratings
        starRating={watch('star_rating')}
        ratingBoost={watch('rating_boost')}
        onStarRatingChange={(value): void => {
          setValue('star_rating', value, { shouldValidate: true })
          if (value === 5) {
            setValue('rating_boost', 0, { shouldValidate: true })
          }
        }}
        onRatingBoostChange={(value): void => {
          setValue('rating_boost', value, { shouldValidate: true })
        }}
      />

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="review-text">
          Your Review
        </label>
        <textarea
          id="review-text"
          className={styles.textarea}
          value={review}
          onChange={(e): void => setValue('review', e.target.value)}
          placeholder="Write your detailed review here... (minimum 150 characters)"
          rows={5}
          maxLength={2000}
          disabled={disabled}
        />
        <div 
          className={`${styles.charCount} ${review.length < 150 ? styles.error : ''}`}
        >
          {review.length}/150
        </div>
      </div>
    </WizardStepCard>
  )
}

export default React.memo(ReviewSubmission)
