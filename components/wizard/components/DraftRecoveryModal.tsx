'use client'

import React from 'react'
import { WizardDraft } from '@/lib/utils/draft-storage'
import { Product } from '@/lib/types/product'
import SelectedProductSummary from '../steps/SelectedProductSummary'
import DraftRestoreModal from '@/components/shared/DraftRestoreModal'

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
  const currentStepTitle: string = (() => {
    switch (draft.currentStep) {
      case 1: return 'Characteristics'
      case 2: return 'Tasting Profile'
      case 3: return 'Review & Submission'
      default: return `Step ${draft.currentStep}`
    }
  })()

  const descriptionNode = selectedProduct
    ? <SelectedProductSummary product={selectedProduct} />
    : <strong>{productTitle || draft.productHandle}</strong>

  return (
    <DraftRestoreModal
      title="Resume Previous Work?"
      description={descriptionNode}
      lastSaved={draft.lastSaved}
      progressLabel={currentStepTitle}
      onRecover={() => onRecover(draft)}
      onStartFresh={onStartFresh}
    />
  )
}

export default DraftRecoveryModal
