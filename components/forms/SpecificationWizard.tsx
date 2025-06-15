'use client'

import { useState, useCallback } from 'react'

import { DraftManager } from './DraftManager'
import { WizardProgress } from './WizardProgress'
import { WizardValidationProvider, useWizardValidation } from './WizardValidationProvider'
import { WizardStepRenderer } from './WizardStepRenderer'
import { useWizardDraftManager } from './hooks/useWizardDraftManager'
import { SpecificationFormData } from '@/lib/schemas/specification'
import styles from './SpecificationWizard.module.css'

interface SpecificationWizardProps {
  productId?: string
  onComplete: (data: SpecificationFormData) => void
  onCancel: () => void
}

interface WizardContentProps extends SpecificationWizardProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  formData: Partial<SpecificationFormData>
  setFormData: (data: Partial<SpecificationFormData>) => void
}

const STEPS = [
  { id: 1, title: 'Product Selection', component: 'ProductSelection' },
  { id: 2, title: 'Characteristics 1', component: 'Characteristics1' },
  { id: 3, title: 'Characteristics 2', component: 'Characteristics2' },
  { id: 4, title: 'Sensory Profile', component: 'SensoryProfile' },
  { id: 5, title: 'Review & Rating', component: 'ReviewRating' }
]

function WizardContent({ productId, onComplete, onCancel, currentStep, setCurrentStep, formData, setFormData }: WizardContentProps): JSX.Element {
  const { validationErrors, stepValidation, validateCurrentStep } = useWizardValidation()
  const { isLoading, showDraftPrompt, setShowDraftPrompt, handleLoadDraft, handleDiscardDraft, saveDraft, clearDraft } = useWizardDraftManager({ productId, setFormData, setCurrentStep })

  const handleStepData = useCallback((stepData: Partial<SpecificationFormData>): void => {
    const updatedData = { ...formData, ...stepData }
    setFormData(updatedData)
    saveDraft(updatedData)
  }, [formData, setFormData, saveDraft])

  const handleNext = useCallback((): void => {
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1)
  }, [currentStep, setCurrentStep])

  const handlePrev = useCallback((): void => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }, [currentStep, setCurrentStep])

  const handleStepNext = useCallback((stepData: Partial<SpecificationFormData>): void => {
    const updatedData = { ...formData, ...stepData }
    const validation = validateCurrentStep(currentStep, updatedData)
    if (validation.isValid) {
      handleStepData(stepData)
      handleNext()
    } else {
      setFormData(updatedData)
      saveDraft(updatedData)
    }
  }, [formData, currentStep, validateCurrentStep, handleStepData, handleNext, setFormData, saveDraft])

  const handleComplete = useCallback((finalStepData: Partial<SpecificationFormData>): void => {
    const completeData = { ...formData, ...finalStepData } as SpecificationFormData
    const validation = validateCurrentStep(5, completeData)
    if (validation.isValid) {
      clearDraft()
      onComplete(completeData)
    }
  }, [formData, onComplete, clearDraft, validateCurrentStep])

  if (isLoading) return (
    <div className={styles.wizard}>
      <div className={styles.loading}>Loading...</div>
    </div>
  )

  return (
    <div className={styles.wizard}>
      <DraftManager
        productId={productId}
        showPrompt={showDraftPrompt}
        onLoadDraft={handleLoadDraft}
        onDiscardDraft={handleDiscardDraft}
        onClosePrompt={(): void => setShowDraftPrompt(false)}
      />

      <div className={styles.header}>
        <button onClick={onCancel} className={styles.cancelButton} type="button">
          ✕
        </button>
        <h1 className={styles.title}>Create Specification</h1>
      </div>

      <WizardProgress
        currentStep={currentStep}
        totalSteps={STEPS.length}
        steps={STEPS}
        formData={formData}
        stepValidation={stepValidation}
        validationErrors={validationErrors}
      />

      <div className={styles.content}>
        <WizardStepRenderer
          currentStep={currentStep}
          formData={formData}
          onStepNext={handleStepNext}
          onStepPrev={handlePrev}
          onComplete={handleComplete}
          productId={productId}
        />
      </div>
    </div>
  )
}

export function SpecificationWizard(props: SpecificationWizardProps): JSX.Element {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<Partial<SpecificationFormData>>({})

  return (
    <WizardValidationProvider currentStep={currentStep} formData={formData}>
      <WizardContent 
        {...props} 
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        formData={formData}
        setFormData={setFormData}
      />
    </WizardValidationProvider>
  )
}
