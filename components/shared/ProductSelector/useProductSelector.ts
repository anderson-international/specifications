'use client'

import { useState, useCallback } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useProductFilters } from './useProductFilters'
import { Product } from '@/lib/types/product'
import type { UseProductSelectorProps, UseProductSelectorReturn } from './product-selector-types'

// Import memo hooks for performance optimization
import { useFilteredProducts, useSelectedProducts, useBrandOptions } from './product-selector-memos'

// Import handler utilities
import {
  createProductSelectHandler,
  createClearFiltersHandler,
  createRemoveProductHandler,
  createClearAllHandler,
  createConfirmSelectionHandler,
} from './product-selector-handlers'

export const useProductSelector = ({
  mode,
  initialSelection = [],
  onSelectionChange,
  products: externalProducts,
}: UseProductSelectorProps): UseProductSelectorReturn => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialSelection)

  if (externalProducts) {
    // Use UI state-only hook when external products provided (no API calls)
    const {
      searchTerm,
      setSearchTerm,
      selectedBrand,
      setSelectedBrand,
      filterProducts,
      getAvailableBrands,
    } = useProductFilters()

    const products = externalProducts
    const isLoading = false
    const error = null
    const availableBrands = getAvailableBrands(products)
    const filteredProducts = filterProducts(products)
    const selectedProducts = useSelectedProducts(products, selectedProductIds)
    const brandOptions = useBrandOptions(availableBrands)

    // Create handlers using utility functions
    const handleProductSelect = useCallback(
      createProductSelectHandler(mode, setSelectedProductIds, onSelectionChange),
      [mode, onSelectionChange]
    )

    const handleClearFilters = useCallback(
      createClearFiltersHandler(setSearchTerm, setSelectedBrand),
      [setSearchTerm, setSelectedBrand]
    )

    const handleRemoveProduct = useCallback(
      createRemoveProductHandler(setSelectedProductIds),
      []
    )

    const handleClearAll = useCallback(
      createClearAllHandler(setSelectedProductIds),
      []
    )

    const handleConfirmSelection = useCallback(
      createConfirmSelectionHandler(selectedProductIds, onSelectionChange),
      [selectedProductIds, onSelectionChange]
    )

    return {
      products,
      filteredProducts,
      selectedProducts,
      selectedProductIds,
      searchTerm,
      selectedBrand,
      isLoading,
      error,
      setSearchTerm,
      setSelectedBrand,
      handleProductSelect,
      handleClearFilters,
      handleRemoveProduct,
      handleClearAll,
      handleConfirmSelection,
      brandOptions,
    }
  } else {
    // Use full useProducts hook when no external products provided
    const {
      products: internalProducts,
      filteredProducts: internalFiltered,
      availableBrands: internalBrands,
      isLoading: internalLoading,
      error: internalError,
      searchTerm,
      setSearchTerm,
      selectedBrand,
      setSelectedBrand,
    } = useProducts()

    const products = internalProducts
    const isLoading = internalLoading
    const error = internalError
    const filteredProducts = useFilteredProducts(products, searchTerm, selectedBrand)
    const selectedProducts = useSelectedProducts(products, selectedProductIds)
    const brandOptions = useBrandOptions(internalBrands)

    // Create handlers using utility functions
    const handleProductSelect = useCallback(
      createProductSelectHandler(mode, setSelectedProductIds, onSelectionChange),
      [mode, onSelectionChange]
    )

    const handleClearFilters = useCallback(
      createClearFiltersHandler(setSearchTerm, setSelectedBrand),
      [setSearchTerm, setSelectedBrand]
    )

    const handleRemoveProduct = useCallback(
      createRemoveProductHandler(setSelectedProductIds),
      []
    )

    const handleClearAll = useCallback(
      createClearAllHandler(setSelectedProductIds),
      []
    )

    const handleConfirmSelection = useCallback(
      createConfirmSelectionHandler(selectedProductIds, onSelectionChange),
      [selectedProductIds, onSelectionChange]
    )

    return {
      products,
      filteredProducts,
      selectedProducts,
      selectedProductIds,
      searchTerm,
      selectedBrand,
      isLoading,
      error,
      setSearchTerm,
      setSelectedBrand,
      handleProductSelect,
      handleClearFilters,
      handleRemoveProduct,
      handleClearAll,
      handleConfirmSelection,
      brandOptions,
    }
  }
}
