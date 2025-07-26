'use client'

import React from 'react'
import { SpecificationRow } from '@/components/specifications/SpecificationRow'
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
  if (showAIIndicators) {
    return (
      <div className={styles.aiSpecWrapper}>
        <SpecificationRow
          specification={specification}
          onClick={onClick}
          isAI={true}
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
    <SpecificationRow
      specification={specification}
      onClick={onClick}
    />
  )
}
