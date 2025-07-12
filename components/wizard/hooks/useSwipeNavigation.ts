'use client'

import { TouchEvent, MouseEvent } from 'react'
import { useSwipeState } from './useSwipeState'
import { useSwipeTouchHandlers } from './useSwipeTouchHandlers'
import { useSwipeMouseHandlers } from './useSwipeMouseHandlers'

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

  // Core swipe state and logic
  const {
    startX,
    currentX,
    dragging,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  } = useSwipeState({ onSwipeLeft, onSwipeRight, threshold })

  // Touch event handlers
  const { touchHandlers } = useSwipeTouchHandlers({
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    dragging,
    preventScroll,
  })

  // Mouse event handlers
  const { mouseHandlers } = useSwipeMouseHandlers({
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    dragging,
  })

  const swipeHandlers: SwipeHandlers = {
    ...touchHandlers,
    ...mouseHandlers,
  }

  const swipeState: SwipeState = {
    offset: dragging ? currentX - startX : 0,
    isDragging: dragging,
  }

  return { swipeHandlers, swipeState }
}
