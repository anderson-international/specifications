'use client'

import { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WizardFormData } from '../types/wizard.types'
import { Product } from '@/lib/types/product'

export const useSelectedProduct = (
  methods: UseFormReturn<WizardFormData>,
  filteredProducts: Product[]
): Product | null => {
  const shopifyHandle = methods.watch('shopify_handle')
  
  const selectedProduct = useMemo(() => {
    if (!shopifyHandle || !filteredProducts.length) {
      return null
    }
    return filteredProducts.find(p => p.handle === shopifyHandle) || null
  }, [shopifyHandle, filteredProducts])

  return selectedProduct
}
