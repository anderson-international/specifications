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
  onProductSelect?: (e: React.MouseEvent<HTMLButtonElement>) => void
  enumData?: SpecificationEnumData
  enumsLoading?: boolean
  filteredProducts?: Product[]
}

interface ProductSelectionFormData {
  shopify_handle: string | null
  product_brand_id: number | null
}

const ProductSelection = ({
  stepNumber,
  totalSteps,
  disabled = false,
  onProductSelect,
  enumData,
  enumsLoading: _enumsLoading,
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
        const product = filteredProducts.find(p => p.handle === selectedHandle)
        
        if (product && brandEnums) {
          const brandId = findEnumByName(brandEnums, product.brand)
          setValue('product_brand_id', brandId, { shouldValidate: true })
        } else {
          setValue('product_brand_id', null, { shouldValidate: true })
        }
        
        setTimeout(() => {
          onProductSelect?.({} as React.MouseEvent<HTMLButtonElement>)
        }, 0)
      } else {
        setValue('product_brand_id', null, { shouldValidate: true })
      }
    },
    [setValue, onProductSelect, brandEnums, filteredProducts]
  )

  return (
    <WizardStepCard title="Select Product" stepNumber={stepNumber} totalSteps={totalSteps}>
      <ProductSelector
        mode="single"
        onSelectionChange={handleProductSelection}
        initialSelection={initialSelection}
        searchPlaceholder="Search by product or brand..."
        disabled={disabled}
        products={filteredProducts}
      />
    </WizardStepCard>
  )
}

export default React.memo(ProductSelection)
