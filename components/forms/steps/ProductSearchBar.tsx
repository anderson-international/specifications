'use client'

import { memo } from 'react'
import styles from './ProductSelection.module.css'

interface ProductSearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export const ProductSearchBar = memo<ProductSearchBarProps>(function ProductSearchBar({
  searchTerm,
  onSearchChange
}: ProductSearchBarProps): JSX.Element {
  return (
    <div className={styles.searchSection}>
      <label htmlFor="search" className={styles.label}>
        Search Products
      </label>
      <input
        id="search"
        type="text"
        placeholder="Search by name or brand..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  )
})
