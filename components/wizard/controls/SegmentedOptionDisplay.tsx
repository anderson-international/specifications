'use client'

import React, { useCallback, KeyboardEvent } from 'react'
import styles from './SegmentedControl.module.css'

export interface SegmentedOption {
  id: string | number
  label: string
  value: string | number
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

export default SegmentedOptionDisplay
