'use client'

import React from 'react'
import { UseFormRegister, FieldError } from 'react-hook-form'
import { ReviewRating as ReviewRatingType } from '@/lib/schemas/specification'
import styles from './ReviewRating.module.css'

interface ReviewTextAreaProps {
  register: UseFormRegister<ReviewRatingType>
  value: string
  error?: FieldError
}

export const ReviewTextArea = React.memo(function ReviewTextArea({ register, value, error }: ReviewTextAreaProps): JSX.Element {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Your Review</h3>
      <p className={styles.sectionDesc}>
        Share your thoughts and experience with this product
      </p>
      <textarea
        {...register('reviewText')}
        placeholder="Describe your experience, what you liked or didn't like, any notable characteristics..."
        className={styles.textarea}
        rows={6}
      />
      <div className={styles.characterCount}>
        {value.length} characters
      </div>
      {error && (
        <div className={styles.error}>{error.message}</div>
      )}
    </div>
  )
})
