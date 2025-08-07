'use client'

import React from 'react'
import { SaveStatus } from '../types/wizard.types'
import styles from './AutoSaveIndicator.module.css'

interface AutoSaveIndicatorProps {
  saveStatus: SaveStatus
  isEnabled: boolean
  productHandle: string | null
  lastError?: string | null
}

const AutoSaveIndicator = ({
  saveStatus,
  isEnabled,
  productHandle,
  lastError,
}: AutoSaveIndicatorProps): JSX.Element | null => {
  if (!isEnabled) {
    throw new Error('AutoSaveIndicator: isEnabled is false - component should not be rendered when autosave is disabled')
  }
  
  if (!productHandle) {
    throw new Error('AutoSaveIndicator: productHandle is null - component requires valid product handle for autosave functionality')
  }

  const getStatusText = (): string => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...'
      case 'saved':
        return 'Saved ✓'
      case 'error':
        return lastError ? `Save failed: ${lastError}` : 'Save failed'
      default:
        return ''
    }
  }

  const getStatusClassName = (): string => {
    switch (saveStatus) {
      case 'saving':
        return styles.saving
      case 'saved':
        return styles.saved
      case 'error':
        return styles.error
      default:
        return styles.idle
    }
  }

  const statusText = getStatusText()
  
  if (!statusText) {
    throw new Error(`AutoSaveIndicator: getStatusText returned empty string for status '${saveStatus}' - invalid state configuration`)
  }

  return (
    <div className={`${styles.indicator} ${getStatusClassName()}`}>
      <span className={styles.text}>
        {statusText}
      </span>
      {saveStatus === 'saving' && (
        <div className={styles.spinner} />
      )}
    </div>
  )
}

export default AutoSaveIndicator
