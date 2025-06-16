'use client'

import React, { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import StarRating from './StarRating'
import ValidationSummary, { ValidationError } from '../controls/ValidationSummary'
import styles from './ReviewRating.module.css'

interface ReviewRatingProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
}

interface ReviewRatingFormData {
  rating: number
  feedback: string
}

/**
 * Final step of the specification wizard for review and rating
 */
const ReviewRating = ({
  stepNumber,
  totalSteps,
  disabled = false
}: ReviewRatingProps): JSX.Element => {
  // Form context
  const { 
    watch, 
    setValue, 
    register,
    formState: { errors } 
  } = useFormContext<ReviewRatingFormData>()
  
  // Watch for form value changes
  const rating = watch('rating')
  const feedback = watch('feedback')
  
  // Character count
  const feedbackLength = useMemo(() => {
    return feedback?.length || 0
  }, [feedback])
  
  // Validation errors
  const validationErrors = useMemo((): ValidationError[] => {
    const errorList: ValidationError[] = []
    
    if (errors.rating) {
      errorList.push({
        fieldName: 'rating',
        message: errors.rating.message || 'Please provide a rating'
      })
    }
    
    return errorList
  }, [errors])

  // Handle rating change
  const handleRatingChange = useCallback((value: number): void => {
    setValue('rating', value, { shouldValidate: true })
  }, [setValue])

  // Check if the step is valid
  const isValid = useMemo((): boolean => {
    return !errors.rating
  }, [errors.rating])

  return (
    <WizardStepCard
      title="Review & Rating"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isValid={isValid}
    >
      <ValidationSummary errors={validationErrors} />
      
      <div className={styles.ratingSection}>
        <label className={styles.label}>
          How would you rate this product?
        </label>
        
        <div className={styles.ratingContainer}>
          <StarRating
            value={rating || 0}
            onChange={handleRatingChange}
            disabled={disabled}
            maxRating={5}
          />
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="feedback" className={styles.label}>
          Additional Feedback (optional)
        </label>
        
        <div className={styles.textareaContainer}>
          <textarea
            id="feedback"
            {...register('feedback')}
            className={styles.textarea}
            placeholder="Enter any additional notes or feedback about this product..."
            disabled={disabled}
            maxLength={500}
            rows={4}
          />
          
          <div className={styles.charCount}>
            <span className={feedbackLength > 400 ? styles.nearLimit : ''}>
              {feedbackLength}
            </span> / 500
          </div>
        </div>
      </div>
      
      <div className={styles.summaryBox}>
        <h3 className={styles.summaryTitle}>Submission Summary</h3>
        <p className={styles.summaryText}>
          You&apos;re about to complete your product specification. Once submitted, it will be reviewed 
          by the product team. You can still edit this specification after submission.
        </p>
      </div>
    </WizardStepCard>
  )
}

// Export with React.memo for performance optimization
export default React.memo(ReviewRating)
