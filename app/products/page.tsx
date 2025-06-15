'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'

import ProductCard from '../../components/products/ProductCard'
import ProductFilters from '../../components/products/ProductFilters'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import styles from './products.module.css'

interface Product {
  id: string
  handle: string
  title: string
  brand: string
  image_url: string | null
  is_reviewed: boolean
}

interface ProductsApiResponse {
  products: Product[]
  total: number
  reviewed_count: number
}

export default function ProductsPage(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const { stats } = useDashboardStats()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: ProductsApiResponse = await response.json()
      setProducts(data.products)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products'
      setError(errorMessage)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Use useMemo for derived state instead of useEffect to prevent loops
  const filteredProducts = useMemo((): Product[] => {
    let filtered = products

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply brand filter
    if (selectedBrand) {
      filtered = filtered.filter(product => product.brand === selectedBrand)
    }

    return filtered
  }, [products, searchTerm, selectedBrand])

  const availableBrands = useMemo(() => [...new Set(products.map(p => p.brand))], [products])

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading Products</h2>
          <p>{error}</p>
          <button 
            onClick={() => fetchProducts()} 
            className={styles.retryButton}
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading products...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.stats}>
          {stats?.reviewed_products || 0} of {stats?.total_products || 0} products reviewed
        </p>
      </header>

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
        availableBrands={availableBrands}
      />

      <div className={styles.grid}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className={styles.empty}>
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
