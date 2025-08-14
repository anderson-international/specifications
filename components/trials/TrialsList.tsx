import React from 'react'
import rowStyles from '@/components/shared/RowStyles/RowStyles.module.css'
import type { TrialUserProduct } from '@/lib/types/trial'

interface TrialsListProps {
  items: TrialUserProduct[]
  activeTab: 'to-do' | 'done'
  draftProducts: Set<number>
  onActivate: (item: TrialUserProduct) => void
}

export default function TrialsList({ items, activeTab, draftProducts, onActivate }: TrialsListProps): JSX.Element {
  return (
    <div>
      {items.map((t) => (
        <div
          key={String(t.id)}
          className={rowStyles.baseRow}
          role="button"
          tabIndex={0}
          onClick={() => onActivate(t)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate(t) } }}
          style={{ cursor: (activeTab === 'to-do' || (activeTab === 'done' && t.userReviewId)) ? 'pointer' : 'default' }}
          aria-label={activeTab === 'to-do' ? `Create review for ${t.name}` : `Edit review for ${t.name}`}
        >
          <div className={rowStyles.imageWrapper}>
            <div className={rowStyles.imagePlaceholder}>
              <span>{t.name.substring(0, 2).toUpperCase()}</span>
            </div>
          </div>

          <div className={rowStyles.rowInfo}>
            <h3 className={rowStyles.rowTitle}>{t.name}</h3>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{t.brand.name}</div>
          </div>
          <div className={rowStyles.rightMeta}>
            {draftProducts.has(Number(t.id)) ? (
              <span className={rowStyles.statusIcon} title="Draft saved">✓</span>
            ) : null}
            {(() => {
              const c = t.totalTrialsCount ?? 0
              const cls = c <= 2 ? rowStyles.countBadgeRed : c <= 4 ? rowStyles.countBadgeYellow : rowStyles.countBadgeGreen
              return (
                <span className={`${rowStyles.countBadge} ${cls}`} title={`Total trials: ${c}`}>{c}</span>
              )
            })()}
          </div>
        </div>
      ))}
    </div>
  )
}
