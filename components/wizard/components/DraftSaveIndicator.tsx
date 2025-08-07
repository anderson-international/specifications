'use client'

import { SaveStatus } from '../types/wizard.types'
import styles from './DraftSaveIndicator.module.css'

interface DraftSaveIndicatorProps {
  saveStatus: SaveStatus
  hasSavedOnce: boolean
}

const DraftSaveIndicator = ({ saveStatus, hasSavedOnce }: DraftSaveIndicatorProps): JSX.Element => {
  const isVisible = hasSavedOnce
  
  if (saveStatus === 'saving') {
    return (
      <div className={`${styles.indicator} ${styles.saving} ${!isVisible ? styles.hidden : ''}`}>
        draft <span className={styles.spinner}></span>
      </div>
    )
  }

  if (saveStatus === 'saved' || saveStatus === 'idle') {
    return (
      <div className={`${styles.indicator} ${styles.saved} ${!isVisible ? styles.hidden : ''}`}>
        draft <span className={styles.checkmark}>✓</span>
      </div>
    )
  }

  return (
    <div className={`${styles.indicator} ${styles.hidden}`}>
      draft <span className={styles.checkmark}>✓</span>
    </div>
  )
}

export default DraftSaveIndicator
