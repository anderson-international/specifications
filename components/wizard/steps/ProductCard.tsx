'use client'

import React, { useCallback } from 'react'
import ProductThumbnail from '@/components/shared/ProductThumbnail/ProductThumbnail'
import { useKeyboardSelect } from '@/hooks/useKeyboardSelect'
import { Product } from './types'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
  isSelected: boolean
  onSelect: (handle: string) => void
  disabled?: boolean
}


const ProductCard = ({
  product,
  isSelected,
  onSelect,
  disabled = false,
}: ProductCardProps): JSX.Element => {
  const handleClick = useCallback((): void => {
    if (disabled) return
    onSelect(product.handle)
  }, [disabled, onSelect, product.handle])

  const handleKeyDown = useKeyboardSelect(disabled, handleClick)

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-pressed={isSelected}
    >
      <ProductThumbnail
        imageUrl={product.image_url}
        title={product.title}
        width={80}
        height={80}
        wrapperClassName={styles.imageWrapper}
        imageClassName={styles.productImage}
        placeholderClassName={styles.imagePlaceholder}
        priority={false}
        loading="lazy"
      />

      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.brand}>{product.brand}</p>
      </div>
    </div>
  )
}

export default React.memo(ProductCard)
