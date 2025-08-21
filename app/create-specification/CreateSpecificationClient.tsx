'use client'

import React, { useCallback, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TransformedFormData, buildApiRequest } from '@/components/wizard/hooks/specification-transform-utils'
import SpecificationWizard from '@/components/wizard/SpecificationWizard'
import { SpecificationEnumData } from '@/types/enum'
import { useAuth } from '@/lib/auth-context'
import { submitSpecification } from '@/lib/utils/submitSpecification'
import { useSpecBack } from '@/hooks/useSpecBack'

interface CreateSpecificationClientProps {
  enumData: SpecificationEnumData
}

export default function CreateSpecificationClient(
  _props: CreateSpecificationClientProps
): JSX.Element | null {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  if (!user?.id) {
    throw new Error('User authentication required for specification creation')
  }
  const productId = searchParams.get('productId') || undefined
  const mode = searchParams.get('mode') || undefined
  const initialTab = ((): 'to-do' | 'my-specs' => {
    const t = searchParams?.get('tab')
    return t === 'my-specs' ? 'my-specs' : 'to-do'
  })()
  const handleBack = useSpecBack(router, initialTab)
  
  useEffect(() => {
    if (!productId) {
      router.replace('/specifications')
    }
  }, [productId, router])

  const handleSubmit = useCallback(
    async (data: TransformedFormData): Promise<void> => {
      try {
        const apiRequest = buildApiRequest(data, user.id)
        const result = await submitSpecification<{ error?: string; message?: string; data?: unknown }>(apiRequest)
        if (result.error || !result.data) {
          if (result.error) {
            throw new Error(result.error)
          }
          if (result.message) {
            throw new Error(result.message)
          }
          throw new Error('Create failed')
        }

        router.push('/specifications?tab=my-specs')
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create specification')
      }
    },
    [router, user.id]
  )

  const initialData: Record<string, unknown> = useMemo(() => {
    if (productId) {
      return {
        shopify_handle: productId,
        mode,
      }
    }
    return {}
  }, [productId, mode])

  if (!productId) return null

  return (
    <SpecificationWizard
      onSubmit={handleSubmit}
      initialData={initialData}
      userId={user.id}
      onBackToList={handleBack}
    />
  )
}
