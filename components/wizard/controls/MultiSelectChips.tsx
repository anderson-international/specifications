'use client'

import React, { useMemo, useCallback } from 'react'
import { useMultiSelect, Option } from '../hooks/useMultiSelect'
import styles from './MultiSelectChips.module.css'
import DropdownMenu from './DropdownMenu'
import Chip from './Chip'
import { ClearIcon, DropdownIcon } from './MultiSelectIcons'

// Re-export Option for convenience
export type { Option }

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
              <ClearIcon />
            </button>
          )}
          <div className={styles.dropdownIcon}>
            <DropdownIcon />
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
