'use client'

import SpecificationsListAdapter from './SpecificationsListAdapter'

interface SpecificationsListConfig {
  title?: string
  subtitle?: string
  searchPlaceholder: string
  emptyStateText: string
  emptySubtext?: string
  showCreateButton?: boolean
  createButtonText?: string
  createButtonHref?: string
  aiGenerated?: boolean
  userId?: string
  navigateTo: 'edit' | 'markdown'
}

interface SpecificationsListProps {
  config: SpecificationsListConfig
}

export default function SpecificationsList({ config }: SpecificationsListProps): JSX.Element {
  return <SpecificationsListAdapter config={config} />
}
