'use client'

import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ReviewRating as ReviewRatingType, reviewRatingSchema } from '@/lib/schemas/specification'
import { StarRating } from './StarRating'
import { RatingBoost } from './RatingBoost'
import { ReviewTextArea } from './ReviewTextArea'
import styles from './ReviewRating.module.css'

interface ReviewRatingProps {
  initialData?: Partial<ReviewRatingType>
  onComplete: (data: ReviewRatingType) => void
  onPrev: () => void
}

export function ReviewRating({
  initialData,
  onComplete,
  onPrev
}: ReviewRatingProps): JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<ReviewRatingType>({
    resolver: zodResolver(reviewRatingSchema),
    defaultValues: initialData
  })

  const watchedOverallRating = watch('overallRating') || 0
  const watchedRatingBoost = watch('ratingBoost') || 0
  const watchedReviewText = watch('reviewText') || ''

  const handleRatingChange = useCallback((rating: number): void => {
    setValue('overallRating', rating)
  }, [setValue])

  const handleBoostChange = useCallback((boost: number): void => {
    setValue('ratingBoost', boost)
  }, [setValue])

  const onSubmit = useCallback((data: ReviewRatingType): void => {
    onComplete(data)
  }, [onComplete])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <ReviewTextArea
        register={register}
        value={watchedReviewText}
        error={errors.reviewText}
      />

      <StarRating
        value={watchedOverallRating}
        onChange={handleRatingChange}
        error={errors.overallRating?.message}
      />

      <RatingBoost
        value={watchedRatingBoost}
        baseRating={watchedOverallRating}
        onChange={handleBoostChange}
      />

      {/* Navigation */}
      <div className={styles.navigation}>
        <button
          type="button"
          onClick={onPrev}
          className={styles.prevButton}
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={styles.completeButton}
        >
          Complete Specification
        </button>
      </div>
    </form>
  )
}
