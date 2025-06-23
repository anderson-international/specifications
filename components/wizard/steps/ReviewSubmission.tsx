'use client'

import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import StarRating from './StarRating'
import styles from './ReviewSubmission.module.css'

interface ReviewSubmissionProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
}

interface ReviewSubmissionFormData {
  review: string
  star_rating: number
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
    star_rating: starRating = 0
  } = watch()
  
  const handleStarRatingChange = useCallback((rating: number): void => {
    setValue('star_rating', rating, { shouldValidate: true })
  }, [setValue])
  
  return (
    <WizardStepCard
      title="Write Your Review"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
    >
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="star-rating">
          Overall Rating
        </label>
        <p className={styles.description}>Rate your overall experience with this product</p>
        <StarRating
          value={starRating}
          onChange={handleStarRatingChange}
          disabled={disabled}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="review-text">
          Your Review
        </label>
        <p className={styles.description}>
          Share your thoughts, experiences, and recommendations about this product
        </p>
        <textarea
          id="review-text"
          className={styles.textarea}
          placeholder="Write your detailed review here... (minimum 10 characters)"
          disabled={disabled}
          rows={8}
          {...register('review')}
        />
        <div className={styles.characterCount}>
          {review.length}/2000 characters
        </div>
      </div>
    </WizardStepCard>
  )
}

export default React.memo(ReviewSubmission)
