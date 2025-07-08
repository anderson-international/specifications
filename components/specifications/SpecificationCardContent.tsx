'use client'

import React from 'react'
import Image from 'next/image'
import { getStatusClass, getStatusLabel } from '@/lib/utils/specificationCardUtils'
import { formatRelativeTime } from '@/lib/utils'
import { Specification } from '@/types/specification'
import styles from './SpecificationCard.module.css'

interface SpecificationCardContentProps {
  specification: Specification
}

export function SpecificationCardContent({ specification }: SpecificationCardContentProps) {
  return (
    <>
      <div className={styles.imageContainer}>
        <Image
          src={specification.product.imageUrl || '/placeholder-product.jpg'}
          alt={specification.product.title}
          width={80}
          height={80}
          className={styles.productImage}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyEQnupkHOSt1ZVvNunn9gLauxqimNB3nWx7oPJQBmr4/7mMvmtaTgQ/wCbdY8+9SQdYN8m/KrKZ8IVr9FzKFdHlM/VNx0AAPnc2KDiHJwf4qOc7TtB4cTf/9k="
        />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.productName}>{specification.product.title}</h3>
          <div className={styles.brand}>{specification.product.brand}</div>
        </div>

        <div className={styles.meta}>
          <div className={`${styles.status} ${getStatusClass(specification.status)}`}>
            {getStatusLabel(specification.status)}
          </div>
          <div className={styles.lastModified}>
            {formatRelativeTime(specification.lastModified)}
          </div>
        </div>

        {specification.status === 'draft' && (
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${specification.progress}%` }}
              />
            </div>
            <span className={styles.progressText}>{specification.progress}% complete</span>
          </div>
        )}

        {(specification.status === 'approved' || specification.status === 'published') &&
          specification.score && (
            <div className={styles.score}>
              <span className={styles.scoreLabel}>Score:</span>
              <span className={styles.scoreValue}>{specification.score}/5</span>
            </div>
          )}
      </div>
    </>
  )
}
