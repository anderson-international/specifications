'use client'

import { useState, useCallback } from 'react'

interface UseAISpecificationMarkdownReturn {
  markdown: string | null
  loading: boolean
  error: string | null
  fetchMarkdown: (aiSpecId: number) => Promise<void>
}

export const useAISpecificationMarkdown = (): UseAISpecificationMarkdownReturn => {
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMarkdown = useCallback(async (aiSpecId: number): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/specifications/${aiSpecId}/markdown`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch AI markdown: ${response.status} ${response.statusText}`)
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
