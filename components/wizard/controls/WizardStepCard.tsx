'use client'

import React, { ReactNode } from 'react'
import styles from './WizardStepCard.module.css'

interface WizardStepCardProps {
  title: string
  children: ReactNode
  stepNumber: number
  totalSteps: number
  isValid?: boolean
}

/**
 * A card layout wrapper for wizard step content
 * Provides consistent styling and header/footer for all steps
 */
const WizardStepCard = ({
  title,
  children,
  stepNumber,
  totalSteps,
  isValid = true
}: WizardStepCardProps): JSX.Element => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.stepIndicator}>
          Step {stepNumber} of {totalSteps}
          {!isValid && (
            <span className={styles.invalidIndicator} aria-label="Invalid step">
              !
            </span>
          )}
        </div>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}

// Export with React.memo for performance optimization
export default React.memo(WizardStepCard)
