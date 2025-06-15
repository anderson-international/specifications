'use client'

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'
import { SpecificationFormData } from '@/lib/schemas/specification'
import { validateStep, ValidationResult } from '@/lib/utils/stepValidation'

interface ValidationContextType {
  validationErrors: string[]
  stepValidation: Record<number, ValidationResult>
  validateCurrentStep: (step: number, data: Partial<SpecificationFormData>) => ValidationResult
  setValidationErrors: (errors: string[]) => void
}

const ValidationContext = createContext<ValidationContextType | null>(null)

interface WizardValidationProviderProps {
  children: ReactNode
  currentStep: number
  formData: Partial<SpecificationFormData>
}

export function WizardValidationProvider({ 
  children, 
  currentStep, 
  formData 
}: WizardValidationProviderProps): JSX.Element {
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [stepValidation, setStepValidation] = useState<Record<number, ValidationResult>>({})

  // Validate current step whenever form data changes
  useEffect((): void => {
    const validation = validateStep(currentStep, formData)
    setStepValidation(prev => ({
      ...prev,
      [currentStep]: validation
    }))
    setValidationErrors(validation.errors)
  }, [currentStep, formData])

  const validateCurrentStep = useCallback((
    step: number, 
    data: Partial<SpecificationFormData>
  ): ValidationResult => {
    const validation = validateStep(step, data)
    setStepValidation(prev => ({
      ...prev,
      [step]: validation
    }))
    setValidationErrors(validation.errors)
    return validation
  }, [])

  const contextValue: ValidationContextType = {
    validationErrors,
    stepValidation,
    validateCurrentStep,
    setValidationErrors
  }

  return (
    <ValidationContext.Provider value={contextValue}>
      {children}
    </ValidationContext.Provider>
  )
}

export function useWizardValidation(): ValidationContextType {
  const context = useContext(ValidationContext)
  if (!context) {
    throw new Error('useWizardValidation must be used within WizardValidationProvider')
  }
  return context
}
