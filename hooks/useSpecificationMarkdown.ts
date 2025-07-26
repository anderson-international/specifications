'use client'

import { useState, useCallback } from 'react'

interface UseSpecificationMarkdownReturn {
  markdown: string | null
  loading: boolean
  error: string | null
  fetchMarkdown: (id: number, userId?: string) => Promise<void>
}

export const useSpecificationMarkdown = (): UseSpecificationMarkdownReturn => {
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMarkdown = useCallback(async (id: number, userId?: string): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = userId ? `?userId=${encodeURIComponent(userId)}` : ''
      const response = await fetch(`/api/specifications/${id}/markdown${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch markdown: ${response.status} ${response.statusText}`)
      }
      
      const markdownContent = await response.text()
      setMarkdown(markdownContent)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      setMarkdown(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    markdown,
    loading,
    error,
    fetchMarkdown
  }
}
