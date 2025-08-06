'use client'

import React from 'react'
import styles from '../SpecificationWizard.module.css'

interface WizardNavigationFooterProps {
  activeStep: number
  totalSteps: number
  isSubmitting: boolean
  isCurrentStepValid: boolean
  onPrevious: () => void
  onNext: (e: React.MouseEvent<HTMLButtonElement>) => void
  autoSaveIndicator?: React.ReactNode
}

const WizardNavigationFooter = ({
  activeStep,
  totalSteps,
  isSubmitting,
  isCurrentStepValid,
  onPrevious,
  onNext,
  autoSaveIndicator,
}: WizardNavigationFooterProps): JSX.Element => {
  return (
    <div className={styles.wizardFooter}>
      <div className={styles.footerContent}>
        {autoSaveIndicator && (
          <div className={styles.autoSaveSection}>
            {autoSaveIndicator}
          </div>
        )}
        
        <div className={styles.navigationButtons}>
          {activeStep > 0 && (
            <button
              type="button"
              onClick={onPrevious}
              className={styles.backButton}
              disabled={isSubmitting}
              title="Previous Step"
            >
              ←
            </button>
          )}
          {activeStep < totalSteps - 1 ? (
            <button
              type="button"
              onClick={onNext}
              className={styles.nextButton}
              disabled={isSubmitting || !isCurrentStepValid}
              title="Next Step"
            >
              →
            </button>
          ) : (
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !isCurrentStepValid}
              title={isSubmitting ? 'Submitting...' : 'Submit'}
            >
              {isSubmitting ? '⏳' : '✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default React.memo(WizardNavigationFooter)
