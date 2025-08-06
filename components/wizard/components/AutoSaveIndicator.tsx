'use client'

import React, { useState, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WizardFormData } from '../types/wizard.types'
import styles from './AutoSaveIndicator.module.css'

interface AutoSaveIndicatorProps {
  methods: UseFormReturn<WizardFormData>
  isEnabled: boolean
  productHandle: string | null
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const AutoSaveIndicator = ({
  methods,
  isEnabled,
  productHandle,
}: AutoSaveIndicatorProps): JSX.Element | null => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null)

  // Watch for form changes to show "saving" status
  useEffect(() => {
    if (!isEnabled || !productHandle) return

    const subscription = methods.watch(() => {
      setSaveStatus('saving')
      
      // Simulate save completion after debounce period
      const timeout = setTimeout(() => {
        setSaveStatus('saved')
        setLastSavedTime(new Date())
        
        // Reset to idle after showing saved status
        const resetTimeout = setTimeout(() => {
          setSaveStatus('idle')
        }, 2000)
        
        return () => clearTimeout(resetTimeout)
      }, 3000)

      return () => clearTimeout(timeout)
    })

    return () => subscription.unsubscribe()
  }, [methods, isEnabled, productHandle])

  // Don't render anything if auto-save is disabled
  if (!isEnabled || !productHandle) {
    return null
  }

  const getStatusText = (): string => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...'
      case 'saved':
        return 'Saved ✓'
      case 'error':
        return 'Save failed'
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
    return null
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
