'use client'

import React, { useCallback } from 'react'
import type { Specification } from '@/types/specification'
import styles from './SpecificationRow.module.css'

interface SpecificationRowProps {
  specification: Specification
  onClick: (id: string) => void
  isAI?: boolean
}

const SpecificationRowComponent = ({
  specification,
  onClick,
  isAI = false,
}: SpecificationRowProps): JSX.Element => {
  const handleClick = useCallback(() => {
    onClick(specification.id)
  }, [onClick, specification.id])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleClick()
      }
    },
    [handleClick]
  )

  return (
    <div
      className={styles.specificationRow}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${isAI ? 'View' : 'Edit'} specification for ${specification.product?.title || specification.shopify_handle}`}
    >
      <div className={styles.specificationInfo}>
        <h3 className={styles.title}>
          {specification.product?.title || specification.shopify_handle}
        </h3>
        <p className={styles.brand}>
          {specification.product?.brand || 'Unknown Brand'}
        </p>
        {specification.star_rating && (
          <div className={styles.rating}>
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={i < specification.star_rating ? styles.starFilled : styles.starEmpty}
                aria-hidden="true"
              >
                {i < specification.star_rating ? '●' : '○'}
              </span>
            ))}
            <span className={styles.ratingText}>({specification.star_rating}/5)</span>
          </div>
        )}
      </div>

      <div className={styles.editButton}>
        {isAI ? 'View' : 'Edit'}
      </div>
    </div>
  )
}

export const SpecificationRow = React.memo(SpecificationRowComponent)
export default React.memo(SpecificationRowComponent)
