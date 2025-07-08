'use client'

import React, { useCallback } from 'react'
import styles from './WizardProgress.module.css'

export interface WizardStep {
  id: number
  title: string
  isValid?: boolean
  isComplete?: boolean
}

interface WizardStepDisplayProps {
  step: WizardStep
  status: string
  isClickable: boolean
  onClick: (step: WizardStep) => void
}

const WizardStepDisplayComponent = ({
  step,
  status,
  isClickable,
  onClick,
}: WizardStepDisplayProps): JSX.Element => {
  const handleClick = useCallback(() => {
    if (isClickable) {
      onClick(step)
    }
  }, [step, isClickable, onClick])

  return (
    <div
      className={`${styles.step} ${styles[status]} ${isClickable ? styles.clickable : ''} ${
        step.isValid === false ? styles.invalid : ''
      }`}
      onClick={handleClick}
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
    </div>
  )
}

const WizardStepDisplay = React.memo(WizardStepDisplayComponent)
WizardStepDisplay.displayName = 'WizardStepDisplay'

export default WizardStepDisplay
