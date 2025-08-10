'use client'

import containerStyles from '@/components/shared/PageContainer/PageContainer.module.css'
import pageTitleStyles from '@/components/shared/PageTitle/PageTitle.module.css'

import SpecificationsTabContent from '@/components/specifications/SpecificationsTabContent'
import SpecificationsTabNavigation, { type SpecTabId } from '@/components/specifications/SpecificationsTabNavigation'
import { useToDoFilters } from '@/hooks/useToDoFilters'
import { useUserProducts } from '@/hooks/useUserProducts'
import { useAuth } from '@/lib/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import styles from './specifications.module.css'

export default function SpecificationsPage(): JSX.Element {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<SpecTabId>('to-do')
  
  if (!user?.id) {
    throw new Error('User authentication required for specifications page')
  }
  
  const { products, loading, error } = useUserProducts(user.id, activeTab)
  
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'my-specs' || tabParam === 'to-do') {
      setActiveTab(tabParam as SpecTabId)
    }
  }, [searchParams])
  
  const {
    searchValue,
    setSearchValue,
    filteredProducts,
    filters,
    handleFilterChange,
    handleClearAll,
    showClearAll
  } = useToDoFilters(products, activeTab)

  const handleTabClick = useCallback((tab: SpecTabId): void => {
    setActiveTab(tab)
    router.replace(`/specifications?tab=${tab}`)
  }, [router])

  const handleCreateClick = useCallback((productId: string): void => {
    router.push(`/create-specification?productId=${encodeURIComponent(productId)}&mode=createFromProduct`)
  }, [router])

  const handleEditClick = useCallback((specificationId: string): void => {
    router.push(`/edit-specification/${encodeURIComponent(specificationId)}`)
  }, [router])

  const tabs = [
    { id: 'to-do' as const, label: 'To Do' },
    { id: 'my-specs' as const, label: 'Done' }
  ]

  return (
    <div className={containerStyles.pageContainer}>
      <div className={pageTitleStyles.pageHeader}>
        <h1 className={pageTitleStyles.pageTitle}>My Specs</h1>
      </div>

      <SpecificationsTabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />
      
      <div className={styles.tabContent}>
        <SpecificationsTabContent
          activeTab={activeTab}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filteredProducts={filteredProducts}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          showClearAll={showClearAll}
          loading={loading}
          error={error}
          onCreateClick={handleCreateClick}
          onEditClick={handleEditClick}
        />
      </div>
    </div>
  )
}
