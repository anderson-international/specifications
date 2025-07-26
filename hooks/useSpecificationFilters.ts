'use client'

import { useState, useMemo } from 'react'
import { Specification } from '@/types/specification'

interface UseSpecificationFiltersReturn {
  brandFilter: string
  searchQuery: string
  setBrandFilter: (brand: string) => void
  setSearchQuery: (query: string) => void
  filteredSpecs: Specification[]
  availableBrands: Array<{ value: string; label: string }>
}

export function useSpecificationFilters(
  specifications: Specification[]
): UseSpecificationFiltersReturn {
  const [brandFilter, setBrandFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const availableBrands = useMemo(() => {
    const brands = Array.from(new Set(specifications.map(spec => spec.product?.brand || '').filter(Boolean)))
    return [
      { value: '', label: 'All Brands' },
      ...brands.map(brand => ({ value: brand, label: brand }))
    ]
  }, [specifications])

  const filteredSpecs = useMemo((): Specification[] => {
    return specifications.filter((spec) => {
      const matchesSearch =
        (spec.product?.title || spec.shopify_handle).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (spec.product?.brand || '').toLowerCase().includes(searchQuery.toLowerCase())
      const matchesBrand = brandFilter === '' || spec.product?.brand === brandFilter
      return matchesSearch && matchesBrand
    })
  }, [specifications, searchQuery, brandFilter])

  return {
    brandFilter,
    searchQuery,
    setBrandFilter,
    setSearchQuery,
    filteredSpecs,
    availableBrands,
  }
}
