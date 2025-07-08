'use client'

import { useState, useEffect, RefObject, useCallback } from 'react'

interface DropdownPosition {
  top: number
  left: number
  width: number
}

export const useDropdownPosition = (
  containerRef: RefObject<HTMLElement>,
  isOpen: boolean
): DropdownPosition => {
  const [position, setPosition] = useState<DropdownPosition>({ top: 0, left: 0, width: 0 })

  const calculatePosition = useCallback(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }, [isOpen, containerRef])

  useEffect(() => {
    calculatePosition()

    window.addEventListener('resize', calculatePosition)
    window.addEventListener('scroll', calculatePosition, true)

    return () => {
      window.removeEventListener('resize', calculatePosition)
      window.removeEventListener('scroll', calculatePosition, true)
    }
  }, [calculatePosition])

  return position
}
