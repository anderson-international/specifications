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

  const handleDraftRecovered = useCallback((step: number): void => {
    setDraftRecoveryStep(step)
    onStepClick(step)
  }, [onStepClick])

  return {
    draftRecoveryStep,
    handleDraftRecovered,
  }
}
