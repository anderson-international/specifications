'use client'

import React, { useCallback } from 'react'
import styles from './FilterControls.module.css'
import { FilterConfig, FilterOption } from './FilterControls'

interface FilterGroupProps {
  filter: FilterConfig
  onFilterChange: (id: string, value: string) => void
}

export const FilterGroup: React.FC<FilterGroupProps> = React.memo(
  ({
    filter,
    onFilterChange,
  }) => {
    const handleFilterChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>): void => {
        onFilterChange(filter.id, e.target.value)
      },
      [filter.id, onFilterChange]
    )

    return (
      <div key={filter.id} className={styles.filterGroup}>
        {filter.label && (
          <label htmlFor={filter.id} className={styles.label}>
            {filter.label}
          </label>
        )}
        <select
          id={filter.id}
          value={filter.value}
          onChange={handleFilterChange}
          className={styles.select}
        >
          {filter.options.map((option: FilterOption) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
)

FilterGroup.displayName = 'FilterGroup'
