import { FilterOption, FilterConfig } from '@/components/shared/FilterControls'

export interface UseItemListFiltersConfig<T> {
  items: T[]
  searchFields: (item: T) => string[]
  getFilterValue: (item: T, filterId: string) => string
  getAvailableFilterOptions: (items: T[], filterId: string) => FilterOption[]
  filterIds: string[]
}

export interface UseItemListFiltersReturn<T> {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: Record<string, string>
  setFilter: (filterId: string, value: string) => void
  filteredItems: T[]
  availableFilterOptions: Record<string, FilterOption[]>
  filterConfigs: FilterConfig[]
  clearAll: () => void
  hasActiveFilters: boolean
}
