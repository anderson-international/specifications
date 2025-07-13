'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Product } from '@/lib/types/product'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [retryCount, setRetryCount] = useState<number>(0)

  const fetchProducts = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`)
      }
      const data = await response.json()

      // Handle cache warming state with retry limit
      if (data.warming) {
        if (retryCount < 5) { // Max 5 retries for warming
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 2000)
          return
        } else {
          throw new Error('Cache warming timeout - exceeded retry limit')
        }
      }
      
      // Reset retry count on success
      setRetryCount(0)

      setProducts(data.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setProducts([]) // Clear products on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchProducts()
  }, [])

  // Handle retries
  useEffect(() => {
    if (retryCount > 0) {
      const timer = setTimeout(() => {
        fetchProducts()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [retryCount])

  const filteredProducts = useMemo((): Product[] => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedBrand) {
      filtered = filtered.filter((product) => product.brand === selectedBrand)
    }

    return filtered
  }, [products, searchTerm, selectedBrand])

  const availableBrands = useMemo(() => [...new Set(products.map((p) => p.brand))], [products])

  return {
    products,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand,
    filteredProducts,
    availableBrands,
    retryFetch: fetchProducts,
  }
}
