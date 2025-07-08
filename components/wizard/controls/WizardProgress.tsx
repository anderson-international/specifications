'use client'

import React, { useMemo, useCallback } from 'react'
import WizardStepDisplay, { type WizardStep } from './WizardStepDisplay'
import styles from './WizardProgress.module.css'

interface WizardProgressProps {
  steps: WizardStep[]
  currentStepId: number
  onStepClick?: (stepId: number) => void
  allowNavigation?: boolean
  canNavigateToStep?: (stepId: number) => boolean
}

/**
 * A component that visualizes progress through a multi-step wizard
 * Shows completed, current, and remaining steps with validation status
 */
const WizardProgressComponent = ({
  steps,
  currentStepId,
  onStepClick,
  allowNavigation = false,
  canNavigateToStep,
}: WizardProgressProps): JSX.Element => {
  // Calculate progress percentage for progress bar
  const progressPercentage = useMemo((): number => {
    const totalSteps = steps.length
    const currentStepIndex = steps.findIndex((step) => step.id === currentStepId)

    // If we couldn't find the step or no steps, return 0
    if (currentStepIndex === -1 || totalSteps === 0) return 0

    // Calculate percentage based on current step (0-indexed)
    return (currentStepIndex / (totalSteps - 1)) * 100
  }, [steps, currentStepId])

  const progressStyle = useMemo(
    () =>
      ({
        '--progress-width': `${progressPercentage}%`,
      }) as React.CSSProperties,
    [progressPercentage]
  )

  const getStepStatus = useCallback(
    (stepId: number): string => {
      if (stepId === currentStepId) return 'current'

      const currentIndex = steps.findIndex((step) => step.id === currentStepId)
      const stepIndex = steps.findIndex((step) => step.id === stepId)

      if (stepIndex < 0 || currentIndex < 0) return 'upcoming'
      return stepIndex < currentIndex ? 'completed' : 'upcoming'
    },
    [steps, currentStepId]
  )

  // Handle step click with hybrid navigation support
  const handleStepClick = useCallback(
    (step: WizardStep): void => {
      if (allowNavigation && onStepClick) {
        // Use canNavigateToStep if provided, otherwise fallback to status-based logic
        const canNavigate = canNavigateToStep
          ? canNavigateToStep(step.id)
          : getStepStatus(step.id) === 'completed' || getStepStatus(step.id) === 'current'

        if (canNavigate) {
          onStepClick(step.id)
        }
      }
    },
    [allowNavigation, onStepClick, canNavigateToStep, getStepStatus]
  )

  return (
    <div className={styles.progressContainer}>
      {/* Visual progress bar */}
      <div className={styles.progressBar} style={progressStyle}>
        <div className={styles.progressFill} />
      </div>

      {/* Step indicators */}
      <div className={styles.stepsContainer}>
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          const isClickable =
            allowNavigation &&
            (canNavigateToStep
              ? canNavigateToStep(step.id)
              : status === 'completed' || status === 'current')

          return (
            <React.Fragment key={step.id}>
              <WizardStepDisplay
                step={step}
                status={status}
                isClickable={isClickable}
                onClick={handleStepClick}
              />
              {index < steps.length - 1 && <div className={styles.stepConnector} />}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

// Export with React.memo for performance optimization
const WizardProgress = React.memo(WizardProgressComponent)
WizardProgress.displayName = 'WizardProgress'
export default WizardProgress
