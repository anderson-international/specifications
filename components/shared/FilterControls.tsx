'use client'

import React from 'react'
import { SearchInput } from './SearchInput'
import { FilterGroup } from './FilterGroup'
import styles from './FilterControls.module.css'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  id: string
  label: string
  value: string
  options: FilterOption[]
}

interface FilterControlsProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filters: FilterConfig[]
  onFilterChange: (id: string, value: string) => void
  onClearAll: () => void
  showClearAll: boolean
  summaryText?: string
  disabled?: boolean
}

export const FilterControls: React.FC<FilterControlsProps> = React.memo(
  ({
    searchQuery,
    onSearchChange,
    searchPlaceholder = 'Search by product...',
    filters,
    onFilterChange,
    onClearAll,
    showClearAll,
    summaryText,
  }) => {
    return (
      <div className={styles.container}>
        <div className={styles.searchRow}>
          <SearchInput
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            searchPlaceholder={searchPlaceholder}
          />
          <button
            onClick={onClearAll}
            className={`${styles.clearAllButton} ${styles.clearAllTop}`}
            type="button"
            disabled={!showClearAll}
            title="Clear all filters"
            aria-label="Clear all filters"
          >
            ×
          </button>
        </div>

        <div className={styles.filtersRow}>
          {filters.map((filter) => (
            <FilterGroup key={filter.id} filter={filter} onFilterChange={onFilterChange} />
          ))}
        </div>

        {summaryText && (
          <div className={styles.summary}>
            <span className={styles.count}>{summaryText}</span>
          </div>
        )}
      </div>
    )
  }
)

FilterControls.displayName = 'FilterControls'
