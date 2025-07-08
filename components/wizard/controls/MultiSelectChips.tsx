'use client'

import React, { useMemo, useCallback } from 'react'
import { useMultiSelect, Option } from '../hooks/useMultiSelect'
import styles from './MultiSelectChips.module.css'
import DropdownMenu from './DropdownMenu'

// Re-export Option for convenience
export type { Option }

interface ChipProps {
  option: Option
  onRemove: (id: string | number) => void
  disabled?: boolean
}

const Chip = React.memo(function Chip({ option, onRemove, disabled }: ChipProps) {
  const handleRemoveClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onRemove(option.id)
    },
    [onRemove, option.id]
  )

  return (
    <div className={styles.chip}>
      {option.label}
      <button
        type="button"
        className={styles.chipRemove}
        onClick={handleRemoveClick}
        disabled={disabled}
        aria-label={`Remove ${option.label}`}
      >
        ×
      </button>
    </div>
  )
})

interface MultiSelectChipsProps {
  options: Option[]
  selectedValues: (number | string)[]
  onChange: (values: (number | string)[]) => void
  name: string
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

const MultiSelectChips = ({
  options,
  selectedValues,
  onChange,
  name,
  label,
  placeholder = 'Search...',
  error,
  disabled = false,
}: MultiSelectChipsProps): JSX.Element => {
  const {
    isOpen,
    setIsOpen,
    searchTerm,
    containerRef,
    inputRef,
    dropdownRef,
    filteredOptions,
    selectedOptions,
    dropdownPosition,
    handleOptionToggle,
    handleRemoveOption,
    handleSearchChange,
    handleContainerClick,
    handleKeyDown,
    handleClearAll,
  } = useMultiSelect({ options, selectedValues, onChange, disabled })

  const controlId = useMemo(() => `multiselect-${name}`, [name])

  const onClearAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      handleClearAll()
    },
    [handleClearAll]
  )

  return (
    <div
      className={`${styles.container} ${isOpen ? styles.open : ''}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label htmlFor={controlId} className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={`${styles.chipContainer} ${disabled ? styles.disabled : ''} ${error ? styles.hasError : ''}`}
        onClick={handleContainerClick}
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        role="combobox"
        aria-controls={`${controlId}-listbox`}
        aria-haspopup="listbox"
      >
        <div className={styles.chipList}>
          {selectedOptions.map((option) => (
            <Chip
              key={option.id}
              option={option}
              onRemove={handleRemoveOption}
              disabled={disabled}
            />
          ))}
          <input
            id={controlId}
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder={selectedOptions.length === 0 ? placeholder : ''}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsOpen(true)}
            onClick={(e): void => e.stopPropagation()}
            disabled={disabled}
            aria-autocomplete="list"
          />
        </div>

        <div className={styles.actionsWrapper}>
          {selectedOptions.length > 0 && (
            <button
              onClick={onClearAll}
              className={styles.clearButton}
              aria-label="Clear all selections"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
          )}
          <div className={styles.dropdownIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </div>
        </div>
      </div>

      <DropdownMenu
        isOpen={isOpen}
        dropdownRef={dropdownRef}
        controlId={controlId}
        dropdownPosition={dropdownPosition}
        filteredOptions={filteredOptions}
        selectedValues={selectedValues}
        handleOptionToggle={handleOptionToggle}
      />

      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}

export default React.memo(MultiSelectChips)
