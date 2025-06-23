'use client'

import React from 'react'
import { PRODUCT_TYPES } from '@/constants/wizardOptions'
import styles from './ProductSelection.module.css'

interface ProductTypeFilterProps {
  selectedTypeId: number | null
  onTypeFilter: (typeId: number | null) => void
  disabled?: boolean
}

/**
 * Product Type filter component for filtering products by type
 */
const ProductTypeFilter = ({
  selectedTypeId,
  onTypeFilter,
  disabled = false
}: ProductTypeFilterProps): JSX.Element => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value
    onTypeFilter(value ? Number(value) : null)
  }

  return (
    <div className={styles.filterContainer}>
      <select
        id="product-type-filter"
        value={selectedTypeId || ''}
        onChange={handleTypeChange}
        disabled={disabled}
        className={styles.select}
      >
        <option value="">All Types</option>
        {PRODUCT_TYPES.map(type => (
          <option key={type.id} value={type.id}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default React.memo(ProductTypeFilter)
