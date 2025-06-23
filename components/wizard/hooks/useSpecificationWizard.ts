'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useSpecificationSubmission } from './useSpecificationSubmission'
import { WizardFormData, UseSpecificationWizardReturn, UseSpecificationWizardProps } from '../types/wizard.types'

const defaultValues: Partial<WizardFormData> = {
  shopify_handle: null,
  product_brand_id: null,
  product_type_id: null,
  grind_id: null,
  experience_level_id: null,
  is_fermented: false,
  is_oral_tobacco: false,
  is_artisan: false,
  nicotine_level_id: null,
  moisture_level_id: null,
  tasting_notes: [],
  cures: [],
  tobacco_types: [],
  review: '',
  star_rating: 0
}

/**
 * Main wizard hook for managing multi-step specification creation
 * Simplified to use React Hook Form without Zod validation
 */
export const useSpecificationWizard = ({ onSubmit, initialData = {} }: UseSpecificationWizardProps): UseSpecificationWizardReturn => {
  const [activeStep, setActiveStep] = useState<number>(0)

  const methods = useForm<WizardFormData>({
    defaultValues: { ...defaultValues, ...initialData } as WizardFormData
  })

  const { isSubmitting, isSavingDraft, handleFormSubmit, saveDraft } = useSpecificationSubmission({
    onSubmit,
    methods
  })

  const handleNext = useCallback(() => {
    setActiveStep(prev => Math.min(prev + 1, 4))
  }, [])

  const handlePrevious = useCallback(() => {
    setActiveStep(prev => Math.max(prev - 1, 0))
  }, [])

  const handleStepClick = useCallback((stepIndex: number) => {
    setActiveStep(stepIndex - 1)
  }, [])

  return {
    methods,
    activeStep,
    isSubmitting,
    isSavingDraft,
    handleNext,
    handlePrevious,
    handleStepClick,
    handleFormSubmit,
    saveDraft
  }
}
