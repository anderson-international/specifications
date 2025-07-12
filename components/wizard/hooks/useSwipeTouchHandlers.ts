'use client'

import { useCallback, TouchEvent } from 'react'

interface TouchHandlers {
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: () => void
}

interface UseSwipeTouchHandlersProps {
  handleDragStart: (clientX: number) => void
  handleDragMove: (clientX: number) => void
  handleDragEnd: () => void
  dragging: boolean
  preventScroll?: boolean
}

interface UseSwipeTouchHandlersReturn {
  touchHandlers: TouchHandlers
}

export const useSwipeTouchHandlers = ({
  handleDragStart,
  handleDragMove,
  handleDragEnd,
  dragging,
  preventScroll = false,
}: UseSwipeTouchHandlersProps): UseSwipeTouchHandlersReturn => {
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

  const touchHandlers: TouchHandlers = {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }

  return { touchHandlers }
}
