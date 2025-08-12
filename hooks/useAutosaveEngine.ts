import { useCallback, useEffect, useRef, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { createAutosaveEngine, type Engine, type AutoStatus, type Unsub } from '@/lib/utils/autosave-core'

export interface UseAutosaveEngineProps<T extends Record<string, unknown>> {
  methods: UseFormReturn<T>
  isEnabled: boolean
  canSave: () => boolean
  saveFn: (data: T) => void
}

export interface UseAutosaveEngineResult {
  saveStatus: AutoStatus
  lastError: string | null
  hasSavedOnce: boolean
  forceSave: () => void
}

export function useAutosaveEngine<T extends Record<string, unknown>>({
  methods,
  isEnabled,
  canSave,
  saveFn,
}: UseAutosaveEngineProps<T>): UseAutosaveEngineResult {
  const [saveStatus, setSaveStatus] = useState<AutoStatus>('idle')
  const [lastError, setLastError] = useState<string | null>(null)
  const [hasSavedOnce, setHasSavedOnce] = useState<boolean>(false)
  const engineRef = useRef<Engine | null>(null)

  const onStatus = useCallback((s: AutoStatus, err?: string): void => {
    if (s === 'error') setLastError(err ?? 'Unknown error')
    if (s === 'saved') setHasSavedOnce(true)
    setSaveStatus(s)
  }, [])

  const forceSave = useCallback((): void => {
    try { engineRef.current?.forceSave() } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setLastError(msg); setSaveStatus('error'); throw new Error(`Failed to save draft: ${msg}`)
    }
  }, [])

  useEffect(() => {
    if (!isEnabled) return
    const engine: Engine = createAutosaveEngine<T>({
      getValues: () => methods.getValues(),
      subscribe: (cb) => {
        const subscription: { unsubscribe: () => void } = methods.watch((data) => cb(data as unknown as T)) as unknown as { unsubscribe: () => void }
        return { unsubscribe: () => subscription.unsubscribe() } as Unsub
      },
      canSave,
      saveFn,
      onStatus,
    })
    engineRef.current = engine
    return () => { engine.dispose(); engineRef.current = null }
  }, [methods, isEnabled, canSave, saveFn, onStatus])

  return { saveStatus, lastError, hasSavedOnce, forceSave }
}
