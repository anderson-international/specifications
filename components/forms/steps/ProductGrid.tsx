'use client'

import { memo } from 'react'
import styles from './ProductSelection.module.css'

interface Product {
  id: string
  handle: string
  title: string
  brand: string
  image_url: string | null
  is_reviewed: boolean
}

interface ProductGridProps {
  products: Product[]
  selectedProduct: Product | null
  onProductSelect: (product: Product) => void
}

export const ProductGrid = memo<ProductGridProps>(function ProductGrid({
  products,
  selectedProduct,
  onProductSelect
}: ProductGridProps): JSX.Element {
  return (
    <div className={styles.productsGrid}>
      {products.map((product) => (
        <div
          key={product.id}
          className={`${styles.productCard} ${
            selectedProduct?.id === product.id ? styles.selected : ''
          }`}
          onClick={() => onProductSelect(product)}
        >
          <div className={styles.productHeader}>
            <h3 className={styles.productTitle}>{product.title}</h3>
            <p className={styles.productBrand}>{product.brand}</p>
          </div>
          
          <div className={styles.productStatus}>
            {product.is_reviewed ? (
              <span className={styles.reviewedBadge}>✓ Reviewed</span>
            ) : (
              <span className={styles.unreviewedBadge}>⏳ Pending</span>
            )}
          </div>

          {selectedProduct?.id === product.id && (
            <div className={styles.selectedIndicator}>
              <span className={styles.checkmark}>✓</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
})
