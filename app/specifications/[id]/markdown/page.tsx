import React from 'react'
import { notFound } from 'next/navigation'
import { SpecificationMarkdownViewer } from '@/components/specifications/SpecificationMarkdownViewer'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SpecificationMarkdownPage({ params }: PageProps): Promise<JSX.Element> {
  const { id } = await params
  const specId = parseInt(id, 10)

  if (isNaN(specId)) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <SpecificationMarkdownViewer specificationId={specId} />
      </div>
    </div>
  )
}
