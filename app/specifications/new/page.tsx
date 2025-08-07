'use client'

import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { TransformedFormData } from '@/components/wizard/hooks/specification-transform-utils'
import SpecificationWizard from '@/components/wizard/SpecificationWizard'
import { useAuth } from '@/lib/auth-context'

export default function NewSpecificationPage(): JSX.Element {
  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = useCallback(async (_data: TransformedFormData): Promise<void> => {
    router.push('/specifications')
  }, [router])

  return (
    <div className="container mx-auto py-8">
      <SpecificationWizard onSubmit={handleSubmit} userId={user?.id || ''} />
    </div>
  )
}
