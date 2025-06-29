'use client'

import React, { useMemo } from 'react'
import { FormProvider } from 'react-hook-form'
import { Specification } from '@/lib/schemas/specification'
import WizardProgress from './controls/WizardProgress'
import { useSpecificationWizard } from './hooks/useSpecificationWizard'
import { useStepValidation } from './hooks/useStepValidation'
import { createWizardSteps } from './constants/wizardSteps'
import styles from './SpecificationWizard.module.css'

interface SpecificationWizardProps {
  onSubmit: (data: Specification) => void | Promise<void>
  initialData?: Record<string, unknown>
  userId: string
}

/**
 * Main wizard component for creating a specification
 */
const SpecificationWizard = ({
  onSubmit,
  initialData = {},
  userId
}: SpecificationWizardProps): JSX.Element => {
  const {
    methods,
    activeStep,
    isSubmitting,
    isSavingDraft,
    handleNext,
    handlePrevious,
    handleStepClick,
    handleFormSubmit,
    saveDraft
  } = useSpecificationWizard({ onSubmit, initialData, userId })

  const steps = useMemo(() => createWizardSteps(), [])
  const currentStep = steps[activeStep]
  const totalSteps = steps.length

  const isCurrentStepValid = useStepValidation({
    currentStepId: currentStep.id,
    methods
  })



  return (
    <FormProvider {...methods}>
      <div className={styles.wizardContainer}>
        <div className={styles.progress}>
          <WizardProgress
            steps={steps.map((step, index) => ({
              id: index + 1,
              title: step.title
            }))}
            currentStepId={activeStep + 1}
            onStepClick={handleStepClick}
            allowNavigation={true}
          />
        </div>

        <form onSubmit={methods.handleSubmit(handleFormSubmit)} className={styles.form}>
          <div className={styles.stepContent}>
            {currentStep.component(
              activeStep + 1,
              totalSteps,
              isSubmitting,
              handleNext
            )}
          </div>

          {activeStep > 0 && (
            <div className={styles.wizardFooter}>
              <button
                type="button"
                onClick={saveDraft}
                className={styles.draftButton}
                disabled={isSubmitting || isSavingDraft}
              >
                {isSavingDraft ? 'Saving...' : 'Save Draft'}
              </button>
              
              <div className={styles.navigationButtons}>
                {activeStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className={styles.backButton}
                    disabled={isSubmitting || isSavingDraft}
                  >
                    Back
                  </button>
                )}
                {activeStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className={styles.nextButton}
                    disabled={isSubmitting || isSavingDraft || !isCurrentStepValid}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting || isSavingDraft || !isCurrentStepValid}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </FormProvider>
  )
}

export default React.memo(SpecificationWizard)
