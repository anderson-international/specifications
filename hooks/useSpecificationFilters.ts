'use client'

import { useState, useMemo } from 'react'
import { Specification } from '@/types/specification'

interface UseSpecificationFiltersReturn {
  statusFilter: string
  searchQuery: string
  setStatusFilter: (status: string) => void
  setSearchQuery: (query: string) => void
  filteredSpecs: Specification[]
  groupedSpecs: {
    published: Specification[]
    needs_revision: Specification[]
  }
}

export function useSpecificationFilters(
  specifications: Specification[]
): UseSpecificationFiltersReturn {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filter specifications based on search and status - using useMemo to prevent infinite loops
  const filteredSpecs = useMemo((): Specification[] => {
    return specifications.filter((spec) => {
      const matchesSearch =
        spec.product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spec.product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || spec.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [specifications, searchQuery, statusFilter])

  // Group specifications by status - using useMemo for performance
  const groupedSpecs = useMemo(
    () => ({
      published: filteredSpecs.filter((spec) => spec.status === 'published'),
      needs_revision: filteredSpecs.filter((spec) => spec.status === 'needs_revision'),
    }),
    [filteredSpecs]
  )

  return {
    statusFilter,
    searchQuery,
    setStatusFilter,
    setSearchQuery,
    filteredSpecs,
    groupedSpecs,
  }
}
