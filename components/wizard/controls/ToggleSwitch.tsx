'use client'

import React, { useCallback, useMemo } from 'react'
import styles from './ToggleSwitch.module.css'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  name: string
  label?: string
  error?: string
  disabled?: boolean
}

/**
 * A mobile-friendly toggle switch component for boolean selections
 * Designed as a replacement for checkboxes
 */
const ToggleSwitch = ({
  checked,
  onChange,
  name,
  label,
  error,
  disabled = false
}: ToggleSwitchProps): JSX.Element => {
  // Generate a unique ID for this control instance
  const switchId = useMemo((): string => `toggle-${name}-${Math.random().toString(36).substring(2, 9)}`, [name])
  
  // Handle toggle click
  const handleToggle = useCallback((): void => {
    if (disabled) return
    onChange(!checked)
  }, [checked, onChange, disabled])
  
  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent): void => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChange(!checked)
    }
  }, [checked, onChange, disabled])

  return (
    <div className={styles.container}>
      <div 
        className={`${styles.toggleContainer} ${error ? styles.hasError : ''}`}
      >
        <div
          className={`${styles.toggle} ${checked ? styles.checked : ''} ${disabled ? styles.disabled : ''}`}
          role="switch"
          aria-checked={checked}
          aria-labelledby={label ? `${switchId}-label` : undefined}
          tabIndex={disabled ? -1 : 0}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          id={switchId}
        >
          <div className={styles.thumb} />
        </div>
        
        {label && (
          <label 
            htmlFor={switchId} 
            id={`${switchId}-label`} 
            className={styles.label}
            onClick={disabled ? undefined : handleToggle}
          >
            {label}
          </label>
        )}
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}

// Export with React.memo for performance optimization
export default React.memo(ToggleSwitch)
