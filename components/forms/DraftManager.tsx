'use client'

import { useCallback } from 'react'

import { SpecificationFormData } from '@/lib/schemas/specification'
import { saveDraft, loadDraft, clearDraft } from '@/lib/utils/draftStorage'
import styles from './DraftManager.module.css'

interface DraftManagerProps {
  productId?: string
  showPrompt: boolean
  onLoadDraft: (data: Partial<SpecificationFormData>) => void
  onDiscardDraft: () => void
  onClosePrompt: () => void
}

export function DraftManager({
  productId,
  showPrompt,
  onLoadDraft,
  onDiscardDraft,
  onClosePrompt
}: DraftManagerProps): JSX.Element | null {
  const handleLoadDraft = useCallback((): void => {
    const draft = loadDraft(productId)
    if (draft) {
      onLoadDraft(draft)
    }
    onClosePrompt()
  }, [productId, onLoadDraft, onClosePrompt])

  const handleDiscardDraft = useCallback((): void => {
    clearDraft()
    onDiscardDraft()
    onClosePrompt()
  }, [onDiscardDraft, onClosePrompt])

  if (!showPrompt) {
    return null
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Resume Draft?</h2>
        <p className={styles.modalText}>
          You have an unfinished specification. Would you like to continue where you left off?
        </p>
        <div className={styles.modalActions}>
          <button
            onClick={handleDiscardDraft}
            className={styles.modalButtonSecondary}
            type="button"
          >
            Start Fresh
          </button>
          <button
            onClick={handleLoadDraft}
            className={styles.modalButtonPrimary}
            type="button"
          >
            Resume Draft
          </button>
        </div>
      </div>
    </div>
  )
}

export function useDraftManager(productId?: string): {
  saveDraft: (data: Partial<SpecificationFormData>) => void
  clearDraft: () => void
} {
  const saveDraftData = useCallback((data: Partial<SpecificationFormData>): void => {
    saveDraft(data, productId)
  }, [productId])

  const clearDraftData = useCallback((): void => {
    clearDraft()
  }, [])

  return {
    saveDraft: saveDraftData,
    clearDraft: clearDraftData
  }
}
