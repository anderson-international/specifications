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
  let filtered = [...products]
  
  if (selectedBrandId) {
    filtered = filtered.filter(p => p.brand_id === selectedBrandId)
  }
  
  if (selectedTypeId) {
    filtered = filtered.filter(p => p.type_id === selectedTypeId)
  }
  
  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.brand_name.toLowerCase().includes(term)
    )
  }
  
  return filtered
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
