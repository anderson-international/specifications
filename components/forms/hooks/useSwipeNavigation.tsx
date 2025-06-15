'use client'

import React, { useCallback, useRef, useState } from 'react'

interface SwipeState {
  startX: number
  startY: number
  currentX: number
  currentY: number
  isDragging: boolean
}

interface UseSwipeNavigationProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
  preventScroll?: boolean
}

interface UseSwipeNavigationReturn {
  swipeHandlers: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
    onTouchEnd: (e: React.TouchEvent) => void
  }
  swipeState: {
    isDragging: boolean
    offset: number
  }
}

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  preventScroll = true
}: UseSwipeNavigationProps): UseSwipeNavigationReturn {
  const swipeRef = useRef<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false
  })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [offset, setOffset] = useState<number>(0)

  const handleTouchStart = useCallback((e: React.TouchEvent): void => {
    const touch = e.touches[0]
    swipeRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isDragging: true
    }
    setIsDragging(true)
    setOffset(0)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent): void => {
    if (!swipeRef.current.isDragging) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - swipeRef.current.startX
    const deltaY = touch.clientY - swipeRef.current.startY

    // Prevent scroll if horizontal swipe is dominant
    if (preventScroll && Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault()
    }

    swipeRef.current.currentX = touch.clientX
    swipeRef.current.currentY = touch.clientY
    setOffset(deltaX)
  }, [preventScroll])

  const handleTouchEnd = useCallback((_e: TouchEvent): void => {
    if (!swipeRef.current.isDragging) return

    const deltaX = swipeRef.current.currentX - swipeRef.current.startX
    const deltaY = swipeRef.current.currentY - swipeRef.current.startY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Only trigger swipe if horizontal movement is dominant and exceeds threshold
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      if (deltaX > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    }

    // Reset state
    swipeRef.current.isDragging = false
    setIsDragging(false)
    setOffset(0)
  }, [onSwipeLeft, onSwipeRight, threshold])

  return {
    swipeHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    swipeState: {
      isDragging,
      offset
    }
  }
}
