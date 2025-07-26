'use client'

import React from 'react'
import Link from 'next/link'
import { MarkdownDisplay } from '@/components/shared/MarkdownDisplay'
import { useSpecificationMarkdown } from '@/hooks/useSpecificationMarkdown'

interface SpecificationMarkdownViewerProps {
  specificationId: number
}

const SpecificationMarkdownViewerComponent = ({ 
  specificationId 
}: SpecificationMarkdownViewerProps): JSX.Element => {
  const { markdown, loading, error, fetchMarkdown } = useSpecificationMarkdown()

  React.useEffect(() => {
    fetchMarkdown(specificationId)
  }, [specificationId, fetchMarkdown])

  const handleDownload = React.useCallback(() => {
    if (!markdown) return
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `specification-${specificationId}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [markdown, specificationId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading specification...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-red-800 text-lg font-semibold mb-2">Error Loading Specification</h2>
        <p className="text-red-700">{error}</p>
        <Link 
          href="/specifications" 
          className="inline-block mt-4 text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to Specifications
        </Link>
      </div>
    )
  }

  if (!markdown) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No specification data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link 
          href="/specifications"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to Specifications
        </Link>
        <span className="text-sm text-gray-500">Expert Specification</span>
      </div>

      <MarkdownDisplay
        content={markdown}
        onDownload={handleDownload}
        filename={`specification-${specificationId}.md`}
        className="border border-gray-200 rounded-lg"
      />
    </div>
  )
}

SpecificationMarkdownViewerComponent.displayName = 'SpecificationMarkdownViewer'
export const SpecificationMarkdownViewer = React.memo(SpecificationMarkdownViewerComponent)
