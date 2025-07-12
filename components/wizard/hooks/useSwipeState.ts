'use client'

import { useState, useCallback } from 'react'

interface UseSwipeStateProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
}

interface UseSwipeStateReturn {
  startX: number
  currentX: number
  dragging: boolean
  handleDragStart: (clientX: number) => void
  handleDragMove: (clientX: number) => void
  handleDragEnd: () => void
}

export const useSwipeState = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: UseSwipeStateProps): UseSwipeStateReturn => {
  const [startX, setStartX] = useState<number>(0)
  const [currentX, setCurrentX] = useState<number>(0)
  const [dragging, setDragging] = useState<boolean>(false)

  const handleDragStart = useCallback((clientX: number): void => {
    setStartX(clientX)
    setDragging(true)
  }, [])

  const handleDragMove = useCallback(
    (clientX: number): void => {
      if (!dragging) return
      setCurrentX(clientX)
    },
    [dragging]
  )

  const handleDragEnd = useCallback((): void => {
    if (!dragging) return

    const diff = currentX - startX

    if (diff > threshold && onSwipeRight) {
      onSwipeRight()
    } else if (diff < -threshold && onSwipeLeft) {
      onSwipeLeft()
    }

    setDragging(false)
    setStartX(0)
    setCurrentX(0)
  }, [dragging, currentX, startX, threshold, onSwipeLeft, onSwipeRight])

  return {
    startX,
    currentX,
    dragging,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  }
}
