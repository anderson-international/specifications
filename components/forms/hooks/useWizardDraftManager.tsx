'use client'

import { useState, useCallback, useEffect } from 'react'
import { SpecificationFormData } from '@/lib/schemas/specification'
import { useDraftManager } from '../DraftManager'
import { hasDraft } from '@/lib/utils/draftStorage'

interface UseWizardDraftManagerProps {
  productId?: string
  setFormData: (data: Partial<SpecificationFormData>) => void
  setCurrentStep: (step: number) => void
}

interface UseWizardDraftManagerReturn {
  isLoading: boolean
  showDraftPrompt: boolean
  setShowDraftPrompt: (show: boolean) => void
  handleLoadDraft: (data: Partial<SpecificationFormData>) => void
  handleDiscardDraft: () => void
  saveDraft: (data: Partial<SpecificationFormData>) => void
  clearDraft: () => void
}

const STEPS_COUNT = 5

export function useWizardDraftManager({ 
  productId, 
  setFormData, 
  setCurrentStep 
}: UseWizardDraftManagerProps): UseWizardDraftManagerReturn {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showDraftPrompt, setShowDraftPrompt] = useState<boolean>(false)
  
  const { saveDraft, clearDraft } = useDraftManager(productId)

  // Load draft on mount
  useEffect((): void => {
    if (hasDraft(productId)) {
      setShowDraftPrompt(true)
    }
    setIsLoading(false)
  }, [productId])

  const handleLoadDraft = useCallback((data: Partial<SpecificationFormData>): void => {
    setFormData(data)
    const completedSteps = Object.keys(data).length
    setCurrentStep(Math.min(completedSteps + 1, STEPS_COUNT))
  }, [setFormData, setCurrentStep])

  const handleDiscardDraft = useCallback((): void => {
    setFormData({})
    setCurrentStep(1)
  }, [setFormData, setCurrentStep])

  return {
    isLoading,
    showDraftPrompt,
    setShowDraftPrompt,
    handleLoadDraft,
    handleDiscardDraft,
    saveDraft,
    clearDraft
  }
}
