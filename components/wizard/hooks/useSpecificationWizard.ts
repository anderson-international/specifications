'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import useSpecificationSubmission from './useSpecificationSubmission'
import {
  WizardFormData,
  UseSpecificationWizardReturn,
  UseSpecificationWizardProps,
} from '../types/wizard.types'

const defaultValues: Partial<WizardFormData> = {
  shopify_handle: 'gid://shopify/Product/8675309519157',
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
  star_rating: null,
  rating_boost: 0,
}

/**
 * Main wizard hook for managing multi-step specification creation
 * Simplified to use React Hook Form without Zod validation
 */
export const useSpecificationWizard = ({
  onSubmit,
  initialData = {},
  userId,
}: UseSpecificationWizardProps): UseSpecificationWizardReturn => {
  const [activeStep, setActiveStep] = useState<number>(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const methods = useForm<WizardFormData>({
    defaultValues: { ...defaultValues, ...initialData } as WizardFormData,
  })

  const { isSubmitting, handleFormSubmit } = useSpecificationSubmission({
    onSubmit,
    methods,
    userId,
  })

  const handleNext = useCallback(() => {
    setActiveStep((prev) => {
      const nextStep = Math.min(prev + 1, 4)
      // Mark current step as completed when moving forward
      setCompletedSteps((completed) => new Set(completed).add(prev))
      return nextStep
    })
  }, [])

  const handlePrevious = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }, [])

  // Hybrid navigation: allow backward jumps only, forward gated by validation
  const handleStepClick = useCallback(
    (stepIndex: number) => {
      const targetStep = stepIndex - 1
      const canNavigate = targetStep <= activeStep || completedSteps.has(targetStep)

      if (canNavigate) {
        setActiveStep(targetStep)
      }
    },
    [activeStep, completedSteps]
  )

  // Check if user can navigate to a specific step
  const canNavigateToStep = useCallback(
    (stepIndex: number) => {
      const targetStep = stepIndex - 1
      return targetStep <= activeStep || completedSteps.has(targetStep)
    },
    [activeStep, completedSteps]
  )

  return {
    methods,
    activeStep,
    completedSteps,
    isSubmitting,
    handleNext,
    handlePrevious,
    handleStepClick,
    handleFormSubmit,
    canNavigateToStep,
  }
}
