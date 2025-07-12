'use client'

import React from 'react'
import { useMultiSelectState, Option } from './useMultiSelectState'
import { useMultiSelectActions } from './useMultiSelectActions'
import { useMultiSelectInteractions } from './useMultiSelectInteractions'

// Re-export Option for convenience
export type { Option }

interface UseMultiSelectProps {
  options: Option[]
  selectedValues: (number | string)[]
  onChange: (values: (number | string)[]) => void
  disabled?: boolean
}

interface DropdownPosition {
  top: number
  left: number
  width: number
}

interface UseMultiSelectReturn {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  searchTerm: string
  containerRef: React.RefObject<HTMLDivElement>
  dropdownRef: React.RefObject<HTMLDivElement>
  inputRef: React.RefObject<HTMLInputElement>
  filteredOptions: Option[]
  selectedOptions: Option[]
  dropdownPosition: DropdownPosition
  handleOptionToggle: (optionId: number | string) => void
  handleRemoveOption: (optionId: number | string) => void
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleContainerClick: () => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  handleClearAll: () => void
}

export const useMultiSelect = ({
  options,
  selectedValues,
  onChange,
  disabled = false,
}: UseMultiSelectProps): UseMultiSelectReturn => {
  // State management
  const {
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    containerRef,
    dropdownRef,
    inputRef,
    filteredOptions,
    selectedOptions,
  } = useMultiSelectState({ options, selectedValues })

  // Action handlers
  const {
    handleOptionToggle,
    handleRemoveOption,
    handleSearchChange,
    handleClearAll,
  } = useMultiSelectActions({ selectedValues, onChange, disabled, setSearchTerm })

  // UI interactions
  const {
    dropdownPosition,
    handleContainerClick,
    handleKeyDown,
  } = useMultiSelectInteractions({ isOpen, setIsOpen, containerRef, dropdownRef, inputRef, disabled })

  return {
    isOpen,
    setIsOpen,
    searchTerm,
    containerRef,
    inputRef,
    filteredOptions,
    selectedOptions,
    handleOptionToggle,
    handleRemoveOption,
    handleSearchChange,
    handleContainerClick,
    handleKeyDown,
    dropdownPosition,
    dropdownRef,
    handleClearAll,
  }
}
