'use client'

import React from 'react'
import styles from './ProductSelection.module.css'

interface ProductSearchProps {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

/**
 * Search input component for product filtering
 */
const ProductSearch = ({
  searchTerm,
  onSearchChange,
  disabled = false
}: ProductSearchProps): JSX.Element => {
  return (
    <div className={styles.searchContainer}>
      <input
        id="product-search"
        type="text"
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search products..."
        className={styles.searchInput}
        disabled={disabled}
      />
    </div>
  )
}

export default React.memo(ProductSearch)
