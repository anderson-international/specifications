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
  // System fields (populated at initialization)
  user_id: '', // Will be set from props
  created_at: new Date(),
  updated_at: new Date(),
  status_id: 1, // Default to "published"
  submission_id: undefined, // Legacy field - ignore
  
  // Form fields with proper Specification interface names
  shopify_handle: '',
  product_brand_id: 0,
  product_type_id: 0,
  grind_id: 0,
  experience_level_id: 0,
  is_fermented: false,
  is_oral_tobacco: false,
  is_artisan: false,
  nicotine_level_id: 0,
  moisture_level_id: 0,
  tasting_note_ids: [],
  cure_type_ids: [],
  tobacco_type_ids: [],
  review: '',
  star_rating: 1, // Minimum allowed by schema
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
    defaultValues: { 
      ...defaultValues, 
      user_id: userId, // Set user_id from props
      ...initialData 
    } as WizardFormData,
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
