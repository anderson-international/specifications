'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import SpecificationWizard from '@/components/wizard/SpecificationWizard'
import { WizardFormData } from '@/components/wizard/types/wizard.types'
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
  const [productId, setProductId] = useState<string | undefined>(undefined)

  useEffect(() => {
    setProductId(searchParams.get('productId') || undefined)
  }, [searchParams])

  const handleSubmit = useCallback(
    async (_data: WizardFormData): Promise<void> => {
      try {
        // TODO: Replace with actual API call
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Navigate to success page or products list
        router.push('/products')
      } catch (error) {
        // TODO: Show error message to user
        throw new Error(error instanceof Error ? error.message : 'Failed to create specification')
      }
    },
    [router]
  )

  // Prepare initial data if productId is provided
  const initialData = useMemo(() => {
    if (productId) {
      return {
        product_id: parseInt(productId, 10) || null,
      }
    }
    return {}
  }, [productId])

  return (
    <SpecificationWizard
      onSubmit={handleSubmit}
      initialData={initialData}
      userId={user?.id || ''}
    />
  )
}
