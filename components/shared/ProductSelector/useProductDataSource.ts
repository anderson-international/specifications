'use client'

import { useMemo } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useProductFilters } from './useProductFilters'
import type { Product } from './product-selector-interfaces'

interface UseProductDataSourceProps {
  externalProducts?: Product[] | null
}

interface UseProductDataSourceReturn {
  products: Product[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedBrand: string
  setSelectedBrand: (brand: string) => void
  availableBrands: string[]
}

export const useProductDataSource = ({
  externalProducts,
}: UseProductDataSourceProps): UseProductDataSourceReturn => {
  const internalData = useProducts()
  const externalData = useProductFilters()

  return useMemo(() => {
    if (externalProducts) {
      return {
        products: externalProducts,
        isLoading: false,
        error: null,
        searchTerm: externalData.searchTerm,
        setSearchTerm: externalData.setSearchTerm,
        selectedBrand: externalData.selectedBrand,
        setSelectedBrand: externalData.setSelectedBrand,
        availableBrands: externalData.getAvailableBrands(externalProducts),
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
}
