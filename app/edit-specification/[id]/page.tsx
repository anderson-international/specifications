'use client'

import React, { useCallback, use } from 'react'
import { SpecificationWizard } from '@/components/wizard/SpecificationWizard'
import { notFound, useRouter } from 'next/navigation'
import { TransformedFormData, buildApiRequest } from '@/components/wizard/hooks/specification-transform-utils'
import { useAuthenticatedUser } from '@/lib/auth-context'
import { useSpecificationData } from '@/components/wizard/hooks/useSpecificationData'
import { LoadingState, ErrorState, NotFoundState } from './EditPageStates'

interface EditSpecificationPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditSpecificationPage({
  params,
}: EditSpecificationPageProps): JSX.Element {
  const { id } = use(params)
  const router = useRouter()
  const user = useAuthenticatedUser()
  
  const { data: specificationData, isLoading, error } = useSpecificationData(id)

  const handleSubmit = useCallback<(data: TransformedFormData) => Promise<void>>(async (data) => {
    const apiRequest = buildApiRequest(data, user.id, id)
    const response = await fetch(apiRequest.url, {
      method: apiRequest.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequest.body),
    })

    if (!response.ok) {
      const raw = await response.text()
      const trimmed = raw.trim()
      let details = ''
      if (trimmed.length > 0) {
        const header = response.headers.get('content-type')
        const headerIsJson = typeof header === 'string' && header.includes('application/json')
        const looksJson = headerIsJson || trimmed.startsWith('{') || trimmed.startsWith('[')
        let parsed: unknown
        if (looksJson) {
          try {
            parsed = JSON.parse(trimmed)
          } catch {
            parsed = undefined
          }
        }
        if (parsed && typeof parsed === 'object') {
          const maybeMessage = (parsed as { message?: unknown }).message
          if (typeof maybeMessage === 'string' && maybeMessage.trim().length > 0) {
            details = maybeMessage.trim()
          } else {
            details = trimmed
          }
        } else {
          details = trimmed
        }
      }
      const base = 'Update failed'
      const composed = details.length > 0 ? `${base}: ${details}` : `${base}: server returned an error without message`
      throw new Error(composed)
    }

    const result = await response.json()

    type ResultShape = { success?: boolean; error?: unknown; message?: unknown }
    const obj: ResultShape | undefined =
      result && typeof result === 'object' ? (result as ResultShape) : undefined
    const success = obj?.success === true
    const parts: string[] = []
    if (obj && typeof obj.error === 'string' && obj.error.trim().length > 0) {
      parts.push(obj.error.trim())
    }
    if (obj && typeof obj.message === 'string' && obj.message.trim().length > 0) {
      parts.push(obj.message.trim())
    }
    if (!success || parts.length > 0) {
      const details = parts.length > 0 ? `: ${parts.join(' | ')}` : ''
      throw new Error(`Update failed${details}`)
    }

    router.push('/specifications')
  }, [id, router, user.id])

  if (!id || id === 'undefined') {
    notFound()
  }
  


  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!specificationData) return <NotFoundState />



  return (
    <div className="min-h-screen bg-gray-900">
      <SpecificationWizard
        onSubmit={handleSubmit}
        initialData={{ ...specificationData, mode: 'edit' } as unknown as Record<string, unknown>}
        userId={user.id}
      />
    </div>
  )
}
