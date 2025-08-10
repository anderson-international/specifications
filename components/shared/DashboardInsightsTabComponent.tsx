import React from 'react'
import styles from '../../app/Dashboard.module.css'

export type RenderItem<T> = (item: T, index: number) => JSX.Element

export interface InsightsCardProps<T> {
  title: string
  description: string
  items: T[]
  emptyText: string
  listClassName: string
  limit?: number
  renderItem: RenderItem<T>
}

export function DashboardInsightsTabComponent<T>(props: InsightsCardProps<T>): JSX.Element {
  const { title, description, items, emptyText, listClassName, limit = 5, renderItem } = props

  return (
    <div className={styles.insightCard}>
      <h3 className={styles.insightTitle}>{title}</h3>
      <p className={styles.insightDescription}>{description}</p>
      {items.length > 0 ? (
        <div className={listClassName}>
          {items.slice(0, limit).map((item, index) => renderItem(item, index))}
        </div>
      ) : (
        <div className={styles.emptyState}>{emptyText}</div>
      )}
    </div>
  )
}

export default DashboardInsightsTabComponent
