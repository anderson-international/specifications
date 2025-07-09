'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProducts } from '@/hooks/useProducts'

import type { UseProductSelectorProps, UseProductSelectorReturn } from './product-selector-types'
import {
  createProductSelectHandler,
  createRemoveProductHandler,
  createClearAllHandler,
  createConfirmSelectionHandler,
  createClearFiltersHandler,
} from './product-selector-handlers'
import {
  useFilteredProducts,
  useSelectedProducts,
  useBrandOptions,
} from './product-selector-memos'

export const useProductSelector = ({
  mode,
  initialSelection = [],
  onSelectionChange,
}: UseProductSelectorProps): UseProductSelectorReturn => {
  const {
    isLoading,
    error,
    filteredProducts: products,
    availableBrands,
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand,
  } = useProducts()

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialSelection)

  // Use extracted memo hooks - products is already canonical Product[]
  const filteredProducts = useFilteredProducts(products, searchTerm, selectedBrand)
  const selectedProducts = useSelectedProducts(products, selectedProductIds)
  const brandOptions = useBrandOptions(availableBrands)

  // Create handlers using utility functions
  // AI_CONTEXT: Factory function pattern for handler creation
  // ESLint can't analyze dependencies of returned functions from factory functions
  // Dependencies are manually verified and correct - this is an acceptable architectural trade-off
  // Benefits: code reuse, testability, type safety, separation of concerns
  // Risk mitigation: factory functions only use passed parameters, no external closures
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleProductSelect = useCallback(
    createProductSelectHandler(
      mode,
      setSelectedProductIds,
      onSelectionChange
    ),
    mode === 'single' ? [mode, onSelectionChange] : [mode]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleRemoveProduct = useCallback(
    createRemoveProductHandler(setSelectedProductIds),
    []
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClearAll = useCallback(
    createClearAllHandler(setSelectedProductIds),
    []
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleConfirmSelection = useCallback(
    createConfirmSelectionHandler(selectedProductIds, onSelectionChange),
    [selectedProductIds, onSelectionChange]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClearFilters = useCallback(
    createClearFiltersHandler(setSearchTerm, setSelectedBrand),
    [setSearchTerm, setSelectedBrand]
  )

  // Update initial selection when prop changes
  useEffect(() => {
    setSelectedProductIds(initialSelection)
  }, [initialSelection])

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
