'use client'

import React, { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import ProductSelector from '@/components/shared/ProductSelector'

interface ProductSelectionProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
  onProductSelect: () => void;
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
  
  const initialSelection = useMemo(() => {
    return shopifyHandle ? [shopifyHandle] : []
  }, [shopifyHandle])
  
  const handleProductSelection = useCallback((productIds: string[]) => {
    const selectedHandle = productIds[0] || null
    setValue('shopify_handle', selectedHandle, { shouldValidate: true })
    
    // Note: We're setting product_brand_id to null here since ProductSelector
    // doesn't currently provide brand_id. This could be enhanced if needed.
    setValue('product_brand_id', null, { shouldValidate: true })
    
    // Call the parent callback to proceed to next step
    if (selectedHandle) {
      onProductSelect()
    }
  }, [setValue, onProductSelect])
  
  return (
    <WizardStepCard
      title="Select Product"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
    >
      <ProductSelector
        mode="single"
        onSelectionChange={handleProductSelection}
        initialSelection={initialSelection}
        title="Choose a Product to Review"
        searchPlaceholder="Search products..."
        disabled={disabled}
      />
    </WizardStepCard>
  )
}

export default React.memo(ProductSelection)
