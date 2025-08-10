'use client'

import { useForm } from 'react-hook-form'
import { useCallback, useState, useMemo, useEffect } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useSpecificationEnums } from './useSpecificationEnums'
import useSpecificationTransform from './useSpecificationTransform'
import { useSelectedProduct } from './useSelectedProduct'
import { useWizardNavigation } from './useWizardNavigation'
import { useWizardAutoSave } from './useWizardAutoSave'
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
  const shopifyHandle = methods.watch('shopify_handle')

  const {
    activeStep,
    completedSteps,
    handleNext,
    handlePrevious,
    handleStepClick,
    canNavigateToStep,
  } = useWizardNavigation(0)

  const { getTransformedData } = useSpecificationTransform({
    methods,
    userId,
    initialData,
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (mode === 'createFromProduct' && enumData?.productBrands && filteredProducts.length > 0) {
      const shopifyHandle = initialData.shopify_handle as string
      if (shopifyHandle) {
        const product = filteredProducts.find(p => p.handle === shopifyHandle)
        if (product) {
          const brandId = findEnumByName(enumData.productBrands, product.brand)
          if (brandId !== null) {
            methods.setValue('product_brand_id', brandId, { shouldValidate: true })
          }
        }
      }
    }
  }, [mode, enumData?.productBrands, filteredProducts, initialData.shopify_handle, methods])
  const isAutoSaveEnabled = !isEditMode
  
  const productHandle = useMemo((): string | null => {
    if (selectedProduct?.handle) return selectedProduct.handle
    if (initialData.shopify_handle) return initialData.shopify_handle as string
    if (shopifyHandle) return shopifyHandle
    return null
  }, [selectedProduct?.handle, initialData.shopify_handle, shopifyHandle])
  const { clearDraft, forceSave, saveStatus, lastError, hasSavedOnce } = useWizardAutoSave({
    methods,
    userId,
    productHandle,
    currentStep: activeStep + 1,
    isEnabled: isAutoSaveEnabled,
    isSubmitting,
  })

  const handleFormSubmit = useCallback(async (_data: WizardFormData): Promise<void> => {
    setIsSubmitting(true)
    try {
      const transformedData = getTransformedData()
      await onSubmit(transformedData)
      clearDraft()
    } catch (error) {
      throw new Error(`Failed to submit specification: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [onSubmit, getTransformedData, clearDraft])

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
    clearDraft,
    forceSave,
    productHandle,
    saveStatus,
    lastError,
    hasSavedOnce,
  }
}
