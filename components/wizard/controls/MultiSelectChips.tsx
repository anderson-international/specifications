'use client'

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import styles from './MultiSelectChips.module.css'

export interface Option {
  id: number | string
  label: string
  value: number | string | boolean | null
}

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

/**
 * A mobile-friendly multi-select component with search and chips
 * Designed as a replacement for multi-select dropdowns
 */
const MultiSelectChips = ({
  options,
  selectedValues,
  onChange,
  name,
  label,
  placeholder = 'Search...',
  error,
  disabled = false
}: MultiSelectChipsProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Generate a unique ID for this control instance
  const controlId = useMemo((): string => 
    `multiselect-${name}-${Math.random().toString(36).substring(2, 9)}`, 
    [name]
  )

  // Filter options based on search term
  const filteredOptions = useMemo((): Option[] => {
    if (!searchTerm) return options
    const lowerSearchTerm = searchTerm.toLowerCase()
    return options.filter(option => 
      option.label.toLowerCase().includes(lowerSearchTerm)
    )
  }, [options, searchTerm])

  // Get selected option objects
  const selectedOptions = useMemo((): Option[] => {
    return options.filter(option => selectedValues.includes(option.id))
  }, [options, selectedValues])
  
  // Handle toggling an option
  const handleOptionToggle = useCallback((optionId: number | string): void => {
    if (disabled) return
    
    const newSelectedValues = selectedValues.includes(optionId)
      ? selectedValues.filter(id => id !== optionId)
      : [...selectedValues, optionId]
    
    onChange(newSelectedValues)
  }, [selectedValues, onChange, disabled])

  // Handle removing a selected option (chip)
  const handleRemoveOption = useCallback((optionId: number | string): void => {
    if (disabled) return
    onChange(selectedValues.filter(id => id !== optionId))
  }, [selectedValues, onChange, disabled])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle opening the dropdown
  const handleContainerClick = useCallback((): void => {
    if (disabled) return
    setIsOpen(prev => !prev)
    
    // Focus input when opening
    if (!isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [isOpen, disabled])

  // Handle search input
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
  }, [])

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent): void => {
    if (disabled) return
    
    // Close on Escape
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
    
    // Toggle dropdown on Enter when input isn't focused
    if (e.key === 'Enter' && document.activeElement !== inputRef.current) {
      e.preventDefault()
      setIsOpen(prev => !prev)
    }
  }, [disabled])

  return (
    <div 
      className={styles.container} 
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
        {/* Selected chips */}
        <div className={styles.chipList}>
          {selectedOptions.map(option => (
            <div key={option.id} className={styles.chip}>
              {option.label}
              <button
                type="button"
                className={styles.chipRemove}
                onClick={(e): void => {
                  e.stopPropagation()
                  handleRemoveOption(option.id)
                }}
                disabled={disabled}
                aria-label={`Remove ${option.label}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        {/* Search input */}
        <div className={styles.inputWrapper}>
          <input
            id={controlId}
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder={selectedOptions.length === 0 ? placeholder : ''}
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={(e): void => e.stopPropagation()}
            disabled={disabled}
            aria-autocomplete="list"
          />
        </div>
        
        {/* Dropdown icon */}
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
      
      {/* Options dropdown */}
      {isOpen && (
        <div 
          className={styles.dropdown} 
          id={`${controlId}-listbox`}
          role="listbox"
          aria-multiselectable="true"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => {
              const isSelected = selectedValues.includes(option.id)
              return (
                <div
                  key={option.id}
                  className={`${styles.option} ${isSelected ? styles.selected : ''}`}
                  onClick={(e): void => {
                    e.stopPropagation()
                    handleOptionToggle(option.id)
                  }}
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
            })
          ) : (
            <div className={styles.noOptions}>No options found</div>
          )}
        </div>
      )}
      
      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}

// Export with React.memo for performance optimization
export default React.memo(MultiSelectChips)
