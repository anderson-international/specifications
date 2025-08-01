'use client'

import { useState, useMemo, useCallback } from 'react'
import type { FilterConfig } from '@/components/shared/FilterControls'
import type { Product } from '@/lib/types/product'

interface UserProduct extends Product {
  userHasSpec: boolean
  specCount: number
}

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
  activeTab: string
): UseToDoFiltersReturn {
  const [searchValue, setSearchValue] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string>('')

  const filteredProducts = useMemo(() => {
    if (activeTab !== 'to-do') return products
    
    return products.filter(product => {
      const matchesSearch = !searchValue || 
        product.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchValue.toLowerCase())
      
      const matchesBrand = !selectedBrand || product.brand === selectedBrand
      
      return matchesSearch && matchesBrand
    })
  }, [products, searchValue, selectedBrand, activeTab])

  const brandOptions = useMemo(() => {
    const brands = [...new Set(products.map(p => p.brand))].sort()
    return [
      { value: '', label: 'All Brands' },
      ...brands.map(brand => ({ value: brand, label: brand }))
    ]
  }, [products])

  const filters = useMemo(() => [{
    id: 'brand',
    label: 'Brand',
    value: selectedBrand,
    options: brandOptions
  }], [selectedBrand, brandOptions])

  const handleFilterChange = useCallback((id: string, value: string) => {
    if (id === 'brand') {
      setSelectedBrand(value)
    }
  }, [])

  const handleClearAll = useCallback(() => {
    setSearchValue('')
    setSelectedBrand('')
  }, [])

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
