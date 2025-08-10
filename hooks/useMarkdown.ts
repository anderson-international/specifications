'use client'

import { useCallback, useState } from 'react'

export type UseMarkdownReturn<TArgs extends unknown[]> = {
  markdown: string | null
  loading: boolean
  error: string | null
  fetchMarkdown: (...args: TArgs) => Promise<void>
}

export function useMarkdown<TArgs extends unknown[]>(
  buildUrl: (...args: TArgs) => string
): UseMarkdownReturn<TArgs> {
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMarkdown = useCallback(
    async (...args: TArgs): Promise<void> => {
      setLoading(true)
      setError(null)

      try {
        const url = buildUrl(...args)
        const response = await fetch(url)

        if (!response.ok) {
          let serverMessage = `HTTP error status: ${response.status}`
          try {
            const errorData = await response.json()
            if (
              errorData &&
              typeof errorData.error === 'string' &&
              errorData.error.trim() !== ''
            ) {
              serverMessage = errorData.error
            } else if (
              typeof errorData.message === 'string' &&
              errorData.message.trim() !== ''
            ) {
              serverMessage = errorData.message
            }
          } catch (_) {
            serverMessage = `HTTP error status: ${response.status}`
          }
          throw new Error(serverMessage)
        }

        const markdownContent = await response.text()
        setMarkdown(markdownContent)
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : `NonErrorThrown: ${String(e)}`
        setError(message)
        setMarkdown(null)
      } finally {
        setLoading(false)
      }
    },
    [buildUrl]
  )

  return { markdown, loading, error, fetchMarkdown }
}
