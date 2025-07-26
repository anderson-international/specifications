import { useMemo, useState } from 'react'
import { FilterOption } from '@/components/shared/FilterControls'
import type { UseItemListFiltersConfig, UseItemListFiltersReturn } from './useItemListFilters.types'

export function useItemListFilters<T>({
  items,
  searchFields,
  getFilterValue,
  getAvailableFilterOptions,
  filterIds,
}: UseItemListFiltersConfig<T>): UseItemListFiltersReturn<T> {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})

  const setFilter = (filterId: string, value: string): void => {
    setFilters(prev => ({
      ...prev,
      [filterId]: value,
    }))
  }

  const clearAll = (): void => {
    setSearchQuery('')
    setFilters({})
  }

  const availableFilterOptions = useMemo(() => {
    const options: Record<string, FilterOption[]> = {}
    filterIds.forEach(filterId => {
      options[filterId] = getAvailableFilterOptions(items, filterId)
    })
    return options
  }, [items, filterIds, getAvailableFilterOptions])

  const filteredItems = useMemo(() => {
    let filtered = items


    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(item =>
        searchFields(item).some(field =>
          field.toLowerCase().includes(query)
        )
      )
    }


    filterIds.forEach(filterId => {
      const filterValue = filters[filterId]
      if (filterValue && filterValue.trim()) {
        filtered = filtered.filter(item =>
          getFilterValue(item, filterId) === filterValue
        )
      }
    })

    return filtered
  }, [items, searchQuery, filters, searchFields, getFilterValue, filterIds])

  const filterConfigs = useMemo(() => {
    return filterIds.map(filterId => ({
      id: filterId,
      label: filterId.charAt(0).toUpperCase() + filterId.slice(1),
      value: filters[filterId] || '',
      options: availableFilterOptions[filterId] || [],
    }))
  }, [filterIds, filters, availableFilterOptions])

  const hasActiveFilters = useMemo(() => {
    return searchQuery !== '' || Object.values(filters).some(value => value !== '')
  }, [searchQuery, filters])

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    filteredItems,
    availableFilterOptions,
    filterConfigs,
    clearAll,
    hasActiveFilters,
  }
}
