'use client'

import React, { useCallback, use } from 'react'
import { SpecificationWizard } from '@/components/wizard/SpecificationWizard'
import { notFound, useRouter, useSearchParams } from 'next/navigation'
import { TransformedFormData, buildApiRequest } from '@/components/wizard/hooks/specification-transform-utils'
import { useAuthenticatedUser } from '@/lib/auth-context'
import { useSpecificationData } from '@/components/wizard/hooks/useSpecificationData'
import { LoadingState, ErrorState, NotFoundState } from './EditPageStates'
import { submitSpecification } from '@/lib/utils/submitSpecification'
import { useSpecBack } from '@/hooks/useSpecBack'

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
  const searchParams = useSearchParams()
  const user = useAuthenticatedUser()
  const initialTab = ((): 'to-do' | 'my-specs' => {
    const t = searchParams?.get('tab')
    return t === 'my-specs' ? 'my-specs' : 'to-do'
  })()
  const handleBack = useSpecBack(router, initialTab)
  
  const { data: specificationData, isLoading, error } = useSpecificationData(id)

  const handleSubmit = useCallback<(data: TransformedFormData) => Promise<void>>(async (data) => {
    const apiRequest = buildApiRequest(data, user.id, id)
    const result = await submitSpecification<{ success?: boolean; error?: unknown; message?: unknown }>(apiRequest)
    const obj = result && typeof result === 'object' ? (result as { success?: boolean; error?: unknown; message?: unknown }) : undefined
    const success = obj?.success === true
    const parts: string[] = []
    if (obj && typeof obj.error === 'string' && obj.error.trim().length > 0) parts.push(obj.error.trim())
    if (obj && typeof obj.message === 'string' && obj.message.trim().length > 0) parts.push(obj.message.trim())
    if (!success || parts.length > 0) {
      const details = parts.length > 0 ? `: ${parts.join(' | ')}` : ''
      throw new Error(`Update failed${details}`)
    }
    router.push('/specifications?tab=my-specs')
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
        onBackToList={handleBack}
      />
    </div>
  )
}
