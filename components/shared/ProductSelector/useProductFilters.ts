'use client'

import { useState, useMemo } from 'react'
import { Product } from '@/lib/types/product'

/**
 * Hook for managing product filtering UI state without data fetching
 * Used when external products are provided to avoid redundant API calls
 */
export function useProductFilters() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedBrand, setSelectedBrand] = useState<string>('')

  const filterProducts = useMemo(() => (products: Product[]) => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedBrand) {
      filtered = filtered.filter((product) => product.brand === selectedBrand)
    }

    return filtered
  }, [searchTerm, selectedBrand])

  const getAvailableBrands = useMemo(() => (products: Product[]) => {
    return Array.from(new Set(products.map((p) => p.brand)))
  }, [])

  return {
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand,
    filterProducts,
    getAvailableBrands,
  }
}
