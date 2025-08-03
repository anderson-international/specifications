'use client'

import React, { useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import SpecificationWizard from '@/components/wizard/SpecificationWizard'
import { SpecificationFormData } from '@/types'
import { SpecificationEnumData } from '@/types/enum'
import { useAuth } from '@/lib/auth-context'

interface CreateSpecificationClientProps {
  enumData: SpecificationEnumData
}

export default function CreateSpecificationClient(
  _props: CreateSpecificationClientProps
): JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  if (!user?.id) {
    throw new Error('User authentication required for specification creation')
  }

  // Read params directly instead of using state to prevent infinite loops
  const productId = searchParams.get('productId') || undefined
  const mode = searchParams.get('mode') || undefined
  
  if ((mode === 'edit' || mode === 'createFromProduct') && !productId) {
    throw new Error(`${mode} mode requires productId parameter`)
  }

  const handleSubmit = useCallback(
    async (_data: SpecificationFormData): Promise<void> => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        router.push('/products')
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create specification')
      }
    },
    [router]
  )

  const initialData = useMemo(() => {
    if (productId) {
      return {
        shopify_handle: productId,
        mode,
      }
    }
    return {}
  }, [productId, mode])

  return (
    <SpecificationWizard
      onSubmit={handleSubmit}
      initialData={initialData}
      userId={user.id}
    />
  )
}
