'use client'

import React, { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import ProductSelector from '@/components/shared/ProductSelector'
import { findEnumByName } from '../hooks/useEnumUtils'
import { SpecificationEnumData } from '@/types/enum'
import { Product } from '@/lib/types/product'

interface ProductSelectionProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
  onProductSelect?: () => void
  enumData?: SpecificationEnumData
  enumsLoading?: boolean
  filteredProducts?: Product[]
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
  enumData,
  enumsLoading,
  filteredProducts = [],
}: ProductSelectionProps): JSX.Element => {
  const { watch, setValue } = useFormContext<ProductSelectionFormData>()
  const brandEnums = enumData?.productBrands

  const shopifyHandle = watch('shopify_handle')

  const initialSelection = useMemo(() => {
    return shopifyHandle ? [shopifyHandle] : []
  }, [shopifyHandle])

  const handleProductSelection = useCallback(
    (productIds: string[]) => {
      const selectedHandle = productIds[0] || null
      setValue('shopify_handle', selectedHandle, { shouldValidate: true })

      if (selectedHandle) {
        // Find product by handle from filtered products
        const product = filteredProducts.find(p => p.handle === selectedHandle)
        
        if (product && brandEnums) {
          // Map brand name to brand_id using enum data
          const brandId = findEnumByName(brandEnums, product.brand)
          setValue('product_brand_id', brandId, { shouldValidate: true })
        } else {
          setValue('product_brand_id', null, { shouldValidate: true })
        }
        
        setValue('product_type_id', 1, { shouldValidate: true }) // Default to Tobacco Snuff
        onProductSelect?.()
      } else {
        setValue('product_brand_id', null, { shouldValidate: true })
        setValue('product_type_id', null, { shouldValidate: true })
      }
    },
    [setValue, onProductSelect, brandEnums]
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
