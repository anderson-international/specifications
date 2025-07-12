'use client'

import { useCallback, MouseEvent } from 'react'

interface MouseHandlers {
  onMouseDown: (e: MouseEvent) => void
  onMouseMove: (e: MouseEvent) => void
  onMouseUp: () => void
  onMouseLeave: () => void
}

interface UseSwipeMouseHandlersProps {
  handleDragStart: (clientX: number) => void
  handleDragMove: (clientX: number) => void
  handleDragEnd: () => void
  dragging: boolean
}

interface UseSwipeMouseHandlersReturn {
  mouseHandlers: MouseHandlers
}

export const useSwipeMouseHandlers = ({
  handleDragStart,
  handleDragMove,
  handleDragEnd,
  dragging,
}: UseSwipeMouseHandlersProps): UseSwipeMouseHandlersReturn => {
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

  const mouseHandlers: MouseHandlers = {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
  }

  return { mouseHandlers }
}
