'use client'

import React, { useState, useCallback } from 'react'
import { useSwipeNavigation } from '../wizard/hooks/useSwipeNavigation'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import { SpecificationCardContent } from './SpecificationCardContent'
import styles from './SpecificationCard.module.css'
import { Specification } from '@/types/specification'

interface SpecificationCardProps {
  specification: Specification
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

export const SpecificationCard = React.memo(function SpecificationCard({
  specification,
  onEdit,
  onDelete,
  onDuplicate,
}: SpecificationCardProps): JSX.Element {
  const [showActions, setShowActions] = useState<boolean>(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)

  const handleEdit = useCallback((): void => {
    onEdit(specification.id)
  }, [onEdit, specification.id])

  const handleDelete = useCallback((): void => {
    setShowDeleteConfirm(true)
  }, [])

  const handleConfirmDelete = useCallback((): void => {
    onDelete(specification.id)
    setShowDeleteConfirm(false)
  }, [onDelete, specification.id])

  const handleCancelDelete = useCallback((): void => {
    setShowDeleteConfirm(false)
  }, [])

  const handleDuplicate = useCallback((): void => {
    onDuplicate(specification.id)
    setShowActions(false)
  }, [onDuplicate, specification.id])

  const toggleActions = useCallback((): void => {
    setShowActions((prev) => !prev)
  }, [])

  // Swipe actions - only for draft items
  const { swipeHandlers, swipeState } = useSwipeNavigation({
    onSwipeLeft: specification.status === 'draft' ? handleDelete : undefined,
    onSwipeRight: specification.status === 'draft' ? handleEdit : undefined,
    threshold: 60,
    preventScroll: true,
  })

  const cardStyle =
    specification.status === 'draft'
      ? {
          transform: `translateX(${swipeState.offset}px)`,
        }
      : undefined

  const cardClasses = [
    styles.card,
    specification.status === 'draft' ? styles.swipeable : '',
    swipeState.isDragging ? styles.dragging : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.container}>
      {specification.status === 'draft' && (
        <>
          <div
            className={`${styles.swipeAction} ${styles.left} ${swipeState.offset > 60 ? styles.active : ''}`}
          >
            <span>✏️ Edit</span>
          </div>
          <div
            className={`${styles.swipeAction} ${styles.right} ${swipeState.offset < -60 ? styles.active : ''}`}
          >
            <span>🗑️ Delete</span>
          </div>
        </>
      )}

      <div
        className={cardClasses}
        style={cardStyle}
        {...(specification.status === 'draft' ? swipeHandlers : {})}
      >
        <SpecificationCardContent specification={specification} />

        <div className={styles.actions}>
          <button
            onClick={toggleActions}
            className={styles.actionButton}
            type="button"
            aria-label="More actions"
          >
            ⋮
          </button>

          {showActions && (
            <div className={styles.actionMenu}>
              {specification.status === 'draft' && (
                <button onClick={handleEdit} className={styles.menuItem} type="button">
                  Edit
                </button>
              )}
              <button onClick={handleDuplicate} className={styles.menuItem} type="button">
                Duplicate
              </button>
              {specification.status === 'draft' && (
                <button onClick={handleDelete} className={styles.menuItem} type="button">
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
})
