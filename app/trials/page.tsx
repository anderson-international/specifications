'use client'

import buttonStyles from '@/components/shared/Button/Button.module.css'
import containerStyles from '@/components/shared/PageContainer/PageContainer.module.css'
import pageTitleStyles from '@/components/shared/PageTitle/PageTitle.module.css'
import rowStyles from '@/components/shared/RowStyles/RowStyles.module.css'
import ItemList from '@/components/shared/ItemList/ItemList'
import { useItemListFilters } from '@/hooks/useItemListFilters'
import { useTrials } from '@/hooks/useTrials'
import type { Trial } from '@/lib/types/trial'
import StarRating from '@/components/wizard/steps/StarRating'
import { useAuth } from '@/lib/auth-context'
import React from 'react'

export default function TrialsPage(): JSX.Element {
  const { user } = useAuth()

  if (!user?.id) {
    throw new Error('User authentication required for trials page')
  }

  const { trials, loading, error, refetch } = useTrials(user.id)

  const {
    searchQuery,
    setSearchQuery,
    filteredItems,
    filterConfigs,
    setFilter,
    clearAll,
    hasActiveFilters,
  } = useItemListFilters<Trial>({
    items: trials,
    searchFields: (t) => [t.product_name, t.supplier.name, t.review ?? ''],
    getFilterValue: (t, id) => {
      if (id === 'supplier') return t.supplier.name
      if (id === 'rating') return String(t.rating)
      if (id === 'should_sell') return t.should_sell ? 'Yes' : 'No'
      return ''
    },
    getAvailableFilterOptions: (items, id) => {
      const set = new Set<string>()
      if (id === 'supplier') items.forEach(i => set.add(i.supplier.name))
      if (id === 'rating') items.forEach(i => set.add(String(i.rating)))
      if (id === 'should_sell') items.forEach(i => set.add(i.should_sell ? 'Yes' : 'No'))
      return Array.from(set).sort().map(v => ({ value: v, label: v }))
    },
    filterIds: ['supplier', 'rating', 'should_sell'],
  })

  return (
    <div className={containerStyles.pageContainer}>
      <div className={pageTitleStyles.pageHeader}>
        <h1 className={pageTitleStyles.pageTitle}>My Trials</h1>
        <button
          className={buttonStyles.createButton}
          type="button"
          disabled
          title="Creation form not available yet"
        >
          New Trial
        </button>
      </div>

      <ItemList<Trial>
        config={{
          searchPlaceholder: 'Search trials',
          emptyStateText: 'No trials yet',
          emptySubtext: 'Create your first trial to get started.',
          showCreateButton: false,
          createButtonText: 'New Trial',
          createButtonHref: '/trials/new',
        }}
        items={filteredItems}
        isLoading={loading}
        error={error}
        onRetry={refetch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filterConfigs}
        onFilterChange={setFilter}
        onClearAll={clearAll}
        showClearAll={hasActiveFilters}
        getItemKey={(t) => String(t.id)}
        renderItem={(t) => (
          <div className={rowStyles.baseRow}>
            <div className={rowStyles.imageWrapper}>
              <div className={rowStyles.imagePlaceholder}>
                <span>{t.product_name.substring(0, 2).toUpperCase()}</span>
              </div>
            </div>

            <div className={rowStyles.rowInfo}>
              <h3 className={rowStyles.rowTitle}>{t.product_name}</h3>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{t.supplier.name}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <StarRating value={t.rating} onChange={() => { /* read-only */ }} disabled />
              <button
                className={buttonStyles.editButton}
                type="button"
                disabled
                title="Edit form not available yet"
                aria-label={`Edit trial for ${t.product_name}`}
              >
                Edit
              </button>
            </div>
          </div>
        )}
      />
    </div>
  )
}
