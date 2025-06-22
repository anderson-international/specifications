'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useSpecificationSubmission } from './useSpecificationSubmission'
import { WizardFormData, UseSpecificationWizardReturn, UseSpecificationWizardProps } from '../types/wizard.types'

// Streamlined form schema
const wizardSchema = z.object({
  shopify_handle: z.string().nullable(),
  product_brand_id: z.number().nullable().refine(val => val !== null, { message: 'Please select a product brand' }),
  product_type_id: z.number().nullable().refine(val => val !== null, { message: 'Please select a product type' }),
  grind_id: z.number().nullable().refine(val => val !== null, { message: 'Please select a grind type' }),
  experience_level_id: z.number().nullable().refine(val => val !== null, { message: 'Please select your experience level' }),
  is_fermented: z.boolean(),
  is_oral_tobacco: z.boolean(),
  is_artisan: z.boolean(),
  nicotine_level_id: z.number().nullable().refine(val => val !== null, { message: 'Please select nicotine level' }),
  moisture_level_id: z.number().nullable().refine(val => val !== null, { message: 'Please select moisture level' }),
  tasting_notes: z.array(z.number()).min(1, { message: 'Please select at least one tasting note' }),
  cures: z.array(z.number()).min(1, { message: 'Please select at least one cure type' }),
  tobacco_types: z.array(z.number()).min(1, { message: 'Please select at least one tobacco type' }),
  review: z.string().min(10, { message: 'Review must be at least 10 characters' }),
  star_rating: z.number().min(1, { message: 'Please provide a rating' })
})

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

export const useSpecificationWizard = ({ onSubmit, initialData = {} }: UseSpecificationWizardProps): UseSpecificationWizardReturn => {
  const [activeStep, setActiveStep] = useState<number>(0)

  const methods = useForm<WizardFormData>({
    defaultValues: { ...defaultValues, ...initialData } as WizardFormData,
    resolver: zodResolver(wizardSchema)
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
    setActiveStep(stepIndex)
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
