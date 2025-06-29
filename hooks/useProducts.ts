'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Product } from '@/lib/types/product'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedBrand, setSelectedBrand] = useState<string>('')

  const fetchProducts = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`)
      }
      const data = await response.json()
      
      // Handle cache warming state
      if (data.warming) {
        console.log('Cache is warming, retrying in 2 seconds...')
        setTimeout(() => fetchProducts(), 2000)
        return
      }
      
      setProducts(data.products)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filteredProducts = useMemo((): Product[] => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        product =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedBrand) {
      filtered = filtered.filter(product => product.brand === selectedBrand)
    }

    return filtered
  }, [products, searchTerm, selectedBrand])

  const availableBrands = useMemo(() => [...new Set(products.map(p => p.brand))], [products])

  return {
    isLoading,
    error,
    filteredProducts,
    availableBrands,
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand,
    retryFetch: fetchProducts,
  }
}
