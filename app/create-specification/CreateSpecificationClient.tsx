'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import SpecificationWizard from '@/components/wizard/SpecificationWizard'
import { Specification } from '@/lib/schemas/specification'
import { SpecificationEnumData } from '@/types/enum'

interface CreateSpecificationClientProps {
  enumData: SpecificationEnumData
}

export default function CreateSpecificationClient(_props: CreateSpecificationClientProps): JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [productId, setProductId] = useState<string | undefined>(undefined)

  useEffect(() => {
    setProductId(searchParams.get('productId') || undefined)
  }, [searchParams])

  const handleSubmit = useCallback(async (data: Specification): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      console.log('Specification data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate to success page or products list
      router.push('/products')
    } catch (error) {
      console.error('Failed to create specification:', error)
      // TODO: Show error message
    }
  }, [router])

  const handleCancel = useCallback((): void => {
    router.back()
  }, [router])

  // Prepare initial data if productId is provided
  const initialData = useMemo(() => {
    if (productId) {
      return {
        product_id: parseInt(productId, 10) || null
      }
    }
    return {}
  }, [productId])

  return (
    <SpecificationWizard
      onSubmit={handleSubmit}
      initialData={initialData}
    />
  )
}
