'use client'

import { useForm } from 'react-hook-form'
import { useProducts } from '@/hooks/useProducts'
import { useSpecificationEnums } from './useSpecificationEnums'
import useSpecificationSubmission from './useSpecificationSubmission'
import { useSelectedProduct } from './useSelectedProduct'
import { useWizardNavigation } from './useWizardNavigation'
import {
  WizardFormData,
  UseSpecificationWizardReturn,
  UseSpecificationWizardProps,
} from '../types/wizard.types'
import { WIZARD_DEFAULT_VALUES } from '../wizard-defaults'

/**
 * Main wizard hook for managing multi-step specification creation
 * Simplified to use React Hook Form without Zod validation
 */
export const useSpecificationWizard = ({
  onSubmit,
  initialData = {},
  userId,
}: UseSpecificationWizardProps): UseSpecificationWizardReturn => {
  // Detect if we're in edit mode (initialData provided and not empty)
  const isEditMode = Object.keys(initialData).length > 0
  
  const methods = useForm<WizardFormData>({
    defaultValues: { 
      ...WIZARD_DEFAULT_VALUES, 
      user_id: userId, // Set user_id from props
      ...initialData 
    } as WizardFormData,
  })

  // Single data source: fetch all data here to eliminate redundant API calls
  const { filteredProducts } = useProducts()
  const { data: enumData, isLoading: enumsLoading } = useSpecificationEnums()
  const selectedProduct = useSelectedProduct(methods, filteredProducts)

  // Extract navigation logic to separate hook for file size compliance
  // Start at step 2 (index 1) for edit mode, step 1 (index 0) for create mode
  const {
    activeStep,
    completedSteps,
    handleNext,
    handlePrevious,
    handleStepClick,
    canNavigateToStep,
  } = useWizardNavigation(isEditMode ? 1 : 0)

  const { isSubmitting, handleFormSubmit } = useSpecificationSubmission({
    onSubmit,
    methods,
    userId,
    initialData,
  })

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
