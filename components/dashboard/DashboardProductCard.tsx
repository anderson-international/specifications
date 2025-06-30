import React from 'react'
import styles from '../../app/Dashboard.module.css'

interface Product {
  handle: string
  title: string
  brand?: string
  spec_count: number
  image_url: string | null
}

interface DashboardProductCardProps {
  product: Product
  isZeroSpecs?: boolean
}

const DashboardProductCard: React.FC<DashboardProductCardProps> = React.memo(({ 
  product, 
  isZeroSpecs = false 
}): JSX.Element => {
  const badgeClass = isZeroSpecs ? styles.specBadgeZero : styles.specBadgeOne
  const specText = `${product.spec_count}`

  return (
    <div className={styles.productCard}>
      <div className={styles.productImageContainer}>
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.title}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.productImagePlaceholder}>
            <span>No Image</span>
          </div>
        )}
        <span className={`${badgeClass} ${styles.productBadgeOverlay}`}>{specText}</span>
      </div>
      <div className={styles.productInfo}>
        <h4 className={styles.productTitle}>{product.title}</h4>
        {product.brand && <p className={styles.productBrand}>{product.brand}</p>}
      </div>
      <div className={styles.productActions}>
        <button 
          className={styles.reviewButton}
          onClick={() => window.open(`/products/${product.handle}`, '_blank')}
          type="button"
        >
          Add Specification
        </button>
      </div>
    </div>
  )
})

DashboardProductCard.displayName = 'DashboardProductCard'

export default DashboardProductCard
