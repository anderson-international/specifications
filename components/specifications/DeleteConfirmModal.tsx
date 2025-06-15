'use client'

import { useCallback } from 'react'
import styles from './DeleteConfirmModal.module.css'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmModal({
  isOpen,
  onConfirm,
  onCancel
}: DeleteConfirmModalProps): JSX.Element | null {
  const handleConfirm = useCallback((): void => {
    onConfirm()
  }, [onConfirm])

  const handleCancel = useCallback((): void => {
    onCancel()
  }, [onCancel])

  if (!isOpen) return null

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <p>Are you sure you want to delete this specification?</p>
        <div className={styles.modalActions}>
          <button 
            onClick={handleCancel} 
            className={styles.cancelButton} 
            type="button"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            className={styles.deleteButton} 
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
