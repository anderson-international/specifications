'use client'

import React, { useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import styles from './ProductCard.module.css'

interface Product {
  id: string
  handle: string
  title: string
  brand: string
  image_url: string | null
  is_reviewed: boolean
}

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps): JSX.Element {
  const router = useRouter()

  const handleCreateSpec = useCallback((): void => {
    router.push(`/create-specification?productId=${product.id}`)
  }, [product.id, router])

  return (
    <div className={`${styles.card} ${product.is_reviewed ? styles.reviewed : styles.unreviewed}`}>
      {/* Status Indicator */}
      <div className={styles.statusBadge}>
        {product.is_reviewed ? (
          <span className={styles.reviewedBadge}>
            ✓ Reviewed
          </span>
        ) : (
          <span className={styles.unreviewedBadge}>
            ⏳ Pending
          </span>
        )}
      </div>

      {/* Product Image with Optimization */}
      <div className={styles.imageContainer}>
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.title}
            className={styles.image}
            width={200}
            height={200}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span className={styles.placeholderIcon}>📦</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{product.title}</h3>
          <p className={styles.brand}>{product.brand}</p>
        </div>

        <div className={styles.handle}>
          Handle: <code className={styles.handleCode}>{product.handle}</code>
        </div>

        {/* Action Button */}
        <div className={styles.actions}>
          {product.is_reviewed ? (
            <button 
              className={styles.secondaryButton}
              onClick={handleCreateSpec}
              type="button"
            >
              Review Again
            </button>
          ) : (
            <button 
              className={styles.primaryButton}
              onClick={handleCreateSpec}
              type="button"
            >
              Create Specification
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default React.memo(ProductCard)
