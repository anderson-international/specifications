'use client'

import React, { useState, useCallback } from 'react'
import { SegmentedOption } from '../controls/SegmentedOptionDisplay'

interface UseSegmentedTouchGesturesProps {
  options: SegmentedOption[]
  value: string | number | null
  onChange: (value: string | number) => void
  disabled: boolean
}

interface UseSegmentedTouchGesturesReturn {
  touchStartX: number | null
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchMove: (e: React.TouchEvent) => void
  handleTouchEnd: (e: React.TouchEvent) => void
}

export const useSegmentedTouchGestures = ({
  options,
  value,
  onChange,
  disabled,
}: UseSegmentedTouchGesturesProps): UseSegmentedTouchGesturesReturn => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  // Touch gesture handling for swipe selection
  const handleTouchStart = useCallback(
    (e: React.TouchEvent): void => {
      if (disabled) return
      setTouchStartX(e.touches[0].clientX)
    },
    [disabled]
  )

  const handleTouchMove = useCallback((_: React.TouchEvent): void => {
    // No-op, just to capture the touch event
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent): void => {
      if (disabled || touchStartX === null) return

      const touchEndX = e.changedTouches[0].clientX
      const deltaX = touchEndX - touchStartX
      const minSwipeDelta = 50 // Minimum px to consider it a swipe

      if (Math.abs(deltaX) < minSwipeDelta) return

      const currentIndex = options.findIndex((opt) => opt.id === value)
      if (currentIndex === -1) return

      // Determine direction based on swipe
      const nextIndex =
        deltaX > 0
          ? Math.max(0, currentIndex - 1) // Swipe right -> previous
          : Math.min(options.length - 1, currentIndex + 1) // Swipe left -> next

      onChange(options[nextIndex].value)
      setTouchStartX(null)
    },
    [disabled, touchStartX, options, value, onChange]
  )

  return {
    touchStartX,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
