'use client'

import React, { useCallback } from 'react'
import { type MockProduct } from '@/constants/wizardOptions'
import ProductCard from './ProductCard'
import styles from './ProductGrid.module.css'

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
  disabled = false,
}: ProductGridProps): JSX.Element => {
  const handleSelect = useCallback(
    (handle: string) => {
      const selectedProduct = products.find((p) => p.shopify_handle === handle)
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
        const cardProduct = {
          id: product.id,
          title: product.name,
          handle: product.shopify_handle,
          brand_id: product.brand_id,
          brand_name: product.brand_name,
          image_url: product.image_url,
          is_reviewed: product.reviewed,
        }

        return (
          <ProductCard
            key={product.id}
            product={cardProduct}
            isSelected={product.shopify_handle === selectedHandle}
            onSelect={handleSelect}
            disabled={disabled}
          />
        )
      })}
    </div>
  )
}

export default React.memo(ProductGrid)
