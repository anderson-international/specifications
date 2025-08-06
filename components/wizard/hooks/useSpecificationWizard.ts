'use client'

import { useForm } from 'react-hook-form'
import { useCallback, useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useSpecificationEnums } from './useSpecificationEnums'
import useSpecificationTransform from './useSpecificationTransform'
import { useSelectedProduct } from './useSelectedProduct'
import { useWizardNavigation } from './useWizardNavigation'

import {
  WizardFormData,
  UseSpecificationWizardReturn,
  UseSpecificationWizardProps,
} from '../types/wizard.types'
import { WIZARD_DEFAULT_VALUES } from '../wizard-defaults'

export const useSpecificationWizard = ({
  onSubmit,
  initialData = {},
  userId,
}: UseSpecificationWizardProps): UseSpecificationWizardReturn => {
  const mode = initialData.mode as string | undefined
  const isEditMode = mode === 'edit'
  const shouldSkipProductSelection = mode === 'edit' || mode === 'createFromProduct'

  const formDefaults = { 
    ...WIZARD_DEFAULT_VALUES, 
    user_id: userId,
    ...initialData 
  } as WizardFormData

  const methods = useForm<WizardFormData>({
    defaultValues: formDefaults,
  })

  const { filteredProducts } = useProducts()
  const { data: enumData, isLoading: enumsLoading } = useSpecificationEnums()
  const selectedProduct = useSelectedProduct(methods, filteredProducts)

  const {
    activeStep,
    completedSteps,
    handleNext,
    handlePrevious,
    handleStepClick,
    canNavigateToStep,
  } = useWizardNavigation(shouldSkipProductSelection ? 1 : 0)

  const { getTransformedData } = useSpecificationTransform({
    methods,
    userId,
    initialData,
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleFormSubmit = useCallback(async (): Promise<void> => {
    setIsSubmitting(true)
    try {
      const transformedData = getTransformedData()
      const completeSpecification = {
        ...transformedData.specification,
        tasting_note_ids: transformedData.junctionData.tasting_note_ids,
        cure_type_ids: transformedData.junctionData.cure_ids,
        tobacco_type_ids: transformedData.junctionData.tobacco_type_ids,
      }
      await onSubmit(completeSpecification)
    } catch (error) {
      throw new Error(`Failed to submit specification: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [onSubmit, getTransformedData])

  return {
    methods,
    activeStep,
    completedSteps,
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
  }
}
