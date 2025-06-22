'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { MOCK_PRODUCTS, type MockProduct } from '@/constants/wizardOptions'

interface UseProductSelectionProps {
  shopifyHandle: string | null
  onProductSelect: (product: MockProduct) => void
}

interface UseProductSelectionReturn {
  searchTerm: string
  selectedBrandId: number | null
  selectedProduct: MockProduct | null
  filteredProducts: MockProduct[]
  handleBrandFilter: (brandId: number | null) => void
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleProductSelect: (product: MockProduct) => void
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
  
  // Selected product from current selection
  const selectedProduct = useMemo(() => {
    return MOCK_PRODUCTS.find(p => p.shopify_handle === shopifyHandle) || null
  }, [shopifyHandle])
  
  // Filtered products based on brand and search
  const filteredProducts = useMemo(() => {
    let filtered = [...MOCK_PRODUCTS]
    
    if (selectedBrandId) {
      filtered = filtered.filter(p => p.brand_id === selectedBrandId)
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.brand_name.toLowerCase().includes(term)
      )
    }
    
    return filtered
  }, [selectedBrandId, searchTerm])
  
  // Handle brand filter change
  const handleBrandFilter = useCallback((brandId: number | null): void => {
    setSelectedBrandId(brandId)
  }, [])
  
  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
  }, [])
  
  // Handle product selection
  const handleProductSelect = useCallback((product: MockProduct): void => {
    onProductSelect(product)
  }, [onProductSelect])
  
  return {
    searchTerm,
    selectedBrandId,
    selectedProduct,
    filteredProducts,
    handleBrandFilter,
    handleSearchChange,
    handleProductSelect
  }
}
