'use client'

import { useState, useCallback } from 'react'

export interface UseWizardNavigationReturn {
  activeStep: number
  completedSteps: Set<number>
  handleNext: () => void
  handlePrevious: () => void
  handleStepClick: (stepIndex: number) => void
  canNavigateToStep: (stepIndex: number) => boolean
}

/**
 * Hook for managing wizard step navigation and validation
 * Extracted from useSpecificationWizard to comply with file size limits
 */
export const useWizardNavigation = (initialStep: number = 0): UseWizardNavigationReturn => {
  const [activeStep, setActiveStep] = useState<number>(initialStep)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const handleNext = useCallback(() => {
    setActiveStep((prev) => {
      const nextStep = Math.min(prev + 1, 4)
      // Mark current step as completed when moving forward
      setCompletedSteps((completed) => new Set(completed).add(prev))
      return nextStep
    })
  }, [])

  const handlePrevious = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }, [])

  // Hybrid navigation: allow backward jumps only, forward gated by validation
  const handleStepClick = useCallback(
    (stepIndex: number) => {
      const targetStep = stepIndex - 1
      const canNavigate = targetStep <= activeStep || completedSteps.has(targetStep)

      if (canNavigate) {
        setActiveStep(targetStep)
      }
    },
    [activeStep, completedSteps]
  )

  // Check if user can navigate to a specific step
  const canNavigateToStep = useCallback(
    (stepIndex: number) => {
      const targetStep = stepIndex - 1
      return targetStep <= activeStep || completedSteps.has(targetStep)
    },
    [activeStep, completedSteps]
  )

  return {
    activeStep,
    completedSteps,
    handleNext,
    handlePrevious,
    handleStepClick,
    canNavigateToStep,
  }
}
