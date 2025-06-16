'use client'

import React, { useMemo } from 'react'
import ProductCard from './ProductCard'
import { Product } from './types'
import styles from './ProductGrid.module.css'

interface ProductGridProps {
  products: Product[]
  selectedProduct: Product | null
  onProductSelect: (product: Product) => void
  disabled?: boolean
}

/**
 * Grid component to display product cards
 */
const ProductGrid = ({
  products,
  selectedProduct,
  onProductSelect,
  disabled = false
}: ProductGridProps): JSX.Element => {
  // Calculate review stats
  const reviewStats = useMemo((): { total: number; reviewed: number } => {
    const reviewed = products.filter(p => p.is_reviewed).length
    return {
      total: products.length,
      reviewed
    }
  }, [products])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Select a Product</h3>
        <div className={styles.stats}>
          <span className={styles.statsReviewed}>{reviewStats.reviewed}</span>
          {' / '}
          <span className={styles.statsTotal}>{reviewStats.total}</span>
          {' products reviewed'}
        </div>
      </div>

      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.gridItem}>
              <ProductCard
                product={product}
                isSelected={selectedProduct?.id === product.id}
                onSelect={onProductSelect}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <svg
            className={styles.emptyIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
          </svg>
          <p>No products found matching your search.</p>
        </div>
      )}
    </div>
  )
}

// Export with React.memo for performance optimization
export default React.memo(ProductGrid)
