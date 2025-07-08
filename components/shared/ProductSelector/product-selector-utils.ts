// ProductSelector utility functions

import type { Product } from './product-selector-interfaces'

// Transform raw products to our Product interface
export const transformProducts = (rawProducts: any[]): Product[] => {
  return rawProducts.map((product) => ({
    id: product.id,
    handle: product.handle,
    title: product.title,
    brand: product.brand,
    image_url: product.image_url,
    spec_count_total: product.spec_count_total,
  }))
}

// Filter products based on search and brand criteria
export const filterProducts = (
  products: Product[],
  searchTerm: string,
  selectedBrand: string
): Product[] => {
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
export const getSelectedProducts = (products: Product[], selectedIds: string[]): Product[] => {
  return products.filter((product) => selectedIds.includes(product.id))
}
