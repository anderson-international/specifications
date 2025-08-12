'use client'

import React, { useCallback } from 'react'
import { formatDraftAge } from '@/lib/utils/draft-types'
import styles from './DraftRestoreModal.module.css'

interface DraftRestoreModalProps {
  title: string
  description?: React.ReactNode
  lastSaved: string
  progressLabel?: string
  confirmLabel?: string
  cancelLabel?: string
  onRecover: () => void
  onStartFresh: () => void
}

const DraftRestoreModal = ({
  title,
  description,
  lastSaved,
  progressLabel,
  confirmLabel,
  cancelLabel,
  onRecover,
  onStartFresh,
}: DraftRestoreModalProps): JSX.Element => {
  const handleRecover = useCallback((): void => {
    onRecover()
  }, [onRecover])

  const handleStartFresh = useCallback((): void => {
    onStartFresh()
  }, [onStartFresh])

  const handleKeyDown = useCallback((e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') handleRecover()
    else if (e.key === 'Escape') handleStartFresh()
  }, [handleRecover, handleStartFresh])

  return (
    <div
      className={styles.overlay}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
      aria-labelledby="draft-restore-title"
      aria-describedby="draft-restore-description"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 id="draft-restore-title" className={styles.title}>{title}</h2>
        </div>

        <div className={styles.content}>
          {description ? (
            <div id="draft-restore-description" className={styles.description}>
              {description}
            </div>
          ) : null}

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Last saved:</span>
              <span className={styles.detailValue}>{formatDraftAge(lastSaved)}</span>
            </div>
            {progressLabel ? (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Progress:</span>
                <span className={styles.detailValue}>{progressLabel}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleStartFresh}
          >
            {cancelLabel ?? 'Start Fresh'}
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleRecover}
            autoFocus
          >
            {confirmLabel ?? 'Resume'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DraftRestoreModal
