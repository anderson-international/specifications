'use client'

import React, { useCallback } from 'react'
import { Specification } from '@/lib/schemas/specification'
import SpecificationWizard from '@/components/wizard/SpecificationWizard'
import { useAuth } from '@/lib/auth-context'

export default function NewSpecificationPage(): JSX.Element {
  const { user } = useAuth()

  const handleSubmit = useCallback(async (_data: Specification): Promise<void> => {
    // TODO: Implement actual API call to create specification
  }, [])

  return (
    <div className="container mx-auto py-8">
      <SpecificationWizard onSubmit={handleSubmit} userId={user?.id || ''} />
    </div>
  )
}
