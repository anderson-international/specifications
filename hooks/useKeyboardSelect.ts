import React, { useCallback } from 'react'

export function useKeyboardSelect(
  disabled: boolean,
  onActivate: () => void
): (e: React.KeyboardEvent) => void {
  return useCallback(
    (e: React.KeyboardEvent): void => {
      if (disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onActivate()
      }
    },
    [disabled, onActivate]
  )
}
