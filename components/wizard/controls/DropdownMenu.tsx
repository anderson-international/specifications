'use client'

import React, { useCallback } from 'react'
import ReactDOM from 'react-dom'
import { Option } from '../hooks/useMultiSelect'
import styles from './MultiSelectChips.module.css'

interface DropdownMenuProps {
  isOpen: boolean
  dropdownRef: React.RefObject<HTMLDivElement>
  controlId: string
  dropdownPosition: { top: number; left: number; width: number }
  filteredOptions: Option[]
  selectedValues: (string | number)[]
  handleOptionToggle: (optionId: string | number) => void
}

interface DropdownOptionProps {
  option: Option
  isSelected: boolean
  onToggle: (id: string | number) => void
}

const DropdownOptionComponent = ({
  option,
  isSelected,
  onToggle,
}: DropdownOptionProps): JSX.Element => {
  const handleClick = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation()
      onToggle(option.id)
    },
    [onToggle, option.id]
  )

  return (
    <div
      className={`${styles.option} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      role="option"
      aria-selected={isSelected}
    >
      <div className={styles.optionCheckbox}>
        {isSelected && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
          </svg>
        )}
      </div>
      <span className={styles.optionLabel}>{option.label}</span>
    </div>
  )
}
const DropdownOption = React.memo(DropdownOptionComponent)
DropdownOption.displayName = 'DropdownOption'

const DropdownMenuComponent = ({
  isOpen,
  dropdownRef,
  controlId,
  dropdownPosition,
  filteredOptions,
  selectedValues,
  handleOptionToggle,
}: DropdownMenuProps): React.ReactPortal | null => {
  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      className={styles.dropdown}
      id={`${controlId}-listbox`}
      role="listbox"
      aria-multiselectable="true"
      style={dropdownPosition}
    >
      {filteredOptions.length > 0 ? (
        filteredOptions.map((option) => (
          <DropdownOption
            key={option.id}
            option={option}
            isSelected={selectedValues.includes(option.id)}
            onToggle={handleOptionToggle}
          />
        ))
      ) : (
        <div className={styles.noOptions}>No options found</div>
      )}
    </div>,
    document.body
  )
}

const DropdownMenu = React.memo(DropdownMenuComponent)
DropdownMenu.displayName = 'DropdownMenu'
export default DropdownMenu
