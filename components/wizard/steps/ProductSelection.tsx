'use client'

import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import ProductBrandFilter from './ProductBrandFilter'
import ProductTypeFilter from './ProductTypeFilter'
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
    setValue
  } = useFormContext<ProductSelectionFormData>()
  
  const shopifyHandle = watch('shopify_handle')
  
  const {
    selectedBrandId,
    selectedTypeId,
    searchTerm,
    filteredProducts,
    handleBrandFilter,
    handleTypeFilter,
    handleSearchChange,
    handleProductSelect,
    handleClearFilters
  } = useProductSelection({
    shopifyHandle,
    onProductSelect: useCallback((product: MockProduct): void => {
      try {
        setValue('shopify_handle', product.shopify_handle, { shouldValidate: true })
        setValue('product_brand_id', product.brand_id, { shouldValidate: true })
        
        // Auto-advance to next step for mobile-first UX
        if (onProductSelect) {
          onProductSelect()
        }
      } catch (error) {
        console.error('Error selecting product:', error)
      }
    }, [setValue, onProductSelect])
  })
  
  return (
    <WizardStepCard
      title="Select Product"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
    >
      <div className={styles.filtersContainer}>
        <div className={styles.filterRow}>
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
            aria-labelledby="product-type-filter-label"
            aria-describedby="product-type-filter-description"
          >
            <ProductTypeFilter
              selectedTypeId={selectedTypeId}
              onTypeFilter={handleTypeFilter}
              disabled={disabled}
            />
          </div>
        </div>
        
        <div className={styles.searchRow}>
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
          
          <button 
            type="button" 
            onClick={handleClearFilters}
            disabled={disabled}
            className={styles.clearButton}
            aria-label="Clear all filters"
          >
            ✕
          </button>
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
          onProductSelect={handleProductSelect}
          disabled={disabled}
        />
      </div>
    </WizardStepCard>
  )
}

export default React.memo(ProductSelection)
