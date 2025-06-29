'use client'

import { useEffect, RefObject, useCallback } from 'react'

export const useClickOutside = (
  refs: RefObject<HTMLElement>[],
  handler: () => void
): void => {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (refs.every(ref => ref.current && !ref.current.contains(event.target as Node))) {
        handler()
      }
    },
    [refs, handler]
  )

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [handleClickOutside])
}
