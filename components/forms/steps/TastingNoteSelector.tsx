'use client'

import { useCallback, useState, memo } from 'react'
import styles from './SensoryProfile.module.css'

interface TastingNoteSelectorProps {
  selectedNotes: string[]
  onToggleNote: (note: string) => void
  onAddCustomNote: (note: string) => void
  onRemoveNote: (note: string) => void
  error?: string
}

const COMMON_TASTING_NOTES = [
  'Earthy', 'Woody', 'Nutty', 'Sweet', 'Salty', 'Bitter', 'Floral',
  'Fruity', 'Spicy', 'Herbal', 'Smoky', 'Leather', 'Chocolate',
  'Vanilla', 'Coffee', 'Toast', 'Hay', 'Grass', 'Citrus', 'Berry'
]

export const TastingNoteSelector = memo<TastingNoteSelectorProps>(function TastingNoteSelector({
  selectedNotes,
  onToggleNote,
  onAddCustomNote,
  onRemoveNote,
  error
}: TastingNoteSelectorProps): JSX.Element {
  const [customNote, setCustomNote] = useState<string>('')

  const handleAddCustomNote = useCallback((): void => {
    const trimmedNote = customNote.trim()
    if (trimmedNote && !selectedNotes.includes(trimmedNote)) {
      onAddCustomNote(trimmedNote)
      setCustomNote('')
    }
  }, [customNote, selectedNotes, onAddCustomNote])

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Tasting Notes</h3>
      <p className={styles.sectionDesc}>Select or add flavors you detect</p>
      
      {/* Common Notes */}
      <div className={styles.tagGrid}>
        {COMMON_TASTING_NOTES.map((note) => (
          <button
            key={note}
            type="button"
            onClick={() => onToggleNote(note)}
            className={`${styles.tagButton} ${
              selectedNotes.includes(note) ? styles.tagSelected : ''
            }`}
          >
            {note}
          </button>
        ))}
      </div>

      {/* Custom Note Input */}
      <div className={styles.customNoteSection}>
        <div className={styles.customNoteInput}>
          <input
            type="text"
            placeholder="Add custom tasting note..."
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomNote())}
            className={styles.textInput}
          />
          <button
            type="button"
            onClick={handleAddCustomNote}
            disabled={!customNote.trim()}
            className={styles.addButton}
          >
            Add
          </button>
        </div>
      </div>

      {/* Selected Notes */}
      {selectedNotes.length > 0 && (
        <div className={styles.selectedNotes}>
          <h4 className={styles.selectedTitle}>Selected Notes:</h4>
          <div className={styles.selectedGrid}>
            {selectedNotes.map((note) => (
              <div key={note} className={styles.selectedNote}>
                <span>{note}</span>
                <button
                  type="button"
                  onClick={() => onRemoveNote(note)}
                  className={styles.removeButton}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className={styles.error}>{error}</div>
      )}
    </div>
  )
})
