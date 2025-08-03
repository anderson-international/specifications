'use client'

import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import Ratings from './Ratings'
import SelectedProductSummary from './SelectedProductSummary'
import { Product } from '@/lib/types/product'
import { SpecificationEnumData } from '@/types/enum'
import styles from './ReviewSubmission.module.css'

interface ReviewSubmissionProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
  selectedProduct?: Product | null
  enumData?: SpecificationEnumData
  enumsLoading?: boolean
}

interface ReviewSubmissionFormData {
  review: string
  star_rating: number
  rating_boost: number
}

const ReviewSubmission = ({
  stepNumber,
  totalSteps,
  disabled = false,
  selectedProduct,
  enumData: _enumData,
  enumsLoading: _enumsLoading,
}: ReviewSubmissionProps): JSX.Element => {
  const { watch, setValue } = useFormContext<ReviewSubmissionFormData>()

  const { review: reviewText = '', star_rating: starRating = 2, rating_boost: ratingBoost = 0 } = watch()

  const handleStarRatingChange = useCallback(
    (value: number) => {
      setValue('star_rating', value, { shouldValidate: true })
      if (value === 5) {
        setValue('rating_boost', 0, { shouldValidate: true })
      }
    },
    [setValue]
  )

  const handleRatingBoostChange = useCallback(
    (value: number) => {
      setValue('rating_boost', value, { shouldValidate: true })
    },
    [setValue]
  )

  const handleReviewChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue('review', e.target.value, { shouldValidate: true })
    },
    [setValue]
  )

  return (
    <WizardStepCard
      title="Review & Submit"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
    >
      {selectedProduct && <SelectedProductSummary product={selectedProduct} />}
      <Ratings
        starRating={starRating}
        ratingBoost={ratingBoost}
        onStarRatingChange={handleStarRatingChange}
        onRatingBoostChange={handleRatingBoostChange}
      />

      <div className={styles.formGroup}>
        <div className={styles.reviewHeader}>
          <label className={styles.label} htmlFor="review-text">
            Your Review
          </label>
          <span className={styles.mobileRatingText}>
            {starRating > 0 ? (
              starRating === 1 ? 'Poor' :
              starRating === 2 ? 'Fair' :
              starRating === 3 ? 'Good' :
              starRating === 4 ? 'Very Good' :
              'Excellent'
            ) : ''}
          </span>
        </div>
        <textarea
          id="review-text"
          className={styles.textarea}
          value={reviewText}
          onChange={handleReviewChange}
          placeholder="Write your detailed review here... (minimum 150 characters)"
          rows={5}
          disabled={disabled}
        />
        <div className={`${styles.charCount} ${reviewText.length < 150 ? styles.error : styles.success}`}>
          {reviewText.length < 150 
            ? `${reviewText.length} / 150 minimum required`
            : <>{reviewText.length} characters <span className={styles.checkmark}>✓</span></>
          }
        </div>
      </div>
    </WizardStepCard>
  )
}

export default React.memo(ReviewSubmission)
