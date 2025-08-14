'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTrialProducts } from '@/hooks/useTrialProducts'
import type { TrialUserProduct } from '@/lib/types/trial'

export interface SelectedTrialProductResult {
  productId: number
  selectedItem: TrialUserProduct | null
}

export function useSelectedTrialProduct(userId: string): SelectedTrialProductResult {
  const searchParams = useSearchParams()
  const productId = Number(searchParams.get('productId') ?? 0)
  if (!productId) {
    throw new Error('Product selection is required to create or edit a review')
  }

  const { toDo, done } = useTrialProducts(userId)

  const selectedItem: TrialUserProduct | null = useMemo(() => {
    const all = [...toDo, ...done]
    return all.find(p => Number(p.id) === productId) || null
  }, [toDo, done, productId])

  return { productId, selectedItem }
}
