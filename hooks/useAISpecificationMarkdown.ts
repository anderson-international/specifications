'use client'

import { useMarkdown } from '@/hooks/useMarkdown'

interface UseAISpecificationMarkdownReturn {
  markdown: string | null
  loading: boolean
  error: string | null
  fetchMarkdown: (aiSpecId: number) => Promise<void>
}

export const useAISpecificationMarkdown = (): UseAISpecificationMarkdownReturn => {
  const { markdown, loading, error, fetchMarkdown } = useMarkdown<number>((aiSpecId) => `/api/specifications/${aiSpecId}/markdown`)
  return { markdown, loading, error, fetchMarkdown }
}
