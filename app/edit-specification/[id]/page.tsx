'use client'

import React, { useCallback, use } from 'react'
import { SpecificationWizard } from '@/components/wizard/SpecificationWizard'
import { notFound, useRouter } from 'next/navigation'
import { Specification, SpecificationFormData } from '@/types/specification'
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

  const handleSubmit = useCallback(async (data: SpecificationFormData) => {
    const response = await fetch(`/api/specifications/${id}?userId=${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update specification')
    }

    const result = await response.json()

    if (result.error || !result.success) {
      throw new Error(result.error || result.message || 'Update failed')
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
