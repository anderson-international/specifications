'use client'

import React, { useCallback } from 'react'
import { type Product } from '@/lib/types/product'
import ProductCard from './ProductCard'
import styles from './ProductGrid.module.css'

interface ProductGridProps {
  products: Product[]
  selectedHandle: string | null
  onProductSelect: (product: Product) => void
  disabled?: boolean
}

/**
 * Product grid display component with selection functionality
 */
const ProductGrid = ({
  products,
  selectedHandle,
  onProductSelect,
  disabled = false,
}: ProductGridProps): JSX.Element => {
  const handleSelect = useCallback(
    (handle: string) => {
      const selectedProduct = products.find((p) => p.handle === handle)
      if (selectedProduct) {
        onProductSelect(selectedProduct)
      }
    },
    [products, onProductSelect]
  )

  if (products.length === 0) {
    return <div className={styles.noResults}>No products found matching your criteria.</div>
  }

  return (
    <div className={styles.productGrid}>
      {products.map((product) => {
        // Product already has correct format - no mapping needed
        return (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={product.handle === selectedHandle}
            onSelect={handleSelect}
            disabled={disabled}
          />
        )
      })}
    </div>
  )
}

export default React.memo(ProductGrid)
