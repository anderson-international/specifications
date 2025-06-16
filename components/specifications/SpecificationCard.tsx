'use client'

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { useSwipeNavigation } from '../wizard/hooks/useSwipeNavigation'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import { formatLastModified, getStatusColor, getStatusLabel } from '../../lib/utils/specificationCardUtils'
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
  onDuplicate
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
    setShowActions(prev => !prev)
  }, [])

  // Swipe actions - only for draft items
  const { swipeHandlers, swipeState } = useSwipeNavigation({
    onSwipeLeft: specification.status === 'draft' ? handleDelete : undefined,
    onSwipeRight: specification.status === 'draft' ? handleEdit : undefined,
    threshold: 60,
    preventScroll: true
  })

  const cardStyle = specification.status === 'draft' ? {
    transform: `translateX(${swipeState.offset}px)`
  } : undefined

  const cardClasses = [
    styles.card,
    specification.status === 'draft' ? styles.swipeable : '',
    swipeState.isDragging ? styles.dragging : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.container}>
      {/* Swipe action indicators for drafts */}
      {specification.status === 'draft' && (
        <>
          <div className={`${styles.swipeAction} ${styles.left} ${swipeState.offset > 60 ? styles.active : ''}`}>
            <span>✏️ Edit</span>
          </div>
          <div className={`${styles.swipeAction} ${styles.right} ${swipeState.offset < -60 ? styles.active : ''}`}>
            <span>🗑️ Delete</span>
          </div>
        </>
      )}

      <div 
        className={cardClasses}
        style={cardStyle}
        {...(specification.status === 'draft' ? swipeHandlers : {})}
      >
        <div className={styles.imageContainer}>
          <Image
            src={specification.product.imageUrl || '/placeholder-product.jpg'}
            alt={specification.product.title}
            width={80}
            height={80}
            className={styles.productImage}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEQnupkHOSt1ZVvNunn9gLauxqimNB3nWx7oPJQBmr4/7mMvmtaTgQ/wCbdY8+9SQdYN8m/KrKZ8IVr9FzKFdHlM/VNx0AAPnc2KDiHJwf4qOc7TtB4cTf/9k="
          />
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.productName}>{specification.product.title}</h3>
            <div className={styles.brand}>{specification.product.brand}</div>
          </div>

          <div className={styles.meta}>
            <div 
              className={styles.status}
              style={{ backgroundColor: getStatusColor(specification.status) }}
            >
              {getStatusLabel(specification.status)}
            </div>
            <div className={styles.lastModified}>
              {formatLastModified(specification.lastModified)}
            </div>
          </div>

          {specification.status === 'draft' && (
            <div className={styles.progress}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${specification.progress}%` }}
                />
              </div>
              <span className={styles.progressText}>
                {specification.progress}% complete
              </span>
            </div>
          )}

          {(specification.status === 'approved' || specification.status === 'published') && specification.score && (
            <div className={styles.score}>
              <span className={styles.scoreLabel}>Score:</span>
              <span className={styles.scoreValue}>{specification.score}/5</span>
            </div>
          )}
        </div>

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
