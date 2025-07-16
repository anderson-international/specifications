'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Product } from '@/lib/types/product'

interface UseProductsReturn {
  products: Product[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedBrand: string
  setSelectedBrand: (brand: string) => void
  filteredProducts: Product[]
  availableBrands: string[]
  retryFetch: () => void
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [retryCount, setRetryCount] = useState<number>(0)

  const fetchProducts = useCallback(async (isCancelled: { value: boolean }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      const data = await response.json()

      if (isCancelled.value) return

      if (data.warming && retryCount < 5) {
        setTimeout(() => setRetryCount(prev => prev + 1), 2000)
      } else if (data.warming) {
        throw new Error('Cache warming timeout.')
      } else {
        setProducts(data.products || [])
        if (retryCount > 0) setRetryCount(0)
      }
    } catch (err) {
      if (!isCancelled.value) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    } finally {
      if (!isCancelled.value) setIsLoading(false)
    }
  }, [retryCount])

  useEffect(() => {
    const isCancelled = { value: false }
    fetchProducts(isCancelled)
    return () => { isCancelled.value = true }
  }, [fetchProducts])

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      (p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       p.brand.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedBrand ? p.brand === selectedBrand : true)
    )
  }, [products, searchTerm, selectedBrand])

  const availableBrands = useMemo(() => 
    [...new Set(products.map(p => p.brand))],
    [products]
  )

  const retryFetch = useCallback(() => setRetryCount(prev => prev + 1), [])

  return useMemo(() => ({
    products,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand,
    filteredProducts,
    availableBrands,
    retryFetch,
  }), [
    products, isLoading, error, searchTerm, selectedBrand, 
    filteredProducts, availableBrands, retryFetch
  ])
}
