'use client'

import React from 'react'
import SpecificationsList from '@/components/specifications/SpecificationsList'

export default function SpecificationsPage(): JSX.Element {
  return (
    <SpecificationsList
      config={{
        title: 'My Specifications',
        searchPlaceholder: 'Search by product or brand...',
        emptyStateText: 'No specifications found.',
        showCreateButton: true,
        createButtonText: '+ New Specification',
        createButtonHref: '/create-specification',
        aiGenerated: false,
        navigateTo: 'edit'
      }}
    />
  )
}
