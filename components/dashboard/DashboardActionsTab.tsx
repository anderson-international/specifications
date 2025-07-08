import React from 'react'
import DashboardSubTabNavigation from './DashboardSubTabNavigation'
import DashboardProductCard from './DashboardProductCard'
import type { ProductInsight } from '@/app/api/dashboard/stats/types'
import styles from '../../app/Dashboard.module.css'

interface DashboardActionsTabProps {
  nextSpecSubTabs: Array<{ id: string; label: string }>
  activeNextSpecSubTab: string
  onSubTabClick: (subTabId: string) => void
  priorityProducts: ProductInsight[]
  attentionProducts: ProductInsight[]
  isLoading: boolean
}

const DashboardActionsTab: React.FC<DashboardActionsTabProps> = React.memo(
  ({
    nextSpecSubTabs,
    activeNextSpecSubTab,
    onSubTabClick,
    priorityProducts,
    attentionProducts,
    isLoading,
  }): JSX.Element => {
    const products = activeNextSpecSubTab === 'priority' ? priorityProducts : attentionProducts
    const isZeroSpecs = activeNextSpecSubTab === 'priority'
    const emptyMessage =
      activeNextSpecSubTab === 'priority'
        ? 'Great! All products have at least one specification.'
        : 'No products found with exactly 1 specification.'

    const renderProductGrid = (): JSX.Element => {
      if (isLoading) {
        return <div className={styles.loadingState}>Loading products...</div>
      }

      if (products.length === 0) {
        return <div className={styles.emptyState}>{emptyMessage}</div>
      }

      return (
        <div className={styles.productGrid}>
          {products.map((product) => (
            <DashboardProductCard
              key={product.handle}
              product={product}
              isZeroSpecs={isZeroSpecs}
            />
          ))}
        </div>
      )
    }

    return (
      <section className={styles.section}>
        <DashboardSubTabNavigation
          subTabs={nextSpecSubTabs}
          activeSubTab={activeNextSpecSubTab}
          onSubTabClick={onSubTabClick}
        />
        <div className={styles.subTabContent}>{renderProductGrid()}</div>
      </section>
    )
  }
)

DashboardActionsTab.displayName = 'DashboardActionsTab'

export default DashboardActionsTab
