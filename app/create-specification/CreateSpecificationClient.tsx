'use client'

import React, { useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TransformedFormData, buildApiRequest } from '@/components/wizard/hooks/specification-transform-utils'
import SpecificationWizard from '@/components/wizard/SpecificationWizard'
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
  const productId = searchParams.get('productId') || undefined
  const mode = searchParams.get('mode') || undefined
  
  if ((mode === 'edit' || mode === 'createFromProduct') && !productId) {
    throw new Error(`${mode} mode requires productId parameter`)
  }

  const handleSubmit = useCallback(
    async (data: TransformedFormData): Promise<void> => {
      try {
        const apiRequest = buildApiRequest(data, user.id)
        const response = await fetch(apiRequest.url, {
          method: apiRequest.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiRequest.body),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
          if (errorData.message) {
            throw new Error(errorData.message)
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        if (result.error || !result.data) {
          if (result.error) {
            throw new Error(result.error)
          }
          if (result.message) {
            throw new Error(result.message)
          }
          throw new Error('Create failed')
        }

        router.push('/specifications')
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
