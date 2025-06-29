'use client'

import React, { useCallback, memo } from 'react'

import styles from './ProductFilters.module.css'

interface ProductFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedBrand: string
  onBrandChange: (value: string) => void
  availableBrands: string[]
}

function ProductFilters({
  searchTerm,
  onSearchChange,
  selectedBrand,
  onBrandChange,
  availableBrands
}: ProductFiltersProps): JSX.Element {
  
  const handleClearFilters = useCallback((): void => {
    onSearchChange('')
    onBrandChange('')
  }, [onSearchChange, onBrandChange])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(e.target.value)
  }, [onSearchChange])

  const handleBrandChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    onBrandChange(e.target.value)
  }, [onBrandChange])

  return (
    <div className={styles.filters}>
      {/* Search Input */}
      <div className={styles.searchGroup}>
        <label htmlFor="search" className={styles.label}>
          Search Products
        </label>
        <div className={styles.searchWrapper}>
          <input
            id="search"
            type="text"
            placeholder="Search by product name or brand..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          {searchTerm ? (
            <button
              onClick={() => onSearchChange('')}
              className={styles.searchIcon}
              type="button"
              aria-label="Clear search"
            >
              &times;
            </button>
          ) : (
            <span className={styles.searchIcon}>🔍</span>
          )}
        </div>
      </div>

      {/* Brand Filter */}
      <div className={styles.filterGroup}>
        <label htmlFor="brand" className={styles.label}>
          Filter by Brand
        </label>
        <select
          id="brand"
          value={selectedBrand}
          onChange={handleBrandChange}
          className={styles.select}
        >
          <option value="">All Brands</option>
          {availableBrands.sort().map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {(searchTerm || selectedBrand) && (
        <button
          onClick={handleClearFilters}
          className={styles.clearButton}
          type="button"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}

export default memo(ProductFilters)
