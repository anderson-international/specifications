'use client'

import React, { useCallback } from 'react'
import { Check } from 'lucide-react'
import type { ProductRowProps } from './product-selector-interfaces'
import styles from './ProductRow.module.css'
import rowStyles from '@/components/shared/RowStyles/RowStyles.module.css'
import ProductThumbnail from '@/components/shared/ProductThumbnail/ProductThumbnail'
import { useKeyboardSelect } from '@/hooks/useKeyboardSelect'

const ProductRow = ({
  product,
  isSelected,
  onSelect,
  disabled = false,
  mode,
  userHasSpec,
  specCount,
  hasLocalDraft,
  onCreateClick,
  onEditClick,
}: ProductRowProps): JSX.Element => {
  const handleClick = useCallback((): void => {
    if (disabled) return
    if (onSelect) {
      onSelect(product)
      return
    }
    if (userHasSpec && onEditClick) {
      const specId = (product as { specification_id?: string }).specification_id
      if (specId) {
        onEditClick(specId)
        return
      }
    }
    if (onCreateClick) {
      const pid = (product as { handle?: string }).handle ?? product.id
      onCreateClick(pid)
    }
  }, [disabled, onSelect, product, userHasSpec, onEditClick, onCreateClick])

  const handleKeyDown = useKeyboardSelect(disabled, handleClick)

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
      <ProductThumbnail
        imageUrl={product.image_url}
        title={product.title}
        width={40}
        height={40}
        wrapperClassName={rowStyles.imageWrapper}
        imageClassName={rowStyles.productImage}
        placeholderClassName={rowStyles.imagePlaceholder}
        priority={false}
        loading="lazy"
      />
      <div className={rowStyles.rowInfo}>
        <h3 className={rowStyles.rowTitle}>{product.title}</h3>
      </div>

      <div className={styles.rightMeta}>
        {hasLocalDraft && (
          <div
            className={styles.userSpecIndicator}
            title="Draft saved locally"
            aria-label="Draft saved locally"
          >
            <Check size={16} />
          </div>
        )}
        {(() => {
          const c = specCount ?? 0
          const cls = c <= 4
            ? rowStyles.countBadgeRed
            : c <= 9
              ? rowStyles.countBadgeYellow
              : rowStyles.countBadgeGreen
          return (
            <span className={`${rowStyles.countBadge} ${cls}`}>{c}</span>
          )
        })()}
      </div>

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

