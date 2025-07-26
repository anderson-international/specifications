import React from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownDisplayProps {
  content: string
  onDownload?: () => void
  filename?: string
  className?: string
}

const tableComponents: Components = {
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse border border-gray-300 rounded-lg bg-white shadow-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-50">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700 bg-gray-100">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 px-4 py-2 text-gray-600">
      {children}
    </td>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3 border-b border-gray-200 pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">
      {children}
    </h3>
  )
}

const MarkdownDisplayComponent = ({ 
  content, 
  onDownload, 
  filename = 'document.md',
  className = '' 
}: MarkdownDisplayProps): JSX.Element => {
  const handleDownload = React.useCallback(() => {
    if (onDownload) {
      onDownload()
      return
    }
    
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [content, filename, onDownload])

  return (
    <div className={`markdown-display ${className}`}>
        <div className="markdown-header">
          <button 
            onClick={handleDownload}
            className="download-button"
            type="button"
          >
            Download Markdown
          </button>
        </div>
        <div className="markdown-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            components={tableComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
  )
}

MarkdownDisplayComponent.displayName = 'MarkdownDisplay'
export const MarkdownDisplay = React.memo(MarkdownDisplayComponent)
