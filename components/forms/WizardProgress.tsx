'use client'

import React, { useMemo } from 'react'

import { getStepProgress, ValidationResult } from '@/lib/utils/stepValidation'
import { SpecificationFormData } from '@/lib/schemas/specification'
import styles from './WizardProgress.module.css'

interface Step {
  id: number
  title: string
  component: string
}

interface WizardProgressProps {
  currentStep: number
  totalSteps: number
  steps: Step[]
  formData: Partial<SpecificationFormData>
  stepValidation: Record<number, ValidationResult>
  validationErrors: string[]
  onStepClick?: (stepNumber: number) => void
}

export const WizardProgress = React.memo(function WizardProgress({
  currentStep,
  totalSteps,
  steps,
  formData,
  stepValidation,
  validationErrors,
  onStepClick
}: WizardProgressProps): JSX.Element {
  const overallProgress = useMemo((): number => {
    return Math.round((currentStep / totalSteps) * 100)
  }, [currentStep, totalSteps])

  const currentStepProgress = useMemo((): number => {
    return getStepProgress(currentStep, formData)
  }, [currentStep, formData])

  const currentStepData = useMemo(() => {
    return steps.find(step => step.id === currentStep)
  }, [steps, currentStep])

  return (
    <div className={styles.container}>
      {/* Main Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <span className={styles.progressText}>
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Step Progress */}
      <div className={styles.stepProgress}>
        <span className={styles.stepProgressText}>
          Step Progress: {currentStepProgress}%
        </span>
        <div className={styles.stepProgressBar}>
          <div 
            className={styles.stepProgressFill}
            style={{ width: `${currentStepProgress}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className={styles.stepIndicators}>
        {steps.map((step) => {
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep
          const hasErrors = stepValidation[step.id] && !stepValidation[step.id].isValid
          
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick?.(step.id)}
              className={`${styles.stepIndicator} ${
                isActive ? styles.stepActive : ''
              } ${isCompleted ? styles.stepCompleted : ''} ${
                hasErrors ? styles.stepError : ''
              }`}
              disabled={!onStepClick}
            >
              <span className={styles.stepNumber}>{step.id}</span>
              <span className={styles.stepTitle}>{step.title}</span>
            </button>
          )
        })}
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className={styles.validationErrors}>
          <div className={styles.errorIcon}>⚠️</div>
          <div className={styles.errorContent}>
            <h3 className={styles.errorTitle}>Please complete required fields:</h3>
            <ul className={styles.errorList}>
              {validationErrors.map((error, index) => (
                <li key={index} className={styles.errorItem}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Current Step Title */}
      {currentStepData && (
        <h2 className={styles.currentStepTitle}>{currentStepData.title}</h2>
      )}
    </div>
  )
})
