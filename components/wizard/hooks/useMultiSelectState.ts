'use client'

import React, { useState, useMemo, useRef } from 'react'

export interface Option {
  id: number | string
  label: string
  value: number | string | boolean | null
}

interface UseMultiSelectStateProps {
  options: Option[]
  selectedValues: (number | string)[]
}

interface UseMultiSelectStateReturn {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  containerRef: React.RefObject<HTMLDivElement>
  dropdownRef: React.RefObject<HTMLDivElement>
  inputRef: React.RefObject<HTMLInputElement>
  filteredOptions: Option[]
  selectedOptions: Option[]
}

export const useMultiSelectState = ({
  options,
  selectedValues,
}: UseMultiSelectStateProps): UseMultiSelectStateReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = useMemo((): Option[] => {
    if (!searchTerm) return options
    const lowerSearchTerm = searchTerm.toLowerCase()
    return options.filter((option) => option.label.toLowerCase().includes(lowerSearchTerm))
  }, [options, searchTerm])

  const selectedOptions = useMemo((): Option[] => {
    return options.filter((option) => selectedValues.includes(option.id))
  }, [options, selectedValues])

  return {
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    containerRef,
    dropdownRef,
    inputRef,
    filteredOptions,
    selectedOptions,
  }
}
