'use client'

import React, { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import ValidationSummary, { ValidationError } from '../controls/ValidationSummary'
import ProductBrandFilter from './ProductBrandFilter'
import ProductSearch from './ProductSearch'
import ProductGrid from './ProductGrid'
import { useProductSelection } from '../hooks/useProductSelection'
import { type MockProduct } from '@/constants/wizardOptions'
import styles from './ProductSelection.module.css'

interface ProductSelectionProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
  onProductSelect?: () => void
}

interface ProductSelectionFormData {
  shopify_handle: string | null
  product_brand_id: number | null
}

/**
 * Step 1: Product selection with brand filtering and search
 */
const ProductSelection = ({
  stepNumber,
  totalSteps,
  disabled = false,
  onProductSelect
}: ProductSelectionProps): JSX.Element => {
  const { 
    watch, 
    setValue, 
    formState: { errors } 
  } = useFormContext<ProductSelectionFormData>()
  
  const shopifyHandle = watch('shopify_handle')
  
  // Handle product selection from hook
  const handleProductSelect = useCallback((product: MockProduct): void => {
    try {
      setValue('shopify_handle', product.shopify_handle, { shouldValidate: true })
      setValue('product_brand_id', product.brand_id, { shouldValidate: true })
      
      // Add a small delay to ensure form is updated before advancing
      setTimeout(() => {
        onProductSelect?.()
      }, 100)
    } catch (error) {
      console.error('Error selecting product:', error)
    }
  }, [setValue, onProductSelect])
  
  // Use extracted hook for state management
  const {
    searchTerm,
    selectedBrandId,
    filteredProducts,
    handleBrandFilter,
    handleSearchChange,
    handleProductSelect: hookProductSelect
  } = useProductSelection({
    shopifyHandle,
    onProductSelect: handleProductSelect
  })
  
  // Validation errors - Simplified to rely on central Zod schema
  const validationErrors = useMemo((): ValidationError[] => {
    const errorList: ValidationError[] = []
    
    if (errors.shopify_handle) {
      errorList.push({
        fieldName: 'shopify_handle',
        message: errors.shopify_handle.message || 'Please select a product to review'
      })
    }
    
    if (errors.product_brand_id) {
      errorList.push({
        fieldName: 'product_brand_id',
        message: errors.product_brand_id.message || 'Please select a product brand'
      })
    }
    
    return errorList
  }, [errors.shopify_handle, errors.product_brand_id])
  
  // Check if step is valid - Rely on form validation state
  const isValid = useMemo((): boolean => {
    return Boolean(shopifyHandle && !errors.shopify_handle && !errors.product_brand_id)
  }, [shopifyHandle, errors.shopify_handle, errors.product_brand_id])

  return (
    <WizardStepCard
      title="Select Product"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isValid={isValid}
    >
      <ValidationSummary errors={validationErrors} />
      
      <div className={styles.filterSearchContainer}>
        <div 
          role="group" 
          aria-labelledby="brand-filter-label"
          aria-describedby="brand-filter-description"
        >
          <ProductBrandFilter
            selectedBrandId={selectedBrandId}
            onBrandFilter={handleBrandFilter}
            disabled={disabled}
          />
        </div>
        
        <div 
          role="group" 
          aria-labelledby="product-search-label"
          aria-describedby="product-search-description"
        >
          <ProductSearch
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            disabled={disabled}
          />
        </div>
      </div>
      
      <div 
        role="group" 
        aria-labelledby="product-grid-label"
        aria-describedby="product-grid-description"
      >
        <ProductGrid
          products={filteredProducts}
          selectedHandle={shopifyHandle}
          onProductSelect={hookProductSelect}
          disabled={disabled}
        />
      </div>
    </WizardStepCard>
  )
}

export default React.memo(ProductSelection)
