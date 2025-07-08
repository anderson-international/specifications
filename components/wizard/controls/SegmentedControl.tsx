'use client'

import React, { useCallback, useMemo, useState, KeyboardEvent } from 'react'
import styles from './SegmentedControl.module.css'

export interface SegmentedOption {
  id: string | number
  label: string
  value: string | number
}

interface SegmentedControlProps {
  options: SegmentedOption[]
  value: string | number | null
  onChange: (value: string | number) => void
  name: string
  label?: string
  error?: string
  disabled?: boolean
}

interface SegmentedOptionDisplayProps {
  option: SegmentedOption
  isSelected: boolean
  isDisabled: boolean
  onClick: (option: SegmentedOption) => void
  onKeyDown: (e: KeyboardEvent, option: SegmentedOption) => void
}

const SegmentedOptionDisplayComponent = ({
  option,
  isSelected,
  isDisabled,
  onClick,
  onKeyDown,
}: SegmentedOptionDisplayProps): JSX.Element => {
  const handleClick = useCallback(() => onClick(option), [onClick, option])
  const handleKeyDown = useCallback((e: KeyboardEvent) => onKeyDown(e, option), [onKeyDown, option])

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={isDisabled ? -1 : 0}
      className={`${styles.option} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {option.label}
    </div>
  )
}
const SegmentedOptionDisplay = React.memo(SegmentedOptionDisplayComponent)
SegmentedOptionDisplay.displayName = 'SegmentedOptionDisplay'

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
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

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

  // Touch gesture handling for swipe selection
  const handleTouchStart = useCallback(
    (e: React.TouchEvent): void => {
      if (disabled) return
      setTouchStartX(e.touches[0].clientX)
    },
    [disabled]
  )

  const handleTouchMove = useCallback((_: React.TouchEvent): void => {
    // No-op, just to capture the touch event
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent): void => {
      if (disabled || touchStartX === null) return

      const touchEndX = e.changedTouches[0].clientX
      const deltaX = touchEndX - touchStartX
      const minSwipeDelta = 50 // Minimum px to consider it a swipe

      if (Math.abs(deltaX) < minSwipeDelta) return

      const currentIndex = options.findIndex((opt) => opt.id === value)
      if (currentIndex === -1) return

      // Determine direction based on swipe
      const nextIndex =
        deltaX > 0
          ? Math.max(0, currentIndex - 1) // Swipe right -> previous
          : Math.min(options.length - 1, currentIndex + 1) // Swipe left -> next

      onChange(options[nextIndex].value)
      setTouchStartX(null)
    },
    [disabled, touchStartX, options, value, onChange]
  )

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
export default SegmentedControl
