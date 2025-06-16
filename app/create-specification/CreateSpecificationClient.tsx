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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Create Specification</h1>
        <button 
          onClick={handleCancel}
          className="px-4 py-2 text-sm text-gray-300 hover:text-white"
        >
          Cancel
        </button>
      </div>
      <SpecificationWizard
        onSubmit={handleSubmit}
        initialData={initialData}
      />
    </div>
  )
}
