'use client'

import React, { useCallback } from 'react'

interface UseMultiSelectActionsProps {
  selectedValues: (number | string)[]
  onChange: (values: (number | string)[]) => void
  disabled?: boolean
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}

interface UseMultiSelectActionsReturn {
  handleOptionToggle: (optionId: number | string) => void
  handleRemoveOption: (optionId: number | string) => void
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleClearAll: () => void
}

export const useMultiSelectActions = ({
  selectedValues,
  onChange,
  disabled = false,
  setSearchTerm,
}: UseMultiSelectActionsProps): UseMultiSelectActionsReturn => {
  const handleOptionToggle = useCallback(
    (optionId: number | string): void => {
      if (disabled) return

      const newSelectedValues = selectedValues.includes(optionId)
        ? selectedValues.filter((id) => id !== optionId)
        : [...selectedValues, optionId]

      onChange(newSelectedValues)
      setSearchTerm('')
    },
    [selectedValues, onChange, disabled, setSearchTerm]
  )

  const handleRemoveOption = useCallback(
    (optionId: number | string): void => {
      if (disabled) return
      onChange(selectedValues.filter((id) => id !== optionId))
    },
    [selectedValues, onChange, disabled]
  )

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
  }, [setSearchTerm])

  const handleClearAll = useCallback((): void => {
    if (disabled) return
    onChange([])
  }, [onChange, disabled])

  return {
    handleOptionToggle,
    handleRemoveOption,
    handleSearchChange,
    handleClearAll,
  }
}
