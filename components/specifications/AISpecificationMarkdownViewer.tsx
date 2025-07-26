'use client'

import React from 'react'
import Link from 'next/link'
import { MarkdownDisplay } from '@/components/shared/MarkdownDisplay'
import { useAISpecificationMarkdown } from '@/hooks/useAISpecificationMarkdown'

interface AISpecificationMarkdownViewerProps {
  aiSpecificationId: number
}

const AISpecificationMarkdownViewerComponent = ({ 
  aiSpecificationId 
}: AISpecificationMarkdownViewerProps): JSX.Element => {
  const { markdown, loading, error, fetchMarkdown } = useAISpecificationMarkdown()

  React.useEffect(() => {
    fetchMarkdown(aiSpecificationId)
  }, [aiSpecificationId, fetchMarkdown])

  const handleDownload = React.useCallback(() => {
    if (!markdown) return
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ai-specification-${aiSpecificationId}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [markdown, aiSpecificationId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading AI specification...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-red-800 text-lg font-semibold mb-2">Error Loading AI Specification</h2>
        <p className="text-red-700">{error}</p>
        <Link 
          href="/ai-specifications" 
          className="inline-block mt-4 text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to AI Specifications
        </Link>
      </div>
    )
  }

  if (!markdown) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No AI specification data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link 
          href="/ai-specifications"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to AI Specifications
        </Link>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            AI Generated
          </span>
          <span className="text-sm text-gray-500">AI Specification</span>
        </div>
      </div>

      <MarkdownDisplay
        content={markdown}
        onDownload={handleDownload}
        filename={`ai-specification-${aiSpecificationId}.md`}
        className="border border-gray-200 rounded-lg"
      />
    </div>
  )
}

AISpecificationMarkdownViewerComponent.displayName = 'AISpecificationMarkdownViewer'
export const AISpecificationMarkdownViewer = React.memo(AISpecificationMarkdownViewerComponent)
