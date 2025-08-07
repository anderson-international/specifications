'use client'

import React, { useMemo, useCallback } from 'react'
import { FormProvider } from 'react-hook-form'
import type { SpecificationFormData } from '@/types/specification'
import WizardProgress from './controls/WizardProgress'
import WizardNavigationFooter from './controls/WizardNavigationFooter'
import DraftManager from './components/DraftManager'
import { useSpecificationWizard } from './hooks/useSpecificationWizard'
import { useStepValidation } from './hooks/useStepValidation'
import { useDraftNavigation } from './hooks/useDraftNavigation'
import { useWizardErrorHandling } from './hooks/useWizardErrorHandling'
import { createWizardSteps } from './constants/wizardSteps'
import styles from './SpecificationWizard.module.css'

interface SpecificationWizardProps {
  onSubmit: (data: SpecificationFormData) => void | Promise<void>
  initialData?: Record<string, unknown>
  userId: string
}

const SpecificationWizard = ({
  onSubmit,
  initialData = {},
  userId,
}: SpecificationWizardProps): JSX.Element => {
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
    handleStepClick: originalHandleStepClick,
    handleFormSubmit,
    canNavigateToStep,
    isEditMode,
    clearDraft: _clearDraft,
    forceSave: _forceSave,
    productHandle,
    saveStatus,
    hasSavedOnce,
  } = useSpecificationWizard({ onSubmit, initialData, userId })
  const handleStepClick = useCallback((stepIndex: number) => {
    originalHandleStepClick(stepIndex)
  }, [originalHandleStepClick])
  
  const { draftRecoveryStep: _draftRecoveryStep, handleDraftRecovered } = useDraftNavigation({
    onStepClick: originalHandleStepClick
  })

  const { submitError, setSubmitError, handleFormSubmitWithError } = useWizardErrorHandling({
    handleFormSubmit,
    methods
  })

  const steps = useMemo(() => createWizardSteps(), [])
  const currentStep = steps[activeStep]
  const totalSteps = steps.length

  const isCurrentStepValid = useStepValidation({
    currentStepId: currentStep.id,
    methods,
  })

  const progressSteps = useMemo(
    () => steps.map((step, index) => ({
      id: index + 1,
      title: step.title,
    })),
    [steps]
  )



  return (
    <FormProvider {...methods}>
      <DraftManager
        userId={userId}
        productHandle={productHandle}
        methods={methods}
        isEditMode={isEditMode}
        selectedProduct={selectedProduct}
        onDraftRecovered={handleDraftRecovered}
      >
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
                isSubmitting || (isEditMode && activeStep === 0),
                handleNext,
                selectedProduct,
                enumData,
                enumsLoading,
                filteredProducts,
                saveStatus,
                hasSavedOnce
              )}
            </div>

            <WizardNavigationFooter
              activeStep={activeStep}
              totalSteps={totalSteps}
              isSubmitting={isSubmitting}
              isCurrentStepValid={isCurrentStepValid}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </form>
        </div>
      </DraftManager>
    </FormProvider>
  )
}

export { SpecificationWizard }
export default React.memo(SpecificationWizard)
