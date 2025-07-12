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
  disabled = false,
}: ProductCardProps): JSX.Element => {
  // Handle card click
  const handleClick = useCallback((): void => {
    if (disabled) return
    onSelect(product.handle)
  }, [disabled, onSelect, product.handle])

  // Handle keyboard interaction
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): void => {
      if (disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onSelect(product.handle)
      }
    },
    [disabled, onSelect, product.handle]
  )

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

        {/* Reviewed badge removed - is_reviewed property not available in canonical Product interface */}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.brand}>{product.brand}</p>
      </div>
    </div>
  )
}

// Export with React.memo for performance optimization
export default React.memo(ProductCard)
