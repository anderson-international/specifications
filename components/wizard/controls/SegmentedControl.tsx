'use client'

import React, { useCallback, useMemo } from 'react'
import styles from './SegmentedControl.module.css'
import SegmentedOptionDisplay, { SegmentedOption } from './SegmentedOptionDisplay'
import { useSegmentedTouchGestures } from '../hooks/useSegmentedTouchGestures'

interface SegmentedControlProps {
  options: SegmentedOption[]
  value: string | number | null
  onChange: (value: string | number) => void
  name: string
  label?: string
  error?: string
  disabled?: boolean
}

/**
 * A mobile-friendly segmented control component for option selection
 * Designed as a replacement for select/radio inputs for small option sets
 */
const SegmentedControlComponent = ({
  options,
  value,
  onChange,
  name,
  label,
  error,
  disabled = false,
}: SegmentedControlProps): JSX.Element => {

  // Get the selected option index for UI highlighting
  const selectedIndex = useMemo((): number => {
    return options.findIndex((option) => option.id === value)
  }, [options, value])

  // Handle click on an option
  const handleOptionClick = useCallback(
    (option: SegmentedOption): void => {
      if (disabled) return
      onChange(option.value)
    },
    [onChange, disabled]
  )

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, option: SegmentedOption): void => {
      if (disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onChange(option.value)
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault()
        const currentIndex = options.findIndex((opt) => opt.id === value)
        if (currentIndex === -1) return

        const nextIndex =
          e.key === 'ArrowRight'
            ? (currentIndex + 1) % options.length
            : (currentIndex - 1 + options.length) % options.length

        onChange(options[nextIndex].value)
      }
    },
    [onChange, options, value, disabled]
  )

  // Touch gesture handling via custom hook
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSegmentedTouchGestures({
    options,
    value,
    onChange,
    disabled,
  })

  // Generate a unique ID for this control instance
  const controlId = useMemo(() => `segmented-${name}`, [name])

  const indicatorStyle = useMemo(
    () =>
      ({
        '--indicator-left': `${(selectedIndex / options.length) * 100}%`,
        '--indicator-width': `${(1 / options.length) * 100}%`,
      }) as React.CSSProperties,
    [selectedIndex, options.length]
  )

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={controlId} className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={`${styles.segmentedControl} ${disabled ? styles.disabled : ''} ${error ? styles.hasError : ''}`}
        role="radiogroup"
        aria-labelledby={label ? `${controlId}-label` : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={indicatorStyle}
      >
        {options.map((option) => (
          <SegmentedOptionDisplay
            key={option.id}
            option={option}
            isSelected={value === option.id}
            isDisabled={disabled || false}
            onClick={handleOptionClick}
            onKeyDown={handleKeyDown}
          />
        ))}

        {selectedIndex >= 0 && <div className={styles.indicator} />}
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}

// Export with React.memo for performance optimization
const SegmentedControl = React.memo(SegmentedControlComponent)
SegmentedControl.displayName = 'SegmentedControl'

// Re-export SegmentedOption type for consuming components
export type { SegmentedOption }
export default SegmentedControl
