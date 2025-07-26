'use client'

import React, { useCallback, useMemo } from 'react'
import ItemList, { ItemListConfig } from '@/components/shared/ItemList/ItemList'
import { useItemListFilters } from '@/hooks/useItemListFilters'
import { useSpecificationsList } from '@/hooks/useSpecificationsList'
import { SpecificationRow } from '@/components/specifications/SpecificationRow'
import { Specification } from '@/types/specification'

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

interface SpecificationsListAdapterProps {
  config: SpecificationsListConfig
}

export default function SpecificationsListAdapter({ config }: SpecificationsListAdapterProps): JSX.Element {
  const {
    specifications,
    isLoading,
    error,
    handleClick,
    handleRetry,
  } = useSpecificationsList({
    aiGenerated: config.aiGenerated,
    userId: config.userId,
    navigateTo: config.navigateTo
  })

  const searchFields = useCallback((spec: Specification) => [
    spec.product?.title || spec.shopify_handle,
    spec.product?.brand || ''
  ], [])

  const getFilterValue = useCallback((spec: Specification, filterId: string) => {
    if (filterId === 'brand') {
      return spec.product?.brand || ''
    }
    return ''
  }, [])

  const getAvailableFilterOptions = useCallback((specs: Specification[], filterId: string) => {
    if (filterId === 'brand') {
      const brands = Array.from(new Set(specs.map(spec => spec.product?.brand || '').filter(Boolean)))
      return [
        { value: '', label: 'All Brands' },
        ...brands.map(brand => ({ value: brand, label: brand }))
      ]
    }
    return []
  }, [])

  const {
    searchQuery,
    setFilter,
    clearAll,
    filteredItems,
    filterConfigs,
    hasActiveFilters,
    setSearchQuery,
  } = useItemListFilters({
    items: specifications,
    searchFields,
    getFilterValue,
    getAvailableFilterOptions,
    filterIds: ['brand']
  })

  const itemListConfig: ItemListConfig = useMemo(() => ({
    title: config.title,
    subtitle: config.subtitle,
    searchPlaceholder: config.searchPlaceholder,
    emptyStateText: config.emptyStateText,
    emptySubtext: config.emptySubtext,
    showCreateButton: config.showCreateButton,
    createButtonText: config.createButtonText,
    createButtonHref: config.createButtonHref,
  }), [config])

  const renderItem = useCallback((spec: Specification) => (
    <SpecificationRow
      specification={spec}
      onClick={handleClick}
      isAI={config.aiGenerated}
    />
  ), [handleClick, config.aiGenerated])

  const getItemKey = useCallback((spec: Specification) => spec.id, [])

  return (
    <ItemList
      config={itemListConfig}
      items={filteredItems}
      isLoading={isLoading}
      error={error}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      filters={filterConfigs}
      onFilterChange={setFilter}
      onClearAll={clearAll}
      showClearAll={hasActiveFilters}
      onRetry={handleRetry}
      renderItem={renderItem}
      getItemKey={getItemKey}
    />
  )
}
