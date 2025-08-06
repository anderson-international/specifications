import { useState, useCallback } from 'react'

interface UseDraftNavigationProps {
  onStepClick: (stepIndex: number) => void
}

interface UseDraftNavigationReturn {
  draftRecoveryStep: number | null
  handleDraftRecovered: (step: number) => void
}

export function useDraftNavigation({ onStepClick }: UseDraftNavigationProps): UseDraftNavigationReturn {
  const [draftRecoveryStep, setDraftRecoveryStep] = useState<number | null>(null)

  const handleDraftRecovered = useCallback((step: number) => {
    setDraftRecoveryStep(step)
    onStepClick(step - 1)
  }, [onStepClick])

  return {
    draftRecoveryStep,
    handleDraftRecovered,
  }
}
