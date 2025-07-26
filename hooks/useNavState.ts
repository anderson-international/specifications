'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface UseNavStateReturn {
  isNavOpen: boolean
  toggleNav: () => void
  closeNav: () => void
}

export function useNavState(): UseNavStateReturn {
  const [isNavOpen, setIsNavOpen] = useState(false)

  const toggleNav = useCallback(() => setIsNavOpen((prev) => !prev), [])
  const closeNav = useCallback(() => setIsNavOpen(false), [])

  const pathname = usePathname()
  useEffect(() => {
    closeNav()
  }, [pathname, closeNav])

  useEffect(() => {
    if (isNavOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isNavOpen])

  return { isNavOpen, toggleNav, closeNav }
}
