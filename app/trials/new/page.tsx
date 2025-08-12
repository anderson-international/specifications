'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/lib/auth-context'
import { keyForNew, keyForExisting, loadTrialDraft, deleteTrialDraft, type TrialDraft } from '@/lib/utils/trial-draft-storage'
import { useTrialAutoSave } from '@/hooks/useTrialAutoSave'
import DraftRestoreModal from '@/components/shared/DraftRestoreModal'
import StarRating from '@/components/wizard/steps/StarRating'

interface Brand { id: number; name: string }
interface EnumValue { id: number; name: string }
interface FormData { product_name: string; brand_id: number | string; rating: number; review: string; should_sell: boolean; tasting_note_ids: number[]; user_id: string }

export default function NewTrialPage(): JSX.Element {
  const { user } = useAuth()
  if (!user?.id) throw new Error('User authentication required for creating trials')

  const methods = useForm<FormData>({ defaultValues: { product_name: '', brand_id: 0, rating: 1, review: '', should_sell: false, tasting_note_ids: [], user_id: user.id } })
  const [brands, setBrands] = useState<Brand[]>([])
  const [tastingNotes, setTastingNotes] = useState<EnumValue[]>([])
  const [showRestore, setShowRestore] = useState(false)
  const [restoreDraft, setRestoreDraft] = useState<TrialDraft | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => { (async () => {
    const b = await fetch('/api/trial-brands'); if (b.ok) { const j = await b.json(); setBrands(j?.data?.brands ?? j?.brands ?? []) }
    const e = await fetch('/api/enums'); if (e.ok) { const j = await e.json(); setTastingNotes(j?.data?.tastingNotes ?? []) }
  })() }, [])

  const name = methods.watch('product_name')
  const brandId = Number(methods.watch('brand_id')) || 0
  const draftKey: string | null = useMemo(() => (name && brandId ? keyForNew(user.id, brandId, name) : null), [user.id, name, brandId])
  const { clearDraft, forceSave, saveStatus, lastError, hasSavedOnce } = useTrialAutoSave<FormData>({ methods, userId: user.id, draftKey, currentStep: 1, isEnabled: Boolean(draftKey), isSubmitting })

  useEffect(() => {
    if (!draftKey) return
    const d = loadTrialDraft(draftKey)
    if (d) { setRestoreDraft(d); setShowRestore(true) }
  }, [draftKey])
  const handleRecover = useCallback((): void => {
    if (!restoreDraft) return
    methods.reset(restoreDraft.formData as Partial<FormData>, { keepDefaultValues: false })
    setShowRestore(false)
  }, [restoreDraft, methods])
  const handleStartFresh = useCallback((): void => {
    if (draftKey) deleteTrialDraft(draftKey)
    setRestoreDraft(null)
    setShowRestore(false)
  }, [draftKey])

  const onSubmit = useCallback(async (data: FormData): Promise<void> => {
    setIsSubmitting(true)
    try {
      if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
        throw new Error('Rating must be between 1 and 5')
      }
      const trimmed = typeof data.review === 'string' ? data.review.trim() : ''
      const review: string | null = trimmed.length > 0 ? trimmed : null
      const body = { trial: { product_name: data.product_name, brand_id: Number(data.brand_id), rating: data.rating, review, should_sell: Boolean(data.should_sell), user_id: user.id }, junctionData: { tasting_note_ids: data.tasting_note_ids } }
      const res = await fetch('/api/trials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(`Create failed (${res.status})`)
      const json = await res.json(); const created = json?.data ?? json
      if (draftKey && created?.trial_product_id) {
        const existingKey = keyForExisting(user.id, Number(created.trial_product_id))
        const d = loadTrialDraft(draftKey); if (d) { localStorage.setItem(existingKey, JSON.stringify({ ...d, key: existingKey })) }
        deleteTrialDraft(draftKey)
      }
      clearDraft()
      window.location.href = '/trials'
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : 'Unknown error')
    } finally { setIsSubmitting(false) }
  }, [user.id, draftKey, clearDraft])

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>New Trial</h1>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <label>Product Name<input type="text" {...methods.register('product_name', { required: true })} /></label>
          <label>Brand<select {...methods.register('brand_id', { required: true })}>
            <option value={0}>Select brand</option>
            {brands.map(b => (<option key={b.id} value={b.id}>{b.name}</option>))}
          </select></label>
          <div>
            <div style={{ marginBottom: 4 }}>Rating</div>
            <StarRating value={methods.watch('rating')} onChange={(v) => methods.setValue('rating', v, { shouldDirty: true })} />
          </div>
          <fieldset>
            <legend>Tasting Notes</legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {tastingNotes.map(tn => {
                const idsUnknown = methods.getValues('tasting_note_ids')
                if (!Array.isArray(idsUnknown)) throw new Error('tasting_note_ids must be an array')
                const ids = idsUnknown as number[]
                const checked = ids.includes(tn.id)
                return (
                  <label key={tn.id} style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                    <input type="checkbox" checked={checked} onChange={(e) => {
                      const currentUnknown = methods.getValues('tasting_note_ids')
                      if (!Array.isArray(currentUnknown)) throw new Error('tasting_note_ids must be an array')
                      const cur = new Set<number>(currentUnknown as number[])
                      if (e.target.checked) cur.add(tn.id); else cur.delete(tn.id)
                      methods.setValue('tasting_note_ids', Array.from(cur), { shouldDirty: true })
                    }} />{tn.name}
                  </label>
                )
              })}
            </div>
          </fieldset>
          <label>Review<textarea rows={4} {...methods.register('review')} /></label>
          <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={methods.watch('should_sell')} onChange={(e) => methods.setValue('should_sell', e.target.checked, { shouldDirty: true })} />
            Recommend to sell
          </label>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'center' }}>
          <button type="submit" disabled={isSubmitting || !name || !brandId}>Create Trial</button>
          <button type="button" onClick={forceSave} disabled={!draftKey || isSubmitting}>Save Draft</button>
          <span style={{ fontSize: 12, color: '#64748b' }}>Status: {saveStatus}{lastError ? ` — ${lastError}` : ''}{hasSavedOnce ? ' — saved' : ''}</span>
        </div>
      </form>
      {showRestore && restoreDraft ? (
        <DraftRestoreModal
          title="Resume Previous Work?"
          description={<strong>{name}</strong>}
          lastSaved={restoreDraft.lastSaved}
          onRecover={handleRecover}
          onStartFresh={handleStartFresh}
        />
      ) : null}
    </div>
  )
}
