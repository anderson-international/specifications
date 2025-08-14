'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/lib/auth-context'
import { keyForExisting, type TrialDraft } from '@/lib/utils/trial-draft-storage'
import { useTrialAutoSave } from '@/hooks/useTrialAutoSave'
import DraftRestoreModal from '@/components/shared/DraftRestoreModal'
import DraftSaveIndicator from '@/components/wizard/components/DraftSaveIndicator'
import type { Option as MultiSelectOption } from '@/components/wizard/controls/MultiSelectChips'
import NewTrialEvaluation from '@/components/trials/NewTrialEvaluation'
import SelectedProductStep from '@/components/trials/SelectedProductStep'
import { useSelectedTrialProduct } from '@/hooks/useSelectedTrialProduct'
import wizardStyles from '@/components/wizard/SpecificationWizard.module.css'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTrialBack, useStartFresh, useTrialSubmit, useExistingReviewHydration, useDraftRestore, TRIAL_MIN_REVIEW_CHARS, type TrialFormData } from '@/hooks/useTrialReviewActions'

interface EnumValue { id: number; name: string }

export default function NewTrialPage(): JSX.Element {
  const { user } = useAuth()
  if (!user?.id) throw new Error('User authentication required for creating trials')

  const methods = useForm<TrialFormData>({ defaultValues: { product_name: '', brand_id: 0, rating: 0, review: '', should_sell: false, tasting_note_ids: [], user_id: user.id } })
  const [tastingNotes, setTastingNotes] = useState<EnumValue[]>([])
  const [showRestore, setShowRestore] = useState(false)
  const [restoreDraft, setRestoreDraft] = useState<TrialDraft | null>(null)
  const [draftApplied, setDraftApplied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { productId, selectedItem } = useSelectedTrialProduct(user.id)
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = ((): 'to-do' | 'done' => {
    const t = searchParams?.get('tab')
    return t === 'done' || t === 'my-specs' ? 'done' : 'to-do'
  })()

  useEffect(() => { (async () => {
    const e = await fetch('/api/enums'); if (e.ok) { const j = await e.json(); setTastingNotes(j?.data?.tastingNotes ?? []) }
  })() }, [])

  useEffect(() => { if (selectedItem) { methods.setValue('product_name', selectedItem.name, { shouldDirty: false }); methods.setValue('brand_id', selectedItem.brand.id, { shouldDirty: false }) } }, [selectedItem, methods])

  useExistingReviewHydration(methods, user.id, selectedItem, draftApplied)

  const draftKey: string | null = useMemo(() => (productId ? keyForExisting(user.id, productId) : null), [user.id, productId])
  const { clearDraft, saveStatus, hasSavedOnce } = useTrialAutoSave<TrialFormData>({ methods, userId: user.id, draftKey, currentStep: 1, isEnabled: Boolean(draftKey), isSubmitting })

  const tastingNoteOptions: MultiSelectOption[] = useMemo(() => tastingNotes.map((tn) => ({ id: tn.id, label: tn.name, value: tn.id })), [tastingNotes])

  useDraftRestore(methods, draftKey, setRestoreDraft, setShowRestore, setDraftApplied)

  const handleRecover = useCallback((): void => { setShowRestore(false); setRestoreDraft(null) }, [])

  const handleStartFresh = useStartFresh(methods, { draftKey, selectedItem, userId: user.id, setRestoreDraft, setShowRestore, setDraftApplied })

  const handleBack = useTrialBack(router, initialTab)

  const submitCore = useTrialSubmit({ userId: user.id, selectedItem, clearDraft, router })
  const onSubmit = useCallback(async (data: TrialFormData): Promise<void> => {
    setIsSubmitting(true)
    try {
      await submitCore(data)
    } finally {
      setIsSubmitting(false)
    }
  }, [submitCore])

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>New Trial</h1>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gap: '0.25rem' }}>
          <SelectedProductStep item={selectedItem} />
          {Boolean(draftKey) && (<DraftSaveIndicator saveStatus={saveStatus} hasSavedOnce={hasSavedOnce} />)}
          <NewTrialEvaluation
            rating={methods.watch('rating')}
            onRatingChange={(v) => methods.setValue('rating', v, { shouldDirty: true })}
            tastingNoteOptions={tastingNoteOptions}
            selectedTastingNotes={(methods.watch('tasting_note_ids') ?? []) as (number | string)[]}
            onTastingNotesChange={(vals: Array<number | string>) => methods.setValue('tasting_note_ids', vals.map((x) => Number(x)), { shouldDirty: true })}
            reviewRegister={methods.register('review', { minLength: TRIAL_MIN_REVIEW_CHARS, required: true })}
            reviewValue={(methods.watch('review') ?? '') as string}
            minReviewChars={TRIAL_MIN_REVIEW_CHARS}
            shouldSell={Boolean(methods.watch('should_sell'))}
            onShouldSellChange={(v) => methods.setValue('should_sell', v, { shouldDirty: true })}
          />
        </div>

        <div className={wizardStyles.wizardFooter}><div className={wizardStyles.footerContent}><div className={wizardStyles.navigationButtons}><button type="button" onClick={handleBack} className={wizardStyles.backButton} disabled={isSubmitting} title="Back to list" aria-label="Back to list">←</button><button type="submit" className={wizardStyles.submitButton} disabled={isSubmitting || !productId || !selectedItem || (Number(methods.watch('rating')) || 0) < 1 || ((String(methods.watch('review') ?? '')).trim().length) < TRIAL_MIN_REVIEW_CHARS || ((methods.watch('tasting_note_ids') ?? []).length) < 1} title={isSubmitting ? 'Submitting...' : 'Submit review'} aria-label="Submit review">{isSubmitting ? '⏳' : '✓'}</button></div></div></div>
      </form>
      {showRestore && restoreDraft ? (
        <DraftRestoreModal
          title="Resume Previous Work?"
          description={<strong>{selectedItem?.name ?? ''}</strong>}
          lastSaved={restoreDraft.lastSaved}
          onRecover={handleRecover}
          onStartFresh={handleStartFresh}
        />
      ) : null}
    </div>
  )
}
