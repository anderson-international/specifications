'use client'

import React from 'react'
import ProductRow from '@/components/shared/ProductSelector/ProductRow'
import { Specification } from '@/types/specification'
import styles from '../../app/specifications/specifications.module.css'

interface AISpecificationItemProps {
  specification: Specification
  onClick: (id: string) => void
  showAIIndicators?: boolean
}

export default function AISpecificationItem({ 
  specification, 
  onClick, 
  showAIIndicators 
}: AISpecificationItemProps): JSX.Element {
  const handleClick = () => {
    onClick(specification.id)
  }

  if (!specification.product) {
    return <div>Product not found</div>
  }

  if (showAIIndicators) {
    return (
      <div className={styles.aiSpecWrapper}>
        <ProductRow
          product={specification.product}
          onEditClick={handleClick}
          mode="single"
          userHasSpec={true}
          specCount={1}
        />
        <div className={styles.aiIndicator}>
          <span className={styles.aiTag}>AI Generated</span>
          <span className={styles.aiModel}>AI Synthesized</span>
          <span className={styles.aiConfidence}>
            Generated Specification
          </span>
        </div>
      </div>
    )
  }

  return (
    <ProductRow
      product={specification.product}
      onEditClick={handleClick}
      mode="single"
      userHasSpec={true}
      specCount={1}
    />
  )
}
