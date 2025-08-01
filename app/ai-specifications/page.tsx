'use client'

import React from 'react'
import SpecificationsList from '@/components/specifications/SpecificationsList'
import containerStyles from '@/components/shared/PageContainer/PageContainer.module.css'
import pageTitleStyles from '@/components/shared/PageTitle/PageTitle.module.css'

export default function AISpecificationsPage(): JSX.Element {
  return (
    <div className={containerStyles.pageContainer}>
      <div className={pageTitleStyles.pageHeader}>
        <h1 className={pageTitleStyles.pageTitle}>AI Specs</h1>
      </div>

      <SpecificationsList
        config={{
          searchPlaceholder: 'Search by product or brand...',
          emptyStateText: 'No AI specifications found.',
          emptySubtext: 'AI specifications are automatically generated when multiple users review the same product.',
          showCreateButton: false,
          aiGenerated: true,
          navigateTo: 'markdown'
        }}
      />
    </div>
  )
}
