'use client'

import React, { useCallback } from 'react'
import { useDropdownPosition } from './useDropdownPosition'
import { useClickOutside } from './useClickOutside'

interface DropdownPosition {
  top: number
  left: number
  width: number
}

interface UseMultiSelectInteractionsProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  containerRef: React.RefObject<HTMLDivElement>
  dropdownRef: React.RefObject<HTMLDivElement>
  inputRef: React.RefObject<HTMLInputElement>
  disabled?: boolean
}

interface UseMultiSelectInteractionsReturn {
  dropdownPosition: DropdownPosition
  handleContainerClick: () => void
  handleKeyDown: (e: React.KeyboardEvent) => void
}

export const useMultiSelectInteractions = ({
  isOpen,
  setIsOpen,
  containerRef,
  dropdownRef,
  inputRef,
  disabled = false,
}: UseMultiSelectInteractionsProps): UseMultiSelectInteractionsReturn => {
  const handleContainerClick = useCallback((): void => {
    if (disabled) return
    setIsOpen((prev) => !prev)

    if (!isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [isOpen, disabled, setIsOpen, inputRef])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): void => {
      if (disabled) return

      if (e.key === 'Escape') {
        setIsOpen(false)
      }

      if (e.key === 'Enter' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    },
    [disabled, setIsOpen, inputRef]
  )

  const dropdownPosition = useDropdownPosition(containerRef, isOpen)

  useClickOutside([containerRef, dropdownRef], () => {
    setIsOpen(false)
  })

  return {
    dropdownPosition,
    handleContainerClick,
    handleKeyDown,
  }
}
