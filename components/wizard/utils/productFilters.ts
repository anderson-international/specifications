'use client'

import { type Product } from '@/lib/types/product'

/**
 * Filter products by brand, type and search term
 */
export const filterProducts = (
  products: readonly Product[],
  selectedBrandId: string | null,
  selectedTypeId: number | null,
  searchTerm: string
): Product[] => {
  return products
    .filter((p) => !selectedBrandId || p.brand === selectedBrandId)
    // Note: type_id not available in Product - skip type filtering for now
    .filter((p) => {
      if (!searchTerm) return true
      const term = searchTerm.toLowerCase()
      return p.title.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term)
    })
}

/**
 * Find product by shopify handle
 */
export const findProductByHandle = (
  products: readonly Product[],
  shopifyHandle: string | null
): Product | null => {
  return products.find((p) => p.handle === shopifyHandle) || null
}
