'use client'

import { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WizardFormData } from '../types/wizard.types'
import { Product } from '@/lib/types/product'

/**
 * Hook to derive selected product from wizard form data
 * Accepts filteredProducts to avoid redundant useProducts calls
 */
export const useSelectedProduct = (
  methods: UseFormReturn<WizardFormData>,
  filteredProducts: Product[]
): Product | null => {
  const selectedProduct = useMemo(() => {
    const shopifyHandle = methods.watch('shopify_handle')
    if (!shopifyHandle || !filteredProducts.length) {
      return null
    }
    return filteredProducts.find(p => p.handle === shopifyHandle) || null
  }, [methods, filteredProducts])

  return selectedProduct
}
