'use client'

import React, { useCallback } from 'react'
import Image from 'next/image'
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
      <div className={styles.imageWrapper}>
        {specification.product?.image_url ? (
          <Image
            src={specification.product.image_url}
            alt={specification.product.title || specification.shopify_handle}
            className={styles.productImage}
            width={40}
            height={40}
            priority={false}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>{(specification.product?.title || specification.shopify_handle).substring(0, 2).toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className={styles.specificationInfo}>
        <h3 className={styles.title}>
          {specification.product?.title || specification.shopify_handle}
        </h3>

        {specification.star_rating && (
          <div className={styles.rating}>
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={i < specification.star_rating ? styles.starFilled : styles.starEmpty}
                aria-hidden="true"
              >
                {i < specification.star_rating ? '★' : '☆'}
              </span>
            ))}
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
