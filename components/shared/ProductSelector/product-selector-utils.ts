// ProductSelector utility functions

import type { Product } from './product-selector-interfaces'

// Filter products based on search and brand criteria
export const filterProducts = (
  products: Product[] | undefined,
  searchTerm: string,
  selectedBrand: string
): Product[] => {
  if (!products) {
    return []
  }
  
  return products.filter((product) => {
    const matchesSearch =
      !searchTerm ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBrand = !selectedBrand || product.brand === selectedBrand

    return matchesSearch && matchesBrand
  })
}

// Create brand options for filter dropdown
export const createBrandOptions = (
  availableBrands: string[]
): Array<{ value: string; label: string }> => {
  const options = [{ value: '', label: 'All Brands' }]
  options.push(...availableBrands.map((brand) => ({ value: brand, label: brand })))
  return options
}

// Get selected products by IDs (using ref for stability)
export const getSelectedProducts = (products: Product[] | undefined, selectedIds: string[]): Product[] => {
  if (!products) {
    return []
  }
  return products.filter((product) => selectedIds.includes(product.id))
}
