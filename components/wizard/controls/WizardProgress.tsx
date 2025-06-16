'use client'

import React, { useMemo } from 'react'
import styles from './WizardProgress.module.css'

export interface WizardStep {
  id: number
  title: string
  isValid?: boolean
  isComplete?: boolean
}

interface WizardProgressProps {
  steps: WizardStep[]
  currentStepId: number
  onStepClick?: (stepId: number) => void
  allowNavigation?: boolean
}

/**
 * A component that visualizes progress through a multi-step wizard
 * Shows completed, current, and remaining steps with validation status
 */
const WizardProgress = ({
  steps,
  currentStepId,
  onStepClick,
  allowNavigation = false
}: WizardProgressProps): JSX.Element => {
  // Calculate progress percentage for progress bar
  const progressPercentage = useMemo((): number => {
    const totalSteps = steps.length
    const currentStepIndex = steps.findIndex(step => step.id === currentStepId)
    
    // If we couldn't find the step or no steps, return 0
    if (currentStepIndex === -1 || totalSteps === 0) return 0
    
    // Calculate percentage based on current step (0-indexed)
    return ((currentStepIndex) / (totalSteps - 1)) * 100
  }, [steps, currentStepId])
  
  // Get step status (previous, current, upcoming)
  const getStepStatus = useMemo(() => {
    return (stepId: number): string => {
      if (stepId === currentStepId) return 'current'
      
      const currentIndex = steps.findIndex(step => step.id === currentStepId)
      const stepIndex = steps.findIndex(step => step.id === stepId)
      
      if (stepIndex < currentIndex) return 'completed'
      return 'upcoming'
    }
  }, [steps, currentStepId])

  // Handle step click
  const handleStepClick = (step: WizardStep): void => {
    // Only allow navigation if enabled AND step is completed or is the current step
    const status = getStepStatus(step.id)
    if (
      allowNavigation && 
      onStepClick && 
      (status === 'completed' || status === 'current')
    ) {
      onStepClick(step.id)
    }
  }

  return (
    <div className={styles.progressContainer}>
      {/* Visual progress bar */}
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Step indicators */}
      <div className={styles.stepsContainer}>
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          const isClickable = allowNavigation && (status === 'completed' || status === 'current')
          
          return (
            <div
              key={step.id}
              className={`
                ${styles.step} 
                ${styles[status]} 
                ${isClickable ? styles.clickable : ''}
                ${step.isValid === false ? styles.invalid : ''}
              `}
              onClick={(): void => handleStepClick(step)}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <div className={styles.stepIndicator}>
                {status === 'completed' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                  </svg>
                ) : (
                  <span className={styles.stepNumber}>{step.id}</span>
                )}
              </div>
              <div className={styles.stepTitle}>
                {step.title}
                {step.isValid === false && (
                  <span className={styles.invalidIndicator} aria-label="Invalid step">
                    !
                  </span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={styles.stepConnector} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Export with React.memo for performance optimization
export default React.memo(WizardProgress)
