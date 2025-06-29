'use client'

import React, { useCallback } from 'react'
import Image from 'next/image'
import { Product } from './types'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
  isSelected: boolean
  onSelect: (handle: string) => void
  disabled?: boolean
}

/**
 * Card component to display a single product in the product grid
 */
const ProductCard = ({
  product,
  isSelected,
  onSelect,
  disabled = false
}: ProductCardProps): JSX.Element => {
  // Handle card click
  const handleClick = useCallback((): void => {
    if (disabled) return
    onSelect(product.handle)
  }, [disabled, onSelect, product.handle])

  // Handle keyboard interaction
  const handleKeyDown = useCallback((e: React.KeyboardEvent): void => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(product.handle)
    }
  }, [disabled, onSelect, product.handle])

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-pressed={isSelected}
    >
      <div className={styles.imageWrapper}>
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.title} 
            className={styles.productImage}
            width={80}
            height={80}
            priority={false}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>{product.title.substring(0, 2).toUpperCase()}</span>
          </div>
        )}
        
        {product.is_reviewed && (
          <div className={styles.reviewedBadge} title="Product has been reviewed">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              fill="currentColor" 
              viewBox="0 0 16 16"
            >
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
            </svg>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.brand}>{product.brand_name}</p>
      </div>
    </div>
  )
}

// Export with React.memo for performance optimization
export default React.memo(ProductCard)
