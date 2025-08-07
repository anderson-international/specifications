'use client'

import React from 'react'
import Image from 'next/image'
import { Product } from '@/lib/types/product'
import styles from './SelectedProductSummary.module.css'

interface SelectedProductSummaryProps {
  product: Product
}

const SelectedProductSummary = ({ product }: SelectedProductSummaryProps): JSX.Element => {
  if (!product) {
    throw new Error('SelectedProductSummary: product is required but missing. Check product selection state and component usage.')
  }

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        <div className={styles.imageWrapper}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              className={styles.productImage}
              width={40}
              height={40}
              priority={false}
              loading="lazy"
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <span>{product.title.substring(0, 2).toUpperCase()}</span>
            </div>
          )}
        </div>
        <h4 className={styles.title}>{product.title}</h4>
      </div>
    </div>
  )
}

export default React.memo(SelectedProductSummary)
