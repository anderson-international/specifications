'use client'

import React, { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import ProductSelector from '@/components/shared/ProductSelector'

interface ProductSelectionProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
  onProductSelect: () => void
}

interface ProductSelectionFormData {
  shopify_handle: string | null
  product_brand_id: number | null
  product_type_id: number | null
}

/**
 * Step 1: Product selection with brand filtering and search
 */
const ProductSelection = ({
  stepNumber,
  totalSteps,
  disabled = false,
  onProductSelect,
}: ProductSelectionProps): JSX.Element => {
  const { watch, setValue } = useFormContext<ProductSelectionFormData>()

  const shopifyHandle = watch('shopify_handle')

  const initialSelection = useMemo(() => {
    return shopifyHandle ? [shopifyHandle] : []
  }, [shopifyHandle])

  const handleProductSelection = useCallback(
    (productIds: string[]) => {
      const selectedHandle = productIds[0] || null
      setValue('shopify_handle', selectedHandle, { shouldValidate: true })

      // For now, set default values since ProductSelector doesn't provide full product data
      // In a real implementation, you'd need to fetch the full product data or enhance ProductSelector
      setValue('product_brand_id', null, { shouldValidate: true })
      setValue('product_type_id', 1, { shouldValidate: true }) // Default to Tobacco Snuff

      // Call the parent callback to proceed to next step
      if (selectedHandle) {
        onProductSelect()
      }
    },
    [setValue, onProductSelect]
  )

  return (
    <WizardStepCard title="Select Product" stepNumber={stepNumber} totalSteps={totalSteps}>
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
