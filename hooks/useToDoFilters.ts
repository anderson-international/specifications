'use client'

import { useState, useMemo, useCallback } from 'react'
import type { FilterConfig } from '@/components/shared/FilterControls'
import type { UserProduct } from '@/lib/services/user-products-service'
import type { SpecTabId } from '@/hooks/useUserProducts'
import { usePerTabBrandFilter } from './specs/usePerTabBrandFilter'
import { useProductFilterData } from './specs/useProductFilterData'

interface UseToDoFiltersReturn {
  searchValue: string
  selectedBrand: string
  setSearchValue: (value: string) => void
  setSelectedBrand: (value: string) => void
  filteredProducts: UserProduct[]
  filters: FilterConfig[]
  handleFilterChange: (id: string, value: string) => void
  handleClearAll: () => void
  showClearAll: boolean
}

export function useToDoFilters(
  products: UserProduct[],
  activeTab: SpecTabId
): UseToDoFiltersReturn {
  const [searchValue, setSearchValue] = useState('')
  const { selectedBrand, setSelectedBrand, clearBrand } = usePerTabBrandFilter(activeTab)

  const { filteredProducts, brandOptions } = useProductFilterData(products, searchValue, selectedBrand)

  const filters: FilterConfig[] = useMemo(() => ([{
    id: 'brand',
    label: 'Brand',
    value: selectedBrand,
    options: brandOptions,
  }]), [selectedBrand, brandOptions])

  const handleFilterChange = useCallback((id: string, value: string): void => {
    if (id === 'brand') {
      setSelectedBrand(value)
    }
  }, [setSelectedBrand])

  const handleClearAll = useCallback((): void => {
    setSearchValue('')
    clearBrand()
  }, [clearBrand])

  const showClearAll = searchValue !== '' || selectedBrand !== ''

  return {
    searchValue,
    selectedBrand,
    setSearchValue,
    setSelectedBrand,
    filteredProducts,
    filters,
    handleFilterChange,
    handleClearAll,
    showClearAll
  }
}
