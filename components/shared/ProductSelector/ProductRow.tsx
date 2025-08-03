'use client'

import React, { useCallback } from 'react'
import Image from 'next/image'
import { FileText } from 'lucide-react'
import type { ProductRowProps } from './product-selector-interfaces'
import styles from './ProductRow.module.css'
import rowStyles from '@/components/shared/RowStyles/RowStyles.module.css'
import buttonStyles from '@/components/shared/Button/Button.module.css'

const ProductRow = ({
  product,
  isSelected,
  onSelect,
  disabled = false,
  mode,
  userHasSpec,
  specCount,
  onCreateClick,
  onEditClick,
}: ProductRowProps): JSX.Element => {
  const getBadgeStyle = useCallback((count: number): string => {
    if (count <= 4) return styles.specCountBadgeRed
    if (count <= 9) return styles.specCountBadgeYellow
    return styles.specCountBadgeGreen
  }, [])
  const handleClick = useCallback(() => {
    if (!disabled && onSelect) {
      onSelect(product)
    }
  }, [disabled, onSelect, product])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleClick()
      }
    },
    [handleClick]
  )
  
  const handleCreateClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      if (!disabled && onCreateClick) {
        onCreateClick(product.id)
      }
    },
    [disabled, onCreateClick, product.id]
  )
  
  const handleEditClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      if (!disabled && onEditClick) {
        onEditClick(product.id)
      }
    },
    [disabled, onEditClick, product.id]
  )
  
  return (
    <div
      className={`${rowStyles.baseRow} ${isSelected ? rowStyles.rowSelected : ''} ${disabled ? styles.disabled : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role={mode === 'multi' ? 'checkbox' : 'button'}
      {...(mode === 'multi' && { 'aria-checked': isSelected })}
      aria-disabled={disabled}
    >
      <div className={rowStyles.imageWrapper}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            className={rowStyles.productImage}
            width={40}
            height={40}
            priority={false}
            loading="lazy"
          />
        ) : (
          <div className={rowStyles.imagePlaceholder}>
            <span>{product.title.substring(0, 2).toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className={rowStyles.rowInfo}>
        <h3 className={rowStyles.rowTitle}>{product.title}</h3>
      </div>

      <div className={styles.specCountContainer}>
        <FileText size={16} className={styles.specIcon} />
        <span className={`${styles.specCountBadge} ${getBadgeStyle(specCount ?? 0)}`}>
          {specCount ?? 0}
        </span>
      </div>

      {userHasSpec !== undefined && (
        <button
          className={userHasSpec ? buttonStyles.editButton : buttonStyles.createButton}
          onClick={userHasSpec ? handleEditClick : handleCreateClick}
          disabled={disabled}
          type="button"
          aria-label={userHasSpec ? `Edit specification for ${product.title}` : `Create specification for ${product.title}`}
        >
          {userHasSpec ? 'Edit' : 'Create'}
        </button>
      )}

      {mode === 'multi' && (
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => undefined}
            onClick={() => undefined}
            className={styles.checkboxInput}
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}

export default React.memo(ProductRow)
