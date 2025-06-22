'use client'

import React, { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import StarRating from './StarRating'
import ValidationSummary, { ValidationError } from '../controls/ValidationSummary'
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
    register,
    formState: { errors } 
  } = useFormContext<ReviewSubmissionFormData>()
  
  // Watch form values - Optimized with single watch call
  const {
    review = '',
    star_rating: starRating = 0
  } = watch()
  
  // Validation errors - Use schema error messages when available
  const validationErrors = useMemo((): ValidationError[] => {
    const errorList: ValidationError[] = []
    
    if (errors.review) {
      errorList.push({
        fieldName: 'review',
        message: errors.review.message || 'Please write a review (minimum 10 characters)'
      })
    }
    
    if (errors.star_rating) {
      errorList.push({
        fieldName: 'star_rating',
        message: errors.star_rating.message || 'Please provide a star rating'
      })
    }
    
    return errorList
  }, [errors.review, errors.star_rating])
  
  const handleStarRatingChange = useCallback((rating: number): void => {
    setValue('star_rating', rating, { shouldValidate: true })
  }, [setValue])
  
  // Check if step is valid - Rely on form validation state
  const isValid = useMemo((): boolean => {
    return Boolean(
      review.trim().length >= 10 && 
      starRating > 0 &&
      !errors.review && 
      !errors.star_rating
    )
  }, [review, starRating, errors.review, errors.star_rating])

  return (
    <WizardStepCard
      title="Write Your Review"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isValid={isValid}
    >
      <ValidationSummary errors={validationErrors} />
      
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
