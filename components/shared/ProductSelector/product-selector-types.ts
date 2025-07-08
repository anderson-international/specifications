// ProductSelector types and interfaces

import type { Product } from './product-selector-interfaces'

export interface UseProductSelectorProps {
  mode: 'single' | 'multi'
  initialSelection?: string[]
  onSelectionChange: (productIds: string[]) => void
}

export interface UseProductSelectorReturn {
  products: Product[]
  filteredProducts: Product[]
  selectedProducts: Product[]
  selectedProductIds: string[]
  searchTerm: string
  selectedBrand: string
  isLoading: boolean
  error: string | null
  setSearchTerm: (term: string) => void
  setSelectedBrand: (brand: string) => void
  handleProductSelect: (product: Product) => void
  handleClearFilters: () => void
  handleRemoveProduct: (productId: string) => void
  handleClearAll: () => void
  handleConfirmSelection: () => void
  brandOptions: Array<{ value: string; label: string }>
}
