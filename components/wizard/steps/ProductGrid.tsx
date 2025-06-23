'use client'

import React from 'react'
import { type MockProduct } from '@/constants/wizardOptions'
import styles from './ProductSelection.module.css'

interface ProductGridProps {
  products: MockProduct[]
  selectedHandle: string | null
  onProductSelect: (product: MockProduct) => void
  disabled?: boolean
}

/**
 * Product grid display component with selection functionality
 */
const ProductGrid = ({
  products,
  selectedHandle,
  onProductSelect,
  disabled = false
}: ProductGridProps): JSX.Element => {
  if (products.length === 0) {
    return (
      <div className={styles.noResults}>
        No products found matching your criteria.
      </div>
    )
  }

  return (
    <div className={styles.productGrid}>
      {products.map(product => (
        <button
          key={product.id}
          type="button"
          onClick={() => onProductSelect(product)}
          className={`${styles.productCard} ${
            product.shopify_handle === selectedHandle ? styles.selected : ''
          } ${product.reviewed ? styles.reviewed : ''}`}
          disabled={disabled}
          aria-pressed={product.shopify_handle === selectedHandle}
          aria-describedby={`product-${product.id}-details`}
        >
          <div className={styles.productImage}>
            <div className={styles.imagePlaceholder}>
              📦
            </div>
          </div>
          <div className={styles.productInfo}>
            <span className={styles.productName}>{product.name}</span>
            <span className={styles.brandName}>{product.brand_name}</span>
          </div>
        </button>
      ))}
    </div>
  )
}

export default React.memo(ProductGrid)
