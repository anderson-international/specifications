'use client'

import React, { useMemo, useState, useCallback } from 'react'
import { FormProvider } from 'react-hook-form'
import { Specification } from '@/lib/schemas/specification'
import WizardProgress from './controls/WizardProgress'
import WizardNavigationFooter from './controls/WizardNavigationFooter'
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
  userId,
}: SpecificationWizardProps): JSX.Element => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  const {
    methods,
    activeStep,
    isSubmitting,
    selectedProduct,
    enumData,
    enumsLoading,
    filteredProducts,
    handleNext,
    handlePrevious,
    handleStepClick,
    handleFormSubmit,
    canNavigateToStep,
    isEditMode,
  } = useSpecificationWizard({ onSubmit, initialData, userId })

  const steps = useMemo(() => createWizardSteps(), [])
  const currentStep = steps[activeStep]
  const totalSteps = steps.length

  const isCurrentStepValid = useStepValidation({
    currentStepId: currentStep.id,
    methods,
  })

  // Memoized steps mapping to prevent creating new array/objects on every render
  const progressSteps = useMemo(
    () => steps.map((step, index) => ({
      id: index + 1,
      title: step.title,
    })),
    [steps]
  )

  // Memoized form submit handler to prevent creating new function on every render
  const handleFormSubmitWithError = useCallback(
    async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault()
      try {
        setSubmitError(null)
        await methods.handleSubmit(handleFormSubmit)()
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Failed to submit specification')
      }
    },
    [handleFormSubmit, methods, setSubmitError]
  )

  // Separate handler for WizardNavigationFooter (parameterless)
  const handleNavigationSubmit = useCallback(async (): Promise<void> => {
    try {
      setSubmitError(null)
      await methods.handleSubmit(handleFormSubmit)()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit specification')
    }
  }, [handleFormSubmit, methods, setSubmitError])

  return (
    <FormProvider {...methods}>
      <div className={styles.wizardContainer}>
        <div className={styles.progress}>
          <WizardProgress
            steps={progressSteps}
            currentStepId={activeStep + 1}
            onStepClick={handleStepClick}
            allowNavigation={true}
            canNavigateToStep={canNavigateToStep}
          />
        </div>

        {submitError && (
          <div className={styles.errorMessage}>
            <p><strong>Error:</strong> {submitError}</p>
            <button 
              type="button" 
              onClick={() => setSubmitError(null)}
              className={styles.errorDismiss}
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleFormSubmitWithError} className={styles.form}>
          <div className={styles.stepContent}>
            {currentStep.component(
              activeStep + 1,
              totalSteps,
              isSubmitting || (isEditMode && activeStep === 0), // Disable product selection in edit mode
              handleNext,
              selectedProduct,
              enumData,
              enumsLoading,
              filteredProducts
            )}
          </div>

          <WizardNavigationFooter
            activeStep={activeStep}
            totalSteps={totalSteps}
            isSubmitting={isSubmitting}
            isCurrentStepValid={isCurrentStepValid}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleNavigationSubmit}
          />
        </form>
      </div>
    </FormProvider>
  )
}

// Export both default and named export for flexibility
export { SpecificationWizard }
export default React.memo(SpecificationWizard)
