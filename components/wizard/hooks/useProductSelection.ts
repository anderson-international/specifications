'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { MOCK_PRODUCTS, type MockProduct } from '@/constants/wizardOptions'
import { filterProducts, findProductByHandle } from '../utils/productFilters'

interface UseProductSelectionProps {
  shopifyHandle: string | null
  onProductSelect: (product: MockProduct) => void
}

interface UseProductSelectionReturn {
  searchTerm: string
  selectedBrandId: number | null
  selectedTypeId: number | null
  selectedProduct: MockProduct | null
  filteredProducts: MockProduct[]
  handleBrandFilter: (brandId: number | null) => void
  handleTypeFilter: (typeId: number | null) => void
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleProductSelect: (product: MockProduct) => void
  handleClearFilters: () => void
}

/**
 * Custom hook for product selection state management and filtering
 */
export const useProductSelection = ({
  shopifyHandle,
  onProductSelect
}: UseProductSelectionProps): UseProductSelectionReturn => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null)
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null)
  
  const selectedProduct = useMemo(() => findProductByHandle(MOCK_PRODUCTS as unknown as MockProduct[], shopifyHandle), [shopifyHandle])

  useEffect(() => {
    if (selectedProduct) {
      setSearchTerm(selectedProduct.name)
      setSelectedBrandId(selectedProduct.brand_id)
      setSelectedTypeId(selectedProduct.type_id)
    }
  }, [selectedProduct])
  
  const filteredProducts = useMemo(() => filterProducts(MOCK_PRODUCTS as unknown as MockProduct[], selectedBrandId, selectedTypeId, searchTerm), [selectedBrandId, selectedTypeId, searchTerm])
  
  const handleBrandFilter = useCallback((brandId: number | null): void => {
    setSelectedBrandId(brandId)
    setSearchTerm('')
  }, [])
  
  const handleTypeFilter = useCallback((typeId: number | null): void => {
    setSelectedTypeId(typeId)
    setSearchTerm('')
  }, [])
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
  }, [])
  
  const handleProductSelect = useCallback((product: MockProduct): void => {
    setSelectedBrandId(product.brand_id)
    setSelectedTypeId(product.type_id)
    setSearchTerm(product.name)
    onProductSelect(product)
  }, [onProductSelect])
  
  const handleClearFilters = useCallback(() => {
    setSelectedBrandId(null)
    setSelectedTypeId(null)
    setSearchTerm('')
  }, [])

  return {
    searchTerm,
    selectedBrandId,
    selectedTypeId,
    selectedProduct,
    filteredProducts,
    handleBrandFilter,
    handleTypeFilter,
    handleSearchChange,
    handleProductSelect,
    handleClearFilters
  }
}
