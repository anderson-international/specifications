'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WizardFormData } from '../types/wizard.types'
import { WizardDraft, loadDraft, deleteDraft } from '@/lib/utils/draft-storage'
import DraftRecoveryModal from './DraftRecoveryModal'

interface DraftManagerProps {
  userId: string
  productHandle: string | null
  methods: UseFormReturn<WizardFormData>
  isEditMode: boolean
  onDraftRecovered?: (step: number) => void
  children: React.ReactNode
}

const DraftManager = ({
  userId,
  productHandle,
  methods,
  isEditMode,
  onDraftRecovered,
  children,
}: DraftManagerProps): JSX.Element => {
  const [draftToRecover, setDraftToRecover] = useState<WizardDraft | null>(null)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  // Check for existing draft
  useEffect(() => {
    if (isEditMode || !productHandle || !userId) return

    try {
      const existingDraft = loadDraft(userId, productHandle)
      setDraftToRecover(existingDraft)
      setShowRecoveryModal(true)
    } catch (error) {
      // No draft exists or draft expired - continue without modal
    }
    setIsChecked(true)
  }, [userId, productHandle, isEditMode, isChecked])

  const handleRecoverDraft = useCallback((draft: WizardDraft) => {
    try {
      // Restore form data
      Object.entries(draft.formData).forEach(([key, value]) => {
        methods.setValue(key as keyof WizardFormData, value as any)
      })

      // Navigate to the saved step
      if (onDraftRecovered) {
        onDraftRecovered(draft.currentStep)
      }

      setShowRecoveryModal(false)
      setDraftToRecover(null)
    } catch (error) {
      throw new Error(`Draft recovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [methods, onDraftRecovered])

  const handleStartFresh = useCallback(() => {
    if (draftToRecover && productHandle) {
      // Delete the draft since user chose to start fresh
      deleteDraft(userId, productHandle)
    }
    
    setShowRecoveryModal(false)
    setDraftToRecover(null)
  }, [draftToRecover, userId, productHandle])

  // Get product title from form data for display
  const getProductTitle = useCallback((): string | undefined => {
    if (!draftToRecover) return undefined
    
    // Try to get product title from draft data
    const draftProductTitle = draftToRecover.formData.product_title as string | undefined
    if (draftProductTitle) return draftProductTitle
    
    // Fallback to handle
    return draftToRecover.productHandle
  }, [draftToRecover])

  return (
    <>
      {children}
      
      {showRecoveryModal && draftToRecover && (
        <DraftRecoveryModal
          draft={draftToRecover}
          productTitle={getProductTitle()}
          onRecover={handleRecoverDraft}
          onStartFresh={handleStartFresh}
        />
      )}
    </>
  )
}

export default DraftManager
