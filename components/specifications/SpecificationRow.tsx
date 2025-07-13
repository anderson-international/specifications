'use client'

import React, { useCallback } from 'react'
import type { Specification } from '@/types/specification'
import styles from './SpecificationRow.module.css'

interface SpecificationRowProps {
  specification: Specification
  onEdit: (id: string) => void
}

const SpecificationRowComponent = ({
  specification,
  onEdit,
}: SpecificationRowProps): JSX.Element => {
  const handleEdit = useCallback(() => {
    onEdit(specification.id)
  }, [onEdit, specification.id])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleEdit()
      }
    },
    [handleEdit]
  )

  return (
    <div
      className={styles.specificationRow}
      onClick={handleEdit}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Edit specification for ${specification.product?.title || specification.shopify_handle}`}
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
            {'★'.repeat(specification.star_rating)}{'☆'.repeat(5 - specification.star_rating)}
          </div>
        )}
      </div>

      <div className={styles.editButton}>
        Edit
      </div>
    </div>
  )
}

export const SpecificationRow = React.memo(SpecificationRowComponent)
export default React.memo(SpecificationRowComponent)
