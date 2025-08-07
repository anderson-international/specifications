'use client'

import { SaveStatus } from '../types/wizard.types'
import styles from './DraftSaveIndicator.module.css'

interface DraftSaveIndicatorProps {
  saveStatus: SaveStatus
  hasSavedOnce: boolean
}

const DraftSaveIndicator = ({ saveStatus, hasSavedOnce }: DraftSaveIndicatorProps): JSX.Element | null => {

  if (!hasSavedOnce) {
    return null
  }

  if (saveStatus === 'saving') {
    return (
      <div className={`${styles.indicator} ${styles.saving}`}>
        draft <span className={styles.spinner}></span>
      </div>
    )
  }

  if (saveStatus === 'saved' || saveStatus === 'idle') {
    return (
      <div className={`${styles.indicator} ${styles.saved}`}>
        draft <span className={styles.checkmark}>✓</span>
      </div>
    )
  }

  throw new Error(`DraftSaveIndicator: invalid saveStatus '${saveStatus}'. Expected 'saving', 'saved', or 'idle'. Check save status management.`)
}

export default DraftSaveIndicator
