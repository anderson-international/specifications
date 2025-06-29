'use client'

import { type MockProduct } from '@/constants/wizardOptions'

/**
 * Filter products by brand, type and search term
 */
export const filterProducts = (
  products: readonly MockProduct[],
  selectedBrandId: number | null,
  selectedTypeId: number | null,
  searchTerm: string
): MockProduct[] => {
    return products
    .filter(p => !selectedBrandId || p.brand_id === selectedBrandId)
    .filter(p => !selectedTypeId || p.type_id === selectedTypeId)
    .filter(p => {
      if (!searchTerm) return true
      const term = searchTerm.toLowerCase()
      return (
        p.name.toLowerCase().includes(term) ||
        p.brand_name.toLowerCase().includes(term)
      )
    })
}

/**
 * Find product by shopify handle
 */
export const findProductByHandle = (
  products: readonly MockProduct[],
  shopifyHandle: string | null
): MockProduct | null => {
  return products.find(p => p.shopify_handle === shopifyHandle) || null
}
