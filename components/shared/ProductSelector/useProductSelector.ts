'use client'

import { useState, useCallback, useMemo } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useProductFilters } from './useProductFilters'
import type { UseProductSelectorProps, UseProductSelectorReturn } from './product-selector-types'
import { useFilteredProducts, useSelectedProducts, useBrandOptions } from './product-selector-memos'
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
  // ALWAYS call all hooks unconditionally (React rules compliance)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialSelection)
  
  const internalData = useProducts()
  const externalData = useProductFilters()
  
  // Conditionally select data sources AFTER all hooks are called
  const { products, isLoading, error, searchTerm, setSearchTerm, selectedBrand, setSelectedBrand } = useMemo(() => {
    if (externalProducts) {
      const availableBrands = externalData.getAvailableBrands(externalProducts)
      return {
        products: externalProducts,
        isLoading: false,
        error: null,
        searchTerm: externalData.searchTerm,
        setSearchTerm: externalData.setSearchTerm,
        selectedBrand: externalData.selectedBrand,
        setSelectedBrand: externalData.setSelectedBrand,
        availableBrands,
      }
    }
    return {
      products: internalData.products,
      isLoading: internalData.isLoading,
      error: internalData.error,
      searchTerm: internalData.searchTerm,
      setSearchTerm: internalData.setSearchTerm,
      selectedBrand: internalData.selectedBrand,
      setSelectedBrand: internalData.setSelectedBrand,
      availableBrands: internalData.availableBrands || [],
    }
  }, [externalProducts, internalData, externalData])

  // Always call memoized hooks for consistent hook order
  const filteredProducts = useFilteredProducts(products, searchTerm, selectedBrand)
  const selectedProducts = useSelectedProducts(products, selectedProductIds)
  const availableBrands = externalProducts ? externalData.getAvailableBrands(externalProducts) : (internalData.availableBrands || [])
  const brandOptions = useBrandOptions(availableBrands)

  // Always create handlers with useCallback
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
