'use client'

import containerStyles from '@/components/shared/PageContainer/PageContainer.module.css'
import pageTitleStyles from '@/components/shared/PageTitle/PageTitle.module.css'
import type { TrialUserProduct } from '@/lib/types/trial'
import { useAuth } from '@/lib/auth-context'
import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { useTrialProducts } from '@/hooks/useTrialProducts'
import SpecificationsTabNavigation, { type SpecTabId } from '@/components/specifications/SpecificationsTabNavigation'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTrialDraftProductIds } from '@/hooks/useTrialDraftProductIds'
import CountSummary from '@/components/shared/CountSummary'
import { FilterControls } from '@/components/shared/FilterControls'
import AsyncStateContainer from '@/components/shared/AsyncStateContainer'
import TrialsList from '@/components/trials/TrialsList'

export default function TrialsPage(): JSX.Element {
  const { user } = useAuth()

  if (!user?.id) {
    throw new Error('User authentication required for trials page')
  }

  const { toDo, done, loading, error } = useTrialProducts(user.id)
  const draftProducts = useTrialDraftProductIds(user.id)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  type Tab = 'to-do' | 'done'
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const t = searchParams?.get('tab')
    return t === 'done' || t === 'my-specs' ? 'done' : 'to-do'
  })
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState<string>('')

  const currentItems: TrialUserProduct[] = activeTab === 'to-do' ? toDo : done
  const brandOptions: string[] = useMemo((): string[] => {
    const s = new Set<string>()
    currentItems.forEach(i => { if (i.brand?.name) s.add(i.brand.name) })
    return Array.from(s).sort()
  }, [currentItems])

  const filtered: TrialUserProduct[] = useMemo(() => {
    const q = search.trim().toLowerCase()
    return currentItems.filter(i => {
      const matchesSearch = q.length === 0 || i.name.toLowerCase().includes(q) || i.brand.name.toLowerCase().includes(q)
      const matchesBrand = !brand || i.brand.name === brand
      return matchesSearch && matchesBrand
    })
  }, [currentItems, search, brand])

  const tabs: { id: SpecTabId; label: string }[] = [
    { id: 'to-do', label: 'To Do' },
    { id: 'my-specs', label: 'Done' },
  ]

  useEffect(() => {
    try { sessionStorage.setItem('trials:lastTab', activeTab) } catch { void 0 }
  }, [activeTab])

  const handleTabClick = useCallback((tabId: SpecTabId): void => {
    const next: Tab = tabId === 'my-specs' ? 'done' : 'to-do'
    setActiveTab(next)
    try {
      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
      params.set('tab', next)
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname)
    } catch { void 0 }
  }, [pathname, router])

  const handleRowActivate = useCallback((item: TrialUserProduct): void => {
    router.push(`/trials/new?productId=${encodeURIComponent(String(item.id))}&tab=${activeTab}`)
  }, [router, activeTab])

  return (
    <div className={containerStyles.pageContainer}>
      <div className={pageTitleStyles.pageHeader}>
        <h1 className={pageTitleStyles.pageTitle}>My Trials</h1>
      </div>

      <SpecificationsTabNavigation tabs={tabs} activeTab={activeTab === 'done' ? 'my-specs' : 'to-do'} onTabClick={handleTabClick} />

      <div style={{ marginTop: '1rem' }}>
        <FilterControls
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search trials"
          filters={[{
            id: 'brand',
            label: 'Brand',
            value: brand,
            options: brandOptions.map(v => ({ value: v, label: v })),
          }]}
          onFilterChange={(id, value) => { if (id === 'brand') setBrand(value) }}
          onClearAll={() => { setBrand(''); setSearch('') }}
          showClearAll={Boolean(brand || search)}
        />

        <CountSummary
          count={filtered.length}
          hintMobile={activeTab === 'to-do' ? 'Tap a row to create a review' : 'Tap a row to edit your review'}
          hintDesktop={activeTab === 'to-do' ? 'Click a row to create a review' : 'Click a row to edit your review'}
        />

        <AsyncStateContainer
          loading={loading}
          error={error}
          empty={!loading && !error && filtered.length === 0}
          loadingMessage="Loading trials..."
          errorMessage="Failed to load trials."
          emptyMessage={activeTab === 'to-do' ? 'No trial products to review.' : 'No completed trial reviews.'}
        >
          <TrialsList
            items={filtered}
            activeTab={activeTab}
            draftProducts={draftProducts}
            onActivate={handleRowActivate}
          />
        </AsyncStateContainer>
      </div>
    </div>
  )
}
