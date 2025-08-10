'use client'

import { useMemo } from 'react'
import type { FilterOption } from '@/components/shared/FilterControls'
import type { UserProduct } from '@/lib/services/user-products-service'

function buildBrandOptions(products: UserProduct[]): FilterOption[] {
  const brands = [...new Set(products.map(p => p.brand))].sort()
  return [
    { value: '', label: 'All Brands' },
    ...brands.map(brand => ({ value: brand, label: brand }))
  ]
}

function matchesSearch(p: UserProduct, q: string): boolean {
  if (!q) return true
  const t = q.trim().toLowerCase()
  return (
    p.title.toLowerCase().includes(t) ||
    p.brand.toLowerCase().includes(t)
  )
}

function matchesBrand(p: UserProduct, brand: string): boolean {
  return !brand || p.brand === brand
}

export function useProductFilterData(
  products: UserProduct[],
  searchValue: string,
  selectedBrand: string
): { filteredProducts: UserProduct[]; brandOptions: FilterOption[] } {
  const brandOptions: FilterOption[] = useMemo<FilterOption[]>(() => buildBrandOptions(products), [products])

  const filteredProducts: UserProduct[] = useMemo<UserProduct[]>(() => {
    return products.filter(p => matchesSearch(p, searchValue) && matchesBrand(p, selectedBrand))
  }, [products, searchValue, selectedBrand])

  return { filteredProducts, brandOptions }
}
