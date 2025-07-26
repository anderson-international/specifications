'use client'

import React from 'react'
import SpecificationsList from '@/components/specifications/SpecificationsList'

export default function AISpecificationsPage(): JSX.Element {
  return (
    <SpecificationsList
      config={{
        title: 'AI Specifications',
        subtitle: 'AI-generated specifications synthesized from user reviews',
        searchPlaceholder: 'Search AI specifications by product or brand...',
        emptyStateText: 'No AI specifications found.',
        emptySubtext: 'AI specifications are automatically generated when multiple users review the same product.',
        showCreateButton: false,
        aiGenerated: true,
        navigateTo: 'markdown',
        showAIIndicators: true
      }}
    />
  )
}
