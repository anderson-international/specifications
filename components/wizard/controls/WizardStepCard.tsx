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

const WizardStepCard = ({
  title,
  children,
  stepNumber: _stepNumber,
  totalSteps: _totalSteps,
  isValid: _isValid = true,
}: WizardStepCardProps): JSX.Element => {
  return (
    <div className={styles.card} aria-label={title}>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
export default React.memo(WizardStepCard)
