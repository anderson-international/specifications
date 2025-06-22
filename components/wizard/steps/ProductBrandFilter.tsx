'use client'

import React from 'react'
import { PRODUCT_BRANDS } from '@/constants/wizardOptions'
import styles from './ProductSelection.module.css'

interface ProductBrandFilterProps {
  selectedBrandId: number | null
  onBrandFilter: (brandId: number | null) => void
  disabled?: boolean
}

/**
 * Brand filter component for product selection
 */
const ProductBrandFilter = ({
  selectedBrandId,
  onBrandFilter,
  disabled = false
}: ProductBrandFilterProps): JSX.Element => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value
    onBrandFilter(value === '' ? null : parseInt(value, 10))
  }

  return (
    <div className={styles.filterContainer}>
      <select
        id="brand-filter"
        value={selectedBrandId ?? ''}
        onChange={handleChange}
        disabled={disabled}
        className={styles.select}
      >
        <option value="">All Brands</option>
        {PRODUCT_BRANDS.map(brand => (
          <option key={brand.id} value={brand.id}>
            {brand.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default React.memo(ProductBrandFilter)
