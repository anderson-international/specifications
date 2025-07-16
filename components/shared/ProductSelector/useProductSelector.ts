'use client'

import { useState, useCallback, useMemo } from 'react'
import { useProductDataSource } from './useProductDataSource'
import type { UseProductSelectorProps, UseProductSelectorReturn } from './product-selector-types'
import { useFilteredProducts, useSelectedProducts, useBrandOptions } from './product-selector-memos'
import type { Product } from './product-selector-interfaces'

export const useProductSelector = ({
  mode,
  initialSelection = [],
  onSelectionChange,
  products: externalProducts,
}: UseProductSelectorProps): UseProductSelectorReturn => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialSelection)

  const {
    products,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand,
    availableBrands,
  } = useProductDataSource({ externalProducts })

  const filteredProducts = useFilteredProducts(products, searchTerm, selectedBrand)
  const selectedProducts = useSelectedProducts(products, selectedProductIds)
  const brandOptions = useBrandOptions(availableBrands)

  const handleProductSelect = useCallback(
    (product: Product): void => {
      if (mode === 'single') {
        const newIds = [product.id]
        setSelectedProductIds(newIds)
        onSelectionChange(newIds)
      } else {
        setSelectedProductIds(prev => {
          const isSelected = prev.includes(product.id)
          return isSelected ? prev.filter(id => id !== product.id) : [...prev, product.id]
        })
      }
    },
    [mode, onSelectionChange]
  )

  const handleClearFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedBrand('')
  }, [setSearchTerm, setSelectedBrand])

  const handleRemoveProduct = useCallback(
    (productId: string) => {
      setSelectedProductIds(prev => prev.filter(id => id !== productId))
    },
    []
  )

  const handleClearAll = useCallback(() => {
    setSelectedProductIds([])
  }, [])

  const handleConfirmSelection = useCallback(() => {
    onSelectionChange(selectedProductIds)
  }, [onSelectionChange, selectedProductIds])

  return useMemo(() => ({
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
  }), [
    products, filteredProducts, selectedProducts, selectedProductIds, searchTerm,
    selectedBrand, isLoading, error, setSearchTerm, setSelectedBrand, 
    handleProductSelect, handleClearFilters, handleRemoveProduct, handleClearAll,
    handleConfirmSelection, brandOptions
  ])
}
