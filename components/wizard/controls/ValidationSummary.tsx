'use client'

import React, { useCallback } from 'react'
import styles from './ValidationSummary.module.css'

export interface ValidationError {
  fieldName: string
  message: string
}

interface ValidationSummaryProps {
  errors: ValidationError[]
  onFieldFocus?: (fieldName: string) => void
}

/**
 * A component that displays all validation errors for a step
 * Provides a consistent UI for error messaging and links to invalid fields
 */
const ValidationSummary = ({
  errors,
  onFieldFocus
}: ValidationSummaryProps): JSX.Element | null => {
  // Handle click on an error link
  const handleErrorClick = useCallback((e: React.MouseEvent, fieldName: string): void => {
    e.preventDefault()
    if (onFieldFocus) {
      onFieldFocus(fieldName)
    }
  }, [onFieldFocus])
  
  // Skip rendering if no errors
  if (!errors || errors.length === 0) {
    return null
  }

  return (
    <div className={styles.container} role="alert" aria-live="polite">
      <div className={styles.header}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          fill="currentColor" 
          viewBox="0 0 16 16"
          className={styles.icon}
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
        </svg>
        <span>{errors.length} {errors.length === 1 ? 'error' : 'errors'} found</span>
      </div>

      <ul className={styles.errorList}>
        {errors.map((error, index) => (
          <li key={`${error.fieldName}-${index}`} className={styles.errorItem}>
            {onFieldFocus ? (
              <a 
                href="#" 
                onClick={(e): void => handleErrorClick(e, error.fieldName)}
                className={styles.errorLink}
              >
                {error.message}
              </a>
            ) : (
              <span>{error.message}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Export with React.memo for performance optimization
export default React.memo(ValidationSummary)
