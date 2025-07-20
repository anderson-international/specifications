'use client'

import { useState, useMemo } from 'react'
import { Specification, SpecificationStatus } from '@/types/specification'

interface AISpecificationFiltersReturn {
  searchQuery: string
  statusFilter: SpecificationStatus | 'all'
  filteredSpecifications: Specification[]
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: SpecificationStatus | 'all') => void
  clearAllFilters: () => void
}

export function useAISpecificationFilters(
  specifications: Specification[]
): AISpecificationFiltersReturn {
  const [statusFilter, setStatusFilter] = useState<SpecificationStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredSpecs = useMemo((): Specification[] => {
    return specifications.filter((spec) => {
      const matchesSearch =
        spec.product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spec.product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || spec.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [specifications, searchQuery, statusFilter])

  const clearAllFilters = (): void => {
    setStatusFilter('all')
    setSearchQuery('')
  }

  return {
    searchQuery,
    statusFilter,
    filteredSpecifications: filteredSpecs,
    setSearchQuery,
    setStatusFilter,
    clearAllFilters
  }
}
