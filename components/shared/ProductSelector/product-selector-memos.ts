// ProductSelector memoized computations

import { useMemo } from 'react'
import type { Product } from './product-selector-interfaces'
import {
  filterProducts,
  createBrandOptions,
  getSelectedProducts,
} from './product-selector-utils'

// Hook for filtered products
export const useFilteredProducts = (
  products: Product[],
  searchTerm: string,
  selectedBrand: string
): Product[] => {
  return useMemo(
    () => filterProducts(products, searchTerm, selectedBrand),
    [products, searchTerm, selectedBrand]
  )
}

// Hook for selected products
export const useSelectedProducts = (
  products: Product[],
  selectedProductIds: string[]
): Product[] => {
  return useMemo(() => getSelectedProducts(products, selectedProductIds), [products, selectedProductIds])
}

// Hook for brand options
export const useBrandOptions = (
  availableBrands: string[]
): Array<{ value: string; label: string }> => {
  return useMemo(() => createBrandOptions(availableBrands), [availableBrands])
}
