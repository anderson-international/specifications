'use client'

import React from 'react'
import Image from 'next/image'
import { Product } from '@/lib/types/product'
import styles from './SelectedProductSummary.module.css'

interface SelectedProductSummaryProps {
  product: Product | null
}

/**
 * Displays a summary of the selected product
 */
const SelectedProductSummary = ({ product }: SelectedProductSummaryProps): JSX.Element | null => {
  if (!product) return null

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Selected Product</h3>

      <div className={styles.summary}>
        <div className={styles.imageWrapper}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              className={styles.productImage}
              width={100}
              height={100}
              priority={false}
              loading="lazy"
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <span>{product.title.substring(0, 2).toUpperCase()}</span>
            </div>
          )}
        </div>

        <div className={styles.details}>
          <h4 className={styles.title}>{product.title}</h4>
          <p className={styles.brand}>{product.brand}</p>

          <div className={styles.metaData}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Shopify Handle:</span>
              <span className={styles.metaValue}>{product.handle}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Brand:</span>
              <span className={styles.metaValue}>{product.brand}</span>
            </div>
          </div>

          {/* Reviewed badge removed - is_reviewed property not available in canonical Product interface */}
        </div>
      </div>
    </div>
  )
}

// Export with React.memo for performance optimization
export default React.memo(SelectedProductSummary)
