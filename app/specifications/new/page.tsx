'use client'

import React from 'react'
import SpecificationWizard from '@/components/wizard/SpecificationWizard'
import { Specification } from '@/lib/schemas/specification'

export default function NewSpecificationPage(): JSX.Element {
  const handleSubmit = async (data: Specification): Promise<void> => {
    console.log('Specification submitted:', data)
    // TODO: Implement actual submission logic
  }

  return (
    <div className="container mx-auto py-8">
      <SpecificationWizard onSubmit={handleSubmit} />
    </div>
  )
}
