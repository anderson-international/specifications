'use client'

import React, { useCallback } from 'react'
import { WizardDraft, formatDraftAge } from '@/lib/utils/draft-storage'
import { Product } from '@/lib/types/product'
import SelectedProductSummary from '../steps/SelectedProductSummary'
import styles from './DraftRecoveryModal.module.css'

interface DraftRecoveryModalProps {
  draft: WizardDraft
  selectedProduct?: Product | null
  productTitle?: string
  onRecover: (draft: WizardDraft) => void
  onStartFresh: () => void
}

const DraftRecoveryModal = ({
  draft,
  selectedProduct,
  productTitle,
  onRecover,
  onStartFresh,
}: DraftRecoveryModalProps): JSX.Element => {
  const handleRecover = useCallback((): void => {
    onRecover(draft)
  }, [draft, onRecover])

  const handleStartFresh = useCallback((): void => {
    onStartFresh()
  }, [onStartFresh])

  const handleKeyDown = useCallback((e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleRecover()
    } else if (e.key === 'Escape') {
      handleStartFresh()
    }
  }, [handleRecover, handleStartFresh])

  const currentStepTitle: string = (() => {
    switch (draft.currentStep) {
      case 1: return 'Characteristics'
      case 2: return 'Tasting Profile'
      case 3: return 'Review & Submission'
      default: return `Step ${draft.currentStep}`
    }
  })()

  return (
    <div 
      className={styles.overlay}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
      aria-labelledby="draft-recovery-title"
      aria-describedby="draft-recovery-description"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 id="draft-recovery-title" className={styles.title}>
            Resume Previous Work?
          </h2>
        </div>

        <div className={styles.content}>
          {selectedProduct ? (
            <SelectedProductSummary product={selectedProduct} />
          ) : (
            <p id="draft-recovery-description" className={styles.description}>
              <strong>{productTitle || draft.productHandle}</strong>
            </p>
          )}
          
          <div className={styles.draftDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Last saved:</span>
              <span className={styles.detailValue}>{formatDraftAge(draft.lastSaved)}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Progress:</span>
              <span className={styles.detailValue}>{currentStepTitle}</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleStartFresh}
          >
            Start Fresh
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleRecover}
            autoFocus
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  )
}

export default DraftRecoveryModal
