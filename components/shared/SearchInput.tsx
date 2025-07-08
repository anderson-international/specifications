'use client'

import React, { useCallback } from 'react'
import styles from './FilterControls.module.css'

interface SearchInputProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
}

export const SearchInput: React.FC<SearchInputProps> = React.memo(
  ({ searchQuery, onSearchChange, searchPlaceholder }) => {
    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>): void => {
        onSearchChange(e.target.value)
      },
      [onSearchChange]
    )

    return (
      <div className={styles.searchGroup}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
            aria-label="Search"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className={styles.clearButton}
              type="button"
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
