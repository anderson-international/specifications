'use client'

import React, { useState, useCallback } from 'react'

export interface UseWizardNavigationReturn {
  activeStep: number
  completedSteps: Set<number>
  handleNext: (e: React.MouseEvent<HTMLButtonElement>) => void
  handlePrevious: () => void
  handleStepClick: (stepIndex: number) => void
  canNavigateToStep: (stepIndex: number) => boolean
}

export const useWizardNavigation = (initialStep: number = 0): UseWizardNavigationReturn => {
  const isEditMode = initialStep > 0
  const [activeStep, setActiveStep] = useState<number>(initialStep)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const handleNext = useCallback((e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault?.()
    setActiveStep((prev) => {
      const nextStep = Math.min(prev + 1, 3)
      setCompletedSteps((completed) => new Set(completed).add(prev))
      return nextStep
    })
  }, [])

  const handlePrevious = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const handleStepClick = useCallback(
    (stepIndex: number) => {
      const targetStep = stepIndex - 1
      
      if (isEditMode && targetStep === 0) {
        return
      }
      
      const canNavigate = targetStep <= activeStep || completedSteps.has(targetStep)

      if (canNavigate) {
        setActiveStep(targetStep)
      }
    },
    [activeStep, completedSteps, isEditMode]
  )

  const canNavigateToStep = useCallback(
    (stepIndex: number) => {
      const targetStep = stepIndex - 1
      
      if (isEditMode && targetStep === 0) {
        return false
      }
      
      return targetStep <= activeStep || completedSteps.has(targetStep)
    },
    [activeStep, completedSteps, isEditMode]
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
