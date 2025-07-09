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
  const methods = useForm<WizardFormData>({
    defaultValues: { ...defaultValues, ...initialData } as WizardFormData,
  })

  // Single data source: fetch all data here to eliminate redundant API calls
  const { filteredProducts } = useProducts()
  const { data: enumData, isLoading: enumsLoading } = useSpecificationEnums()
  const selectedProduct = useSelectedProduct(methods, filteredProducts)

  // Extract navigation logic to separate hook for file size compliance
  const {
    activeStep,
    completedSteps,
    handleNext,
    handlePrevious,
    handleStepClick,
    canNavigateToStep,
  } = useWizardNavigation()

  const { isSubmitting, handleFormSubmit } = useSpecificationSubmission({
    onSubmit,
    methods,
    userId,
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
  }
}
