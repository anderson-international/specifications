'use client'

import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useSpecificationEnums } from './useSpecificationEnums'
import useSpecificationSubmission from './useSpecificationSubmission'
import { useSelectedProduct } from './useSelectedProduct'
import { useWizardNavigation } from './useWizardNavigation'

import { findEnumByName } from './useEnumUtils'
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


  useEffect(() => {
    if (mode === 'createFromProduct' && selectedProduct && enumData?.productBrands) {
      const currentBrandId = methods.getValues('product_brand_id')
      
      if (!currentBrandId || currentBrandId === 0) {
        const brandId = findEnumByName(enumData.productBrands, selectedProduct.brand)
        if (brandId) {
          methods.setValue('product_brand_id', brandId, { shouldValidate: true })
        }
      }
    }
  }, [mode, selectedProduct, enumData?.productBrands, methods])

  const {
    activeStep,
    completedSteps,
    handleNext,
    handlePrevious,
    handleStepClick,
    canNavigateToStep,
  } = useWizardNavigation(shouldSkipProductSelection ? 1 : 0)

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
