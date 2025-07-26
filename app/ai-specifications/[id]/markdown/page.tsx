import React from 'react'
import { notFound } from 'next/navigation'
import { AISpecificationMarkdownViewer } from '@/components/specifications/AISpecificationMarkdownViewer'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AISpecificationMarkdownPage({ params }: PageProps): Promise<JSX.Element> {
  const { id } = await params
  const aiSpecId = parseInt(id, 10)

  if (isNaN(aiSpecId)) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <AISpecificationMarkdownViewer aiSpecificationId={aiSpecId} />
      </div>
    </div>
  )
}
