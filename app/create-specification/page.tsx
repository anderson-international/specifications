'use client'

import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'

import SpecificationWizard from '@/components/forms/SpecificationWizard'
import { SpecificationFormData } from '@/lib/schemas/specification'
import styles from './page.module.css'

interface CreateSpecificationPageProps {
  searchParams: { productId?: string }
}

export default function CreateSpecificationPage({ 
  searchParams 
}: CreateSpecificationPageProps): JSX.Element {
  const router = useRouter()

  const handleComplete = useCallback(async (data: SpecificationFormData): Promise<void> => {
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

  return (
    <div className={styles.container}>
      <SpecificationWizard
        productId={searchParams.productId}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  )
}
