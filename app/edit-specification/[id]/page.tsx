'use client'

import React, { useCallback } from 'react'
import { SpecificationWizard } from '@/components/wizard/SpecificationWizard'
import { notFound, useRouter } from 'next/navigation'
import { Specification } from '@/lib/schemas/specification'
import { useAuth } from '@/lib/auth-context'
import { useSpecificationData } from '@/components/wizard/hooks/useSpecificationData'

interface EditSpecificationPageProps {
  params: {
    id: string
  }
}

export default function EditSpecificationPage({
  params,
}: EditSpecificationPageProps): JSX.Element {
  const { id } = params
  const router = useRouter()
  const { user } = useAuth()
  
  // Load existing specification data for editing
  const { data: specificationData, isLoading, error } = useSpecificationData(id)

  // Validate that we have an ID and authenticated user
  if (!id || id === 'undefined') {
    notFound()
  }
  
  if (!user?.id) {
    // Redirect to auth if no user - this should be handled by auth wrapper
    router.push('/auth')
    return <div>Redirecting to authentication...</div>
  }

  // Show loading state while fetching specification data
  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading specification data...</p>
      </div>
    )
  }

  // Show error state if failed to load
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Error loading specification: {error}</p>
        <button onClick={() => router.push('/specifications')}>
          Return to Specifications
        </button>
      </div>
    )
  }

  // Don't render wizard until we have data
  if (!specificationData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Specification not found</p>
        <button onClick={() => router.push('/specifications')}>
          Return to Specifications
        </button>
      </div>
    )
  }

  const handleSubmit = useCallback(async (data: Specification) => {
    try {
      const response = await fetch(`/api/specifications/${id}?userId=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update specification')
      }

      const result = await response.json()
      console.log('Specification updated successfully:', result)
      
      // After successful update, return to specifications list
      router.push('/specifications')
    } catch (error) {
      console.error('Failed to update specification:', error)
      throw error
    }
  }, [id, router, user.id])

  return (
    <div className="min-h-screen bg-gray-900">
      <SpecificationWizard
        onSubmit={handleSubmit}
        initialData={specificationData}
        userId={user.id}
      />
    </div>
  )
}
