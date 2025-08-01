'use client'

import React, { useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import SpecificationsList from '@/components/specifications/SpecificationsList'
import SpecificationsTabNavigation, { type SpecTabId } from '@/components/specifications/SpecificationsTabNavigation'
import { useUserProducts } from '@/hooks/useUserProducts'
import ProductRow from '@/components/shared/ProductSelector/ProductRow'
import { useRouter } from 'next/navigation'
import styles from '@/components/layout/AppLayout.module.css'
import itemListStyles from '@/components/shared/ItemList/ItemList.module.css'

export default function SpecificationsPage(): JSX.Element {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<SpecTabId>('my-specs')
  
  if (!user?.id) {
    throw new Error('User authentication required for specifications page')
  }
  
  const { products, loading, error } = useUserProducts(user.id, activeTab)

  const handleTabClick = useCallback((tab: SpecTabId): void => {
    setActiveTab(tab)
  }, [])

  const handleCreateClick = useCallback((productId: string): void => {
    router.push(`/create-specification?productId=${encodeURIComponent(productId)}`)
  }, [router])

  const handleEditClick = useCallback((productId: string): void => {
    router.push(`/create-specification?productId=${encodeURIComponent(productId)}`)
  }, [router])

  const tabs = [
    { id: 'my-specs' as const, label: 'My Specs' },
    { id: 'to-do' as const, label: 'To Do' }
  ]

  return (
    <div className={itemListStyles.container}>
      <SpecificationsTabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />
      
      {activeTab === 'my-specs' ? (
        <SpecificationsList
          config={{
            title: 'My Specifications',
            searchPlaceholder: 'Search by product or brand...',
            emptyStateText: 'No specifications found.',
            showCreateButton: true,
            createButtonText: '+ New Specification',
            createButtonHref: '/create-specification',
            navigateTo: 'edit'
          }}
        />
      ) : (
        <div className={styles.main}>
          {error && (
            <div style={{ color: 'var(--color-error)', padding: '1rem', textAlign: 'center' }}>
              <p>Error loading products: {error}</p>
            </div>
          )}
          
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <p>No products to review yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  mode="single"
                  userHasSpec={product.userHasSpec}
                  specCount={product.specCount}
                  onCreateClick={() => handleCreateClick(product.id)}
                  onEditClick={() => handleEditClick(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
