'use client'

import React, { useCallback } from 'react'
import styles from './ProductSearch.module.css'

interface ProductSearchProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  disabled?: boolean
}

/**
 * Search input for product filtering
 */
const ProductSearch = ({
  searchTerm,
  onSearchChange,
  disabled = false
}: ProductSearchProps): JSX.Element => {
  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(e.target.value)
  }, [onSearchChange])

  // Handle clearing the search
  const handleClearSearch = useCallback((): void => {
    onSearchChange('')
  }, [onSearchChange])

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBox}>
        <svg
          className={styles.searchIcon}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className={styles.searchInput}
          disabled={disabled}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            className={styles.clearButton}
            disabled={disabled}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

// Export with React.memo for performance optimization
export default React.memo(ProductSearch)
