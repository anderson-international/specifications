'use client'

import { useState, useCallback, TouchEvent, MouseEvent } from 'react'

interface SwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
  preventScroll?: boolean
}

interface SwipeState {
  offset: number
  isDragging: boolean
}

interface SwipeHandlers {
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: () => void
  onMouseDown: (e: MouseEvent) => void
  onMouseMove: (e: MouseEvent) => void
  onMouseUp: () => void
  onMouseLeave: () => void
}

export function useSwipeNavigation(options: SwipeOptions): {
  swipeHandlers: SwipeHandlers
  swipeState: SwipeState
} {
  const { onSwipeLeft, onSwipeRight, threshold = 50, preventScroll = false } = options

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

  const onTouchStart = useCallback(
    (e: TouchEvent): void => {
      const touch = e.touches[0]
      handleDragStart(touch.clientX)

      if (preventScroll) {
        e.preventDefault()
      }
    },
    [handleDragStart, preventScroll]
  )

  const onTouchMove = useCallback(
    (e: TouchEvent): void => {
      const touch = e.touches[0]
      handleDragMove(touch.clientX)

      if (preventScroll && dragging) {
        e.preventDefault()
      }
    },
    [handleDragMove, dragging, preventScroll]
  )

  const onTouchEnd = useCallback((): void => {
    handleDragEnd()
  }, [handleDragEnd])

  const onMouseDown = useCallback(
    (e: MouseEvent): void => {
      handleDragStart(e.clientX)
    },
    [handleDragStart]
  )

  const onMouseMove = useCallback(
    (e: MouseEvent): void => {
      handleDragMove(e.clientX)
    },
    [handleDragMove]
  )

  const onMouseUp = useCallback((): void => {
    handleDragEnd()
  }, [handleDragEnd])

  const onMouseLeave = useCallback((): void => {
    if (dragging) {
      handleDragEnd()
    }
  }, [dragging, handleDragEnd])

  const swipeHandlers: SwipeHandlers = {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
  }

  const swipeState: SwipeState = {
    offset: dragging ? currentX - startX : 0,
    isDragging: dragging,
  }

  return { swipeHandlers, swipeState }
}
