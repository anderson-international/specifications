'use client'

import React, { useMemo } from 'react'
import { FormProvider } from 'react-hook-form'
import { Specification } from '@/lib/schemas/specification'
import WizardProgress from './controls/WizardProgress'
import ProductSelection from './steps/ProductSelection'
import { useSpecificationWizard } from './hooks/useSpecificationWizard'
import { createWizardSteps } from './constants/wizardSteps'
import styles from './SpecificationWizard.module.css'

interface SpecificationWizardProps {
  onSubmit: (data: Specification) => void | Promise<void>
  initialData?: Record<string, unknown>
}

/**
 * Main wizard component for creating a specification
 */
const SpecificationWizard = ({
  onSubmit,
  initialData = {}
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
  } = useSpecificationWizard({ onSubmit, initialData })

  const steps = useMemo(() => createWizardSteps(), [])
  const currentStep = steps[activeStep]
  const totalSteps = steps.length

  // Step validation for progress indicator
  const stepValidation = useMemo(() => {
    const formState = methods.formState
    return {
      product: !formState.errors.shopify_handle && !formState.errors.product_brand_id,
      characteristics: !formState.errors.product_type_id && !formState.errors.grind_id && !formState.errors.experience_level_id,
      experience: !formState.errors.nicotine_level_id && !formState.errors.moisture_level_id,
      tasting: !formState.errors.tasting_notes && !formState.errors.cures && !formState.errors.tobacco_types,
      review: !formState.errors.review && !formState.errors.star_rating
    }
  }, [methods.formState])

  const isCurrentStepValid = stepValidation[currentStep.id as keyof typeof stepValidation]

  return (
    <FormProvider {...methods}>
      <div className={styles.wizardContainer}>
        <div className={styles.progress}>
          <WizardProgress
            steps={steps.map((step, index) => ({
              id: index,
              title: step.title,
              isValid: stepValidation[step.id as keyof typeof stepValidation]
            }))}
            currentStepId={activeStep}
            onStepClick={handleStepClick}
            allowNavigation={true}
          />
        </div>

        <form onSubmit={methods.handleSubmit(handleFormSubmit)} className={styles.form}>
          <div className={styles.stepContent}>
            {activeStep === 0 ? (
              <ProductSelection 
                stepNumber={activeStep + 1} 
                totalSteps={totalSteps} 
                disabled={isSubmitting}
                onProductSelect={() => {
                  try {
                    handleNext()
                  } catch (error) {
                    console.error('Error advancing wizard step:', error)
                  }
                }}
              />
            ) : (
              currentStep.component(activeStep + 1, totalSteps, isSubmitting)
            )}
          </div>

          {/* Only show footer buttons after product selection (Step 1+) */}
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
