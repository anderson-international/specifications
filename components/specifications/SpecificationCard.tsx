'use client'

import React, { useCallback } from 'react'
import { SpecificationCardContent } from './SpecificationCardContent'
import styles from './SpecificationCard.module.css'
import { Specification } from '@/types/specification'

interface SpecificationCardProps {
  specification: Specification
  onEdit: (id: string) => void
}

export const SpecificationCard = React.memo(function SpecificationCard({
  specification,
  onEdit,
}: SpecificationCardProps): JSX.Element {
  const handleEdit = useCallback((): void => {
    onEdit(specification.id)
  }, [onEdit, specification.id])

  const cardClasses = [
    styles.card,
    specification.status === 'needs_revision' ? styles.needsRevision : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.container}>
      <div className={cardClasses}>
        {specification.status === 'needs_revision' && (
          <div className={styles.statusIndicator}>
            <span className={styles.statusLabel}>Needs Revision</span>
          </div>
        )}
        
        <SpecificationCardContent specification={specification} />

        <div className={styles.actions}>
          <button
            onClick={handleEdit}
            className={styles.editButton}
            type="button"
            aria-label="Edit specification"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
})
