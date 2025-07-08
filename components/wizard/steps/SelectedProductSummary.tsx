'use client'

import React from 'react'
import Image from 'next/image'
import { Product } from './types'
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
          <p className={styles.brand}>{product.brand_name}</p>

          <div className={styles.metaData}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Shopify Handle:</span>
              <span className={styles.metaValue}>{product.handle}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Brand ID:</span>
              <span className={styles.metaValue}>{product.brand_id}</span>
            </div>
          </div>

          {product.is_reviewed && (
            <div className={styles.reviewedBadge}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
              <span>Previously Reviewed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Export with React.memo for performance optimization
export default React.memo(SelectedProductSummary)
