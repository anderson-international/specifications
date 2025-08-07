'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WizardFormData } from '../types/wizard.types'
import { WizardDraft, loadDraft, deleteDraft } from '@/lib/utils/draft-storage'
import { Product } from '@/lib/types/product'
import DraftRecoveryModal from './DraftRecoveryModal'

interface DraftManagerProps {
  userId: string
  productHandle: string | null
  methods: UseFormReturn<WizardFormData>
  isEditMode: boolean
  selectedProduct?: Product | null
  onDraftRecovered?: (step: number) => void
  children: React.ReactNode
}

const DraftManager = ({
  userId,
  productHandle,
  methods,
  isEditMode,
  selectedProduct,
  onDraftRecovered,
  children,
}: DraftManagerProps): JSX.Element => {
  const [draftToRecover, setDraftToRecover] = useState<WizardDraft | null>(null)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    if (isEditMode || !productHandle || !userId) {
      return
    }

    const existingDraft = loadDraft(userId, productHandle)
    if (existingDraft) {

      setDraftToRecover(existingDraft)
      setShowRecoveryModal(true)
    } else {

      setDraftToRecover(null)
      setShowRecoveryModal(false)
    }
    setIsChecked(true)
  }, [userId, productHandle, isEditMode, isChecked])

  const handleRecoverDraft = useCallback((draft: WizardDraft) => {
    try {
      Object.entries(draft.formData).forEach(([key, value]) => {
        methods.setValue(key as keyof WizardFormData, value as WizardFormData[keyof WizardFormData])
      })
      if (onDraftRecovered) {
        onDraftRecovered(draft.currentStep)
      }
    } catch (_error) {
      throw new Error(`Draft recovery failed: ${_error instanceof Error ? _error.message : 'Unknown error'}`)
    }

    setShowRecoveryModal(false)
    setDraftToRecover(null)
  }, [methods, onDraftRecovered])

  const handleStartFresh = useCallback(() => {
    if (draftToRecover && productHandle) {
      deleteDraft(userId, productHandle)
    }
    
    setShowRecoveryModal(false)
    setDraftToRecover(null)
  }, [draftToRecover, userId, productHandle])

  const getProductTitle = useCallback((): string => {
    if (!draftToRecover) {
      throw new Error('DraftManager: getProductTitle called without draftToRecover - invalid component state')
    }

    if (selectedProduct?.title) {
      return selectedProduct.title
    }

    const draftProductTitle = draftToRecover.formData.product_title as string | undefined
    if (draftProductTitle) return draftProductTitle

    if (draftToRecover.productHandle) {

      return draftToRecover.productHandle
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
    
    throw new Error('DraftManager: draft has no product title, selectedProduct, or productHandle - corrupted draft data')
  }, [draftToRecover, selectedProduct])

  return (
    <>
      {children}
      
      {showRecoveryModal && draftToRecover && (
        <DraftRecoveryModal
          draft={draftToRecover}
          selectedProduct={selectedProduct}
          productTitle={getProductTitle()}
          onRecover={handleRecoverDraft}
          onStartFresh={handleStartFresh}
        />
      )}
    </>
  )
}

export default DraftManager
