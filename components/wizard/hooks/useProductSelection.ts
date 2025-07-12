'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Product } from '@/lib/types/product'
import { useProducts } from '@/hooks/useProducts'
import { filterProducts, findProductByHandle } from '../utils/productFilters'

interface UseProductSelectionProps {
  shopifyHandle: string | null
  onProductSelect: (product: Product) => void
}

interface UseProductSelectionReturn {
  searchTerm: string
  selectedBrandId: string | null
  selectedTypeId: number | null
  selectedProduct: Product | null
  filteredProducts: Product[]
  handleBrandFilter: (brandId: string | null) => void
  handleTypeFilter: (typeId: number | null) => void
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleProductSelect: (product: Product) => void
  handleClearFilters: () => void
}

export const useProductSelection = ({
  shopifyHandle,
  onProductSelect,
}: UseProductSelectionProps): UseProductSelectionReturn => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null)

  // Use real product data instead of mock data
  const { filteredProducts: allProducts } = useProducts()

  const selectedProduct = useMemo(
    () => findProductByHandle(allProducts, shopifyHandle),
    [allProducts, shopifyHandle]
  )

  useEffect(() => {
    if (selectedProduct) {
      setSearchTerm(selectedProduct.title)
      setSelectedBrandId(selectedProduct.brand)
      // Note: type_id not available in Product - needs separate lookup if required
      setSelectedTypeId(null)
    }
  }, [selectedProduct])

  const filteredProducts = useMemo(
    () => filterProducts(
      allProducts,
      selectedBrandId, // string | null - matches Product.brand
      selectedTypeId,  // number | null - not used in filtering since Product lacks type_id
      searchTerm
    ),
    [allProducts, selectedBrandId, selectedTypeId, searchTerm]
  )

  const handleBrandFilter = useCallback((brandId: string | null): void => {
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

  const handleProductSelect = useCallback(
    (product: Product): void => {
      setSelectedBrandId(product.brand)
      setSelectedTypeId(null) // type_id not available in Product
      setSearchTerm(product.title)
      onProductSelect(product)
    },
    [onProductSelect]
  )

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
    handleClearFilters,
  }
}
