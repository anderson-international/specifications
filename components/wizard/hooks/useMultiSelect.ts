'use client'

import React, { useState, useCallback, useMemo, useRef } from 'react'
import { useDropdownPosition } from './useDropdownPosition'
import { useClickOutside } from './useClickOutside'
export interface Option {
  id: number | string
  label: string
  value: number | string | boolean | null
}

interface UseMultiSelectProps {
  options: Option[]
  selectedValues: (number | string)[]
  onChange: (values: (number | string)[]) => void
  disabled?: boolean
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

interface UseMultiSelectReturn {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  containerRef: React.RefObject<HTMLDivElement>;
  dropdownRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  filteredOptions: Option[];
  selectedOptions: Option[];
  dropdownPosition: DropdownPosition;
  handleOptionToggle: (optionId: number | string) => void;
  handleRemoveOption: (optionId: number | string) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleContainerClick: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleClearAll: () => void;
}

export const useMultiSelect = ({
  options,
  selectedValues,
  onChange,
  disabled = false
}: UseMultiSelectProps): UseMultiSelectReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)


  const filteredOptions = useMemo((): Option[] => {
    if (!searchTerm) return options
    const lowerSearchTerm = searchTerm.toLowerCase()
    return options.filter(option => 
      option.label.toLowerCase().includes(lowerSearchTerm)
    )
  }, [options, searchTerm])

  const selectedOptions = useMemo((): Option[] => {
    return options.filter(option => selectedValues.includes(option.id))
  }, [options, selectedValues])

  const handleOptionToggle = useCallback((optionId: number | string): void => {
    if (disabled) return
    
    const newSelectedValues = selectedValues.includes(optionId)
      ? selectedValues.filter(id => id !== optionId)
      : [...selectedValues, optionId]
    
    onChange(newSelectedValues)
    setSearchTerm('')
  }, [selectedValues, onChange, disabled])

  const handleRemoveOption = useCallback((optionId: number | string): void => {
    if (disabled) return
    onChange(selectedValues.filter(id => id !== optionId))
  }, [selectedValues, onChange, disabled])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
  }, [])

  const handleClearAll = useCallback((): void => {
    if (disabled) return
    onChange([])
  }, [onChange, disabled])

  const handleContainerClick = useCallback((): void => {
    if (disabled) return
    setIsOpen(prev => !prev)
    
    if (!isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [isOpen, disabled])

  const dropdownPosition = useDropdownPosition(containerRef, isOpen)

  useClickOutside([containerRef, dropdownRef], () => {
    setIsOpen(false)
  })

  const handleKeyDown = useCallback((e: React.KeyboardEvent): void => {
    if (disabled) return
    
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
    
    if (e.key === 'Enter' && document.activeElement !== inputRef.current) {
      e.preventDefault()
      setIsOpen(prev => !prev)
    }
  }, [disabled])



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
    handleClearAll
  }
}
