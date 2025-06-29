'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useSpecificationSubmission } from './useSpecificationSubmission'
import { WizardFormData, UseSpecificationWizardReturn, UseSpecificationWizardProps } from '../types/wizard.types'

const defaultValues: Partial<WizardFormData> = {
  shopify_handle: 'gid://shopify/Product/8675309519157',
  product_brand_id: 1,
  product_type_id: 1,
  grind_id: 1,
  experience_level_id: 1,
  is_fermented: false,
  is_oral_tobacco: false,
  is_artisan: false,
  nicotine_level_id: 1,
  moisture_level_id: 1,
  tasting_notes: [1, 2, 3],
  cures: [1, 2],
  tobacco_types: [1, 2],
  review: 'This is a default review for testing purposes.',
  star_rating: 3,
  rating_boost: 2
}

/**
 * Main wizard hook for managing multi-step specification creation
 * Simplified to use React Hook Form without Zod validation
 */
export const useSpecificationWizard = ({ onSubmit, initialData = {}, userId }: UseSpecificationWizardProps): UseSpecificationWizardReturn => {
  const [activeStep, setActiveStep] = useState<number>(0)

  const methods = useForm<WizardFormData>({
    defaultValues: { ...defaultValues, ...initialData } as WizardFormData
  })

  const { isSubmitting, isSavingDraft, handleFormSubmit, saveDraft } = useSpecificationSubmission({
    onSubmit,
    methods,
    userId
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
