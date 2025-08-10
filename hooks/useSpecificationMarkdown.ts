'use client'

import { useMarkdown } from '@/hooks/useMarkdown'

interface UseSpecificationMarkdownReturn {
  markdown: string | null
  loading: boolean
  error: string | null
  fetchMarkdown: (id: number, userId?: string) => Promise<void>
}

export const useSpecificationMarkdown = (): UseSpecificationMarkdownReturn => {
  const { markdown, loading, error, fetchMarkdown } = useMarkdown(
    (id: number, userId?: string): string => {
      const queryParams = userId ? `?userId=${encodeURIComponent(userId)}` : ''
      return `/api/specifications/${id}/markdown${queryParams}`
    }
  )
  return { markdown, loading, error, fetchMarkdown }
}
